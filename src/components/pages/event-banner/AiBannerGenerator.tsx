import { Sparkles, RotateCcw, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IBannerTemplateDto } from '@/models/interface/dto';

interface IAiBannerGeneratorProps {
  prompt: string;
  isGenerating: boolean;
  generatedPreview: string | null;
  selectedTemplate: IBannerTemplateDto | null;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  onReset: () => void;
  onSave: () => void;
}

const PROMPT_EXAMPLES = [
  '음식점 봄 신메뉴 출시 이벤트 배너. 할인율 20%, 기간 3월 한정.',
  '미용실 재방문 고객 전용 쿠폰 팝업. 시술 30% 할인.',
  '헬스장 신규 회원 모집 이벤트. 3개월 등록 시 1개월 무료.',
];

export function AiBannerGenerator({
  prompt,
  isGenerating,
  generatedPreview,
  selectedTemplate,
  onPromptChange,
  onGenerate,
  onReset,
  onSave,
}: IAiBannerGeneratorProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI 배너 생성</h3>
          <p className="text-xs text-muted-foreground">원하는 내용을 입력하면 AI가 최적의 문구와 디자인을 제안합니다</p>
        </div>
      </div>

      {/* 선택된 템플릿 힌트 */}
      {selectedTemplate && (
        <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
            <Sparkles size={12} className="text-blue-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-blue-700">
              &ldquo;{selectedTemplate.name}&rdquo; 템플릿 기반
            </p>
            <p className="truncate text-xs text-blue-500">
              {selectedTemplate.industry} · {selectedTemplate.purpose} · {selectedTemplate.bannerType} · 대상: {selectedTemplate.targetCustomer}
            </p>
          </div>
        </div>
      )}

      {/* 프롬프트 입력 */}
      <div className="mb-4">
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="예) 봄 신메뉴 출시 이벤트 배너. 전체 메뉴 20% 할인, 3월 한정. 따뜻하고 밝은 분위기로."
          rows={3}
          className="w-full resize-none rounded-xl border border-border/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20"
        />
      </div>

      {/* 예시 프롬프트 */}
      <div className="mb-5">
        <p className="mb-2 text-xs font-medium text-muted-foreground">예시 프롬프트</p>
        <div className="flex flex-col gap-2">
          {PROMPT_EXAMPLES.map((example, idx) => (
            <button
              key={idx}
              onClick={() => onPromptChange(example)}
              className="rounded-xl border border-dashed border-border/60 px-4 py-2.5 text-left text-xs text-muted-foreground transition-colors hover:border-primary hover:bg-indigo-50/50 hover:text-primary"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* 생성 버튼 */}
      <button
        onClick={onGenerate}
        disabled={!prompt.trim() || isGenerating}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all',
          prompt.trim() && !isGenerating
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm hover:from-purple-700 hover:to-blue-700 hover:shadow-md'
            : 'cursor-not-allowed bg-muted text-muted-foreground'
        )}
      >
        {isGenerating ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            AI 배너 생성 중...
          </>
        ) : (
          <>
            <Sparkles size={15} />
            AI 배너 생성
          </>
        )}
      </button>

      {/* 생성된 미리보기 */}
      {generatedPreview && (
        <div className="mt-5">
          <p className="mb-2.5 text-xs font-medium text-muted-foreground">생성된 배너 미리보기</p>
          <div className="overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-orange-50 to-amber-50 p-6 text-center shadow-sm">
            <p className="mb-1 text-lg font-bold text-foreground">{generatedPreview}</p>
            <p className="text-xs text-muted-foreground">실제 배너 적용 시 디자인이 자동 최적화됩니다</p>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={onReset}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border/60 py-2.5 text-sm transition-colors hover:bg-muted"
            >
              <RotateCcw size={14} />
              다시 생성
            </button>
            <button
              onClick={onSave}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              <Save size={14} />
              배너 저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
