import { useState } from 'react';
import { ImageUploadWithSamples } from '@/components/common/SampleImagePicker';
import {
  Plus,
  GripVertical,
  Info,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Link as LinkIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BannerSubType } from '@/models/type';
import type { IPromoCard } from '@/store/useBannerManagementStore';

interface IBannerContentSettingsStepProps {
  subType: BannerSubType | null;
  // 기본형
  iconBgColor: string;
  mainTitle: string;
  subTitle: string;
  bodyText: string;
  onIconBgColorChange: (color: string) => void;
  onMainTitleChange: (title: string) => void;
  onSubTitleChange: (title: string) => void;
  onBodyTextChange: (text: string) => void;
  // 프로모션형
  promoCards: IPromoCard[];
  onPromoCardsChange: (cards: IPromoCard[]) => void;
  // 유튜브형
  youtubeUrl: string;
  youtubeAutoPlay: boolean;
  onYoutubeUrlChange: (url: string) => void;
  onYoutubeAutoPlayChange: (autoPlay: boolean) => void;
  // 인스타형
  instaFeedType: 'latest' | 'select';
  onInstaFeedTypeChange: (type: 'latest' | 'select') => void;
  // 수신동의
  consentGuideText: string;
  consentButtonLabel: string;
  onConsentGuideTextChange: (text: string) => void;
  onConsentButtonLabelChange: (label: string) => void;
}

const COLOR_OPTIONS = [
  { label: '#717171', value: '#717171' },
  { label: '#EF4444', value: '#EF4444' },
  { label: '#F59E0B', value: '#F59E0B' },
  { label: '#22C55E', value: '#22C55E' },
  { label: '#3B82F6', value: '#3B82F6' },
  { label: '#8B5CF6', value: '#8B5CF6' },
  { label: '#EC4899', value: '#EC4899' },
  { label: '#0A0A0A', value: '#0A0A0A' },
];

export function BannerContentSettingsStep(props: IBannerContentSettingsStepProps) {
  const { subType } = props;

  return (
    <div>
      <h2 className="mb-1 text-base font-semibold">콘텐츠 설정</h2>
      <p className="mb-6 text-xs text-muted-foreground">
        마케팅 콘텐츠의 세부 내용을 설정해 주세요.
      </p>

      {subType === '기본형' && <BasicTypeContent {...props} />}
      {subType === '프로모션형' && <PromoTypeContent {...props} />}
      {subType === '홍보 유튜브' && <YoutubeTypeContent {...props} />}
      {subType === '홍보 인스타' && <InstaTypeContent {...props} />}
      {subType === '마케팅 수신동의' && <ConsentTypeContent {...props} />}
      {!subType && (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-border/60 text-sm text-muted-foreground">
          배너 유형에서 세부 유형을 먼저 선택해 주세요.
        </div>
      )}
    </div>
  );
}

/* ── 기본형 ── */
function BasicTypeContent({
  iconBgColor,
  mainTitle,
  subTitle,
  bodyText,
  onIconBgColorChange,
  onMainTitleChange,
  onSubTitleChange,
  onBodyTextChange,
}: IBannerContentSettingsStepProps) {
  const [iconUploaded, setIconUploaded] = useState(false);
  const [iconSample, setIconSample] = useState<{ id: string; name: string; category: string; gradient: string; icon: string } | null>(null);

  return (
    <div className="max-w-xl space-y-6">
      {/* 아이콘 이미지 등록 */}
      <ImageUploadWithSamples
        label="아이콘 이미지 등록"
        spec="권장 해상도 46×46, 1:1 비율, JPG/PNG/GIF, 5MB 이하"
        uploaded={iconUploaded}
        selectedSample={iconSample}
        onToggleUpload={() => { setIconUploaded(!iconUploaded); setIconSample(null); }}
        onSelectSample={(img) => { setIconSample(img); if (img) setIconUploaded(false); }}
      />

      {/* 아이콘 배경 컬러 */}
      <div>
        <p className="mb-2 text-sm font-medium">아이콘 배경 컬러</p>
        <div className="relative">
          <div className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2.5">
            <div className="h-5 w-5 rounded" style={{ backgroundColor: iconBgColor }} />
            <select
              value={iconBgColor}
              onChange={(e) => onIconBgColorChange(e.target.value)}
              className="flex-1 border-none bg-transparent text-sm outline-none"
            >
              {COLOR_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 메인 타이틀 */}
      <FieldWithCounter
        label="메인 타이틀"
        required
        value={mainTitle}
        onChange={onMainTitleChange}
        maxLength={20}
        placeholder="메인 타이틀을 입력해 주세요."
      />

      {/* 서브 타이틀 */}
      <FieldWithCounter
        label="서브 타이틀"
        value={subTitle}
        onChange={onSubTitleChange}
        maxLength={21}
        placeholder="서브 타이틀을 입력해 주세요."
      />

      {/* 문구 입력 */}
      <RichTextArea
        label="문구 입력"
        value={bodyText}
        onChange={onBodyTextChange}
        maxLength={200}
        placeholder="문구를 입력해 주세요."
      />
    </div>
  );
}

