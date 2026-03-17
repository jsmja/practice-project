import { useState } from 'react';
import {
  AlignLeft,
  Image,
  LayoutList,
  Layers,
  Plus,
  Trash2,
  Check,
  Upload,
  ChevronDown,
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
  color: string;
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
  { id: 'text', name: '텍스트형', icon: <AlignLeft size={24} />, description: '텍스트만으로 구성된 기본 메시지', details: '본문 최대 400자 · 버튼 최대 5개', maxButtons: 5, maxChars: 400, color: 'border-gray-400 bg-gray-50' },
  { id: 'image', name: '이미지형', icon: <Image size={24} />, description: '썸네일 이미지 + 텍스트 조합', details: '이미지 500×250px · 본문 최대 400자 · 버튼 최대 5개', imageSpec: '500×250px', maxButtons: 5, maxChars: 400, color: 'border-blue-400 bg-blue-50' },
  { id: 'wide-image', name: '와이드 이미지형', icon: <Image size={24} />, description: '전체 폭 이미지로 강렬한 인상', details: '이미지 800×600px · 본문 최대 76자 · 버튼 최대 2개', imageSpec: '800×600px', maxButtons: 2, maxChars: 76, color: 'border-green-400 bg-green-50' },
  { id: 'wide-item-list', name: '와이드 아이템 리스트형', icon: <LayoutList size={24} />, description: '여러 상품/이벤트를 리스트로 소개', details: '아이템 2~4개 · 이미지 300×300px · 버튼 최대 2개', imageSpec: '300×300px', maxButtons: 2, maxChars: 400, color: 'border-amber-400 bg-amber-50' },
  { id: 'carousel', name: '캐러셀 피드형', icon: <Layers size={24} />, description: '슬라이드 카드로 여러 콘텐츠 소개', details: '카드 2~6개 · 이미지 500×500px · 카드당 버튼 최대 2개', imageSpec: '500×500px', maxButtons: 2, maxChars: 400, color: 'border-purple-400 bg-purple-50' },
];

const BUTTON_TYPES = ['웹링크', '앱링크', '봇키워드', '채널 추가', '상담톡 전환', '봇 전환'];

// ─── 서브 컴포넌트 ───────────────────────────────────────────────────────────

