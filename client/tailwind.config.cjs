/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
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
        'gradient-animated': "linear-gradient(-45deg, #ff6ec4, #7873f5, #4ade80, #22d3ee)",
      },
    },
  },
  plugins: [],
}
