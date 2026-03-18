/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        border: '#e8e5f0',
        input: '#e8e5f0',
        ring: '#7C3AED',
        background: '#ffffff',
        foreground: '#1e1b2e',
        primary: {
          DEFAULT: '#7C3AED',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f5f3ff',
          foreground: '#4c1d95',
        },
        muted: {
          DEFAULT: '#f5f3ff',
          foreground: '#6b7280',
        },
        accent: {
          DEFAULT: '#ede9fe',
          foreground: '#5b21b6',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#fafafa',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1e1b2e',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#1e1b2e',
        },
        sidebar: {
          DEFAULT: '#faf8ff',
          foreground: '#6b7280',
          active: '#7C3AED',
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
        // 미리보기 패널 등장 애니메이션
        previewEnter: {
          '0%': { opacity: '0', transform: 'scale(0.92) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
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
        'preview-enter': 'previewEnter 0.4s cubic-bezier(0.16,1,0.3,1)',
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
