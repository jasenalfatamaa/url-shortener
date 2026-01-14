/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'arch-dark': '#1A1C1E', // Deep Slate
        'arch-gray': '#2C2E31', // Structural Gray
        'arch-stone': '#3F4145', // Stone Texture
        'arch-accent': '#D4AF37', // Elegant Gold
        'arch-light': '#F5F5F7', // Off-white
      },
      fontFamily: {
        header: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'structural-slide': 'slideIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'subtle-drift': 'drift 20s linear infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        drift: {
          '0%': { transform: 'translateX(-5%) translateY(-5%) rotate(0deg)' },
          '100%': { transform: 'translateX(5%) translateY(5%) rotate(2deg)' },
        }
      }
    },
  },
  plugins: [],
}
