import { useState } from 'react';
import {
  MessageSquare,
  Users,
  FileText,
  Send,
  Check,
  Upload,
  UserPlus,
  List,
  Plus,
  Trash2,
  Image,
  LayoutList,
  Layers,
  AlignLeft,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── 상수 ────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: '메시지 유형 선택', icon: <MessageSquare size={15} /> },
  { id: 2, label: '수신 대상 설정', icon: <Users size={15} /> },
  { id: 3, label: '메시지 내용 작성', icon: <FileText size={15} /> },
  { id: 4, label: '발송 설정', icon: <Send size={15} /> },
];

interface IMessageType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  details: string;
  imageSpec?: string;
  maxButtons: number;
  color: string;
}

const MESSAGE_TYPES: IMessageType[] = [
  {
    id: 'text',
    name: '텍스트형',
    icon: <AlignLeft size={28} />,
    description: '텍스트만으로 구성된 기본 메시지',
    details: '본문 최대 400자 · 버튼 최대 5개',
    maxButtons: 5,
    color: 'border-gray-400 bg-gray-50',
  },
  {
    id: 'image',
    name: '이미지형',
    icon: <Image size={28} />,
    description: '썸네일 이미지 + 텍스트 조합 메시지',
    details: '이미지 500×250px · 본문 최대 400자 · 버튼 최대 5개',
    imageSpec: '500×250px',
    maxButtons: 5,
    color: 'border-blue-400 bg-blue-50',
  },
  {
    id: 'wide-image',
    name: '와이드 이미지형',
    icon: <Image size={28} />,
    description: '전체 폭 이미지로 강렬한 인상을 주는 메시지',
    details: '이미지 800×600px · 본문 최대 400자 · 버튼 최대 2개',
    imageSpec: '800×600px',
    maxButtons: 2,
    color: 'border-green-400 bg-green-50',
  },
  {
    id: 'wide-item-list',
    name: '와이드 아이템 리스트형',
    icon: <LayoutList size={28} />,
    description: '여러 상품/이벤트를 리스트로 보여주는 메시지',
    details: '아이템 2~4개 · 이미지 300×300px · 버튼 최대 2개',
    imageSpec: '300×300px',
    maxButtons: 2,
    color: 'border-amber-400 bg-amber-50',
  },
  {
    id: 'carousel',
    name: '캐러셀 피드형',
    icon: <Layers size={28} />,
    description: '슬라이드 카드 형태로 여러 콘텐츠를 소개',
    details: '카드 2~6개 · 이미지 500×500px · 카드당 버튼 최대 2개',
    imageSpec: '500×500px',
    maxButtons: 2,
    color: 'border-purple-400 bg-purple-50',
  },
];

const BUTTON_TYPES = ['웹링크', '앱링크', '봇키워드', '채널 추가', '상담톡 전환', '봇 전환'];

interface IButton {
  id: number;
  type: string;
  label: string;
  url: string;
}

interface ICarouselCard {
  id: number;
  title: string;
  description: string;
  imageUploaded: boolean;
  buttons: IButton[];
}

interface IWideItem {
  id: number;
  title: string;
  description: string;
  imageUploaded: boolean;
}

// ─── 서브 컴포넌트 ─────────────────────────────────────────────────────────────

