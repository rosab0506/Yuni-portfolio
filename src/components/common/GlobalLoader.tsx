import { useEffect, useState } from 'react';
import { useLoading } from '../../context/LoadingContext';

export const GlobalLoader = () => {
    const { isLoading } = useLoading();
    const [isVisible, setIsVisible] = useState(isLoading);

    useEffect(() => {
        if (isLoading) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-all duration-700 ease-in-out ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            style={{
                background: 'rgba(11, 19, 32, 0.4)', // Lighter, semi-transparent
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
            }}
        >
            <style>{`
                @keyframes morph-spin {
                    0%, 100% { border-radius: 50%; transform: rotate(0deg) scale(1); border-color: rgba(34, 211, 238, 0.6); }
                    50% { border-radius: 15%; transform: rotate(180deg) scale(1.1); border-color: rgba(192, 132, 252, 0.6); }
                }
                @keyframes orbit-1 {
                    from { transform: rotate(0deg) translateX(60px) rotate(0deg); }
                    to { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
                }
                @keyframes orbit-2 {
                    from { transform: rotate(120deg) translateX(80px) rotate(-120deg); }
                    to { transform: rotate(480deg) translateX(80px) rotate(-480deg); }
                }
                @keyframes orbit-3 {
                    from { transform: rotate(240deg) translateX(70px) rotate(-240deg); }
                    to { transform: rotate(-120deg) translateX(70px) rotate(120deg); } /* Reverse direction */
                }
            `}</style>

            <div className="relative flex items-center justify-center">
                {/* Central Morphing Core */}
                <div
                    className="w-20 h-20 border-4 shadow-[0_0_30px_rgba(192,132,252,0.5)] bg-white/5 backdrop-blur-sm"
                    style={{ animation: 'morph-spin 4s ease-in-out infinite' }}
                >
                    {/* Inner core glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-[inherit]" />
                </div>

                {/* Orbiting Orbs */}
                {/* Orb 1: Cyan */}
                <div
                    className="absolute w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]"
                    style={{ animation: 'orbit-1 3s linear infinite' }}
                />

                {/* Orb 2: Purple */}
                <div
                    className="absolute w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_15px_#a855f7]"
                    style={{ animation: 'orbit-2 4s linear infinite' }}
                />

                {/* Orb 3: Pink (Counter-rotating) */}
                <div
                    className="absolute w-5 h-5 bg-pink-500 rounded-full shadow-[0_0_20px_#ec4899] opacity-80"
                    style={{ animation: 'orbit-3 5s linear infinite' }}
                />

                {/* Center Pulse (Static-ish anchor) */}
                <div className="absolute w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_20px_white]" />
            </div>
        </div>
    );
};
