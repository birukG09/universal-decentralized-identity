// Vault as interlocking circuits metaphor
export const CircuitVaultIcon = ({ className = "w-6 h-6", variant = "flat" }) => {
  const isGradient = variant === "gradient";
  
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {isGradient && (
          <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        )}
      </defs>
      
      {/* Outer circuit frame */}
      <rect 
        x="3" y="7" width="18" height="12" rx="2"
        stroke={isGradient ? "url(#circuit-gradient)" : "currentColor"}
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Inner circuit patterns */}
      <rect 
        x="6" y="10" width="3" height="2" rx="1"
        fill={isGradient ? "url(#circuit-gradient)" : "currentColor"}
      />
      <rect 
        x="15" y="10" width="3" height="2" rx="1"
        fill={isGradient ? "url(#circuit-gradient)" : "currentColor"}
      />
      <rect 
        x="6" y="14" width="3" height="2" rx="1"
        fill={isGradient ? "url(#circuit-gradient)" : "currentColor"}
      />
      <rect 
        x="15" y="14" width="3" height="2" rx="1"
        fill={isGradient ? "url(#circuit-gradient)" : "currentColor"}
      />
      
      {/* Central processing unit */}
      <rect 
        x="10" y="11" width="4" height="4" rx="1"
        stroke={isGradient ? "url(#circuit-gradient)" : "currentColor"}
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="12" cy="13" r="1" fill={isGradient ? "url(#circuit-gradient)" : "currentColor"} />
      
      {/* Circuit connections */}
      <path 
        d="M9 11 L10 11 M14 11 L15 11 M9 15 L10 15 M14 15 L15 15 M12 7 L12 10 M12 16 L12 19"
        stroke={isGradient ? "url(#circuit-gradient)" : "currentColor"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Top access ports */}
      <circle cx="8" cy="5" r="1.5" stroke={isGradient ? "url(#circuit-gradient)" : "currentColor"} strokeWidth="1.5" fill="none" />
      <circle cx="16" cy="5" r="1.5" stroke={isGradient ? "url(#circuit-gradient)" : "currentColor"} strokeWidth="1.5" fill="none" />
      
      {/* Interlocking elements */}
      <path 
        d="M8 7 L8 5 M16 7 L16 5"
        stroke={isGradient ? "url(#circuit-gradient)" : "currentColor"}
        strokeWidth="1.5"
      />
    </svg>
  );
};