/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        walnut: {
          light: '#D4A373',
          DEFAULT: '#B9875D',
          dark: '#8B5E3C',
          deep: '#5C3E28',
        },
        forge: {
          black: '#131313',
          surface: '#1C1B1B',
          raised: '#252323',
          hairline: '#393532',
        },
        parchment: {
          ink: '#EAE6E1',
          muted: '#A8A29E',
        }
      }
    },
  },
  plugins: [],
}
