// Trust as fractal keys metaphor
export const FractalKeyIcon = ({ className = "w-6 h-6", variant = "flat" }) => {
  const isGradient = variant === "gradient";
  
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {isGradient && (
          <linearGradient id="fractal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        )}
      </defs>
      
      {/* Main key shaft */}
      <rect 
        x="4" y="11" width="12" height="2" rx="1"
        fill={isGradient ? "url(#fractal-gradient)" : "currentColor"}
      />
      
      {/* Key head (circular with fractal pattern) */}
      <circle 
        cx="6" cy="12" r="3"
        stroke={isGradient ? "url(#fractal-gradient)" : "currentColor"}
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Inner fractal rings */}
      <circle 
        cx="6" cy="12" r="2"
        stroke={isGradient ? "url(#fractal-gradient)" : "currentColor"}
        strokeWidth="1"
        fill="none"
        opacity="0.7"
      />
      <circle 
        cx="6" cy="12" r="1"
        fill={isGradient ? "url(#fractal-gradient)" : "currentColor"}
      />
      
      {/* Fractal teeth pattern */}
      <path 
        d="M16 11 L18 9 M16 13 L18 15 M18 9 L20 7 M18 15 L20 17 M20 7 L21 6 M20 17 L21 18"
        stroke={isGradient ? "url(#fractal-gradient)" : "currentColor"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Secondary fractal branches */}
      <path 
        d="M17 10 L19 8 M17 14 L19 16 M19 8 L20 7 M19 16 L20 17"
        stroke={isGradient ? "url(#fractal-gradient)" : "currentColor"}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
      
      {/* Micro fractal details */}
      <path 
        d="M18.5 8.5 L19 8 M18.5 15.5 L19 16"
        stroke={isGradient ? "url(#fractal-gradient)" : "currentColor"}
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.4"
      />
      
      {/* Key center pattern */}
      <path 
        d="M5 12 L7 12 M6 11 L6 13"
        stroke="white"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
};