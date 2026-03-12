/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        border: '#e5e5e5',
        input: '#e5e5e5',
        ring: '#0a0a0a',
        background: '#ffffff',
        foreground: '#0a0a0a',
        primary: {
          DEFAULT: '#171717',
          foreground: '#fafafa',
        },
        secondary: {
          DEFAULT: '#f5f5f5',
          foreground: '#171717',
        },
        muted: {
          DEFAULT: '#f5f5f5',
          foreground: '#737373',
        },
        accent: {
          DEFAULT: '#f5f5f5',
          foreground: '#171717',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#fafafa',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0a0a0a',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#0a0a0a',
        },
        sidebar: {
          DEFAULT: '#fafafa',
          foreground: '#737373',
          active: '#171717',
        },
        kakao: {
          DEFAULT: '#fee500',
          foreground: '#191919',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        info: '#3b82f6',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
    },
  },
  plugins: [],
};
