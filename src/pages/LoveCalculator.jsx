import React, { useState, useEffect, useRef } from 'react';
import './LoveCalculator.css';

const tarotLevels = [
    { max: 4, image: "the-tower.png", messages: ["Yeh connection intense hai, but stable feel nahi hota.", "Dynamics thode unpredictable lag rahe hain.", "Yeh type ka bond usually shake karta hai before it settles.", "Strong reactions, but not always smooth."] },
    { max: 8, image: "three-of-swords.png", messages: ["Emotions yahan thode heavy ho sakte hain.", "Sensitivity zyada hai is connection mein.", "Expectations aur reality thodi mismatch ho sakti hai.", "Yeh bond thoda emotionally testing lagta hai."] },
    { max: 12, image: "the-moon.png", messages: ["Clarity thodi missing lagti hai yahan.", "Signals samajhna easy nahi hai.", "Yeh connection layered feel hota hai.", "Thoda time lagega isko samajhne mein."] },
    { max: 20, image: "five-of-wands.png", messages: ["Differences noticeable hain yahan.", "Energy thodi competitive ya contrasting lagti hai.", "Alignment kabhi kabhi off feel ho sakta hai.", "Isme adjustment ka role bada hai."] },
    { max: 30, image: "two-of-swords.png", messages: ["Kuch cheezein unsaid reh jaati hain.", "Decisions ya clarity delay ho sakti hai.", "Balance maintain karna important lagta hai.", "Dono sides ko samajhna zaroori hai."] },
    { max: 40, image: "seven-of-cups.png", messages: ["Possibilities kaafi hain, but direction unclear.", "Expectations aur imagination mix ho rahe hain.", "Yeh connection different angles se feel hota hai.", "Reality aur perception dono ka role hai."] },
    { max: 50, image: "wheel-of-fortune.png", messages: ["Yeh dynamic time ke saath change hota rehta hai.", "Ups and downs natural part lagte hain.", "Timing ka strong influence hai.", "Kabhi smooth, kabhi unpredictable."] },
    { max: 60, image: "justice.png", messages: ["Balance aur fairness important factor hai.", "Give and take kaafi clearly visible hai.", "Honesty yahan key role play karti hai.", "Structure ke saath yeh better kaam karta hai."] },
    { max: 70, image: "temperance.png", messages: ["Yeh connection gradual aur stable feel hota hai.", "Balance naturally build hota dikhta hai.", "Patience yahan achha result deta hai.", "Harmony ka potential strong hai."] },
    { max: 80, image: "the-star.png", messages: ["Positive aur hopeful energy feel hoti hai.", "Yeh connection uplift karta hai.", "Growth aur support dono present hain.", "Isme emotional comfort milta hai."] },
    { max: 90, image: "the-sun.png", messages: ["Yeh connection light aur natural feel hota hai.", "Comfort aur ease clearly visible hai.", "Energy warm aur positive hai.", "Things flow easily yahan."] },
    { max: 96, image: "four-of-wands.png", messages: ["Stability aur alignment strong lagta hai.", "Yeh connection grounded feel hota hai.", "Long-term harmony ka sense aata hai.", "Foundation kaafi solid lagti hai."] },
    { max: 100, image: "the-lovers.png", messages: ["Strong alignment aur connection feel hota hai.", "Emotional sync kaafi high lagta hai.", "Yeh bond naturally close feel hota hai.", "Mutual understanding clearly present hai."] }
];

const FloatingHearts = () => {
    const [hearts, setHearts] = useState([]);

    useEffect(() => {
        const heartCount = 12;
        const newHearts = [];
        for (let i = 0; i < heartCount; i++) {
            newHearts.push({
                id: i,
                left: Math.random() * 100,
                size: 10 + Math.random() * 15,
                duration: 15 + Math.random() * 10,
                delay: Math.random() * 20,
                opacity: 0.1 + Math.random() * 0.3
            });
        }
        setHearts(newHearts);
    }, []);

    return (
        <div className="hearts-container">
            {hearts.map(heart => (
                <div
                    key={heart.id}
                    className="floating-heart"
                    style={{
                        left: `${heart.left}%`,
                        width: `${heart.size}px`,
                        height: `${heart.size}px`,
                        animationDuration: `${heart.duration}s`,
                        animationDelay: `-${heart.delay}s`,
                        backgroundColor: `rgba(255, 255, 255, ${heart.opacity})`
                    }}
                />
            ))}
        </div>
    );
};

