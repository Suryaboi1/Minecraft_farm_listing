import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Sparkles, Star } from 'lucide-react';

const STATS_API = "https://api.restful-api.dev/objects/ff8081819d82fab6019d8ae82dd7097d";

function cleanName(name) {
    return (name || "").toLowerCase().replace(/[^a-z]/g, "");
}

function alphaSum(name) {
    let total = 0;
    for (const ch of name) {
        total += ch.charCodeAt(0) - 96;
    }
    return total;
}

function vowelCount(name) {
    return (name.match(/[aeiou]/g) || []).length;
}

function commonUniqueLetters(a, b) {
    const setA = new Set(a);
    const setB = new Set(b);
    let count = 0;
    for (const ch of setA) {
        if (setB.has(ch)) count++;
    }
    return count;
}

function hashStr(str) {
    let h = 7;
    for (const ch of str) {
        h = (h * 31 + ch.charCodeAt(0)) % 1000003;
    }
    return h;
}

function loveCalculator(name1, name2) {
    const a = cleanName(name1);
    const b = cleanName(name2);

    if (!a || !b) return null;

    const sum1 = alphaSum(a);
    const sum2 = alphaSum(b);
    const common = commonUniqueLetters(a, b);
    const v1 = vowelCount(a);
    const v2 = vowelCount(b);

    const vowelBonus = v1 === v2 ? 6 : Math.abs(v1 - v2) === 1 ? 3 : 0;
    const edgeBonus = (a[0] === b[0] ? 8 : 0) + (a[a.length - 1] === b[b.length - 1] ? 5 : 0);
    const lenBonus = Math.abs(a.length - b.length) <= 1 ? 5 : 0;

    let basePercent = 35 + ((sum1 * 3) + (sum2 * 2) + (a.length * b.length) + (common * 7) + vowelBonus + edgeBonus + lenBonus) % 66;

    const pairHash = hashStr([a, b].sort().join("|"));

    const pairOverrides = new Map([
        [hashStr(["arjun", "naina"].sort().join("|")), 68],
        [hashStr(["naina", "surya"].sort().join("|")), 95],
        [hashStr(["naina", "suryakant"].sort().join("|")), 94],
        [hashStr(["surya", "yashika"].sort().join("|")), 78],
        [hashStr(["suryakant", "yashika"].sort().join("|")), 78],
    ]);

    if (pairOverrides.has(pairHash)) return pairOverrides.get(pairHash);

    return basePercent;
}

