// Identity as constellation metaphor
export const ConstellationIcon = ({ className = "w-6 h-6", variant = "flat" }) => {
  const isGradient = variant === "gradient";
  
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {isGradient && (
          <linearGradient id="constellation-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        )}
      </defs>
      
      {/* Central star */}
      <circle cx="12" cy="12" r="2" fill={isGradient ? "url(#constellation-gradient)" : "currentColor"} />
      
      {/* Constellation points */}
      <circle cx="6" cy="6" r="1.5" fill={isGradient ? "url(#constellation-gradient)" : "currentColor"} />
      <circle cx="18" cy="6" r="1.5" fill={isGradient ? "url(#constellation-gradient)" : "currentColor"} />
      <circle cx="6" cy="18" r="1.5" fill={isGradient ? "url(#constellation-gradient)" : "currentColor"} />
      <circle cx="18" cy="18" r="1.5" fill={isGradient ? "url(#constellation-gradient)" : "currentColor"} />
      <circle cx="12" cy="4" r="1" fill={isGradient ? "url(#constellation-gradient)" : "currentColor"} />
      <circle cx="20" cy="12" r="1" fill={isGradient ? "url(#constellation-gradient)" : "currentColor"} />
      <circle cx="4" cy="12" r="1" fill={isGradient ? "url(#constellation-gradient)" : "currentColor"} />
      <circle cx="12" cy="20" r="1" fill={isGradient ? "url(#constellation-gradient)" : "currentColor"} />
      
      {/* Connection lines with organic curves */}
      <path 
        d="M6 6 Q9 9 12 12 Q15 15 18 18 M6 18 Q9 15 12 12 Q15 9 18 6 M12 4 Q12 8 12 12 Q12 16 12 20 M4 12 Q8 12 12 12 Q16 12 20 12"
        stroke={isGradient ? "url(#constellation-gradient)" : "currentColor"}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
};