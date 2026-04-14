import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F748B1',
        charcoal: '#001e2c',
        'on-primary': '#ffffff',
        background: '#0a0a0a',
        surface: '#121212',
        'on-surface': '#ffffff',
        'surface-container-low': '#181818',
        'surface-container-highest': '#333333',
        'outline-variant': '#27272a',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      fontFamily: {
        headline: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        label: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        // Opacity only — scale() misaligns rects vs rounded inputs/buttons
        ctaRing: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.85' },
        },
      },
      animation: {
        ctaRing: 'ctaRing 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [forms],
}
