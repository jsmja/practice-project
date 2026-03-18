import { useState } from 'react';
import {
  AlignLeft,
  Image,
  Trash2,
  Check,
  Upload,
  ChevronDown,
  Sparkles,
  Variable,
  Smile,
  Link as LinkIcon,
  Tag,
  FlaskConical,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── 타입 ────────────────────────────────────────────────────────────────────

interface IMessageType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  details: string;
  imageSpec?: string;
  maxButtons: number;
  maxChars: number;
}

export interface IButton {
  id: number;
  type: string;
  label: string;
  url: string;
}

export interface ICarouselCard {
  id: number;
  title: string;
  description: string;
  imageUploaded: boolean;
  buttons: IButton[];
}

export interface IWideItem {
  id: number;
  title: string;
  description: string;
  imageUploaded: boolean;
}

// ─── 상수 ────────────────────────────────────────────────────────────────────

const MESSAGE_TYPES: IMessageType[] = [
  { id: 'basic', name: '기본형', icon: <AlignLeft size={18} />, description: '텍스트 + 이미지(선택) 조합 메시지', details: '본문 최대 400자 · 이미지 추가 시 이미지형 · 버튼 최대 5개', imageSpec: '500×250px', maxButtons: 5, maxChars: 400 },
  { id: 'wide-image', name: '와이드 이미지형', icon: <Image size={18} />, description: '전체 폭 이미지로 강렬한 인상', details: '이미지 800×600px · 본문 최대 76자 · 버튼 최대 2개', imageSpec: '800×600px', maxButtons: 2, maxChars: 76 },
];

const UNIT_PRICE = 25;

const PERSONALIZATION_VARS = [
  { label: '#{고객명}', desc: '고객 이름' },
  { label: '#{브랜드명}', desc: '쇼핑몰명' },
  { label: '#{최근구매상품}', desc: '마지막 구매 상품명' },
  { label: '#{포인트잔액}', desc: '보유 포인트' },
  { label: '#{쿠폰코드}', desc: '발급 쿠폰 코드' },
  { label: '#{회원등급}', desc: '현재 회원 등급' },
];

const AI_SUGGESTIONS = [
  '고객님, 오랜만이에요! 다시 만나 반가워요 😊 특별 할인 쿠폰을 드립니다.',
  '#{고객명}님을 위한 맞춤 추천! 이번 시즌 인기 상품을 확인해보세요.',
  '장바구니에 담아두신 상품, 지금 구매하시면 추가 할인 혜택이 있어요!',
  '#{고객명}님, 새로운 상품이 도착했어요! 놓치기 아까운 시즌 신상품을 지금 바로 확인해 보세요 🎁',
];

// ─── 서브 컴포넌트 ───────────────────────────────────────────────────────────

