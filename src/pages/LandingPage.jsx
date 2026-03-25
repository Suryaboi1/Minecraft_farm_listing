import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Pickaxe, Heart, Lock, X } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [showIshitaModal, setShowIshitaModal] = useState(false);
    const [ishitaCode, setIshitaCode] = useState('');

    const handleIshitaSubmit = (e) => {
        e.preventDefault();
        if (ishitaCode === '0000') {
            setShowIshitaModal(false);
            navigate('/ishita-diary');
        } else {
            alert('Incorrect code :(');
            setIshitaCode('');
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '900', background: 'linear-gradient(135deg, var(--primary-color) 0%, #00acc1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.05em' }}>
                    FOXU.IN
                </h1>
                <p className="text-secondary mt-1" style={{ fontSize: '1.2rem' }}>Your gaming companion hub</p>
            </header>

            <main style={{ width: '100%', maxWidth: '800px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {/* Card 1: Minecraft Farm Lister */}
                <div
                    className="farm-card"
                    onClick={() => navigate('/minecraft-lister')}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 1.5rem', cursor: 'pointer' }}
                >
                    <div style={{ backgroundColor: 'rgba(0, 230, 118, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                        <Pickaxe size={48} color="var(--primary-color)" />
                    </div>
                    <div className="farm-card-content">
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Minecraft Farm Lister</h2>
                        <p style={{ justifyContent: 'center' }}>Manage your mob and resource farms</p>
                    </div>
                </div>

                {/* Card 2: Love Calculator */}
                <div
                    className="farm-card"
                    onClick={() => navigate('/love-calculator')}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 1.5rem', cursor: 'pointer' }}
                >
                    <div style={{ backgroundColor: 'rgba(255, 75, 75, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                        <Heart size={48} color="#ff4b4b" />
                    </div>
                    <div className="farm-card-content">
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Love Calculator</h2>
                        <p style={{ justifyContent: 'center' }}>Test your compatibility score</p>
                    </div>
                </div>

                {/* Card 3: Ishita Diary */}
                <div
                    className="farm-card"
                    onClick={() => setShowIshitaModal(true)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 1.5rem', cursor: 'pointer' }}
                >
                    <div style={{ backgroundColor: 'rgba(255, 105, 180, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                        <Lock size={48} color="#ff69b4" />
                    </div>
                    <div className="farm-card-content">
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Ishita :3</h2>
                        <p style={{ justifyContent: 'center' }}>Private notes and memories</p>
                    </div>
                </div>
            </main>

            {/* Ishita Code Modal */}
            {showIshitaModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#1E1E1E', padding: '2rem', borderRadius: '1rem',
                        position: 'relative', width: '90%', maxWidth: '350px',
                        border: '1px solid #ff69b4'
                    }}>
                        <button onClick={() => setShowIshitaModal(false)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#ff69b4', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                        <h3 style={{ color: '#ff69b4', marginBottom: '1rem', textAlign: 'center' }}>Enter Code</h3>
                        <form onSubmit={handleIshitaSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="password"
                                value={ishitaCode}
                                onChange={(e) => setIshitaCode(e.target.value)}
                                placeholder="Code..."
                                style={{
                                    padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #444',
                                    backgroundColor: '#2D2D2D', color: 'white', textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.2rem'
                                }}
                                autoFocus
                            />
                            <button type="submit" style={{
                                backgroundColor: '#ff69b4', color: 'white', padding: '0.75rem',
                                border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer'
                            }}>
                                Unlock
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
