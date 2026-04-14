import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Pickaxe, Heart } from 'lucide-react';

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

            <main style={{ width: '100%', maxWidth: '900px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', padding: '1rem' }}>
                {/* Card 1: Minecraft Farm Lister */}
                <div
                    className="farm-card"
                    onClick={() => navigate('/minecraft-lister')}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '3rem 2rem',
                        cursor: 'pointer',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    <div style={{ backgroundColor: 'rgba(0, 230, 118, 0.15)', padding: '1.2rem', borderRadius: '24px', marginBottom: '1.5rem', boxShadow: '0 8px 16px rgba(0, 230, 118, 0.1)' }}>
                        <Pickaxe size={56} color="#00e676" />
                    </div>
                    <div className="farm-card-content">
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', fontWeight: '700' }}>Minecraft Farm Lister</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Efficiently manage your farms and resources with our item-aware lister.</p>
                    </div>
                </div>

                {/* Card 2: Love Calculator */}
                <div
                    className="farm-card"
                    onClick={() => navigate('/love-calculator')}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '3rem 2rem',
                        cursor: 'pointer',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    <div style={{ backgroundColor: 'rgba(255, 75, 75, 0.15)', padding: '1.2rem', borderRadius: '24px', marginBottom: '1.5rem', boxShadow: '0 8px 16px rgba(255, 75, 75, 0.1)' }}>
                        <Heart size={56} color="#ff4b4b" />
                    </div>
                    <div className="farm-card-content">
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', fontWeight: '700' }}>Love Calculator &lt;3</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Discover your cosmic compatibility using our advanced algorithm.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
