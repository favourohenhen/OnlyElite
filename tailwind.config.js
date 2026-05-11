/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        black: '#111111',
        cream: '#FDFBF7',
        gold: '#D4AF37',
        burgundy: '#58111A',
        muted: '#666666',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
