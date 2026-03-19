import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Image, X, ChevronDown } from 'lucide-react';

interface ISampleImage {
  id: string;
  name: string;
  category: string;
  gradient: string;
  icon: string;
}

const SAMPLE_IMAGES: ISampleImage[] = [
  // 프로모션/할인
  { id: 'promo-1', name: '할인 이벤트', category: '프로모션', gradient: 'from-rose-400 to-pink-500', icon: '🏷️' },
  { id: 'promo-2', name: '타임 세일', category: '프로모션', gradient: 'from-red-400 to-orange-500', icon: '⏰' },
  { id: 'promo-3', name: '쿠폰 발급', category: '프로모션', gradient: 'from-amber-400 to-yellow-500', icon: '🎫' },
  { id: 'promo-4', name: '무료 배송', category: '프로모션', gradient: 'from-emerald-400 to-green-500', icon: '🚚' },
  // 시즌/이벤트
  { id: 'season-1', name: '봄 시즌', category: '시즌', gradient: 'from-pink-300 to-rose-400', icon: '🌸' },
  { id: 'season-2', name: '여름 시즌', category: '시즌', gradient: 'from-cyan-400 to-blue-500', icon: '🏖️' },
  { id: 'season-3', name: '크리스마스', category: '시즌', gradient: 'from-red-500 to-green-600', icon: '🎄' },
  { id: 'season-4', name: '새해 인사', category: '시즌', gradient: 'from-indigo-400 to-purple-500', icon: '🎊' },
  // 신상품/브랜드
  { id: 'product-1', name: '신상품 출시', category: '상품', gradient: 'from-violet-400 to-purple-500', icon: '✨' },
  { id: 'product-2', name: '베스트셀러', category: '상품', gradient: 'from-blue-400 to-indigo-500', icon: '👑' },
  { id: 'product-3', name: '한정판', category: '상품', gradient: 'from-fuchsia-400 to-pink-500', icon: '💎' },
  { id: 'product-4', name: '리뷰 이벤트', category: '상품', gradient: 'from-teal-400 to-emerald-500', icon: '⭐' },
  // 고객관리
  { id: 'crm-1', name: '환영 인사', category: '고객', gradient: 'from-sky-400 to-blue-500', icon: '👋' },
  { id: 'crm-2', name: '감사 메시지', category: '고객', gradient: 'from-rose-300 to-pink-400', icon: '❤️' },
  { id: 'crm-3', name: '생일 축하', category: '고객', gradient: 'from-amber-300 to-orange-400', icon: '🎂' },
  { id: 'crm-4', name: '재방문 유도', category: '고객', gradient: 'from-green-400 to-teal-500', icon: '🔄' },
  // 업종별
  { id: 'biz-1', name: '음식/카페', category: '업종', gradient: 'from-orange-400 to-red-500', icon: '☕' },
  { id: 'biz-2', name: '뷰티/패션', category: '업종', gradient: 'from-pink-400 to-rose-500', icon: '💄' },
  { id: 'biz-3', name: '헬스/피트니스', category: '업종', gradient: 'from-lime-400 to-green-500', icon: '💪' },
  { id: 'biz-4', name: '교육/학원', category: '업종', gradient: 'from-blue-400 to-cyan-500', icon: '📚' },
];

const CATEGORIES = ['전체', '프로모션', '시즌', '상품', '고객', '업종'];

interface ISampleImagePickerProps {
  onSelect: (image: ISampleImage) => void;
  onClose: () => void;
}

export function SampleImagePicker({ onSelect, onClose }: ISampleImagePickerProps) {
  const [category, setCategory] = useState('전체');

  const filtered = category === '전체'
    ? SAMPLE_IMAGES
    : SAMPLE_IMAGES.filter((img) => img.category === category);

  return (
    <div className="rounded-xl border border-border/60 bg-white shadow-lg">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <Image size={16} className="text-primary" />
          <p className="text-sm font-semibold">샘플 이미지 선택</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={16} />
        </button>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-1 border-b border-border/40 px-4 py-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
              category === cat
                ? 'bg-primary/8 text-primary'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 이미지 그리드 */}
      <div className="grid max-h-64 grid-cols-4 gap-2 overflow-y-auto p-3">
        {filtered.map((img) => (
          <button
            key={img.id}
            onClick={() => { onSelect(img); onClose(); }}
            className="group flex flex-col items-center gap-1 rounded-lg border border-border/60 p-2 transition-all hover:border-primary hover:shadow-sm"
          >
            <div className={cn(
              'flex h-14 w-full items-center justify-center rounded-lg bg-gradient-to-br text-xl',
              img.gradient
            )}>
              {img.icon}
            </div>
            <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground">{img.name}</span>
          </button>
        ))}
      </div>

      <div className="border-t border-border/40 px-4 py-2">
        <p className="text-[10px] text-muted-foreground">목적에 맞는 샘플 이미지를 선택하세요. 실제 서비스에서는 고해상도 이미지가 제공됩니다.</p>
      </div>
    </div>
  );
}

/** 이미지 업로드 + 샘플 선택 통합 컴포넌트 */
export function ImageUploadWithSamples({
  label,
  spec,
  uploaded,
  selectedSample,
  onToggleUpload,
  onSelectSample,
  required,
}: {
  label: string;
  spec: string;
  uploaded: boolean;
  selectedSample: ISampleImage | null;
  onToggleUpload: () => void;
  onSelectSample: (img: ISampleImage | null) => void;
  required?: boolean;
}) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </p>
      </div>

      {/* 이미지 프리뷰 */}
      {selectedSample ? (
        <div className="relative mb-2">
          <div className={cn(
            'flex h-36 items-center justify-center rounded-xl bg-gradient-to-br text-4xl',
            selectedSample.gradient
          )}>
            {selectedSample.icon}
          </div>
          <button
            onClick={() => onSelectSample(null)}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
          >
            <X size={14} />
          </button>
          <p className="mt-1 text-center text-xs text-muted-foreground">{selectedSample.name}</p>
        </div>
      ) : uploaded ? (
        <div className="relative mb-2">
          <div className="flex h-36 items-center justify-center rounded-xl bg-gradient-to-br from-gray-200 to-gray-300">
            <span className="text-sm text-muted-foreground">업로드된 이미지</span>
          </div>
          <button
            onClick={onToggleUpload}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
          >
            <X size={14} />
          </button>
        </div>
      ) : null}

      {/* 버튼 영역 */}
      <div className="flex gap-2">
        <button
          onClick={onToggleUpload}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/60 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
        >
          직접 업로드
        </button>
        <div className="relative flex-1">
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            샘플 이미지
            <ChevronDown size={14} />
          </button>
          {showPicker && (
            <div className="absolute right-0 top-full z-30 mt-1 w-96">
              <SampleImagePicker
                onSelect={onSelectSample}
                onClose={() => setShowPicker(false)}
              />
            </div>
          )}
        </div>
      </div>

      <p className="mt-1.5 text-[10px] text-muted-foreground">{spec}</p>
    </div>
  );
}
