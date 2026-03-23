import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart } from 'lucide-react';

function cleanName(name) {
    return (name || "").toLowerCase().replace(/[^a-z]/g, "");
}

function alphaSum(name) {
    let total = 0;
    for (const ch of name) {
        total += ch.charCodeAt(0) - 96; // a=1 ... z=26
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

// Simple deterministic hash
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

    // 1) Real-looking base score
    const sum1 = alphaSum(a);
    const sum2 = alphaSum(b);
    const common = commonUniqueLetters(a, b);
    const v1 = vowelCount(a);
    const v2 = vowelCount(b);

    const vowelBonus =
        v1 === v2 ? 6 : Math.abs(v1 - v2) === 1 ? 3 : 0;

    const edgeBonus =
        (a[0] === b[0] ? 8 : 0) +
        (a[a.length - 1] === b[b.length - 1] ? 5 : 0);

    const lenBonus = Math.abs(a.length - b.length) <= 1 ? 5 : 0;

    let basePercent =
        35 +
        (
            (sum1 * 3) +
            (sum2 * 2) +
            (a.length * b.length) +
            (common * 7) +
            vowelBonus +
            edgeBonus +
            lenBonus
        ) % 66;

    // 2) Hidden calibration layer
    const hashA = hashStr(a);
    const hashB = hashStr(b);
    const pairHash = hashStr([a, b].sort().join("|")); // order-independent

    // Hidden numeric signatures
    const singleOverrides = new Map([
        [246202, 94], // "suryakant"
        [206991, 95], // "surya"
    ]);

    const pairOverrides = new Map([
        [75825, 68], // "arjun|naina"
    ]);

    // Single-name priority
    if (singleOverrides.has(hashA)) return singleOverrides.get(hashA);
    if (singleOverrides.has(hashB)) return singleOverrides.get(hashB);

    // Pair priority
    if (pairOverrides.has(pairHash)) return pairOverrides.get(pairHash);

    return basePercent;
}

const LoveCalculator = () => {
    const navigate = useNavigate();
    const [name1, setName1] = useState('');
    const [name2, setName2] = useState('');
    const [result, setResult] = useState(null);

    const handleCalculate = (e) => {
        e.preventDefault();
        const score = loveCalculator(name1, name2);
        setResult(score);
    };

    return (
        <div style={{
            backgroundColor: '#fff0f3',
            color: '#333',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            minHeight: '100vh',
            padding: '0 1rem',
            fontFamily: "'Inter', sans-serif",
            zIndex: 100
        }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 0' }}>
                <header style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#ff4b4b', display: 'flex', alignItems: 'center'
                        }}
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <h1 style={{ flex: 1, textAlign: 'center', color: '#ff4b4b', margin: 0, fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Heart size={32} fill="#ff4b4b" /> Love Calculator
                    </h1>
                    <div style={{ width: '28px' }}></div>
                </header>

                <main style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '24px',
                    padding: '2.5rem 1.5rem',
                    boxShadow: '0 10px 25px rgba(255, 75, 75, 0.15)',
                    border: '1px solid #ffe3e3'
                }}>
                    <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#ff4b4b' }}>Person 1</label>
                            <input
                                type="text"
                                value={name1}
                                onChange={(e) => setName1(e.target.value)}
                                placeholder="Enter first name"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: '2px solid #ffccd5',
                                    fontSize: '1.1rem',
                                    outline: 'none',
                                    color: '#333',
                                    backgroundColor: '#fff',
                                    boxSizing: 'border-box'
                                }}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', margin: '-0.5rem 0' }}>
                            <Heart size={24} color="#ff4b4b" fill="#ff4b4b" />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#ff4b4b' }}>Person 2</label>
                            <input
                                type="text"
                                value={name2}
                                onChange={(e) => setName2(e.target.value)}
                                placeholder="Enter second name"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: '2px solid #ffccd5',
                                    fontSize: '1.1rem',
                                    outline: 'none',
                                    color: '#333',
                                    backgroundColor: '#fff',
                                    boxSizing: 'border-box'
                                }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#ff4b4b',
                                color: 'white',
                                border: 'none',
                                padding: '1rem',
                                borderRadius: '12px',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                marginTop: '1rem',
                                boxShadow: '0 4px 14px rgba(255, 75, 75, 0.4)'
                            }}>
                            Calculate Love
                        </button>
                    </form>

                    {result !== null && (
                        <div style={{
                            marginTop: '2rem',
                            textAlign: 'center',
                            animation: 'fadeIn 0.5s ease'
                        }}>
                            <h2 style={{ fontSize: '1.2rem', color: '#666', marginBottom: '0.5rem' }}>Compatibility Score</h2>
                            <div style={{
                                fontSize: '4.5rem',
                                fontWeight: '900',
                                color: '#ff4b4b',
                                background: '-webkit-linear-gradient(45deg, #ff4b4b, #ff8fa3)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                lineHeight: 1
                            }}>
                                {result}%
                            </div>
                            <p style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#ff4b4b', fontWeight: 'bold' }}>
                                {result > 80 ? "A True Match!" : result > 50 ? "There is Potential!" : "It might be tough..."}
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default LoveCalculator;
