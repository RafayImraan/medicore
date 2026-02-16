/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Luxury Color Scheme
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac', // Luminous mint-like variant
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534', // Darker velvet-like variant
          900: '#0F5132', // Dark emerald primary
          950: '#052e16',
        },
        accent: {
          50: '#fff9e6',
          100: '#fef1c7',
          200: '#fde6a0',
          300: '#f8d46b',
          400: '#e8be3f',
          500: '#D4AF37', // Luxury gold accent
          600: '#b0892e',
          700: '#8a6b24',
          800: '#6a521b',
          900: '#4a3a12',
          950: '#2a2109',
        },
        charcoal: {
          50: '#f7f9fa',
          100: '#f1f3f4',
          200: '#e8eaed',
          300: '#dadce0',
          400: '#bdc1c6',
          500: '#9aa0a6',
          600: '#80868b',
          700: '#5f6368',
          800: '#3c4043',
          900: '#202124',
          950: '#0F1720', // Charcoal background
        },
        muted: {
          50: '#fafbfc',
          100: '#f1f3f5',
          200: '#e8ecf0',
          300: '#d3dbe3',
          400: '#9AA3A8', // Cool grey muted text
          500: '#6c7680',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        luxury: {
          gold: '#D4AF37',
          silver: '#C0C0C0',
          platinum: '#E5E4E2',
          pearl: '#F5F5F0',
        },
      },
      borderColor: {
        border: "var(--color-border)",
      },
      outlineColor: {
        ring: "var(--color-ring)",
      },
      backgroundColor: {
        background: "var(--color-background)",
      },
      textColor: {
        foreground: "var(--color-foreground)",
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        gradient: {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
      },
      animation: {
        blob: "blob 15s infinite",
        gradient: "gradient 8s ease infinite",
      },
      backgroundImage: {
        'gradient-radial': "radial-gradient(var(--tw-gradient-stops))",
        'gradient-animated': "linear-gradient(-45deg, #012e13ff, #1d6c45ff, #4ade80, #22d3ee)",
      },
      fontFamily: {
        body: ['Manrope', 'ui-sans-serif', 'system-ui'],
        display: ['Playfair Display', 'ui-serif', 'Georgia']
      },
    },
  },
  plugins: [],
}