function ButtonBuilder({ buttons, maxButtons, onChange }: { buttons: IButton[]; maxButtons: number; onChange: (buttons: IButton[]) => void }) {
  const addButton = () => { if (buttons.length >= maxButtons) return; onChange([...buttons, { id: Date.now(), type: '웹링크', label: '', url: '' }]); };
  const removeButton = (id: number) => onChange(buttons.filter((b) => b.id !== id));
  const updateButton = (id: number, field: keyof IButton, value: string) => onChange(buttons.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  const BUTTON_TYPES = ['웹링크', '앱링크', '봇키워드', '채널 추가', '상담톡 전환', '봇 전환'];

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <p className="text-sm font-medium">버튼추가 <span className="text-red-500">*</span></p>
        <button type="button" onClick={addButton} disabled={buttons.length >= maxButtons} className="flex items-center gap-1 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40">
          <LinkIcon size={11} /> 링크형
        </button>
        <button type="button" className="flex items-center gap-1 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted">
          <Tag size={11} /> 쿠폰형
        </button>
      </div>
      {buttons.length === 0 && (
        <div className="flex h-10 items-center justify-center rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground">버튼을 추가하세요</div>
      )}
      <div className="space-y-2">
        {buttons.map((btn, idx) => (
          <div key={btn.id} className="flex items-center gap-2 rounded-lg border border-border/60 bg-gray-50 p-2.5">
            <span className="min-w-[18px] text-xs font-bold text-muted-foreground">{idx + 1}</span>
            <div className="relative">
              <select value={btn.type} onChange={(e) => updateButton(btn.id, 'type', e.target.value)} className="h-8 appearance-none rounded-md border border-border/60 bg-white pl-2.5 pr-6 text-xs outline-none focus:border-primary">
                {BUTTON_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              <ChevronDown size={10} className="pointer-events-none absolute right-1.5 top-2.5 text-muted-foreground" />
            </div>
            <input type="text" value={btn.label} onChange={(e) => updateButton(btn.id, 'label', e.target.value)} placeholder="버튼명" className="h-8 flex-1 rounded-md border border-border/60 bg-white px-2.5 text-xs outline-none focus:border-primary" />
            {(btn.type === '웹링크' || btn.type === '앱링크') && (
              <input type="text" value={btn.url} onChange={(e) => updateButton(btn.id, 'url', e.target.value)} placeholder={btn.type === '웹링크' ? 'https://...' : 'app://...'} className="h-8 flex-1 rounded-md border border-border/60 bg-white px-2.5 text-xs outline-none focus:border-primary" />
            )}
            <button type="button" onClick={() => removeButton(btn.id)} className="text-muted-foreground hover:text-red-500"><Trash2 size={13} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageUploadBox({ label, spec, uploaded, onToggle }: { label: string; spec: string; uploaded: boolean; onToggle: () => void }) {
  return (
    <div onClick={onToggle} className={cn('flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 text-center transition-colors', uploaded ? 'border-green-400 bg-green-50' : 'border-border/60 hover:border-gray-400')}>
      {uploaded ? (
        <>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600"><Check size={18} /></div>
          <p className="text-xs font-medium text-green-600">이미지 업로드 완료</p>
          <p className="text-xs text-green-500">{spec}</p>
        </>
      ) : (
        <>
          <Upload size={24} className="text-muted-foreground" />
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{spec}</p>
        </>
      )}
    </div>
  );
}

// ─── 메인 컴포넌트 ───────────────────────────────────────────────────────────

interface ICampaignMessageStepProps {
  selectedMessageTypeId: string | null;
  onSelectMessageType: (id: string) => void;
  bodyText: string;
  onBodyTextChange: (text: string) => void;
  headerText: string;
  onHeaderTextChange: (text: string) => void;
  buttons: IButton[];
  onButtonsChange: (buttons: IButton[]) => void;
  imageUploaded: boolean;
  onImageUploadedChange: (uploaded: boolean) => void;
  wideItems: IWideItem[];
  onWideItemsChange: (items: IWideItem[]) => void;
  carouselCards: ICarouselCard[];
  onCarouselCardsChange: (cards: ICarouselCard[]) => void;
  couponEnabled: boolean;
  onCouponEnabledChange: (enabled: boolean) => void;
  couponName: string;
  onCouponNameChange: (name: string) => void;
}

export function CampaignMessageStep({
  selectedMessageTypeId,
  onSelectMessageType,
  bodyText,
  onBodyTextChange,
  buttons,
  onButtonsChange,
  imageUploaded,
  onImageUploadedChange,
}: ICampaignMessageStepProps) {
  const selectedMessageType = MESSAGE_TYPES.find((t) => t.id === selectedMessageTypeId);
  const [showVarPalette, setShowVarPalette] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [abTestEnabled, setAbTestEnabled] = useState(false);

  const insertVar = (varLabel: string) => {
    onBodyTextChange(bodyText + varLabel);
    setShowVarPalette(false);
  };

  return (
    <div>
      <h2 className="mb-1 text-base font-semibold">메시지 작성</h2>

      {/* 안내 문구 */}
      <div className="mb-5 rounded-lg border border-border/60 bg-gray-50/70 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <p>· 본문 앞에 (광고)가 자동 표시되며, 메시지 하단에 수신거부 및 수신동의 철회 방법 안내가 표시됩니다.</p>
        <p>· 수정은 발송 30분 전까지만 가능하며, 메시지 작성 타입(텍스트/이미지/와이드이미지)은 변경 불가. (단, 텍스트↔이미지만 변경 가능)</p>
        <p className="text-orange-500">· 20세 이상 성인에게만 적합한 내용을 포함할 경우 반드시 [성인 전용 메시지]를 체크해 주세요.(예: 주류, 청소년 이용불가 게임·영화 등)</p>
      </div>

      {/* 메시지 유형 선택 */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {MESSAGE_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelectMessageType(type.id)}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all',
              selectedMessageTypeId === type.id
                ? 'border-primary bg-primary/5'
                : 'border-border/60 bg-white hover:border-primary/30'
            )}
          >
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              selectedMessageTypeId === type.id ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              {type.icon}
            </div>
            <p className="text-xs font-semibold leading-tight">{type.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{UNIT_PRICE}P/건</p>
          </button>
        ))}
      </div>

      {selectedMessageType && (
        <div className="mb-4 rounded-lg border border-border/60 bg-gray-50 px-4 py-2.5 text-xs text-muted-foreground">
          <span>{selectedMessageType.details}</span>
          <span className="ml-2 font-medium text-primary">· 발송 단가: {UNIT_PRICE}P/건</span>
        </div>
      )}

      {selectedMessageType && (
        <>
          {/* 이미지 업로드 */}
          {selectedMessageTypeId === 'basic' && (
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">이미지 추가 <span className="text-xs font-normal text-muted-foreground">(선택 · 추가 시 이미지형으로 발송)</span></p>
              </div>
              <ImageUploadBox
                label="이미지를 드래그하거나 클릭하세요"
                spec="권장 500×250px · JPG/PNG · 최대 5MB"
                uploaded={imageUploaded}
                onToggle={() => onImageUploadedChange(!imageUploaded)}
              />
            </div>
          )}
          {selectedMessageTypeId === 'wide-image' && (
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium">이미지 업로드 <span className="text-xs text-red-500">*</span></p>
              <ImageUploadBox
                label="이미지를 드래그하거나 클릭하세요"
                spec="권장 800×600px · JPG/PNG · 최대 5MB"
                uploaded={imageUploaded}
                onToggle={() => onImageUploadedChange(!imageUploaded)}
              />
            </div>
          )}

          {/* 본문 편집기 */}
          <div className="mb-4 rounded-xl border border-border/60 bg-white">
            <textarea
              rows={8}
              value={bodyText}
              onChange={(e) => {
                if (e.target.value.length <= selectedMessageType.maxChars) {
                  onBodyTextChange(e.target.value);
                }
              }}
              placeholder="친구톡 메시지를 작성해 주세요.(줄바꿈 최대99회)"
              className="w-full resize-none rounded-t-xl border-none px-4 py-4 text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50"
            />
            {/* 글자수 카운터 */}
            <div className="flex justify-end border-t border-border/40 px-4 py-2">
              <span className={cn('text-xs', bodyText.length > selectedMessageType.maxChars - 20 ? 'text-red-500' : 'text-muted-foreground')}>
                [ {bodyText.length} / {selectedMessageType.maxChars} ]
              </span>
            </div>
          </div>

          {/* 도구 모음: 버튼추가, 개인화 변수, 이모티콘, 성인전용 */}
          <div className="mb-4 space-y-4">
            {/* 버튼추가 */}
            <ButtonBuilder buttons={buttons} maxButtons={selectedMessageType.maxButtons} onChange={onButtonsChange} />

            {/* 개인화 변수 */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">개인화 변수</p>
                <button
                  type="button"
                  onClick={() => setShowVarPalette(!showVarPalette)}
                  className="flex items-center gap-1 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                >
                  <Variable size={12} /> 변수생성
                </button>
              </div>
              {showVarPalette && (
                <div className="absolute left-24 top-full z-20 mt-1 rounded-xl border border-border/60 bg-white p-2 shadow-lg">
                  {PERSONALIZATION_VARS.map((v) => (
                    <button
                      key={v.label}
                      onClick={() => insertVar(v.label)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-muted"
                    >
                      <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-primary">{v.label}</code>
                      <span className="text-muted-foreground">{v.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 이모티콘 */}
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">이모티콘</p>
              <button type="button" className="flex items-center gap-1 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted">
                <Smile size={12} className="text-green-500" /> 카카오 이모티콘 명령어
              </button>
              <button type="button" className="flex items-center gap-1 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted">
                <Smile size={12} /> 시스템 이모지
              </button>
            </div>

            {/* 성인 전용 메시지 */}
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">성인 전용 메시지</p>
              <label className="flex cursor-pointer items-center gap-1.5">
                <input type="checkbox" className="h-4 w-4 rounded" />
                <span className="text-xs text-muted-foreground">?</span>
              </label>
            </div>
          </div>

          {/* AI 문구 추천 */}
          <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <p className="text-sm font-semibold text-primary">AI 문구 추천</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAiSuggestions(!showAiSuggestions)}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary/90"
              >
                {showAiSuggestions ? '닫기' : '문구 생성하기'}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">캠페인 유형에 맞는 최적의 문구를 AI가 추천해 드립니다.</p>
            {showAiSuggestions && (
              <div className="mt-3 space-y-2">
                {AI_SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onBodyTextChange(suggestion);
                      setShowAiSuggestions(false);
                    }}
                    className="w-full rounded-lg border border-border/60 bg-white px-4 py-3 text-left text-xs leading-relaxed text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* A/B 테스트 */}
          <div className="mb-4 rounded-xl border border-border/60 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">A/B 테스트</p>
                  <p className="text-xs text-muted-foreground">메시지 변형을 만들어 어떤 문구가 더 효과적인지 비교하세요</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAbTestEnabled(!abTestEnabled)}
                className={cn(
                  'relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors',
                  abTestEnabled ? 'bg-primary' : 'bg-gray-200'
                )}
              >
                <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', abTestEnabled ? 'translate-x-4' : 'translate-x-0')} />
              </button>
            </div>
            {abTestEnabled && (
              <div className="mt-3 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4 text-center">
                <p className="text-xs text-primary">변형 B 메시지를 작성하면 전체 대상의 50%씩 나누어 발송합니다.</p>
                <textarea
                  rows={4}
                  placeholder="변형 B 메시지를 입력하세요"
                  className="mt-2 w-full resize-none rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
            )}
          </div>

          {/* 발송 성과 예측 */}
          <div className="rounded-xl border border-border/60 bg-white p-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-500" />
              <p className="text-sm font-medium">발송 성과 예측</p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-lg font-bold text-primary">92%</p>
                <p className="text-xs text-muted-foreground">예상 도달률</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-lg font-bold text-emerald-500">18.5%</p>
                <p className="text-xs text-muted-foreground">예상 오픈률</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-lg font-bold text-amber-500">4.2%</p>
                <p className="text-xs text-muted-foreground">예상 클릭률</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">* 유사 캠페인 데이터를 기반으로 한 예측값이며, 실제 성과와 다를 수 있습니다.</p>
          </div>
        </>
      )}

      {/* 기본형: 이미지 추가 시 안내 */}
      {selectedMessageTypeId === 'basic' && imageUploaded && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs text-blue-700">
          이미지가 추가되어 <span className="font-semibold">이미지형</span>으로 발송됩니다.
        </div>
      )}
    </div>
  );
}
