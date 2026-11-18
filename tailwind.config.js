/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Pixel theme: display = Tiny5, mono = VT323 (both ship Vietnamese glyphs).
        display: ['Tiny5', 'sans-serif'],
        body: ['"Cabinet Grotesk"', 'sans-serif'],
        mono: ['VT323', 'monospace'],
        pixel: ['Tiny5', 'sans-serif'],
        'pixel-mono': ['VT323', 'monospace'],
      },
      colors: {
        // "Dusk" palette, sampled from the hero photo (sunset over the bay).
        ink: {
          50: '#f7f2ec',
          100: '#ece4dc',
          200: '#d9cfcf',
          300: '#b9afbd',
          400: '#918aa3',
          500: '#6e6886',
          600: '#565170',
          700: '#423e5c',
          800: '#2f2c47',
          900: '#232137',
          950: '#16152a',
        },
        // Theme-aware: peach-terracotta in light mode, soft peach in dark mode.
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          light: 'rgb(var(--accent-light) / <alpha-value>)',
          dark: 'rgb(var(--accent-dark) / <alpha-value>)',
        },
        'on-accent': 'rgb(var(--on-accent) / <alpha-value>)',
        sea: {
          DEFAULT: '#6fa3a0',
          dark: '#4f8582',
        },
        lilac: '#a99bc9',
        paper: {
          light: '#fdf9f4',
          dark: '#232137',
        },
        surface: {
          light: '#f6efe7',
          dark: '#1c1b2e',
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
