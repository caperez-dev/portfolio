import React from 'react';

export function UstLogo({ className = 'w-full h-full' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="University of Santo Tomas Logo"
    >
      {/* Black/Slate canvas */}
      <rect width="200" height="200" rx="24" fill="#0F172A" />
      
      {/* Outer Gold Shield Border */}
      <path
        d="M100 25 L160 50 V105 C160 140 132 165 100 175 C68 165 40 140 40 105 V50 L100 25 Z"
        fill="#1E293B"
        stroke="#F59E0B"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      
      {/* Inner Gold Cross Accent */}
      <path d="M100 55 V135 M65 90 H135" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
      
      {/* Gold Sun Core */}
      <circle cx="100" cy="90" r="18" fill="#F59E0B" stroke="#FBBF24" strokeWidth="2" />
      
      {/* UST Typography */}
      <text
        x="100"
        y="96"
        fill="#0F172A"
        fontFamily="sans-serif"
        fontSize="16"
        fontWeight="900"
        textAnchor="middle"
        letterSpacing="0.5"
      >
        UST
      </text>
    </svg>
  );
}
