import React from 'react';

export function HenkelLogo({ className = 'w-full h-full' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 300"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Henkel Logo"
    >
      {/* Square white background canvas */}
      <rect width="300" height="300" fill="#FFFFFF" />
      
      {/* Red Henkel Oval */}
      <ellipse
        cx="150"
        cy="150"
        rx="125"
        ry="65"
        fill="none"
        stroke="#E1000F"
        strokeWidth="15"
      />
      
      {/* Red Henkel Typography */}
      <text
        x="150"
        y="166"
        fill="#E1000F"
        fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif"
        fontSize="72"
        fontWeight="bold"
        textAnchor="middle"
        letterSpacing="-1.8"
      >
        Henkel
      </text>
    </svg>
  );
}
