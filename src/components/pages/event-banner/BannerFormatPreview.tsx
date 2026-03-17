interface IBannerFormatPreviewProps {
  format: string;
}

/**
 * 배너 유형별 CSS 루프 애니메이션 미니 프리뷰
 * 미니 브라우저 안에서 각 유형이 등장→유지→사라짐→대기를 반복
 */
export function BannerFormatPreview({ format }: IBannerFormatPreviewProps) {
  return (
    <div className="relative h-[120px] w-[160px] overflow-hidden rounded-lg border border-border/60 bg-gray-50">
      {/* 미니 브라우저 타이틀바 */}
      <div className="flex h-4 items-center gap-1 border-b border-border/40 bg-white px-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-red-300" />
        <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
        <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
        <div className="ml-1 h-1.5 flex-1 rounded-sm bg-gray-100" />
      </div>

      {/* 페이지 콘텐츠 골격 */}
      <div className="relative h-[calc(100%-16px)] p-2">
        <div className="mb-1.5 h-1 w-10 rounded-full bg-gray-200" />
        <div className="mb-1 h-1 w-full rounded-full bg-gray-100" />
        <div className="mb-1 h-1 w-4/5 rounded-full bg-gray-100" />
        <div className="mb-1.5 h-1 w-3/5 rounded-full bg-gray-100" />
        <div className="mb-1 h-1 w-full rounded-full bg-gray-100" />
        <div className="mb-1 h-1 w-2/3 rounded-full bg-gray-100" />
        <div className="mb-1 h-1 w-4/5 rounded-full bg-gray-100" />
        <div className="h-1 w-1/2 rounded-full bg-gray-100" />

        {/* 배너 유형별 루프 애니메이션 오버레이 */}
        {format === '센터 팝업' && <CenterPopupAnimation />}
        {format === '띠배너' && <StripBannerAnimation />}
        {format === '슬라이드인' && <SlideInAnimation />}
        {format === '풀스크린' && <FullscreenAnimation />}
        {format === '이탈 감지' && <ExitIntentAnimation />}
      </div>
    </div>
  );
}

function CenterPopupAnimation() {
  return (
    <>
      <div className="absolute inset-0 animate-dim-cycle bg-black/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-popup-cycle rounded-md border border-white/60 bg-white px-2 py-1.5 shadow-lg">
          <div className="mb-1 h-1 w-8 rounded-full bg-indigo-400" />
          <div className="mb-0.5 h-0.5 w-12 rounded-full bg-gray-200" />
          <div className="mb-1 h-0.5 w-10 rounded-full bg-gray-200" />
          <div className="h-1.5 w-8 rounded-sm bg-indigo-400" />
        </div>
      </div>
    </>
  );
}

function StripBannerAnimation() {
  return (
    <div className="absolute inset-x-0 top-0 animate-strip-cycle bg-gradient-to-r from-amber-400 to-orange-400 px-1.5 py-1 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-0.5 h-0.5 w-10 rounded-full bg-white/80" />
          <div className="h-0.5 w-6 rounded-full bg-white/50" />
        </div>
        <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
      </div>
    </div>
  );
}

function SlideInAnimation() {
  return (
    <div className="absolute bottom-1 right-1 animate-slide-cycle rounded-md border border-border/60 bg-white p-1.5 shadow-lg">
      <div className="mb-1 h-1 w-8 rounded-full bg-blue-400" />
      <div className="mb-0.5 h-0.5 w-10 rounded-full bg-gray-200" />
      <div className="mb-1 h-0.5 w-7 rounded-full bg-gray-200" />
      <div className="h-1.5 w-6 rounded-sm bg-blue-400" />
    </div>
  );
}

function FullscreenAnimation() {
  return (
    <div className="absolute inset-0 flex animate-fullscreen-cycle flex-col items-center justify-center bg-gradient-to-br from-violet-500/90 to-indigo-600/90">
      <div className="mb-1 h-1.5 w-14 rounded-full bg-white/90" />
      <div className="mb-0.5 h-0.5 w-16 rounded-full bg-white/40" />
      <div className="mb-1.5 h-0.5 w-12 rounded-full bg-white/40" />
      <div className="h-2 w-10 rounded-sm bg-white/80" />
    </div>
  );
}

function ExitIntentAnimation() {
  return (
    <>
      {/* 마우스 커서 이탈 모션 */}
      <div className="absolute left-1/2 top-1/2 h-2 w-1.5 animate-cursor-exit-cycle text-gray-600">
        <svg viewBox="0 0 10 14" fill="currentColor">
          <path d="M0 0L10 8L6 8L8 14L5 14L3 8L0 10Z" />
        </svg>
      </div>
      {/* 딤 + 팝업 (커서 이탈 후 지연 등장) */}
      <div className="absolute inset-0 animate-exit-dim-cycle bg-black/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-exit-popup-cycle rounded-md border border-rose-200 bg-white px-2 py-1.5 shadow-lg">
          <div className="mb-1 h-1 w-10 rounded-full bg-rose-400" />
          <div className="mb-0.5 h-0.5 w-12 rounded-full bg-gray-200" />
          <div className="mb-1 h-0.5 w-8 rounded-full bg-gray-200" />
          <div className="h-1.5 w-8 rounded-sm bg-rose-400" />
        </div>
      </div>
    </>
  );
}
