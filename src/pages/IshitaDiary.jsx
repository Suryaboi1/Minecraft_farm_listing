import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Image as ImageIcon, Edit2, Trash2, Heart } from 'lucide-react';
import './IshitaDiary.css';

const IshitaDiary = () => {
    const [entries, setEntries] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showCodeSheet, setShowCodeSheet] = useState(false);
    const [sheetCode, setSheetCode] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [draftText, setDraftText] = useState('');
    const [draftImage, setDraftImage] = useState(null);

    const [fullScreenImage, setFullScreenImage] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        const saved = localStorage.getItem('ishita_diary_entries');
        if (saved) {
            setEntries(JSON.parse(saved));
        }
    }, []);

    const saveEntries = (newEntries) => {
        setEntries(newEntries);
        localStorage.setItem('ishita_diary_entries', JSON.stringify(newEntries));
    };

    const handleCodeSubmit = (e) => {
        e.preventDefault();
        if (sheetCode === '1412') {
            setIsEditMode(true);
            setShowCodeSheet(false);
            setSheetCode('');
        } else {
            alert('Wrong code! Only Ishita\'s admirer can edit this.');
            setSheetCode('');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                // Target 1:1 compression
                const minDim = Math.min(img.width, img.height);
                const sx = (img.width - minDim) / 2;
                const sy = (img.height - minDim) / 2;

                canvas.width = 600;
                canvas.height = 600;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 600, 600);

                setDraftImage(canvas.toDataURL('image/jpeg', 0.8));
            };
        };
    };

    const handleSaveEntry = () => {
        if (!draftText.trim() && !draftImage) return;

        const newEntryObj = {
            id: editingId || Date.now().toString(),
            text: draftText,
            image: draftImage,
            timestamp: new Date().toISOString()
        };

        if (editingId) {
            saveEntries(entries.map(e => e.id === editingId ? newEntryObj : e));
        } else {
            saveEntries([newEntryObj, ...entries]);
        }

        closeModal();
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this memory?")) {
            saveEntries(entries.filter(e => e.id !== id));
        }
    };

    const openCreateModal = () => {
        setEditingId(null);
        setDraftText('');
        setDraftImage(null);
        setShowModal(true);
    };

    const openEditModal = (entry) => {
        setEditingId(entry.id);
        setDraftText(entry.text || '');
        setDraftImage(entry.image || null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setDraftText('');
        setDraftImage(null);
        setEditingId(null);
    };

    return (
        <div className="diary-container">
            <header className="diary-header" onClick={() => setShowCodeSheet(true)}>
                <h1 className="diary-title">
                    Ishita :3 <Heart size={20} color="#ff69b4" fill="#ff69b4" />
                </h1>
                {isEditMode && <span style={{ fontSize: '0.75rem', color: '#888' }}>Edit Mode Active</span>}
            </header>

            <main className="diary-content">
                {entries.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#aaa', marginTop: '3rem' }}>
                        <Heart size={48} color="#ffe4e1" style={{ margin: '0 auto 1rem' }} />
                        <p>No memories yet...</p>
                    </div>
                ) : (
                    entries.map(entry => (
                        <div key={entry.id} className="diary-card">
                            {entry.image && (
                                <div className="diary-image-container" onClick={() => setFullScreenImage(entry.image)}>
                                    <img src={entry.image} alt="Memory" className="diary-image" />
                                </div>
                            )}
                            {entry.text && (
                                <div className="diary-text">{entry.text}</div>
                            )}
                            {isEditMode && (
                                <div className="diary-actions">
                                    <button className="action-btn edit" onClick={() => openEditModal(entry)}>
                                        <Edit2 size={18} />
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDelete(entry.id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </main>

            {isEditMode && (
                <button className="diary-fab" onClick={openCreateModal}>
                    <Plus size={32} />
                </button>
            )}

            {/* Code Bottom Sheet */}
            {showCodeSheet && (
                <div className="bottom-sheet-overlay" onClick={(e) => {
                    if (e.target.className === 'bottom-sheet-overlay') setShowCodeSheet(false);
                }}>
                    <div className="bottom-sheet">
                        <h3 style={{ color: '#333', marginBottom: '1rem', textAlign: 'center' }}>Enter Code to Edit</h3>
                        <form onSubmit={handleCodeSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                            <input
                                type="password"
                                className="pin-input"
                                value={sheetCode}
                                onChange={(e) => setSheetCode(e.target.value)}
                                placeholder="****"
                                maxLength={4}
                                autoFocus
                            />
                            <button type="submit" style={{
                                background: '#ff69b4', color: 'white', padding: '1rem',
                                borderRadius: '16px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold'
                            }}>
                                Unlock
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="modal-form">
                    <div className="modal-header">
                        <button className="modal-close" onClick={closeModal}>Cancel</button>
                        <h3 style={{ margin: 0, color: '#333' }}>{editingId ? 'Edit Memory' : 'New Memory'}</h3>
                        <button className="modal-save" onClick={handleSaveEntry}>Save</button>
                    </div>
                    <div className="modal-body">
                        <div
                            className="image-upload-area"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {draftImage ? (
                                <img src={draftImage} alt="Draft" />
                            ) : (
                                <>
                                    <ImageIcon size={48} style={{ marginBottom: '0.5rem' }} />
                                    <span>Tap to add image (1:1 crop)</span>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />

                        <textarea
                            className="text-input-area"
                            placeholder="Write something sweet..."
                            value={draftText}
                            onChange={(e) => setDraftText(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Full Screen Image Modal */}
            {fullScreenImage && (
                <div className="full-image-modal" onClick={() => setFullScreenImage(null)}>
                    <img src={fullScreenImage} alt="Full screen" className="full-image" />
                </div>
            )}
        </div>
    );
};

export default IshitaDiary;
