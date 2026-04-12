
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode with class strategy
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D3A2F',
          light: '#1F5A47',
        },
        button: {
          primary: '#2F7D5F',
          'primary-hover': '#25684E',
          secondary: '#F0EDE6',
        },
        background: {
          light: '#F7F9F8',
          accent: '#D7EDE4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'button': '10px',
      },
      boxShadow: {
        'card': '0px 4px 10px rgba(0, 0, 0, 0.06)',
        'card-hover': '0px 8px 20px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
