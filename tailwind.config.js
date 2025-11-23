module.exports = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffaf2',
          100: '#fff3df',
          200: '#ffe1a8',
          300: '#ffd076',
          400: '#e8c45a',
          DEFAULT: '#D4AF37',
          600: '#C1992E',
          700: '#9a741f'
        },
        dark: {
          DEFAULT: '#1A1A1A',
          300: '#2E2E2E'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
}
