/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zerde: {
          blue: '#062B65',
          navy: '#051B44',
          cyan: '#00BFFF',
          cyanGlow: '#00D4FF',
          sky: '#DDF5FF',
          gold: '#D49A35',
          goldLight: '#F3BE5E',
          goldDark: '#A06E1A',
          white: '#F8FCFF',
          surface: '#0B2356',
          card: '#081D47',
          border: 'rgba(0, 191, 255, 0.25)',
        }
      },
      fontFamily: {
        sans: ['Zerde Sans', 'Arial', 'system-ui', 'sans-serif'],
        serif: ['Zerde Serif', 'Georgia', 'serif'],
        mono: ['Zerde Mono', 'Consolas', 'monospace'],
        display: ['Zerde Serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 25px rgba(0, 191, 255, 0.35)',
        'gold-glow': '0 0 25px rgba(212, 154, 53, 0.35)',
        'glass': '0 8px 32px 0 rgba(2, 18, 54, 0.37)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
