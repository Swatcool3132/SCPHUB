import React, { useState, useEffect } from 'react';

/**
 * ScpAnimatedBackground
 * Recreates the exact animated neon-blue glowing SCP Foundation emblem
 * with the pulsing containment aura and glitching "OYL BKQJZWPEKJ" cipher text,
 * exactly matching the user's uploaded GIF.
 * Also supports custom user uploaded GIF / background if provided.
 */
export const ScpAnimatedBackground = ({ customBgUrl = null }) => {
  const [glitchText, setGlitchText] = useState('OYL BKQJZWPEKJ');
  const [isGlitching, setIsGlitching] = useState(false);

  // Digital cipher text glitching effect between OYL BKQJZWPEKJ and decrypted variants
  useEffect(() => {
    const cipherPhrases = [
      'OYL BKQJZWPEKJ',
      'SCP FOUNDATION',
      'SECURE CONTAIN',
      'OYL BKQJZWPEKJ',
      'LEVEL 4 CLEARANCE',
      'OYL BKQJZWPEKJ'
    ];
    let phraseIdx = 0;

    const interval = setInterval(() => {
      setIsGlitching(true);

      // Scramble characters briefly before settling
      let step = 0;
      const scrambleInterval = setInterval(() => {
        step++;
        const target = cipherPhrases[phraseIdx];
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#$&';
        const scrambled = target
          .split('')
          .map((c) => (c === ' ' ? ' ' : Math.random() > 0.4 ? chars[Math.floor(Math.random() * chars.length)] : c))
          .join('');
        setGlitchText(scrambled);

        if (step > 4) {
          clearInterval(scrambleInterval);
          setGlitchText(cipherPhrases[phraseIdx]);
          setIsGlitching(false);
          phraseIdx = (phraseIdx + 1) % cipherPhrases.length;
        }
      }, 70);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  if (customBgUrl) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <img
          src={customBgUrl}
          alt="Custom Background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-[#0b0f19]/80" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 flex items-center justify-center bg-black">
      {/* CRT Scanline and Grid Overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(0, 240, 255, 0.03), rgba(0, 0, 0, 0) 2%, rgba(0, 0, 0, 0) 98%, rgba(0, 240, 255, 0.03))',
          backgroundSize: '100% 4px, 60px 100%'
        }}
      />

      {/* Radial Background Vignette & Cyan Aura Bloom */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute w-[320px] h-[320px] rounded-full bg-sky-400/15 blur-[60px] pointer-events-none animate-ping" style={{ animationDuration: '4s' }} />

      {/* Centered Animated SCP Emblem & Cipher Text */}
      <div className="relative flex flex-col items-center justify-center -translate-y-6">
        {/* Glowing Pulsing SVG Emblem */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          <svg
            viewBox="0 0 140 140"
            className="w-full h-full drop-shadow-[0_0_25px_rgba(0,229,255,0.7)] filter animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]"
          >
            <defs>
              {/* Neon Glow Filter */}
              <filter id="neon-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer Hex/Notched Containment Shield */}
            <path
              d="m51.9 11.9h31.7l3.07 11.4.944.391c19.4 8.03 32 26.9 32 47.9 0 2.26-.149 4.53-.445 6.77l-.133 1.01 8.37 8.37-15.8 27.4-11.4-3.06-.809.623c-9.06 6.95-20.2 10.7-31.6 10.7-11.4 6e-5-22.5-3.77-31.6-10.7l-.81-.623-11.4 3.06-15.8-27.4 8.37-8.37-.133-1.01c-.296-2.25-.445-4.51-.445-6.77.000141-21 12.6-39.9 32-47.9l.944-.391z"
              fill="none"
              stroke="#00e5ff"
              strokeWidth="4.5"
              strokeLinejoin="round"
              filter="url(#neon-glow)"
            />

            {/* Inner Circular Containment Ring */}
            <circle
              cx="67.7"
              cy="71.5"
              r="33"
              fill="none"
              stroke="#00e5ff"
              strokeWidth="5"
              filter="url(#neon-glow)"
            />

            {/* Three Inward-Facing Containment Arrows */}
            <g fill="#00e5ff" filter="url(#neon-glow)">
              <path
                id="bg-scp-arrow"
                d="m64.7 30.6v24h-5.08l8.08 14 8.08-14h-5.08l-.000265-24h-5.99"
              />
              <use transform="rotate(120 67.7 71.5)" href="#bg-scp-arrow" />
              <use transform="rotate(240 67.7 71.5)" href="#bg-scp-arrow" />
            </g>
          </svg>

          {/* Faint Outer Ring Ripple Pulse */}
          <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping pointer-events-none" style={{ animationDuration: '3.5s' }} />
        </div>

        {/* Monospace Cipher Terminal Subtitle from User's GIF */}
        <div className="mt-5 text-center">
          <div
            className={`font-mono text-base sm:text-xl font-bold tracking-[0.3em] text-[#00e5ff] drop-shadow-[0_0_12px_rgba(0,229,255,0.85)] select-none transition-all duration-75 ${
              isGlitching ? 'text-sky-200 translate-x-0.5 scale-105' : 'text-[#00e5ff]'
            }`}
          >
            {glitchText}
          </div>
          <div className="mt-1 text-[10px] sm:text-xs font-mono tracking-widest text-cyan-400/60 uppercase">
            SECURE • CONTAIN • PROTECT
          </div>
        </div>
      </div>

      {/* Vignette Gradients */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black pointer-events-none" />
    </div>
  );
};
