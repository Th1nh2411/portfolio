/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Pixel theme: display = Tiny5, mono = VT323 (both ship Vietnamese glyphs).
        display: ['Tiny5', 'sans-serif'],
        body: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        mono: ['VT323', 'monospace'],
        pixel: ['Tiny5', 'sans-serif'],
        // Clean, modern headings (Vietnamese glyphs included); pixel fonts stay for accents.
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        'pixel-mono': ['VT323', 'monospace'],
      },
      colors: {
        // "Graphite + Cobalt" palette: neutral slate + cobalt accent + muted teal.
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#dde1e7',
          300: '#c2c8d1',
          400: '#9aa3b0',
          500: '#737d8c',
          600: '#555e6c',
          700: '#3b424d',
          800: '#272c34',
          900: '#121418',
          950: '#07080a',
        },
        // Theme-aware: peach-terracotta in light mode, soft peach in dark mode.
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          light: 'rgb(var(--accent-light) / <alpha-value>)',
          dark: 'rgb(var(--accent-dark) / <alpha-value>)',
        },
        'on-accent': 'rgb(var(--on-accent) / <alpha-value>)',
        sea: {
          DEFAULT: '#5fc4b5',
          dark: '#23786e',
        },
        lilac: '#5fc4b5',
        paper: {
          light: '#ffffff',
          dark: '#121418',
        },
        surface: {
          light: '#f4f5f7',
          dark: '#0a0b0d',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-in': 'slideIn 0.5s ease forwards',
        shimmer: 'shimmer 1.5s infinite',
        blink: 'blink 1s steps(1, end) infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