/* ── 프로모션형 ── */
function PromoTypeContent({
  promoCards,
  onPromoCardsChange,
}: IBannerContentSettingsStepProps) {
  const [activeCardIdx, setActiveCardIdx] = useState(0);

  const handleAddCard = () => {
    const newCard: IPromoCard = {
      id: promoCards.length + 1,
      imageUploaded: false,
      mainTitle: '',
      bodyText: '',
      buttonLabel: '',
    };
    onPromoCardsChange([...promoCards, newCard]);
    setActiveCardIdx(promoCards.length);
  };

  const updateCard = (idx: number, partial: Partial<IPromoCard>) => {
    const updated = promoCards.map((c, i) => (i === idx ? { ...c, ...partial } : c));
    onPromoCardsChange(updated);
  };

  const card = promoCards[activeCardIdx];

  return (
    <div className="max-w-xl space-y-5">
      {/* 카드 탭 */}
      <div className="flex items-center gap-2">
        {promoCards.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => setActiveCardIdx(idx)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
              activeCardIdx === idx
                ? 'bg-primary text-white'
                : 'border border-border/60 text-muted-foreground hover:bg-muted'
            )}
          >
            <GripVertical size={12} />
            카드 {idx + 1}
          </button>
        ))}
        <button
          onClick={handleAddCard}
          className="flex items-center gap-1 rounded-lg border border-dashed border-border/60 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
        >
          <Plus size={14} />
          카드 추가
        </button>
      </div>

      {/* 카드 내용 */}
      {card && (
        <div className="rounded-xl border border-border/60 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold">카드 {activeCardIdx + 1}</p>
            <p className="text-xs text-muted-foreground">카드 총 {promoCards.length}개</p>
          </div>

          {/* 이미지 등록 */}
          <div className="mb-5">
            <ImageUploadWithSamples
              label="이미지 등록"
              spec="권장 해상도 360×240, 3:2 비율, JPG/PNG/GIF, 5MB 이하"
              uploaded={card.imageUploaded}
              selectedSample={null}
              onToggleUpload={() => updateCard(activeCardIdx, { imageUploaded: !card.imageUploaded })}
              onSelectSample={() => updateCard(activeCardIdx, { imageUploaded: true })}
              required
            />
          </div>

          {/* 메인 타이틀 */}
          <div className="mb-5">
            <FieldWithCounter
              label="메인 타이틀"
              required
              value={card.mainTitle}
              onChange={(v) => updateCard(activeCardIdx, { mainTitle: v })}
              maxLength={48}
              placeholder="메인 타이틀을 입력해 주세요."
            />
          </div>

          {/* 문구 입력 */}
          <div className="mb-5">
            <RichTextArea
              label="문구 입력"
              value={card.bodyText}
              onChange={(v) => updateCard(activeCardIdx, { bodyText: v })}
              maxLength={200}
              placeholder="문구를 입력해 주세요."
            />
          </div>

          {/* 버튼명 */}
          <FieldWithCounter
            label="버튼명"
            value={card.buttonLabel}
            onChange={(v) => updateCard(activeCardIdx, { buttonLabel: v })}
            maxLength={20}
            placeholder="버튼명을 입력해 주세요."
          />
        </div>
      )}
    </div>
  );
}

/* ── 홍보 유튜브형 ── */
function YoutubeTypeContent({
  youtubeUrl,
  youtubeAutoPlay,
  onYoutubeUrlChange,
  onYoutubeAutoPlayChange,
}: IBannerContentSettingsStepProps) {
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium">유튜브 영상 URL</p>
        <input
          type="text"
          value={youtubeUrl}
          onChange={(e) => onYoutubeUrlChange(e.target.value)}
          placeholder="유튜브 영상 URL을 입력해 주세요."
          className="w-full rounded-lg border border-border/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">자동 재생</p>
        <button
          type="button"
          onClick={() => onYoutubeAutoPlayChange(!youtubeAutoPlay)}
          className={cn(
            'relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors',
            youtubeAutoPlay ? 'bg-green-500' : 'bg-gray-200'
          )}
        >
          <span className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
            youtubeAutoPlay ? 'translate-x-4' : 'translate-x-0'
          )} />
        </button>
      </div>
    </div>
  );
}

