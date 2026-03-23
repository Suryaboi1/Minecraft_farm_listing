import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Pickaxe } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

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
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 1.5rem' }}
                >
                    <div style={{ backgroundColor: 'rgba(0, 230, 118, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                        <Pickaxe size={48} color="var(--primary-color)" />
                    </div>
                    <div className="farm-card-content">
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Minecraft Farm Lister</h2>
                        <p style={{ justifyContent: 'center' }}>Manage your mob and resource farms</p>
                    </div>
                </div>

                {/* Card 2: Placeholder */}
                <div 
                    className="farm-card"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 1.5rem', cursor: 'default', opacity: 0.6 }}
                >
                    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                        <Gamepad2 size={48} color="var(--text-secondary)" />
                    </div>
                    <div className="farm-card-content">
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Coming Soon</h2>
                        <p style={{ justifyContent: 'center' }}>New game tool will be added here</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
