/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Sora', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // primary
          600: 'rgb(0 181 98 / 1)', // main green
          700: 'rgb(0 150 80 / 1)',
          800: '#1e40af',
          900: '#1e3a8a'
        },
        // elevated surfaces
        surface: {
          DEFAULT: 'hsl(0 0% 100%)',
          50: 'hsl(0 0% 99%)',
          100: 'hsl(0 0% 97%)',
          900: 'hsl(220 18% 10%)',
        }
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.06)',
        glass: '0 10px 40px rgba(2,6,23,0.18)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(1200px 600px at 10% -10%, rgba(59,130,246,.25), transparent 60%), radial-gradient(1000px 500px at 100% 10%, rgba(147,197,253,.2), transparent 50%)',
      },
      animation: {
        'fade-in': 'fade-in .4s ease-out both',
        'scale-in': 'scale-in .35s ease-out both',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'scale-in': { from: { transform: 'scale(.98)', opacity: 0 }, to: { transform: 'scale(1)', opacity: 1 } },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@tailwindcss/line-clamp')],
};
