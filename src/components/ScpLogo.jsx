import React from 'react';

export const ScpLogo = ({ className = 'w-8 h-8', showGlow = false }) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {showGlow && (
        <div className="absolute inset-0 bg-sky-500/20 blur-md rounded-full -z-10" />
      )}
      <svg
        viewBox="0 0 140 140"
        className="w-full h-full drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        {/* Outer White Contour Sticker Border */}
        <path
          d="m51.9 11.9h31.7l3.07 11.4.944.391c19.4 8.03 32 26.9 32 47.9 0 2.26-.149 4.53-.445 6.77l-.133 1.01 8.37 8.37-15.8 27.4-11.4-3.06-.809.623c-9.06 6.95-20.2 10.7-31.6 10.7-11.4 6e-5-22.5-3.77-31.6-10.7l-.81-.623-11.4 3.06-15.8-27.4 8.37-8.37-.133-1.01c-.296-2.25-.445-4.51-.445-6.77.000141-21 12.6-39.9 32-47.9l.944-.391z"
          fill="#0a0f1d"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* Inner White Containment Ring */}
        <circle
          cx="67.7"
          cy="71.5"
          r="33"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6.5"
        />
        {/* Three Inward Containment Arrows */}
        <g fill="#ffffff">
          <path
            id="scp-arrow-head"
            d="m64.7 30.6v24h-5.08l8.08 14 8.08-14h-5.08l-.000265-24h-5.99"
          />
          <use transform="rotate(120 67.7 71.5)" xlinkHref="#scp-arrow-head" />
          <use transform="rotate(240 67.7 71.5)" xlinkHref="#scp-arrow-head" />
        </g>
      </svg>
    </div>
  );
};