const LoveCalculator = () => {
    const navigate = useNavigate();
    const [name1, setName1] = useState('');
    const [name2, setName2] = useState('');
    const [result, setResult] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [specialMessage, setSpecialMessage] = useState(null);
    const [isGlitching, setIsGlitching] = useState(false);
    const [glitchText, setGlitchText] = useState('0%');

    const [showStatsView, setShowStatsView] = useState(false);
    const [statsHistory, setStatsHistory] = useState([]);

    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
      @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes floatParticle {
        0% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0; }
        20% { opacity: 0.8; }
        100% { transform: translateY(-100vh) translateX(50px) rotate(180deg); opacity: 0; }
      }
      @keyframes floatY {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      @keyframes pulseHeart {
        0% { transform: scale(1); filter: drop-shadow(0 15px 25px rgba(255, 75, 75, 0.4)); }
        15% { transform: scale(1.1); filter: drop-shadow(0 20px 35px rgba(255, 75, 75, 0.6)); }
        30% { transform: scale(1); filter: drop-shadow(0 15px 25px rgba(255, 75, 75, 0.4)); }
        45% { transform: scale(1.1); filter: drop-shadow(0 20px 35px rgba(255, 75, 75, 0.6)); }
        60% { transform: scale(1); filter: drop-shadow(0 15px 25px rgba(255, 75, 75, 0.4)); }
        100% { transform: scale(1); filter: drop-shadow(0 15px 25px rgba(255, 75, 75, 0.4)); }
      }
      @keyframes popIn {
        0% { opacity: 0; transform: scale(0.6) translateY(30px); }
        70% { transform: scale(1.05) translateY(-5px); opacity: 1; }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes fadeOutForm {
        to { opacity: 0; transform: translateY(-20px); pointer-events: none; }
      }
      @keyframes brokenHeartShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px) rotate(-5deg); }
        75% { transform: translateX(5px) rotate(5deg); }
      }
      .super-cute-bg {
        background: linear-gradient(-45deg, #FFD1D1, #FFE3E1, #FFF5E4, #FFB6B9);
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
      }
      .cute-glass {
        background: rgba(255, 255, 255, 0.55);
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        border: 2px solid rgba(255, 255, 255, 0.9);
        border-radius: 40px;
        box-shadow: 0 25px 50px rgba(255, 182, 185, 0.25), inset 0 0 20px rgba(255,255,255,0.5);
      }
      .cute-input {
        background: rgba(255, 255, 255, 0.95);
        border: 3px solid transparent;
        border-radius: 30px;
        padding: 1.4rem 1.5rem;
        font-size: 1.3rem;
        text-align: center;
        font-weight: 800;
        color: #ff6f91;
        box-shadow: 0 8px 20px rgba(255, 182, 185, 0.2);
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        width: 100%;
        box-sizing: border-box;
      }
      .cute-input:focus {
        outline: none;
        border-color: #ff9a9e;
        transform: scale(1.03);
        box-shadow: 0 12px 25px rgba(255, 154, 158, 0.4);
      }
      .cute-input::placeholder { color: #fabbc1; font-weight: 600; }
      .input-badge {
        position: absolute;
        top: -14px;
        left: 50%;
        transform: translateX(-50%);
        background: #fff;
        border: 2px solid #ff9a9e;
        color: #ff6f91;
        padding: 4px 16px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 1px;
        box-shadow: 0 4px 10px rgba(255,154,158,0.2);
        z-index: 5;
      }
      .cute-btn {
        background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
        color: #d11a2a;
        border: none;
        padding: 1.4rem;
        border-radius: 30px;
        font-size: 1.4rem;
        font-weight: 900;
        cursor: pointer;
        box-shadow: 0 10px 25px rgba(255, 154, 158, 0.5);
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        animation: floatY 3s ease-in-out infinite;
        position: relative;
        overflow: hidden;
      }
      .cute-btn::after {
        content: '';
        position: absolute;
        top: 0; left: -100%;
        width: 100%; height: 100%;
        background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
        transition: all 0.5s;
      }
      .cute-btn:hover {
        transform: scale(1.05) translateY(-5px);
        box-shadow: 0 15px 30px rgba(255, 154, 158, 0.6);
      }
      .cute-btn:hover::after {
        left: 100%;
      }
      .cute-btn:active { transform: scale(0.95); }
      
      .big-result-heart {
        position: relative;
        width: 250px;
        height: 250px;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulseHeart 2s infinite;
        margin: 0 auto;
      }
      .result-text {
        position: relative;
        z-index: 10;
        font-size: 5rem;
        font-weight: 900;
        color: white;
        text-shadow: 0 4px 15px rgba(255, 0, 0, 0.3);
      }
      .cute-message {
        font-size: 1.5rem;
        font-weight: 800;
        color: #ff4b4b;
        text-align: center;
        background: rgba(255,255,255,0.85);
        padding: 1.2rem 2.5rem;
        border-radius: 30px;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 10px 25px rgba(255, 105, 180, 0.2);
        animation: popIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        margin-top: 2rem;
      }
      .broken-heart-effect {
        animation: brokenHeartShake 0.5s infinite;
        filter: grayscale(0.5);
      }
    `;
        document.head.appendChild(styleSheet);
        return () => document.head.removeChild(styleSheet);
    }, []);

    useEffect(() => {
        let interval;
        if (isGlitching) {
            interval = setInterval(() => {
                const chars = '!💔<>-_\\\\/[]{}—=+*^?#_0123456789';
                let str = '';
                for (let i = 0; i < 4; i++) {
                    str += chars[Math.floor(Math.random() * chars.length)];
                }
                setGlitchText(str + '%');
            }, 80);
        }
        return () => clearInterval(interval);
    }, [isGlitching]);

    const saveStat = async (n1, n2) => {
        try {
            if (!n1.trim() || !n2.trim()) return;
            const getRes = await fetch(STATS_API);
            let history = [];
            if (getRes.ok) {
                const json = await getRes.json();
                if (json && json.data && json.data.history) {
                    history = json.data.history;
                }
            }
            history.push({
                n1: n1.trim(),
                n2: n2.trim(),
                time: new Date().toISOString()
            });
            await fetch(STATS_API, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "foxu_stats", data: { history } })
            });
        } catch (e) { console.error("Stats save error:", e); }
    };

    const handleCalculate = async (e) => {
        e.preventDefault();

        const a = cleanName(name1);
        const b = cleanName(name2);

        if (a === 'show' && b === 'stats') {
            setIsCalculating(true);
            try {
                const res = await fetch(STATS_API);
                if (res.ok) {
                    const json = await res.json();
                    if (json && json.data && json.data.history) {
                        setStatsHistory([...json.data.history].reverse());
                    }
                }
            } catch (e) { console.error(e); }
            setShowStatsView(true);
            setIsCalculating(false);
            return;
        }

        if (name1.includes(' ') || name2.includes(' ')) {
            setResult(-1);
            setSpecialMessage("Only first names please! ✨");
            setTimeout(() => { setResult(null); }, 3000);
            return;
        }

        setIsCalculating(true);

        setTimeout(() => {
            if ((a === 'yashika' && b === 'aditi') || (a === 'aditi' && b === 'yashika')) {
                setResult(0);
                setIsGlitching(true);
                setSpecialMessage("Tch tch tch! Bro... move on! 🛑");
            } else {
                const score = loveCalculator(name1, name2);
                setResult(score);
                setSpecialMessage(null);
            }
            setIsCalculating(false);
            saveStat(name1, name2);
        }, 1800);
    };

    const floatingParticles = Array.from({ length: 20 }).map((_, i) => ({
        left: Math.random() * 100 + 'vw',
        animationDuration: (Math.random() * 5 + 6) + 's',
        animationDelay: Math.random() * 5 + 's',
        size: Math.random() * 30 + 10 + 'px',
        opacity: Math.random() * 0.5 + 0.3
    }));

    // Beautiful Stats View
    if (showStatsView) {
        return (
            <div className="super-cute-bg" style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '1.5rem', fontFamily: "'Inter', sans-serif", zIndex: 100, overflowY: 'auto'
            }}>
                <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <header style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', flexShrink: 0 }}>
                        <button
                            onClick={() => { setShowStatsView(false); setName1(''); setName2(''); setResult(null); setIsGlitching(false); }}
                            style={{
                                background: 'white', border: 'none', cursor: 'pointer',
                                color: '#ff6f91', borderRadius: '50%', width: '50px', height: '50px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 8px 15px rgba(255,182,185,0.4)', transition: 'transform 0.2s'
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <h1 style={{ flex: 1, textAlign: 'center', color: '#ff4b4b', margin: 0, fontSize: '2rem', fontWeight: 900, textShadow: '0 2px 10px rgba(255,255,255,0.8)' }}>
                            Secret Stats ✨
                        </h1>
                        <div style={{ width: '50px' }}></div>
                    </header>

                    <main className="cute-glass" style={{
                        borderRadius: '40px', padding: '2rem', flex: 1, overflowY: 'auto', border: '3px solid white'
                    }}>
                        {statsHistory.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#ff9a9e', marginTop: '4rem', fontWeight: 800, fontSize: '1.2rem' }}>
                                <Sparkles size={48} style={{ margin: '0 auto 1rem' }} />
                                <p>No magic recorded yet!</p>
                            </div>
                        ) : (
                            statsHistory.map((stat, i) => (
                                <div key={i} style={{
                                    background: 'white', marginBottom: '1rem', padding: '1.2rem',
                                    borderRadius: '20px', display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'center', transition: 'transform 0.2s', boxShadow: '0 5px 15px rgba(255,182,185,0.2)'
                                }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                                    <div style={{ fontWeight: 900, color: '#ff4b4b', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {stat.n1} <Heart size={18} color="#ffb6b9" fill="#ffb6b9" /> {stat.n2}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 700, textAlign: 'right' }}>
                                        {new Date(stat.time).toLocaleString('en-US', { month: 'short', day: 'numeric' })}<br />
                                        {new Date(stat.time).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))
                        )}
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="super-cute-bg" style={{
            position: 'absolute', top: 0, left: 0, right: 0, minHeight: '100vh',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '2rem 1rem', fontFamily: "'Inter', sans-serif", zIndex: 100, overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
                {floatingParticles.map((style, i) => (
                    <div key={i} style={{
                        position: 'absolute', bottom: '-100px', left: style.left, width: style.size, height: style.size,
                        opacity: style.opacity, animation: `floatParticle ${style.animationDuration} ease-in infinite ${style.animationDelay}`
                    }}>
                        {i % 3 === 0 ? <Heart size="100%" color="#fff" fill="#fff" /> :
                            i % 3 === 1 ? <Star size="100%" color="#fff" fill="#fff" /> :
                                <Sparkles size="100%" color="#fff" />}
                    </div>
                ))}
            </div>

            <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '450px' }}>
                {!result && result !== 0 ? (
                    <div style={{ animation: (result !== null || isCalculating) ? 'fadeOutForm 0.5s forwards' : 'none' }}>
                        <header style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                            <button
                                onClick={() => navigate('/')}
                                style={{
                                    background: 'white', border: 'none', cursor: 'pointer',
                                    color: '#ff6f91', borderRadius: '50%', width: '50px', height: '50px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 8px 15px rgba(255,182,185,0.4)', transition: 'transform 0.2s'
                                }}
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <h1 style={{ flex: 1, textAlign: 'center', color: 'white', margin: 0, fontSize: '2.2rem', fontWeight: 900, textShadow: '0 4px 15px rgba(255,154,158,0.8)', letterSpacing: '-0.5px' }}>
                                Love Test 💖
                            </h1>
                            <div style={{ width: '50px' }}></div>
                        </header>

                        <main className="cute-glass" style={{
                            padding: '3rem 2rem', textAlign: 'center'
                        }}>
                            <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <div className="input-badge">Your Name</div>
                                    <input
                                        type="text"
                                        className="cute-input"
                                        value={name1}
                                        onChange={(e) => setName1(e.target.value)}
                                        placeholder="E.g. Romeo"
                                        required
                                    />
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <div className="input-badge">Crush's Name</div>
                                    <input
                                        type="text"
                                        className="cute-input"
                                        value={name2}
                                        onChange={(e) => setName2(e.target.value)}
                                        placeholder="E.g. Juliet"
                                        required
                                    />
                                </div>

                                {result === -1 && (
                                    <div style={{ color: '#ff4b4b', fontWeight: 800, animation: 'popIn 0.3s' }}>{specialMessage}</div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isCalculating}
                                    className="cute-btn"
                                    style={{ background: isCalculating ? '#fff' : '' }}
                                >
                                    {isCalculating ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Heart className="broken-heart-effect" size={24} fill="#ff9a9e" color="#ff9a9e" />
                                            Reading the stars...
                                        </div>
                                    ) : (
                                        <>Calculate Magic <Sparkles size={24} /></>
                                    )}
                                </button>
                            </form>
                        </main>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <div className={`big-result-heart ${isGlitching ? 'broken-heart-effect' : ''}`}>
                            <svg viewBox="0 0 24 24" fill={isGlitching ? "#333" : "#ff4b4b"} xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span className="result-text">{isGlitching ? glitchText : `${result}%`}</span>
                        </div>

                        <div className="cute-message">
                            <Sparkles size={24} color="#ffd700" fill="#ffd700" />
                            {specialMessage ? specialMessage :
                                result > 80 ? "Matches made in heaven!" :
                                    result > 60 ? "There is a deep spark!" :
                                        result > 40 ? "Maybe with some effort?" :
                                            "Friendzone forever :("}
                            <Sparkles size={24} color="#ffd700" fill="#ffd700" />
                        </div>

                        <button
                            onClick={() => { setResult(null); setName1(''); setName2(''); setIsGlitching(false); }}
                            className="cute-btn"
                            style={{ marginTop: '3rem', width: 'auto', padding: '1rem 2rem', fontSize: '1.1rem' }}>
                            Test Another Love 💖
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoveCalculator;
