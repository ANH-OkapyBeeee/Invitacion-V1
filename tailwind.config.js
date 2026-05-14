/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'xv-red': 'var(--red)',
        'xv-dark-red': 'var(--dark-red)',
        'xv-gold': 'var(--gold)',
        'xv-gold-light': 'var(--gold-light)',
        'xv-pearl': 'var(--pearl)',
        'xv-black-bg': 'var(--black-bg)',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        josefin: ['"Josefin Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
