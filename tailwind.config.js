/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      //adding primary color and dark them 
      colors: {
        'primary' : '#1E40AF',
        'secondary' : '#FBBF24',
      }
    },
  },
  plugins: [],
}