/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',             // #186BE8
          dark: 'var(--primary-dark)',                 // #042352
          light: 'var(--color-primary-light)',         // #224E8F
        },
        // secondary: 'var(--color-secondary)',          
        text: 'var(--color-gray-400)',                  // #93AFB6            
        accent: "var(--color-accent)",                  // #5EDCD4
        accentLight: 'var(--color-accent-light)',       // #7FF1E3
        background: 'var(--color-background)',          // #222222
        gray: {
          100: 'var(--color-gray-100)',                // #DBE4E7
          200: 'var(--color-gray-200)',                // #CDD8DA
          300: 'var(--color-gray-300)',                // #B5CACE
          400: 'var(--color-gray-400)',                // #93AFB6
          500: 'var(--color-gray-500)',                // #76979E
          600: 'var(--color-gray-600)',                // #5C7D85
          700: 'var(--color-gray-700)',                // #5B7075
          800: 'var(--color-gray-800)',                // #536468
          900: 'var(--color-gray-900)',                // #445356
          1000: 'var(--color-gray-1000)',              // #384345
          1100: 'var(--color-gray-1100)',              // #313839
        },
        warning: 'var(--color-warning)',               // #D7AE20
        success: 'var(--color-success)',               // #3DBB59
        danger: 'var(--color-danger)',                 // #D65025
        info: 'var(--color-info)',                     // #1BAAB4
      },
      fontSize: {
        'h1': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
        'h2': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        'h3': ['1.5rem', { lineHeight: '2rem' }], // 24px
        'h4': ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        'h5': ['1rem', { lineHeight: '1.5rem' }], // 16px
        'h6': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
      },
      screens: {
        xl: { max: '1149px' },
        lg: { max: '991px' },
        md: { max: '767px' },
        sm: { max: '560px' },
        xs: { max: '479px' },
      },
    },
  },
  plugins: [
    ({ addComponents }) => {
      addComponents({
        '.btn': {
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          fontWeight: '500',
          display: 'inline-block',
          textAlign: 'center',
          cursor: 'pointer',
        },
        '.btn-default': {
          backgroundColor: 'var(--color-accent)',     // Default background (accent color)
          color: 'var(--color-primary-dark)',              // Default text (primary color)
          '&:hover': {
            backgroundColor: 'var(--color-primary)',  // Hover background (primary color)
            color: 'var(--color-accent)',             // Hover text (accent color)
          },
          '&:disabled': {
            backgroundColor: 'var(--color-gray-500)', // Disabled background (gray)
            color: 'var(--color-background)',         // Disabled text (background)
            cursor: 'not-allowed',
          }
        },
        '.btn-primary': {
          backgroundColor: 'var(--color-primary)',    // Primary button background
          color: 'var(--color-background)',           // Primary button text
          '&:hover': {
            backgroundColor: 'var(--primary-dark)',   // Darker background on hover
            color: 'var(--color-background)',         // Ensure text remains visible
          },
        },
        '.btn-secondary': {
          backgroundColor: 'var(--color-gray-500)',   // Secondary button background
          color: 'var(--color-background)',           // Secondary button text
          '&:hover': {
            backgroundColor: 'var(--color-gray-700)', // Darker background on hover
            color: 'var(--color-background)',         // Ensure text remains visible
          },
        },
      });
    },
  ],
}

