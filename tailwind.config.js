/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1C50CB',
        secondary: '#3BB273',
        danger: '#E10C0C',
        warning: '#F5AF36',
        info: '#21BFE2',
        'dark-blue': '#251D4E',

      },
    },
  },
  plugins: [],
}