function ButtonBuilder({ buttons, maxButtons, onChange }: {
  buttons: IButton[];
  maxButtons: number;
  onChange: (buttons: IButton[]) => void;
}) {
  const addButton = () => {
    if (buttons.length >= maxButtons) return;
    onChange([...buttons, { id: Date.now(), type: '웹링크', label: '', url: '' }]);
  };

  const removeButton = (id: number) => {
    onChange(buttons.filter((b) => b.id !== id));
  };

  const updateButton = (id: number, field: keyof IButton, value: string) => {
    onChange(buttons.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium">버튼 설정 <span className="text-muted-foreground">(최대 {maxButtons}개)</span></p>
        {buttons.length < maxButtons && (
          <button
            type="button"
            onClick={addButton}
            className="flex items-center gap-1 rounded-lg border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Plus size={11} /> 버튼 추가
          </button>
        )}
      </div>
      {buttons.length === 0 && (
        <div className="flex h-12 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
          버튼을 추가하세요
        </div>
      )}
      <div className="space-y-2">
        {buttons.map((btn, idx) => (
          <div key={btn.id} className="flex items-center gap-2 rounded-lg border border-border bg-gray-50 p-2.5">
            <span className="min-w-[18px] text-xs font-bold text-muted-foreground">{idx + 1}</span>
            <div className="relative">
              <select
                value={btn.type}
                onChange={(e) => updateButton(btn.id, 'type', e.target.value)}
                className="h-8 appearance-none rounded-md border border-border bg-white pl-2.5 pr-6 text-xs outline-none focus:border-primary"
              >
                {BUTTON_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              <ChevronDown size={10} className="pointer-events-none absolute right-1.5 top-2.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={btn.label}
              onChange={(e) => updateButton(btn.id, 'label', e.target.value)}
              placeholder="버튼명"
              className="h-8 flex-1 rounded-md border border-border bg-white px-2.5 text-xs outline-none focus:border-primary"
            />
            {(btn.type === '웹링크' || btn.type === '앱링크') && (
              <input
                type="text"
                value={btn.url}
                onChange={(e) => updateButton(btn.id, 'url', e.target.value)}
                placeholder={btn.type === '웹링크' ? 'https://...' : 'app://...'}
                className="h-8 flex-1 rounded-md border border-border bg-white px-2.5 text-xs outline-none focus:border-primary"
              />
            )}
            <button type="button" onClick={() => removeButton(btn.id)} className="text-muted-foreground hover:text-red-500">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageUploadBox({ label, spec, uploaded, onToggle }: {
  label: string;
  spec: string;
  uploaded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 text-center transition-colors',
        uploaded ? 'border-green-400 bg-green-50' : 'border-border hover:border-gray-400'
      )}
    >
      {uploaded ? (
        <>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600"><Check size={18} /></div>
          <p className="text-xs font-medium text-green-600">이미지 업로드 완료</p>
          <p className="text-[10px] text-green-500">{spec}</p>
        </>
      ) : (
        <>
          <Upload size={24} className="text-muted-foreground" />
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-[10px] text-muted-foreground">{spec}</p>
        </>
      )}
    </div>
  );
}

// ─── 메인 폼 ─────────────────────────────────────────────────────────────────

interface ICrmCampaignCreateFormProps {
  onCancel: () => void;
  onComplete: () => void;
}

export function CrmCampaignCreateForm({ onCancel, onComplete }: ICrmCampaignCreateFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignName, setCampaignName] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [targetMethod, setTargetMethod] = useState<string | null>(null);
  const [directInput, setDirectInput] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [headerText, setHeaderText] = useState('');
  const [buttons, setButtons] = useState<IButton[]>([]);
  const [couponEnabled, setCouponEnabled] = useState(false);
  const [couponName, setCouponName] = useState('');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [sendOption, setSendOption] = useState<'now' | 'reserved'>('now');
  const [wideItems, setWideItems] = useState<IWideItem[]>([
    { id: 1, title: '', description: '', imageUploaded: false },
    { id: 2, title: '', description: '', imageUploaded: false },
  ]);
  const [carouselCards, setCarouselCards] = useState<ICarouselCard[]>([
    { id: 1, title: '', description: '', imageUploaded: false, buttons: [] },
    { id: 2, title: '', description: '', imageUploaded: false, buttons: [] },
  ]);

  const selectedTypeInfo = MESSAGE_TYPES.find((t) => t.id === selectedType);
  const canNext1 = !!selectedType;
  const canNext2 = !!targetMethod;
  const canNext3 = bodyText.trim().length > 0;

  const addWideItem = () => {
    if (wideItems.length >= 4) return;
    setWideItems((prev) => [...prev, { id: Date.now(), title: '', description: '', imageUploaded: false }]);
  };

  const addCarouselCard = () => {
    if (carouselCards.length >= 6) return;
    setCarouselCards((prev) => [...prev, { id: Date.now(), title: '', description: '', imageUploaded: false, buttons: [] }]);
  };

  const removeCarouselCard = (id: number) => {
    if (carouselCards.length <= 2) return;
    setCarouselCards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div>
      {/* Step Indicator */}
      <div className="mb-8 flex items-center justify-center gap-1">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => { if (step.id < currentStep) setCurrentStep(step.id); }}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                currentStep === step.id ? 'bg-foreground text-white' : currentStep > step.id ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
              )}
            >
              {currentStep > step.id ? <Check size={13} /> : step.icon}
              {step.label}
            </button>
            {idx < STEPS.length - 1 && (
              <div className={cn('mx-2 h-px w-8', currentStep > step.id ? 'bg-green-300' : 'bg-border')} />
            )}
          </div>
        ))}
      </div>

      {/* 캠페인명 (공통) */}
      {currentStep >= 1 && (
        <div className="mx-auto mb-6 max-w-3xl">
          <div className="rounded-xl border border-border bg-white p-5">
            <label className="mb-1.5 block text-xs font-medium">캠페인명 <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="캠페인 이름을 입력해주세요"
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl">

        {/* ── STEP 1: 메시지 유형 선택 ── */}
        {currentStep === 1 && (
          <div>
            <h2 className="mb-4 text-base font-semibold">메시지 유형을 선택해주세요</h2>
            <div className="grid grid-cols-5 gap-3">
              {MESSAGE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    'flex flex-col items-center gap-3 rounded-xl border-2 p-4 text-center transition-all',
                    selectedType === type.id ? type.color : 'border-border bg-white hover:border-gray-300'
                  )}
                >
                  <div className={cn('flex h-14 w-14 items-center justify-center rounded-xl', selectedType === type.id ? 'bg-white/70' : 'bg-muted')}>
                    {type.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{type.name}</p>
                    <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{type.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {selectedTypeInfo && (
              <div className="mt-4 rounded-xl border border-border bg-gray-50 p-4">
                <p className="mb-2 text-xs font-semibold">선택된 유형: {selectedTypeInfo.name}</p>
                <div className="flex gap-6 text-xs text-muted-foreground">
                  <span>📝 {selectedTypeInfo.details}</span>
                  {selectedTypeInfo.imageSpec && <span>🖼 권장 이미지 {selectedTypeInfo.imageSpec}</span>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: 수신 대상 설정 ── */}
        {currentStep === 2 && (
          <div>
            <h2 className="mb-4 text-base font-semibold">수신 대상을 설정해주세요</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'customer-list', icon: <List size={30} />, label: '고객 리스트에서 선택', sub: '기존 고객 데이터에서 대상 선택' },
                { id: 'direct-input', icon: <UserPlus size={30} />, label: '전화번호 직접 입력', sub: '수신자 번호를 직접 입력' },
                { id: 'file-upload', icon: <Upload size={30} />, label: '파일 업로드', sub: '엑셀/CSV 파일로 대량 등록' },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setTargetMethod(method.id)}
                  className={cn(
                    'flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all',
                    targetMethod === method.id ? 'border-foreground bg-gray-50' : 'border-border hover:border-gray-300'
                  )}
                >
                  <div className="text-foreground">{method.icon}</div>
                  <span className="text-sm font-medium">{method.label}</span>
                  <span className="text-xs text-muted-foreground">{method.sub}</span>
                </button>
              ))}
            </div>

            {targetMethod === 'direct-input' && (
              <div className="mt-4 rounded-xl border border-border bg-white p-5">
                <p className="mb-2 text-xs text-muted-foreground">전화번호를 입력해주세요 (쉼표 또는 줄바꿈으로 구분)</p>
                <textarea
                  rows={4}
                  value={directInput}
                  onChange={(e) => setDirectInput(e.target.value)}
                  placeholder="01012345678, 01098765432..."
                  className="w-full resize-none rounded-lg border border-border p-3 text-sm outline-none focus:border-primary"
                />
                <p className="mt-1.5 text-right text-xs text-muted-foreground">
                  {directInput ? directInput.split(/[,\n]/).filter((v) => v.trim()).length : 0}명
                </p>
              </div>
            )}

            {targetMethod === 'file-upload' && (
              <div className="mt-4 rounded-xl border-2 border-dashed border-border bg-white p-10 text-center">
                <Upload size={36} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">엑셀 또는 CSV 파일을 드래그하거나 클릭하여 업로드하세요</p>
                <p className="mt-1 text-xs text-muted-foreground">최대 10,000명 · 전화번호 컬럼 필수</p>
                <button className="mt-3 rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted">파일 선택</button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3: 메시지 내용 작성 ── */}
        {currentStep === 3 && selectedTypeInfo && (
          <div>
            <h2 className="mb-4 text-base font-semibold">메시지 내용을 작성해주세요</h2>

            {/* 텍스트형 */}
            {selectedType === 'text' && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-white p-5">
                  <label className="mb-1.5 block text-xs font-medium">헤더 텍스트 <span className="text-muted-foreground">(선택)</span></label>
                  <input
                    type="text"
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    placeholder="상단 헤더 문구 (채널명 대체 가능)"
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <div className="mb-1.5 flex justify-between">
                    <label className="text-xs font-medium">본문 내용 <span className="text-red-500">*</span></label>
                    <span className="text-xs text-muted-foreground">{bodyText.length}/400</span>
                  </div>
                  <textarea
                    rows={6}
                    value={bodyText}
                    onChange={(e) => { if (e.target.value.length <= 400) setBodyText(e.target.value); }}
                    placeholder="메시지 본문을 입력하세요&#10;&#10;변수 사용: #{고객명}, #{쿠폰코드} 등"
                    className="w-full resize-none rounded-lg border border-border p-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <ButtonBuilder buttons={buttons} maxButtons={5} onChange={setButtons} />
                </div>
              </div>
            )}

            {/* 이미지형 / 와이드 이미지형 */}
            {(selectedType === 'image' || selectedType === 'wide-image') && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-white p-5">
                  <label className="mb-2 block text-xs font-medium">
                    이미지 업로드 <span className="text-red-500">*</span>
                    <span className="ml-1 font-normal text-muted-foreground">({selectedTypeInfo.imageSpec})</span>
                  </label>
                  <ImageUploadBox
                    label="이미지를 드래그하거나 클릭하세요"
                    spec={`권장 ${selectedTypeInfo.imageSpec} · JPG/PNG · 최대 5MB`}
                    uploaded={imageUploaded}
                    onToggle={() => setImageUploaded((v) => !v)}
                  />
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <div className="mb-1.5 flex justify-between">
                    <label className="text-xs font-medium">본문 내용 <span className="text-red-500">*</span></label>
                    <span className="text-xs text-muted-foreground">{bodyText.length}/400</span>
                  </div>
                  <textarea
                    rows={5}
                    value={bodyText}
                    onChange={(e) => { if (e.target.value.length <= 400) setBodyText(e.target.value); }}
                    placeholder="이미지 아래 본문을 입력하세요&#10;&#10;변수 사용: #{고객명}, #{쿠폰코드} 등"
                    className="w-full resize-none rounded-lg border border-border p-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <ButtonBuilder buttons={buttons} maxButtons={selectedTypeInfo.maxButtons} onChange={setButtons} />
                </div>
              </div>
            )}

            {/* 와이드 아이템 리스트형 */}
            {selectedType === 'wide-item-list' && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-white p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-xs font-medium">아이템 목록 <span className="text-red-500">*</span> <span className="font-normal text-muted-foreground">(2~4개)</span></label>
                    {wideItems.length < 4 && (
                      <button onClick={addWideItem} className="flex items-center gap-1 rounded-lg border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary">
                        <Plus size={11} /> 아이템 추가
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {wideItems.map((item, idx) => (
                      <div key={item.id} className="flex gap-3 rounded-lg border border-border p-3">
                        <div
                          onClick={() => setWideItems((prev) => prev.map((w) => w.id === item.id ? { ...w, imageUploaded: !w.imageUploaded } : w))}
                          className={cn(
                            'flex h-16 w-16 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-xs',
                            item.imageUploaded ? 'border-green-400 bg-green-50 text-green-600' : 'border-border text-muted-foreground hover:border-gray-400'
                          )}
                        >
                          {item.imageUploaded ? <Check size={16} /> : <Image size={16} />}
                        </div>
                        <div className="flex flex-1 flex-col gap-1.5">
                          <p className="text-[10px] text-muted-foreground">아이템 {idx + 1}</p>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => setWideItems((prev) => prev.map((w) => w.id === item.id ? { ...w, title: e.target.value } : w))}
                            placeholder="타이틀"
                            className="rounded-md border border-border px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                          />
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => setWideItems((prev) => prev.map((w) => w.id === item.id ? { ...w, description: e.target.value } : w))}
                            placeholder="설명"
                            className="rounded-md border border-border px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                          />
                        </div>
                        {wideItems.length > 2 && (
                          <button onClick={() => setWideItems((prev) => prev.filter((w) => w.id !== item.id))} className="self-start text-muted-foreground hover:text-red-500">
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <div className="mb-1.5 flex justify-between">
                    <label className="text-xs font-medium">본문 내용 <span className="text-red-500">*</span></label>
                    <span className="text-xs text-muted-foreground">{bodyText.length}/400</span>
                  </div>
                  <textarea
                    rows={4}
                    value={bodyText}
                    onChange={(e) => { if (e.target.value.length <= 400) setBodyText(e.target.value); }}
                    placeholder="리스트 하단 본문을 입력하세요"
                    className="w-full resize-none rounded-lg border border-border p-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <ButtonBuilder buttons={buttons} maxButtons={2} onChange={setButtons} />
                </div>
              </div>
            )}

            {/* 캐러셀 피드형 */}
            {selectedType === 'carousel' && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-white p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-xs font-medium">슬라이드 카드 <span className="text-red-500">*</span> <span className="font-normal text-muted-foreground">(2~6장)</span></label>
                    {carouselCards.length < 6 && (
                      <button onClick={addCarouselCard} className="flex items-center gap-1 rounded-lg border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary">
                        <Plus size={11} /> 카드 추가
                      </button>
                    )}
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {carouselCards.map((card, idx) => (
                      <div key={card.id} className="min-w-[200px] flex-shrink-0 rounded-xl border border-border bg-gray-50 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-muted-foreground">카드 {idx + 1}</span>
                          {carouselCards.length > 2 && (
                            <button onClick={() => removeCarouselCard(card.id)} className="text-muted-foreground hover:text-red-500"><Trash2 size={11} /></button>
                          )}
                        </div>
                        <div
                          onClick={() => setCarouselCards((prev) => prev.map((c) => c.id === card.id ? { ...c, imageUploaded: !c.imageUploaded } : c))}
                          className={cn(
                            'mb-2 flex h-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-xs',
                            card.imageUploaded ? 'border-green-400 bg-green-50 text-green-600' : 'border-border text-muted-foreground'
                          )}
                        >
                          {card.imageUploaded ? <><Check size={14} /><span className="ml-1">이미지</span></> : <><Image size={14} /><span className="ml-1">500×500px</span></>}
                        </div>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => setCarouselCards((prev) => prev.map((c) => c.id === card.id ? { ...c, title: e.target.value } : c))}
                          placeholder="타이틀"
                          className="mb-1.5 w-full rounded-md border border-border bg-white px-2 py-1.5 text-xs outline-none focus:border-primary"
                        />
                        <input
                          type="text"
                          value={card.description}
                          onChange={(e) => setCarouselCards((prev) => prev.map((c) => c.id === card.id ? { ...c, description: e.target.value } : c))}
                          placeholder="설명"
                          className="mb-2 w-full rounded-md border border-border bg-white px-2 py-1.5 text-xs outline-none focus:border-primary"
                        />
                        <ButtonBuilder
                          buttons={card.buttons}
                          maxButtons={2}
                          onChange={(btns) => setCarouselCards((prev) => prev.map((c) => c.id === card.id ? { ...c, buttons: btns } : c))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 쿠폰 연동 (모든 유형 공통) */}
            <div className="mt-4 rounded-xl border border-border bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium">쿠폰 연동 <span className="text-muted-foreground">(선택)</span></p>
                  <p className="text-[10px] text-muted-foreground">메시지에 쿠폰을 포함하여 발송합니다</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCouponEnabled((v) => !v)}
                  className={cn(
                    'relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors',
                    couponEnabled ? 'bg-foreground' : 'bg-gray-200'
                  )}
                >
                  <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', couponEnabled ? 'translate-x-4' : 'translate-x-0')} />
                </button>
              </div>
              {couponEnabled && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[10px] text-muted-foreground">쿠폰명</label>
                    <input
                      type="text"
                      value={couponName}
                      onChange={(e) => setCouponName(e.target.value)}
                      placeholder="예) 봄맞이 10% 할인"
                      className="w-full rounded-lg border border-border px-3 py-2 text-xs outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] text-muted-foreground">유효기간</label>
                    <input
                      type="date"
                      className="w-full rounded-lg border border-border px-3 py-2 text-xs outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 4: 발송 설정 ── */}
        {currentStep === 4 && (
          <div>
            <h2 className="mb-4 text-base font-semibold">발송 설정</h2>
            <div className="space-y-3">
              {[
                { id: 'now' as const, icon: <Send size={22} className="text-foreground" />, label: '즉시 발송', sub: '저장 즉시 메시지를 발송합니다' },
                { id: 'reserved' as const, icon: <span className="text-2xl">📅</span>, label: '예약 발송', sub: '지정한 날짜와 시간에 자동 발송합니다' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSendOption(opt.id)}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-xl border-2 p-5 text-left transition-all',
                    sendOption === opt.id ? 'border-foreground bg-gray-50' : 'border-border hover:border-gray-300'
                  )}
                >
                  {opt.icon}
                  <div>
                    <p className="font-medium">{opt.label}</p>
                    <p className="text-sm text-muted-foreground">{opt.sub}</p>
                  </div>
                </button>
              ))}

              {sendOption === 'reserved' && (
                <div className="ml-12 rounded-xl border border-border bg-white p-4">
                  <div className="flex gap-4">
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">날짜</label>
                      <input type="date" className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">시간</label>
                      <input type="time" className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 최종 요약 */}
            <div className="mt-6 rounded-xl border border-border bg-gray-50 p-5">
              <p className="mb-3 text-xs font-semibold">발송 전 최종 확인</p>
              <div className="space-y-1.5 text-xs">
                <div className="flex gap-2"><span className="w-24 text-muted-foreground">캠페인명</span><span className="font-medium">{campaignName || '-'}</span></div>
                <div className="flex gap-2"><span className="w-24 text-muted-foreground">메시지 유형</span><span className="font-medium">{selectedTypeInfo?.name || '-'}</span></div>
                <div className="flex gap-2"><span className="w-24 text-muted-foreground">수신 대상</span><span className="font-medium">{targetMethod === 'customer-list' ? '고객 리스트' : targetMethod === 'direct-input' ? `직접 입력 ${directInput.split(/[,\n]/).filter((v) => v.trim()).length}명` : targetMethod === 'file-upload' ? '파일 업로드' : '-'}</span></div>
                <div className="flex gap-2"><span className="w-24 text-muted-foreground">버튼 수</span><span className="font-medium">{buttons.length}개</span></div>
                <div className="flex gap-2"><span className="w-24 text-muted-foreground">쿠폰 연동</span><span className="font-medium">{couponEnabled ? couponName || '설정됨' : '없음'}</span></div>
                <div className="flex gap-2"><span className="w-24 text-muted-foreground">발송 방식</span><span className="font-medium">{sendOption === 'now' ? '즉시 발송' : '예약 발송'}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* 네비게이션 버튼 */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <button
            onClick={onCancel}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            취소
          </button>
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                이전
              </button>
            )}
            <button className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted">
              임시저장
            </button>
            {currentStep < 4 ? (
              <button
                onClick={() => {
                  const canProceed = currentStep === 1 ? canNext1 : currentStep === 2 ? canNext2 : canNext3;
                  if (canProceed) setCurrentStep((prev) => prev + 1);
                }}
                disabled={currentStep === 1 ? !canNext1 : currentStep === 2 ? !canNext2 : !canNext3}
                className={cn(
                  'rounded-lg px-5 py-2.5 text-sm font-medium transition-colors',
                  (currentStep === 1 ? canNext1 : currentStep === 2 ? canNext2 : canNext3)
                    ? 'bg-foreground text-white hover:bg-gray-800'
                    : 'cursor-not-allowed bg-muted text-muted-foreground'
                )}
              >
                다음
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                <Send size={14} />
                발송하기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
