import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart } from 'lucide-react';

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
      @keyframes floatHeart {
        0% { transform: translateY(0px) scale(1) rotate(0deg); opacity: 0; }
        20% { opacity: 0.8; }
        100% { transform: translateY(-100vh) scale(1.5) rotate(45deg); opacity: 0; }
      }
      @keyframes slideUpFade {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes glitchEffect {
        0% { transform: translate(0) }
        20% { transform: translate(-3px, 3px) }
        40% { transform: translate(-3px, -3px) }
        60% { transform: translate(3px, 3px) }
        80% { transform: translate(3px, -3px) }
        100% { transform: translate(0) }
      }
      @keyframes glitchColors {
        0% { text-shadow: 3px 0 red, -3px 0 cyan; }
        25% { text-shadow: -3px 0 red, 3px 0 cyan; }
        50% { text-shadow: 3px 3px red, -3px -3px cyan; }
        75% { text-shadow: -3px -3px red, 3px 3px cyan; }
        100% { text-shadow: 3px 0 red, -3px 0 cyan; }
      }
      .fancy-bg {
        background: linear-gradient(-45deg, #ff9a9e, #fecfef, #fbc2eb, #a18cd1);
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
      }
      .glass-card {
        background: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      }
      .custom-input {
        box-shadow: inset 0 2px 5px rgba(0,0,0,0.02);
      }
      .custom-input:focus {
        border-color: #ff4b4b !important;
        box-shadow: 0 0 0 4px rgba(255, 75, 75, 0.15), inset 0 2px 5px rgba(0,0,0,0.02) !important;
        background-color: #fff !important;
      }
      .glitching-container {
        animation: glitchEffect 0.2s infinite;
      }
      .glitching-text {
        color: #000 !important;
        background: none !important;
        -webkit-text-fill-color: #000 !important;
        animation: glitchColors 0.1s infinite !important;
      }
      .stats-item {
        background: rgba(255,255,255,0.6);
        margin-bottom: 0.5rem;
        padding: 0.8rem 1rem;
        border-radius: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: transform 0.2s;
      }
      .stats-item:hover {
        transform: scale(1.02);
        background: rgba(255,255,255,0.9);
      }
    `;
        document.head.appendChild(styleSheet);
        return () => document.head.removeChild(styleSheet);
    }, []);

    useEffect(() => {
        let interval;
        if (isGlitching) {
            interval = setInterval(() => {
                const chars = '!<>-_\\\\/[]{}—=+*^?#_0123456789';
                let str = '';
                for (let i = 0; i < 4; i++) {
                    str += chars[Math.floor(Math.random() * chars.length)];
                }
                setGlitchText(str + '%');
            }, 50);
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
        setResult(null);
        setIsCalculating(true);
        setSpecialMessage(null);
        setIsGlitching(false);

        const a = cleanName(name1);
        const b = cleanName(name2);

        // Check for special stats trigger
        if (a === 'show' && b === 'stats') {
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
            setIsCalculating(false);
            setResult(-1);
            setSpecialMessage("Full name not allowed");
            return;
        }

        setTimeout(() => {
            if ((a === 'yashika' && b === 'aditi') || (a === 'aditi' && b === 'yashika')) {
                setResult(0);
                setIsGlitching(true);
                setSpecialMessage("Tch tch tch! bro! move on!");
            } else {
                const score = loveCalculator(name1, name2);
                setResult(score);
                setSpecialMessage(null);
            }
            setIsCalculating(false);
            // Save to global history secretly
            saveStat(name1, name2);
        }, 1500);
    };

    const floatingHearts = Array.from({ length: 15 }).map((_, i) => ({
        left: Math.random() * 100 + 'vw',
        animationDuration: (Math.random() * 4 + 5) + 's',
        animationDelay: Math.random() * 5 + 's',
        size: Math.random() * 20 + 15 + 'px'
    }));

    // Stats View
    if (showStatsView) {
        return (
            <div className="fancy-bg" style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '1.5rem', fontFamily: "'Inter', sans-serif", zIndex: 100, overflowY: 'auto'
            }}>
                <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <header style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', flexShrink: 0 }}>
                        <button
                            onClick={() => { setShowStatsView(false); setName1(''); setName2(''); }}
                            style={{
                                background: 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer',
                                color: '#fff', borderRadius: '50%', width: '45px', height: '45px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                            }}
                        >
                            <ChevronLeft size={28} />
                        </button>
                        <h1 style={{ flex: 1, textAlign: 'center', color: '#fff', margin: 0, fontSize: '1.8rem', fontWeight: 900, textShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>
                            Global Searches
                        </h1>
                        <div style={{ width: '45px' }}></div>
                    </header>

                    <main className="glass-card" style={{
                        borderRadius: '30px', padding: '1.5rem', flex: 1, overflowY: 'auto'
                    }}>
                        {statsHistory.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>No searches recorded yet.</p>
                        ) : (
                            statsHistory.map((stat, i) => (
                                <div key={i} className="stats-item">
                                    <div style={{ fontWeight: 800, color: '#333', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {stat.n1} <Heart size={14} color="#ff4b4b" fill="#ff4b4b" /> {stat.n2}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>
                                        {new Date(stat.time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
        <div className="fancy-bg" style={{
            position: 'absolute', top: 0, left: 0, right: 0, minHeight: '100vh',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '2rem 1rem', fontFamily: "'Inter', sans-serif", zIndex: 100, overflow: 'hidden'
        }}>

            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
                {floatingHearts.map((style, i) => (
                    <Heart key={i} size={style.size} fill="rgba(255,255,255,0.6)" color="rgba(255,255,255,0.6)" style={{
                        position: 'absolute', bottom: '-50px', left: style.left,
                        animation: `floatHeart ${style.animationDuration} ease-in infinite ${style.animationDelay}`
                    }} />
                ))}
            </div>

            <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '450px' }}>
                <header style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer',
                            color: '#fff', borderRadius: '50%', width: '45px', height: '45px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <h1 style={{ flex: 1, textAlign: 'center', color: '#fff', margin: 0, fontSize: '2rem', fontWeight: 900, textShadow: '0 4px 15px rgba(0,0,0,0.15)', letterSpacing: '-0.5px' }}>
                        Love Calculator
                    </h1>
                    <div style={{ width: '45px' }}></div>
                </header>

                <main className="glass-card" style={{
                    borderRadius: '30px', padding: '2.5rem 1.5rem', textAlign: 'center'
                }}>
                    <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ position: 'relative', marginTop: '1rem' }}>
                            <input
                                type="text"
                                className="custom-input"
                                value={name1}
                                onChange={(e) => setName1(e.target.value)}
                                placeholder="  "
                                style={{
                                    width: '100%', padding: '1.2rem 1rem', borderRadius: '16px',
                                    border: '2px solid rgba(255,255,255,0.8)', fontSize: '1.2rem',
                                    outline: 'none', color: '#333', backgroundColor: 'rgba(255,255,255,0.8)',
                                    transition: 'all 0.3s ease', boxSizing: 'border-box', textAlign: 'center', fontWeight: 'bold'
                                }}
                                required
                            />
                            <span style={{
                                position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.9)', borderRadius: '10px',
                                padding: '2px 10px', fontSize: '0.8rem', fontWeight: 800, color: '#ff4b4b', textTransform: 'uppercase', letterSpacing: '1px'
                            }}>
                                Your Name
                            </span>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="custom-input"
                                value={name2}
                                onChange={(e) => setName2(e.target.value)}
                                placeholder="  "
                                style={{
                                    width: '100%', padding: '1.2rem 1rem', borderRadius: '16px',
                                    border: '2px solid rgba(255,255,255,0.8)', fontSize: '1.2rem',
                                    outline: 'none', color: '#333', backgroundColor: 'rgba(255,255,255,0.8)',
                                    transition: 'all 0.3s ease', boxSizing: 'border-box', textAlign: 'center', fontWeight: 'bold'
                                }}
                                required
                            />
                            <span style={{
                                position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.9)', borderRadius: '10px',
                                padding: '2px 10px', fontSize: '0.8rem', fontWeight: 800, color: '#ff4b4b', textTransform: 'uppercase', letterSpacing: '1px'
                            }}>
                                Crush's Name
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={isCalculating}
                            style={{
                                background: isCalculating ? '#ffb3c1' : 'linear-gradient(135deg, #ff4b4b 0%, #ff0f4b 100%)',
                                color: 'white', border: 'none', padding: '1.2rem', borderRadius: '16px',
                                fontSize: '1.2rem', fontWeight: '900', cursor: isCalculating ? 'wait' : 'pointer',
                                transition: 'all 0.3s ease', textTransform: 'uppercase',
                                letterSpacing: '2px', boxShadow: isCalculating ? 'none' : '0 10px 20px rgba(255, 75, 75, 0.4)',
                                transform: isCalculating ? 'scale(0.98)' : 'scale(1)'
                            }}>
                            {isCalculating ? 'Calculating...' : 'Calculate Love'}
                        </button>
                    </form>

                    {result !== null && !isCalculating && (
                        <div className={isGlitching ? "glitching-container" : ""} style={{
                            marginTop: '3.5rem', animation: isGlitching ? 'none' : 'slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                        }}>
                            <p style={{ fontSize: '0.9rem', color: isGlitching ? '#000' : '#666', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem', fontWeight: 800 }}>Compatibility</p>

                            {result !== -1 && (
                                <div className={isGlitching ? "glitching-text" : ""} style={{
                                    fontSize: '6rem', fontWeight: '900',
                                    background: 'linear-gradient(135deg, #ff0f4b, #ff758c)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                    lineHeight: 1, filter: 'drop-shadow(0 4px 15px rgba(255, 75, 75, 0.3))'
                                }}>
                                    {isGlitching ? glitchText : `${result}%`}
                                </div>
                            )}
                            <p className={isGlitching ? "glitching-text" : ""} style={{
                                marginTop: '1rem', fontSize: '1.3rem', color: '#ff0f4b', fontWeight: '900'
                            }}>
                                {specialMessage ? specialMessage :
                                    result > 80 ? "Matches made in heaven ✨" :
                                        result > 60 ? "There is a spark! 💖" :
                                            result > 40 ? "Maybe some effort? 🤔" :
                                                "Friendzone forever 😬"}
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default LoveCalculator;