const LoveCalculator = () => {
    const [screen, setScreen] = useState(1);
    const [yourName, setYourName] = useState('');
    const [crushName, setCrushName] = useState('');
    const [result, setResult] = useState(null);
    const [displayPercentage, setDisplayPercentage] = useState(0);
    const [loadingDots, setLoadingDots] = useState('');
    const [stats, setStats] = useState([]);

    const intervalRef = useRef(null);

    // Load stats on mount
    useEffect(() => {
        const savedStats = JSON.parse(localStorage.getItem('love_stats') || "[]");
        setStats(savedStats);
    }, []);

    // Loading dots animation
    useEffect(() => {
        if (screen === 2) {
            let dots = 0;
            const interval = setInterval(() => {
                dots = (dots + 1) % 4;
                setLoadingDots('.'.repeat(dots));
            }, 500);
            return () => clearInterval(interval);
        }
    }, [screen]);

    // Percentage animation
    useEffect(() => {
        if (screen === 3 && result !== null) {
            let current = 0;
            const stepTime = Math.max(10, Math.floor(1500 / result.score));
            const interval = setInterval(() => {
                current += 1;
                setDisplayPercentage(current);
                if (current >= result.score) {
                    clearInterval(interval);
                }
            }, stepTime);
            return () => clearInterval(interval);
        }
    }, [screen, result]);

    // Global layout override
    useEffect(() => {
        document.body.classList.add('love-calc-active');
        return () => {
            document.body.classList.remove('love-calc-active');
        };
    }, []);

    const handleNameChange = (setter) => (e) => {
        const val = e.target.value.replace(/[^a-zA-Z]/g, '');
        setter(val);
    };

    const calculateLoveScore = (yourName, crushName) => {
        if (!yourName || !crushName) throw new Error("Both names are required.");
        if (yourName.includes(" ") || crushName.includes(" ")) {
            throw new Error("Only first names are allowed.");
        }

        const a = yourName.trim().toLowerCase();
        const b = crushName.trim().toLowerCase();

        if (!/^[a-z]+$/.test(a) || !/^[a-z]+$/.test(b)) {
            throw new Error("Names must contain letters only.");
        }

        if (
            (a === "naina" && b === "surya") ||
            (a === "surya" && b === "naina")
        ) {
            return 92;
        }

        const combined = `A:${a}|B:${b}|LOVE:v1`;
        let hash = 0;

        for (let i = 0; i < combined.length; i++) {
            hash =
                (hash * 131 +
                    combined.charCodeAt(i) * (i + 3) +
                    (i % 2 === 0 ? 17 : 29) +
                    a.length * 11 +
                    b.length * 7) >>> 0;
        }

        let score = hash % 101;

        if (a === "naina" || b === "naina") {
            score = Math.min(score, 92);
        }

        return score;
    };

    const handleCalculate = () => {
        if (yourName.toLowerCase() === "show" && crushName.toLowerCase() === "stats") {
            setScreen(4);
            return;
        }

        if (!yourName.trim()) return;
        if (!crushName.trim()) return;

        setScreen(2);

        const score = calculateLoveScore(yourName, crushName);
        let levelData = tarotLevels[tarotLevels.length - 1];
        for (let level of tarotLevels) {
            if (score <= level.max) {
                levelData = level;
                break;
            }
        }

        const message = levelData.messages[Math.floor(Math.random() * levelData.messages.length)];
        const resultData = { score, message, image: levelData.image };

        // Save stat
        const newStat = {
            date: new Date().toLocaleString(),
            names: `${yourName} & ${crushName}`,
            score: score,
            card: levelData.image.replace('.png', '').replace(/-/g, ' ').toUpperCase(),
            device: navigator.platform
        };
        const updatedStats = [newStat, ...stats];
        setStats(updatedStats);
        localStorage.setItem('love_stats', JSON.stringify(updatedStats));

        setTimeout(() => {
            setResult(resultData);
            setScreen(3);
        }, 3000);
    };

    const handleRestart = () => {
        setYourName('');
        setCrushName('');
        setResult(null);
        setDisplayPercentage(0);
        setScreen(1);
    };

    return (
        <div className="love-calculator-container">
            {/* Screen 1: Input */}
            <div className={`love-screen ${screen === 1 ? 'active' : ''}`}>
                <FloatingHearts />
                <header className="love-header">
                    <button className="back-icon-btn" onClick={() => window.history.back()}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="#3C3B52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </header>
                <main>
                    <div className="love-titles">
                        <h1>Love calculator</h1>
                        <h2>What future beholds</h2>
                    </div>
                    <div className="love-form-section">
                        <h3 className="love-section-title">LET'S GET STARTED</h3>
                        <div className="love-input-group">
                            <input type="text" placeholder="Your name" value={yourName} onChange={handleNameChange(setYourName)} maxLength="20" />
                        </div>
                        <div className="love-input-group">
                            <input type="text" placeholder="Crush's name" value={crushName} onChange={handleNameChange(setCrushName)} maxLength="20" />
                        </div>
                    </div>
                    <div className="love-spacer"></div>
                    <div className="cta-container">
                        <div className="love-disclaimer">
                            <p>Love Calculator™ doesn't guess, it calculates. Using the movements of the Sun and Moon and an ancient god-script hidden from mortals, it delivers results with terrifying precision.</p>
                            <p>It was reportedly coded after consuming powdered unicorn horn and the blood of Cupid's right little toe.</p>
                            <p>Proceed only if you're brave enough to know the truth.</p>
                        </div>
                        <button className="love-cta-button" onClick={handleCalculate}>CALCULATE</button>
                    </div>
                </main>
            </div>

            {/* Screen 2: Calculating */}
            <div className={`love-screen calculating-screen ${screen === 2 ? 'active' : ''}`}>
                <FloatingHearts />
                <div className="calculating-content">
                    <div className="globe-placeholder">
                        <img src="/assets/globe.png" alt="Rotating globe" />
                    </div>
                    <div className="loading-text">Calculating<span>{loadingDots}</span></div>
                </div>
            </div>

            {/* Screen 3: Result */}
            <div className={`love-screen result-screen-bg ${screen === 3 ? 'active' : ''}`}>
                <FloatingHearts />
                <header className="love-header">
                    <button className="back-icon-btn" onClick={handleRestart}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </header>
                <div className="result-content">
                    <div className="result-center-group">
                        <h1 className="percentage">{displayPercentage}%</h1>
                        <div className="tarot-card-container">
                            {result && (
                                <img
                                    src={`/assets/tarots/${result.image}`}
                                    className="result-tarot-card"
                                    alt="Tarot Result"
                                />
                            )}
                        </div>
                        <p className="result-text">{result?.message}</p>
                    </div>
                </div>
            </div>

            {/* Screen 4: Stats */}
            <div className={`love-screen stats-screen ${screen === 4 ? 'active' : ''}`}>
                <header className="love-header">
                    <button className="back-icon-btn" onClick={() => setScreen(1)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="#3C3B52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <h3 style={{ marginLeft: '16px', color: '#3C3B52', fontFamily: "'Varela Round', sans-serif", fontSize: '18px' }}>Secret Stats</h3>
                </header>
                <div className="love-stats-list">
                    {stats.length === 0 ? (
                        <p style={{ color: '#8583A5', fontSize: '14px', textAlign: 'center' }}>No calculations logged yet.</p>
                    ) : (
                        stats.map((s, i) => (
                            <div key={i} className="love-stat-card">
                                <div className="love-stat-row"><span className="label">Date:</span> <span>{s.date}</span></div>
                                <div className="love-stat-row"><span className="label">Pairing:</span> <span>{s.names}</span></div>
                                <div className="love-stat-row"><span className="label">Result:</span> <span style={{ fontWeight: 'bold', color: '#5E57B4' }}>{s.score}% ({s.card})</span></div>
                                <div className="love-stat-row"><span className="label">Device:</span> <span>{s.device}</span></div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoveCalculator;
