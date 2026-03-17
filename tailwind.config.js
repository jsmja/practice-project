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
      keyframes: {
        // 센터 팝업: 딤 배경 루프
        dimCycle: {
          '0%': { opacity: '0' },
          '10%': { opacity: '1' },
          '60%': { opacity: '1' },
          '75%': { opacity: '0' },
          '100%': { opacity: '0' },
        },
        // 센터 팝업: 스케일 등장 루프
        popupCycle: {
          '0%': { opacity: '0', transform: 'scale(0.6)' },
          '10%': { opacity: '1', transform: 'scale(1.05)' },
          '15%': { opacity: '1', transform: 'scale(1)' },
          '60%': { opacity: '1', transform: 'scale(1)' },
          '75%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '0', transform: 'scale(0.8)' },
        },
        // 띠배너: 위→아래 슬라이드 루프
        stripCycle: {
          '0%': { opacity: '0', transform: 'translateY(-100%)' },
          '10%': { opacity: '1', transform: 'translateY(0)' },
          '60%': { opacity: '1', transform: 'translateY(0)' },
          '75%': { opacity: '0', transform: 'translateY(-100%)' },
          '100%': { opacity: '0', transform: 'translateY(-100%)' },
        },
        // 슬라이드인: 우측에서 슬라이드 루프
        slideCycle: {
          '0%': { opacity: '0', transform: 'translateX(120%)' },
          '12%': { opacity: '1', transform: 'translateX(0)' },
          '60%': { opacity: '1', transform: 'translateX(0)' },
          '75%': { opacity: '0', transform: 'translateX(120%)' },
          '100%': { opacity: '0', transform: 'translateX(120%)' },
        },
        // 풀스크린: 페이드 루프
        fullscreenCycle: {
          '0%': { opacity: '0' },
          '12%': { opacity: '1' },
          '60%': { opacity: '1' },
          '75%': { opacity: '0' },
          '100%': { opacity: '0' },
        },
        // 이탈 감지: 커서 이탈 모션
        cursorExitCycle: {
          '0%': { opacity: '1', transform: 'translate(0, 0)' },
          '15%': { opacity: '1', transform: 'translate(-6px, -18px)' },
          '22%': { opacity: '0', transform: 'translate(-6px, -24px)' },
          '75%': { opacity: '0', transform: 'translate(-6px, -24px)' },
          '90%': { opacity: '0', transform: 'translate(0, 0)' },
          '100%': { opacity: '1', transform: 'translate(0, 0)' },
        },
        // 이탈 감지: 딤+팝업 지연 등장
        exitPopupCycle: {
          '0%': { opacity: '0', transform: 'scale(0.6)' },
          '22%': { opacity: '0', transform: 'scale(0.6)' },
          '30%': { opacity: '1', transform: 'scale(1.05)' },
          '35%': { opacity: '1', transform: 'scale(1)' },
          '60%': { opacity: '1', transform: 'scale(1)' },
          '75%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '0', transform: 'scale(0.8)' },
        },
        exitDimCycle: {
          '0%': { opacity: '0' },
          '22%': { opacity: '0' },
          '30%': { opacity: '1' },
          '60%': { opacity: '1' },
          '75%': { opacity: '0' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'dim-cycle': 'dimCycle 3s ease-in-out infinite',
        'popup-cycle': 'popupCycle 3s ease-in-out infinite',
        'strip-cycle': 'stripCycle 3s ease-in-out infinite',
        'slide-cycle': 'slideCycle 3s ease-in-out infinite',
        'fullscreen-cycle': 'fullscreenCycle 3s ease-in-out infinite',
        'cursor-exit-cycle': 'cursorExitCycle 4s ease-in-out infinite',
        'exit-popup-cycle': 'exitPopupCycle 4s ease-in-out infinite',
        'exit-dim-cycle': 'exitDimCycle 4s ease-in-out infinite',
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
