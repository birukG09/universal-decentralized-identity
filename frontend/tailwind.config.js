/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark neutrals base
        'vault-dark': '#0F172A',
        'vault-slate': '#1E293B',
        'vault-gray': '#334155',
        // Neon accents
        'vault-cyan': '#38BDF8',
        'vault-purple': '#9333EA',
        'vault-amber': '#F59E0B',
        // Legacy support
        primary: '#38BDF8',
        secondary: '#1E293B',
      },
      fontFamily: {
        'heading': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'body': ['Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'vault': '0.25rem',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(56, 189, 248, 0.3)',
        'glow-purple': '0 0 20px rgba(147, 51, 234, 0.3)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'hover-bounce': 'bounce 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
}