import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Droplets, MapPin, ChevronLeft } from 'lucide-react';
import FloatingActionButton from '../components/FloatingActionButton';
import BottomSheet from '../components/BottomSheet';
import useFarmStore from '../store/farmStore';

const HomePage = () => {
    const navigate = useNavigate();
    const farms = useFarmStore((state) => state.farms);
    const addFarm = useFarmStore((state) => state.addFarm);

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [newFarmName, setNewFarmName] = useState('');
    const [newFarmLink, setNewFarmLink] = useState('');

    const handleAddFarm = (e) => {
        e.preventDefault();
        if (!newFarmName.trim()) return;

        addFarm({
            name: newFarmName.trim(),
            youtubeLink: newFarmLink.trim()
        });

        setNewFarmName('');
        setNewFarmLink('');
        setIsSheetOpen(false);
    };

    return (
        <div className="animate-fade-in">
            <header className="app-header">
                <div className="page-header" style={{ display: 'flex', width: '100%' }}>
                    <button className="icon-btn" onClick={() => navigate('/')} aria-label="Go to Home" style={{ position: 'absolute' }}>
                        <ChevronLeft size={24} />
                    </button>
                    <div className="logo-container" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <img
                            src="/images/minecraft.png"
                            alt="Minecraft Logo"
                            className="logo-image"
                            style={{ filter: 'drop-shadow(0 0 10px rgba(0, 230, 118, 0.4))', height: '60px', objectFit: 'contain' }}
                        />
                    </div>
                </div>
            </header>

            <main className="farm-list">
                {farms.length === 0 ? (
                    <div className="empty-state">
                        <Droplets size={48} />
                        <h2 className="mt-2 text-primary">No Farms Yet</h2>
                        <p className="mt-1 text-secondary">Click the + button to add your first Minecraft farm to the list.</p>
                    </div>
                ) : (
                    farms.map((farm) => (
                        <div
                            key={farm.id}
                            className="farm-card"
                            onClick={() => navigate(`/minecraft-lister/farm/${farm.id}`)}
                        >
                            <div className="farm-card-content">
                                <h2>{farm.name}</h2>
                                <p>
                                    <MapPin size={14} />
                                    {farm.items.length} {farm.items.length === 1 ? 'Item' : 'Items'} Required
                                </p>
                            </div>
                            <ChevronRight size={24} className="chevron-icon" />
                        </div>
                    ))
                )}
            </main>

            <FloatingActionButton onClick={() => setIsSheetOpen(true)} />

            <BottomSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                title="Add New Farm"
            >
                <form onSubmit={handleAddFarm}>
                    <div className="input-group">
                        <label htmlFor="farmName" className="input-label">Farm Name *</label>
                        <input
                            id="farmName"
                            type="text"
                            className="input-field"
                            placeholder="e.g. Iron Golem Farm"
                            value={newFarmName}
                            onChange={(e) => setNewFarmName(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="farmLink" className="input-label">YouTube Link (Optional)</label>
                        <input
                            id="farmLink"
                            type="url"
                            className="input-field"
                            placeholder="https://youtube.com/watch?v=..."
                            value={newFarmLink}
                            onChange={(e) => setNewFarmLink(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary mt-3"
                        disabled={!newFarmName.trim()}
                    >
                        Create Farm
                    </button>
                </form>
            </BottomSheet>
        </div>
    );
};

export default HomePage;
