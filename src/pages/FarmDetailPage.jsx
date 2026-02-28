import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Youtube, Plus, Edit2, Trash2, CheckCircle, Circle, MoreVertical, AlertTriangle } from 'lucide-react';
import useFarmStore from '../store/farmStore';
import BottomSheet from '../components/BottomSheet';
import Dropdown from '../components/Dropdown';
import minecraftItems from '../data/minecraftItems.json';
import getYouTubeID from 'get-youtube-id';

const FarmDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const farms = useFarmStore((state) => state.farms);
    const addItemToFarm = useFarmStore((state) => state.addItemToFarm);
    const updateFarm = useFarmStore((state) => state.updateFarm);
    const deleteFarm = useFarmStore((state) => state.deleteFarm);
    const updateItemInFarm = useFarmStore((state) => state.updateItemInFarm);
    const deleteItemFromFarm = useFarmStore((state) => state.deleteItemFromFarm);
    const toggleItemCollected = useFarmStore((state) => state.toggleItemCollected);

    const farm = farms.find(f => f.id === id);

    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Item Form State
    const [selectedItemId, setSelectedItemId] = useState('');
    const [quantityType, setQuantityType] = useState('items'); // 'items' or 'stacks'
    const [quantityValue, setQuantityValue] = useState('');

    // Edit Form State
    const [isEditMode, setIsEditMode] = useState(false);
    const [editItemId, setEditItemId] = useState(null);

    // Edit Farm State
    const [isOptionsSheetOpen, setIsOptionsSheetOpen] = useState(false);
    const [isEditFarmSheetOpen, setIsEditFarmSheetOpen] = useState(false);
    const [isDeleteConfirmSheetOpen, setIsDeleteConfirmSheetOpen] = useState(false);
    const [editFarmName, setEditFarmName] = useState('');
    const [editFarmLink, setEditFarmLink] = useState('');

    if (!farm) {
        return (
            <div className="empty-state animate-fade-in">
                <h2>Farm Not Found</h2>
                <button className="btn-primary mt-2" onClick={() => navigate('/')}>
                    Go Home
                </button>
            </div>
        );
    }

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!selectedItemId || !quantityValue || isNaN(quantityValue) || Number(quantityValue) < 0) return;

        const itemDef = minecraftItems.find(i => i.id === selectedItemId);
        const value = Math.floor(Number(quantityValue));

        let stacks = 0;
        let quantity = 0;

        if (quantityType === 'stacks') {
            stacks = value;
        } else {
            stacks = Math.floor(value / 64);
            quantity = value % 64;
        }

        if (isEditMode && editItemId) {
            updateItemInFarm(id, editItemId, {
                stacks,
                quantity
            });
        } else {
            addItemToFarm(id, {
                id: itemDef.id,
                name: itemDef.name,
                image: itemDef.image,
                stacks,
                quantity
            });
        }

        closeItemSheet();
    };

    const openEditItemSheet = (item) => {
        setSelectedItemId(item.id);

        // Convert back to simple value for form
        if (item.stacks > 0 && item.quantity === 0) {
            setQuantityType('stacks');
            setQuantityValue(item.stacks.toString());
        } else {
            setQuantityType('items');
            setQuantityValue(((item.stacks * 64) + item.quantity).toString());
        }

        setIsEditMode(true);
        setEditItemId(item.id);
        setIsSheetOpen(true);
    };

    const closeItemSheet = () => {
        setSelectedItemId('');
        setQuantityValue('');
        setQuantityType('items');
        setIsEditMode(false);
        setEditItemId(null);
        setIsSheetOpen(false);
    };

    const handleEditFarm = (e) => {
        e.preventDefault();
        if (!editFarmName.trim()) return;

        updateFarm(id, {
            name: editFarmName.trim(),
            youtubeLink: editFarmLink.trim()
        });
        setIsEditFarmSheetOpen(false);
    };

    const handleDeleteFarm = () => {
        deleteFarm(id);
        navigate('/');
    };

    const openEditFarm = () => {
        setEditFarmName(farm.name);
        setEditFarmLink(farm.youtubeLink || '');
        setIsOptionsSheetOpen(false);
        setIsEditFarmSheetOpen(true);
    };

    const confirmDeleteFarm = () => {
        setIsOptionsSheetOpen(false);
        setIsDeleteConfirmSheetOpen(true);
    };

    const ytId = farm.youtubeLink ? getYouTubeID(farm.youtubeLink) : null;

    // Derived sorted items
    const sortedItems = [...farm.items].sort((a, b) => {
        if (a.isCollected === b.isCollected) return 0;
        return a.isCollected ? 1 : -1;
    });

    return (
        <div className="animate-fade-in">
            <header className="app-header">
                <div className="page-header">
                    <button className="icon-btn" onClick={() => navigate('/')} aria-label="Go Back">
                        <ChevronLeft size={24} />
                    </button>
                    <div style={{ flex: 1 }}></div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className="btn-primary"
                            style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.9rem', marginRight: '0.5rem' }}
                            onClick={() => setIsSheetOpen(true)}
                        >
                            <Plus size={18} /> Add Item
                        </button>
                        <button
                            className="icon-btn"
                            onClick={() => setIsOptionsSheetOpen(true)}
                            aria-label="More Options"
                        >
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main>
                <div className="detail-content">
                    <h1 className="farm-title">{farm.name}</h1>

                    {ytId && (
                        <a
                            href={farm.youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="youtube-widget"
                        >
                            <div className="yt-thumbnail">
                                <img src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`} alt="YouTube Thumbnail" onError={(e) => { e.target.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`; }} />
                                <div className="yt-play-overlay">
                                    <Youtube size={32} color="#ff0000" fill="#fff" />
                                </div>
                            </div>
                            <div className="yt-info">
                                <span>Watch Tutorial</span>
                            </div>
                        </a>
                    )}
                </div>

                {farm.items.length === 0 ? (
                    <div className="empty-state">
                        <h3 className="text-primary mt-2">No Items Required Yet</h3>
                        <p className="text-secondary mt-1">Start adding items to build this farm.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="items-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th className="text-center" width="80">Stacks</th>
                                    <th className="text-center" width="80">Items</th>
                                    <th className="text-center" width="60">Done</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedItems.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'odd-row' : 'even-row'}>
                                        <td>
                                            <div
                                                className="item-cell"
                                                style={{ opacity: item.isCollected ? 0.5 : 1 }}
                                                onClick={() => openEditItemSheet(item)}
                                            >
                                                {item.image && <img src={item.image} alt={item.name} className="item-image" />}
                                                <span style={{ textDecoration: item.isCollected ? 'line-through' : 'none' }}>{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-center number-cell text-secondary" style={{ opacity: item.isCollected ? 0.5 : 1 }}>
                                            {item.stacks > 0 ? item.stacks : '0'}
                                        </td>
                                        <td className="text-center number-cell" style={{ opacity: item.isCollected ? 0.5 : 1 }}>
                                            {item.quantity > 0 ? item.quantity : '0'}
                                        </td>
                                        <td className="text-center">
                                            <div className="checkbox-cell">
                                                <input
                                                    type="checkbox"
                                                    className="styled-toggle"
                                                    checked={item.isCollected || false}
                                                    onChange={() => toggleItemCollected(id, item.id)}
                                                    onClick={(e) => e.stopPropagation()} // Prevent row or cell click events if added later
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <BottomSheet
                isOpen={isSheetOpen}
                onClose={closeItemSheet}
                title={isEditMode ? "Edit Material" : "Add Material"}
                headerAction={isEditMode && editItemId ? (
                    <button
                        className="icon-btn-small"
                        onClick={(e) => {
                            e.preventDefault();
                            deleteItemFromFarm(id, editItemId);
                            closeItemSheet();
                        }}
                        style={{ color: 'var(--text-secondary)' }}
                        aria-label="Delete Item"
                    >
                        <Trash2 size={18} />
                    </button>
                ) : null}
            >
                <form onSubmit={handleAddItem}>
                    {!isEditMode && (
                        <div className="input-group">
                            <label className="input-label">Select Item *</label>
                            <Dropdown
                                options={minecraftItems}
                                value={selectedItemId}
                                onChange={setSelectedItemId}
                                placeholder="Search items..."
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label className="input-label">Quantity Type</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="quantityType"
                                    value="items"
                                    checked={quantityType === 'items'}
                                    onChange={() => setQuantityType('items')}
                                />
                                Items
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="quantityType"
                                    value="stacks"
                                    checked={quantityType === 'stacks'}
                                    onChange={() => setQuantityType('stacks')}
                                />
                                Stacks (x64)
                            </label>
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="quantityValue" className="input-label">
                            Amount In {quantityType === 'stacks' ? 'Stacks' : 'Items'} *
                        </label>
                        <input
                            id="quantityValue"
                            type="number"
                            min="1"
                            className="input-field"
                            placeholder="e.g. 10"
                            value={quantityValue}
                            onChange={(e) => setQuantityValue(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary mt-3"
                        disabled={!selectedItemId || !quantityValue}
                    >
                        {isEditMode ? "Update Item" : "Add to Farm"}
                    </button>
                </form>
            </BottomSheet>

            <BottomSheet
                isOpen={isEditFarmSheetOpen}
                onClose={() => setIsEditFarmSheetOpen(false)}
                title="Edit Farm"
            >
                <form onSubmit={handleEditFarm}>
                    <div className="input-group">
                        <label htmlFor="editFarmName" className="input-label">Farm Name *</label>
                        <input
                            id="editFarmName"
                            type="text"
                            className="input-field"
                            placeholder="e.g. Iron Golem Farm"
                            value={editFarmName}
                            onChange={(e) => setEditFarmName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="editFarmLink" className="input-label">YouTube Link (Optional)</label>
                        <input
                            id="editFarmLink"
                            type="url"
                            className="input-field"
                            placeholder="https://youtube.com/watch?v=..."
                            value={editFarmLink}
                            onChange={(e) => setEditFarmLink(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary mt-3"
                        disabled={!editFarmName.trim()}
                    >
                        Save Changes
                    </button>
                </form>
            </BottomSheet>

            <BottomSheet
                isOpen={isOptionsSheetOpen}
                onClose={() => setIsOptionsSheetOpen(false)}
                title="Options"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                        className="btn-primary"
                        style={{ backgroundColor: 'var(--surface-color)', color: 'var(--text-primary)', justifyContent: 'flex-start', padding: '1rem' }}
                        onClick={openEditFarm}
                    >
                        <Edit2 size={20} /> Edit Farm Details
                    </button>
                    <button
                        className="btn-primary"
                        style={{ backgroundColor: 'rgba(255, 82, 82, 0.1)', color: 'var(--danger-color)', justifyContent: 'flex-start', padding: '1rem' }}
                        onClick={confirmDeleteFarm}
                    >
                        <Trash2 size={20} /> Delete Farm
                    </button>
                </div>
            </BottomSheet>

            <BottomSheet
                isOpen={isDeleteConfirmSheetOpen}
                onClose={() => setIsDeleteConfirmSheetOpen(false)}
                title="Confirm Deletion"
            >
                <div className="text-center" style={{ padding: '1rem 0 2rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--danger-color)' }}>
                        <AlertTriangle size={48} />
                    </div>
                    <h3 className="mb-1">Delete {farm.name}?</h3>
                    <p className="text-secondary mb-3">This action cannot be undone. All required items will be lost.</p>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className="btn-primary"
                            style={{ backgroundColor: 'var(--surface-color)', color: 'var(--text-primary)' }}
                            onClick={() => setIsDeleteConfirmSheetOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn-primary"
                            style={{ backgroundColor: 'var(--danger-color)', color: '#fff' }}
                            onClick={handleDeleteFarm}
                        >
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </BottomSheet>
        </div>
    );
};

export default FarmDetailPage;