/* ── 홍보 인스타형 ── */
function InstaTypeContent({
  instaFeedType,
  onInstaFeedTypeChange,
}: IBannerContentSettingsStepProps) {
  const MOCK_FEED_IMAGES = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    color: ['#7C3AED', '#EC4899', '#F59E0B', '#22C55E', '#3B82F6', '#EF4444', '#8B5CF6', '#14B8A6', '#F97316'][i],
  }));

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <p className="mb-3 text-sm font-medium">인스타그램 피드 유형</p>
        <div className="flex gap-2">
          <button
            onClick={() => onInstaFeedTypeChange('latest')}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              instaFeedType === 'latest'
                ? 'bg-primary text-white'
                : 'border border-border/60 text-muted-foreground hover:bg-muted'
            )}
          >
            최신순
          </button>
          <button
            onClick={() => onInstaFeedTypeChange('select')}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              instaFeedType === 'select'
                ? 'bg-primary text-white'
                : 'border border-border/60 text-muted-foreground hover:bg-muted'
            )}
          >
            특정 게시물 선택
          </button>
        </div>
      </div>

      <div className="flex items-start gap-1.5 text-xs text-blue-600">
        <Info size={12} className="mt-0.5 flex-shrink-0" />
        <span>최신순을 선택하는 경우 최신 피드부터 최대 24개까지 표시됩니다.</span>
      </div>

      {instaFeedType === 'select' && (
        <div>
          <p className="mb-3 text-sm font-medium">게시물 선택</p>
          <div className="grid grid-cols-3 gap-2">
            {MOCK_FEED_IMAGES.map((img) => (
              <div
                key={img.id}
                className="flex aspect-square items-center justify-center rounded-lg"
                style={{ backgroundColor: img.color + '33' }}
              >
                <div className="h-8 w-8 rounded" style={{ backgroundColor: img.color }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 마케팅 수신동의형 ── */
function ConsentTypeContent({
  mainTitle,
  bodyText,
  consentGuideText,
  consentButtonLabel,
  onMainTitleChange,
  onBodyTextChange,
  onConsentGuideTextChange,
  onConsentButtonLabelChange,
}: IBannerContentSettingsStepProps) {
  const [buttonTab, setButtonTab] = useState<'link' | 'coupon'>('coupon');

  return (
    <div className="max-w-xl space-y-6">
      {/* 이미지 등록 */}
      <ImageUploadWithSamples
        label="이미지 등록"
        spec="권장 해상도 360×240, 3:2 비율, JPG/PNG/GIF, 5MB 이하"
        uploaded={false}
        selectedSample={null}
        onToggleUpload={() => {}}
        onSelectSample={() => {}}
        required
      />

      {/* 메인 타이틀 */}
      <FieldWithCounter
        label="메인 타이틀"
        required
        value={mainTitle}
        onChange={onMainTitleChange}
        maxLength={20}
        placeholder="메인 타이틀을 입력해 주세요."
      />

      {/* 문구 입력 */}
      <RichTextArea
        label="문구 입력"
        value={bodyText}
        onChange={onBodyTextChange}
        maxLength={200}
        placeholder="문구를 입력해 주세요."
      />

      {/* 버튼 */}
      <div>
        <p className="mb-3 text-sm font-medium">
          버튼 <span className="text-red-500">*</span>
        </p>
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setButtonTab('link')}
            className={cn(
              'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
              buttonTab === 'link' ? 'border-primary bg-primary/5 text-primary' : 'border-border/60 text-muted-foreground hover:bg-muted'
            )}
          >
            링크형
          </button>
          <button
            onClick={() => setButtonTab('coupon')}
            className={cn(
              'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
              buttonTab === 'coupon' ? 'border-primary bg-primary/5 text-primary' : 'border-border/60 text-muted-foreground hover:bg-muted'
            )}
          >
            쿠폰형
          </button>
        </div>

        {buttonTab === 'coupon' && (
          <div className="space-y-5">
            <p className="text-xs leading-relaxed text-muted-foreground">
              쿠폰 한 장으로, 매출이 달라집니다. 등록된 쿠폰을 활용해 고객 유입을 늘리고, 전환율을 높여보세요.
              <br />
              <span className="text-xs text-muted-foreground/80">(단, 발급 조건에 "최초 1회 발급"이나 "미보유 발급"으로 이미 발급받았거나 사용하지 않은 해당 쿠폰이 있으면 중복 발급되지 않습니다.)</span>
            </p>

            {/* 쿠폰 선택 */}
            <div>
              <p className="mb-2 text-sm font-medium">
                쿠폰 선택 <span className="text-red-500">*</span>
              </p>
              <select className="w-full rounded-lg border border-border/60 px-4 py-2.5 text-sm text-muted-foreground outline-none focus:border-primary">
                <option>등록된 쿠폰이 없습니다.</option>
              </select>
            </div>

            {/* 쿠폰 정보 */}
            <div className="rounded-lg border border-border/60 bg-gray-50 px-4 py-3 text-xs text-muted-foreground">
              <p>쿠폰 혜택: -</p>
              <p>쿠폰 사용 기간: -</p>
              <p>사용 기준(금액 제한): -</p>
            </div>

            <p className="text-xs text-muted-foreground">고객이 마케팅 수신 동의하기 버튼 선택시, 쿠폰이 자동 발급됩니다.</p>

            {/* 발급 조건 선택 */}
            <div>
              <p className="mb-2 text-sm font-medium">
                발급 조건 선택 <span className="text-red-500">*</span>
              </p>
              <select className="w-full rounded-lg border border-border/60 px-4 py-2.5 text-sm text-muted-foreground outline-none focus:border-primary">
                <option>쿠폰 발급조건을 선택해 주세요.</option>
                <option>최초 1회 발급</option>
                <option>미보유 발급</option>
                <option>매번 발급</option>
              </select>
            </div>
          </div>
        )}

        {/* 버튼명 */}
        <div className="mt-5">
          <FieldWithCounter
            label="버튼명"
            required
            value={consentButtonLabel}
            onChange={onConsentButtonLabelChange}
            maxLength={25}
            placeholder="마케팅 수신 동의하기"
          />
        </div>

        {/* 버튼 URL */}
        {buttonTab === 'link' && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">
              버튼 URL <span className="text-red-500">*</span>
            </p>
            <input
              type="text"
              value={consentGuideText}
              onChange={(e) => onConsentGuideTextChange(e.target.value)}
              placeholder="http://"
              className="w-full rounded-lg border border-border/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>
        )}

        {/* 버튼 컬러 */}
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium">버튼 컬러</p>
          <div className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2.5">
            <div className="h-5 w-5 rounded bg-gray-600" />
            <span className="flex-1 text-sm text-muted-foreground">#717171</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 공통 하위 컴포넌트 ── */

function FieldWithCounter({
  label,
  required,
  value,
  onChange,
  maxLength,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </p>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              onChange(e.target.value);
            }
          }}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border/60 px-4 py-2.5 pr-16 text-sm outline-none transition-colors focus:border-primary"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}

function RichTextArea({
  label,
  value,
  onChange,
  maxLength,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="rounded-lg border border-border/60 focus-within:border-primary">
        {/* 툴바 */}
        <div className="flex items-center gap-1 border-b border-border/40 px-3 py-1.5">
          <select className="border-none bg-transparent text-xs text-muted-foreground outline-none">
            <option>Normal</option>
            <option>H1</option>
            <option>H2</option>
          </select>
          <div className="mx-1 h-4 w-px bg-border/60" />
          <button type="button" className="rounded p-1 text-muted-foreground hover:bg-muted"><Bold size={14} /></button>
          <div className="mx-1 h-4 w-px bg-border/60" />
          <button type="button" className="rounded p-1 text-muted-foreground hover:bg-muted"><AlignLeft size={14} /></button>
          <button type="button" className="rounded p-1 text-muted-foreground hover:bg-muted"><AlignCenter size={14} /></button>
          <button type="button" className="rounded p-1 text-muted-foreground hover:bg-muted"><AlignRight size={14} /></button>
          <button type="button" className="rounded p-1 text-muted-foreground hover:bg-muted"><AlignJustify size={14} /></button>
          <div className="mx-1 h-4 w-px bg-border/60" />
          <button type="button" className="rounded p-1 text-muted-foreground hover:bg-muted"><LinkIcon size={14} /></button>
        </div>
        {/* 텍스트 영역 */}
        <textarea
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              onChange(e.target.value);
            }
          }}
          placeholder={placeholder}
          rows={6}
          className="w-full resize-none border-none bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/60"
        />
        <div className="border-t border-border/40 px-4 py-1.5 text-right text-xs text-muted-foreground">
          {value.length} / {maxLength}
        </div>
      </div>
    </div>
  );
}
