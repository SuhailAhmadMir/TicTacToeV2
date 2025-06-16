/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'bounceIn': 'bounceIn 0.6s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.3) translateY(-50px)',
          },
          '50%': { 
            opacity: '1',
            transform: 'scale(1.1) translateY(-10px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1) translateY(0)',
          },
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)',
            opacity: '0.7',
          },
          '50%': { 
            transform: 'translateY(-20px) rotate(180deg)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
};