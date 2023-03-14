/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  mode: 'jit',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      fontSize: {
        base: '15px',
      },
      fontFamily: {
        body: ["Mackinac Pro Medium", ...defaultTheme.fontFamily.serif],
        book: ["Mackinac Pro Book", ...defaultTheme.fontFamily.serif],
        header: ["Mackinac Pro Bold", ...defaultTheme.fontFamily.serif],
        bold: ["Mackinac Pro Bold", ...defaultTheme.fontFamily.serif],
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
