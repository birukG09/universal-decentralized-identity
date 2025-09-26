// Data as flowing energy nodes metaphor
export const EnergyFlowIcon = ({ className = "w-6 h-6", variant = "flat" }) => {
  const isGradient = variant === "gradient";
  
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {isGradient && (
          <linearGradient id="energy-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        )}
      </defs>
      
      {/* Energy nodes */}
      <circle cx="6" cy="8" r="2" fill={isGradient ? "url(#energy-gradient)" : "currentColor"} opacity="0.8" />
      <circle cx="18" cy="8" r="2" fill={isGradient ? "url(#energy-gradient)" : "currentColor"} opacity="0.8" />
      <circle cx="6" cy="16" r="2" fill={isGradient ? "url(#energy-gradient)" : "currentColor"} opacity="0.8" />
      <circle cx="18" cy="16" r="2" fill={isGradient ? "url(#energy-gradient)" : "currentColor"} opacity="0.8" />
      
      {/* Central energy core */}
      <circle 
        cx="12" cy="12" r="3"
        stroke={isGradient ? "url(#energy-gradient)" : "currentColor"}
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="12" cy="12" r="1.5" fill={isGradient ? "url(#energy-gradient)" : "currentColor"} />
      
      {/* Flowing energy connections */}
      <path 
        d="M8 8 Q10 10 12 9 Q14 8 16 8"
        stroke={isGradient ? "url(#energy-gradient)" : "currentColor"}
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      <path 
        d="M8 16 Q10 14 12 15 Q14 16 16 16"
        stroke={isGradient ? "url(#energy-gradient)" : "currentColor"}
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      <path 
        d="M6 10 Q8 11 9 12 Q8 13 6 14"
        stroke={isGradient ? "url(#energy-gradient)" : "currentColor"}
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      <path 
        d="M18 10 Q16 11 15 12 Q16 13 18 14"
        stroke={isGradient ? "url(#energy-gradient)" : "currentColor"}
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      
      {/* Energy particles */}
      <circle cx="9" cy="6" r="0.5" fill={isGradient ? "url(#energy-gradient)" : "currentColor"} opacity="0.6" />
      <circle cx="15" cy="6" r="0.5" fill={isGradient ? "url(#energy-gradient)" : "currentColor"} opacity="0.6" />
      <circle cx="9" cy="18" r="0.5" fill={isGradient ? "url(#energy-gradient)" : "currentColor"} opacity="0.6" />
      <circle cx="15" cy="18" r="0.5" fill={isGradient ? "url(#energy-gradient)" : "currentColor"} opacity="0.6" />
      <circle cx="3" cy="12" r="0.5" fill={isGradient ? "url(#energy-gradient)" : "currentColor"} opacity="0.6" />
      <circle cx="21" cy="12" r="0.5" fill={isGradient ? "url(#energy-gradient)" : "currentColor"} opacity="0.6" />
      
      {/* Pulsing inner ring */}
      <circle 
        cx="12" cy="12" r="2"
        stroke={isGradient ? "url(#energy-gradient)" : "currentColor"}
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
};