function ButtonBuilder({ buttons, maxButtons, onChange }: { buttons: IButton[]; maxButtons: number; onChange: (buttons: IButton[]) => void }) {
  const addButton = () => { if (buttons.length >= maxButtons) return; onChange([...buttons, { id: Date.now(), type: '웹링크', label: '', url: '' }]); };
  const removeButton = (id: number) => onChange(buttons.filter((b) => b.id !== id));
  const updateButton = (id: number, field: keyof IButton, value: string) => onChange(buttons.map((b) => (b.id === id ? { ...b, [field]: value } : b)));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium">버튼 설정 <span className="text-muted-foreground">(최대 {maxButtons}개)</span></p>
        {buttons.length < maxButtons && (
          <button type="button" onClick={addButton} className="flex items-center gap-1 rounded-lg border border-dashed border-border/60 px-2.5 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary">
            <Plus size={11} /> 버튼 추가
          </button>
        )}
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
  headerText,
  onHeaderTextChange,
  buttons,
  onButtonsChange,
  imageUploaded,
  onImageUploadedChange,
  wideItems,
  onWideItemsChange,
  carouselCards,
  onCarouselCardsChange,
  couponEnabled,
  onCouponEnabledChange,
  couponName,
  onCouponNameChange,
}: ICampaignMessageStepProps) {
  const selectedMessageType = MESSAGE_TYPES.find((t) => t.id === selectedMessageTypeId);

  const addWideItem = () => {
    if (wideItems.length >= 4) return;
    onWideItemsChange([...wideItems, { id: Date.now(), title: '', description: '', imageUploaded: false }]);
  };

  const addCarouselCard = () => {
    if (carouselCards.length >= 6) return;
    onCarouselCardsChange([...carouselCards, { id: Date.now(), title: '', description: '', imageUploaded: false, buttons: [] }]);
  };

  return (
    <div>
      <h2 className="mb-1 text-base font-semibold">메시지 유형과 내용을 작성해주세요</h2>
      <p className="mb-4 text-xs text-muted-foreground">카카오 브랜드 메시지 유형을 선택하고 내용을 입력하세요</p>

      {/* 메시지 유형 선택 */}
      <div className="mb-4 grid grid-cols-5 gap-2">
        {MESSAGE_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelectMessageType(type.id)}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all',
              selectedMessageTypeId === type.id ? type.color : 'border-border/60 bg-white hover:border-gray-300'
            )}
          >
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', selectedMessageTypeId === type.id ? 'bg-white/70' : 'bg-muted')}>
              {type.icon}
            </div>
            <p className="text-xs font-semibold leading-tight">{type.name}</p>
          </button>
        ))}
      </div>

      {selectedMessageType && (
        <div className="mb-4 rounded-lg border border-border/60 bg-gray-50 px-4 py-2.5 text-xs text-muted-foreground">
          {selectedMessageType.details}
        </div>
      )}

      {/* 텍스트형 */}
      {selectedMessageTypeId === 'text' && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border/60 bg-white p-4">
            <label className="mb-1.5 block text-xs font-medium">헤더 텍스트 <span className="text-muted-foreground">(선택)</span></label>
            <input type="text" value={headerText} onChange={(e) => onHeaderTextChange(e.target.value)} placeholder="상단 헤더 문구" className="w-full rounded-lg border border-border/60 px-3 py-2 text-sm outline-none focus:border-primary" />
          </div>
          <div className="rounded-xl border border-border/60 bg-white p-4">
            <div className="mb-1.5 flex justify-between">
              <label className="text-xs font-medium">본문 내용 <span className="text-red-500">*</span></label>
              <span className={cn('text-xs', bodyText.length > 380 ? 'text-red-500' : 'text-muted-foreground')}>{bodyText.length}/400</span>
            </div>
            <textarea rows={6} value={bodyText} onChange={(e) => { if (e.target.value.length <= 400) onBodyTextChange(e.target.value); }} placeholder={'메시지 본문을 입력하세요\n\n변수 사용: #{고객명}, #{쿠폰코드} 등'} className="w-full resize-none rounded-lg border border-border/60 p-3 text-sm outline-none focus:border-primary" />
          </div>
          <div className="rounded-xl border border-border/60 bg-white p-4">
            <ButtonBuilder buttons={buttons} maxButtons={5} onChange={onButtonsChange} />
          </div>
        </div>
      )}

      {/* 이미지형 / 와이드 이미지형 */}
      {(selectedMessageTypeId === 'image' || selectedMessageTypeId === 'wide-image') && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border/60 bg-white p-4">
            <label className="mb-2 block text-xs font-medium">
              이미지 업로드 <span className="text-red-500">*</span>
              <span className="ml-1 font-normal text-muted-foreground">({selectedMessageType?.imageSpec})</span>
            </label>
            <ImageUploadBox label="이미지를 드래그하거나 클릭하세요" spec={`권장 ${selectedMessageType?.imageSpec} · JPG/PNG · 최대 5MB`} uploaded={imageUploaded} onToggle={() => onImageUploadedChange(!imageUploaded)} />
          </div>
          <div className="rounded-xl border border-border/60 bg-white p-4">
            <div className="mb-1.5 flex justify-between">
              <label className="text-xs font-medium">본문 내용 <span className="text-red-500">*</span></label>
              <span className={cn('text-xs', bodyText.length > (selectedMessageType?.maxChars ?? 400) - 20 ? 'text-red-500' : 'text-muted-foreground')}>{bodyText.length}/{selectedMessageType?.maxChars}</span>
            </div>
            <textarea rows={selectedMessageTypeId === 'wide-image' ? 3 : 5} value={bodyText} onChange={(e) => { const max = selectedMessageType?.maxChars ?? 400; if (e.target.value.length <= max) onBodyTextChange(e.target.value); }} placeholder={'이미지 아래 본문을 입력하세요\n\n변수 사용: #{고객명}, #{쿠폰코드} 등'} className="w-full resize-none rounded-lg border border-border/60 p-3 text-sm outline-none focus:border-primary" />
          </div>
          <div className="rounded-xl border border-border/60 bg-white p-4">
            <ButtonBuilder buttons={buttons} maxButtons={selectedMessageType?.maxButtons ?? 2} onChange={onButtonsChange} />
          </div>
        </div>
      )}

      {/* 와이드 아이템 리스트형 */}
      {selectedMessageTypeId === 'wide-item-list' && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border/60 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-xs font-medium">아이템 목록 <span className="text-red-500">*</span> <span className="font-normal text-muted-foreground">(2~4개)</span></label>
              {wideItems.length < 4 && (
                <button onClick={addWideItem} className="flex items-center gap-1 rounded-lg border border-dashed border-border/60 px-2.5 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary">
                  <Plus size={11} /> 아이템 추가
                </button>
              )}
            </div>
            <div className="space-y-2">
              {wideItems.map((item, idx) => (
                <div key={item.id} className="flex gap-3 rounded-lg border border-border/60 p-3">
                  <div onClick={() => onWideItemsChange(wideItems.map((w) => w.id === item.id ? { ...w, imageUploaded: !w.imageUploaded } : w))} className={cn('flex h-14 w-14 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-xs', item.imageUploaded ? 'border-green-400 bg-green-50 text-green-600' : 'border-border/60 text-muted-foreground hover:border-gray-400')}>
                    {item.imageUploaded ? <Check size={14} /> : <Image size={14} />}
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <p className="text-xs text-muted-foreground">아이템 {idx + 1}</p>
                    <input type="text" value={item.title} onChange={(e) => onWideItemsChange(wideItems.map((w) => w.id === item.id ? { ...w, title: e.target.value } : w))} placeholder="타이틀" className="rounded-md border border-border/60 px-2.5 py-1.5 text-xs outline-none focus:border-primary" />
                    <input type="text" value={item.description} onChange={(e) => onWideItemsChange(wideItems.map((w) => w.id === item.id ? { ...w, description: e.target.value } : w))} placeholder="설명" className="rounded-md border border-border/60 px-2.5 py-1.5 text-xs outline-none focus:border-primary" />
                  </div>
                  {wideItems.length > 2 && (
                    <button onClick={() => onWideItemsChange(wideItems.filter((w) => w.id !== item.id))} className="self-start text-muted-foreground hover:text-red-500"><Trash2 size={13} /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-white p-4">
            <div className="mb-1.5 flex justify-between">
              <label className="text-xs font-medium">본문 내용 <span className="text-red-500">*</span></label>
              <span className="text-xs text-muted-foreground">{bodyText.length}/400</span>
            </div>
            <textarea rows={4} value={bodyText} onChange={(e) => { if (e.target.value.length <= 400) onBodyTextChange(e.target.value); }} placeholder="리스트 하단 본문을 입력하세요" className="w-full resize-none rounded-lg border border-border/60 p-3 text-sm outline-none focus:border-primary" />
          </div>
          <div className="rounded-xl border border-border/60 bg-white p-4">
            <ButtonBuilder buttons={buttons} maxButtons={2} onChange={onButtonsChange} />
          </div>
        </div>
      )}

      {/* 캐러셀 피드형 */}
      {selectedMessageTypeId === 'carousel' && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border/60 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-xs font-medium">슬라이드 카드 <span className="text-red-500">*</span> <span className="font-normal text-muted-foreground">(2~6장)</span></label>
              {carouselCards.length < 6 && (
                <button onClick={addCarouselCard} className="flex items-center gap-1 rounded-lg border border-dashed border-border/60 px-2.5 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary">
                  <Plus size={11} /> 카드 추가
                </button>
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {carouselCards.map((card, idx) => (
                <div key={card.id} className="min-w-[180px] flex-shrink-0 rounded-xl border border-border/60 bg-gray-50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">카드 {idx + 1}</span>
                    {carouselCards.length > 2 && (
                      <button onClick={() => { if (carouselCards.length > 2) onCarouselCardsChange(carouselCards.filter((c) => c.id !== card.id)); }} className="text-muted-foreground hover:text-red-500"><Trash2 size={11} /></button>
                    )}
                  </div>
                  <div onClick={() => onCarouselCardsChange(carouselCards.map((c) => c.id === card.id ? { ...c, imageUploaded: !c.imageUploaded } : c))} className={cn('mb-2 flex h-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-xs', card.imageUploaded ? 'border-green-400 bg-green-50 text-green-600' : 'border-border/60 text-muted-foreground')}>
                    {card.imageUploaded ? <><Check size={13} /><span className="ml-1">이미지</span></> : <><Image size={13} /><span className="ml-1">500×500px</span></>}
                  </div>
                  <input type="text" value={card.title} onChange={(e) => onCarouselCardsChange(carouselCards.map((c) => c.id === card.id ? { ...c, title: e.target.value } : c))} placeholder="타이틀" className="mb-1.5 w-full rounded-md border border-border/60 bg-white px-2 py-1.5 text-xs outline-none focus:border-primary" />
                  <input type="text" value={card.description} onChange={(e) => onCarouselCardsChange(carouselCards.map((c) => c.id === card.id ? { ...c, description: e.target.value } : c))} placeholder="설명" className="mb-2 w-full rounded-md border border-border/60 bg-white px-2 py-1.5 text-xs outline-none focus:border-primary" />
                  <ButtonBuilder buttons={card.buttons} maxButtons={2} onChange={(btns) => onCarouselCardsChange(carouselCards.map((c) => c.id === card.id ? { ...c, buttons: btns } : c))} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 쿠폰 연동 */}
      {selectedMessageTypeId && (
        <div className="mt-3 rounded-xl border border-border/60 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium">쿠폰 연동 <span className="text-muted-foreground">(선택)</span></p>
              <p className="text-xs text-muted-foreground">메시지에 쿠폰을 포함하여 발송합니다</p>
            </div>
            <button type="button" onClick={() => onCouponEnabledChange(!couponEnabled)} className={cn('relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors', couponEnabled ? 'bg-foreground' : 'bg-gray-200')}>
              <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', couponEnabled ? 'translate-x-4' : 'translate-x-0')} />
            </button>
          </div>
          {couponEnabled && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">쿠폰명</label>
                <input type="text" value={couponName} onChange={(e) => onCouponNameChange(e.target.value)} placeholder="예) 봄맞이 10% 할인" className="w-full rounded-lg border border-border/60 px-3 py-2 text-xs outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">유효기간</label>
                <input type="date" className="w-full rounded-lg border border-border/60 px-3 py-2 text-xs outline-none focus:border-primary" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
