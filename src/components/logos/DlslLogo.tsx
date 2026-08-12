import React from 'react';

export function DlslLogo({ className = 'w-full h-full' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="De La Salle Lipa Logo"
    >
      {/* Dark Green canvas */}
      <rect width="200" height="200" rx="24" fill="#064E3B" />
      
      {/* De La Salle Signum Fidei 5-Pointed Star */}
      <polygon
        points="100,28 122,76 174,76 132,106 148,154 100,124 52,154 68,106 26,76 78,76"
        fill="#10B981"
        stroke="#34D399"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      
      {/* Inner White Star Highlight */}
      <polygon
        points="100,48 115,80 150,80 122,100 133,132 100,112 67,132 78,100 50,80 85,80"
        fill="#ECFDF5"
      />
      
      {/* DLSL Typography */}
      <text
        x="100"
        y="178"
        fill="#A7F3D0"
        fontFamily="sans-serif"
        fontSize="18"
        fontWeight="800"
        textAnchor="middle"
        letterSpacing="1"
      >
        DLSL
      </text>
    </svg>
  );
}
