import { useState } from 'react';
import {
  MessageSquare,
  Users,
  FileText,
  Send,
  Check,
  Upload,
  Plus,
  Trash2,
  Image,
  LayoutList,
  Layers,
  AlignLeft,
  ChevronDown,
  Star,
  RefreshCw,
  Gift,
  UserCheck,
  Heart,
  Sparkles,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: '캠페인 유형', icon: <Sparkles size={14} /> },
  { id: 2, label: '수신 대상', icon: <Users size={14} /> },
  { id: 3, label: '메시지 작성', icon: <FileText size={14} /> },
  { id: 4, label: '발송 설정', icon: <Send size={14} /> },
  { id: 5, label: '최종 확인', icon: <Check size={14} /> },
];

// ─── 캠페인 유형 ───────────────────────────────────────────────────────────────

interface ICampaignType {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  hashtags: string[];
  filters: string[];
}

const CAMPAIGN_TYPES: ICampaignType[] = [
  {
    id: 'custom',
    name: '커스텀 캠페인',
    subtitle: '전체 고객 대상',
    description: '자유롭게 대상을 설정하고 원하는 메시지를 보내세요',
    icon: <Filter size={22} />,
    gradient: 'from-slate-500 to-slate-700',
    iconBg: 'bg-slate-100 text-slate-600',
    hashtags: ['#모든고객', '#자유설정', '#맞춤발송'],
    filters: ['grade', 'lastVisit', 'joinDate', 'purchase', 'demographic'],
  },
  {
    id: 'welcome-back',
    name: '웰컴백 캠페인',
    subtitle: '장기 미접속 고객',
    description: '오랫동안 방문하지 않은 고객을 다시 불러오세요',
    icon: <RefreshCw size={22} />,
    gradient: 'from-blue-500 to-indigo-600',
    iconBg: 'bg-blue-100 text-blue-600',
    hashtags: ['#장기미접속', '#재방문유도', '#휴면고객'],
    filters: ['lastVisit', 'joinDate', 'demographic'],
  },
  {
    id: 'new-member',
    name: '신규회원 이탈방지',
    subtitle: '신규 가입 고객',
    description: '가입 후 첫 구매를 하지 않은 신규 고객에게 특별 혜택을 제공하세요',
    icon: <UserCheck size={22} />,
    gradient: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-100 text-emerald-600',
    hashtags: ['#신규가입', '#첫구매유도', '#이탈방지'],
    filters: ['joinDate'],
  },
  {
    id: 'repurchase',
    name: '재구매 유도',
    subtitle: '구매 이력 고객',
    description: '이전에 구매한 고객의 재구매를 유도하고 충성 고객으로 만드세요',
    icon: <RefreshCw size={22} />,
    gradient: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-100 text-amber-600',
    hashtags: ['#재구매', '#구매이력', '#충성고객'],
    filters: ['purchase'],
  },
  {
    id: 'purchase-thanks',
    name: '구매 감사',
    subtitle: '최근 구매 고객',
    description: '최근 구매 고객에게 감사 메시지와 다음 방문을 위한 혜택을 전달하세요',
    icon: <Heart size={22} />,
    gradient: 'from-pink-500 to-rose-600',
    iconBg: 'bg-pink-100 text-pink-600',
    hashtags: ['#구매감사', '#CS', '#다음방문'],
    filters: ['purchase'],
  },
  {
    id: 'birthday',
    name: '생일 축하',
    subtitle: '생일 고객 자동 발송',
    description: '고객의 생일에 맞춰 자동으로 축하 메시지를 발송하세요',
    icon: <Gift size={22} />,
    gradient: 'from-violet-500 to-purple-600',
    iconBg: 'bg-violet-100 text-violet-600',
    hashtags: ['#생일', '#자동발송', '#개인화'],
    filters: [],
  },
  {
    id: 'vip',
    name: 'VIP 전용',
    subtitle: '우수 등급 고객',
    description: 'VIP 회원에게 특별한 혜택과 프리미엄 서비스를 안내하세요',
    icon: <Star size={22} />,
    gradient: 'from-yellow-500 to-amber-600',
    iconBg: 'bg-yellow-100 text-yellow-600',
    hashtags: ['#VIP', '#회원등급', '#프리미엄'],
    filters: ['grade'],
  },
];

// ─── 메시지 유형 ───────────────────────────────────────────────────────────────

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

const MESSAGE_TYPES: IMessageType[] = [
  {
    id: 'text',
    name: '텍스트형',
    icon: <AlignLeft size={24} />,
    description: '텍스트만으로 구성된 기본 메시지',
    details: '본문 최대 400자 · 버튼 최대 5개',
    maxButtons: 5,
    maxChars: 400,
    color: 'border-gray-400 bg-gray-50',
  },
  {
    id: 'image',
    name: '이미지형',
    icon: <Image size={24} />,
    description: '썸네일 이미지 + 텍스트 조합',
    details: '이미지 500×250px · 본문 최대 400자 · 버튼 최대 5개',
    imageSpec: '500×250px',
    maxButtons: 5,
    maxChars: 400,
    color: 'border-blue-400 bg-blue-50',
  },
  {
    id: 'wide-image',
    name: '와이드 이미지형',
    icon: <Image size={24} />,
    description: '전체 폭 이미지로 강렬한 인상',
    details: '이미지 800×600px · 본문 최대 76자 · 버튼 최대 2개',
    imageSpec: '800×600px',
    maxButtons: 2,
    maxChars: 76,
    color: 'border-green-400 bg-green-50',
  },
  {
    id: 'wide-item-list',
    name: '와이드 아이템 리스트형',
    icon: <LayoutList size={24} />,
    description: '여러 상품/이벤트를 리스트로 소개',
    details: '아이템 2~4개 · 이미지 300×300px · 버튼 최대 2개',
    imageSpec: '300×300px',
    maxButtons: 2,
    maxChars: 400,
    color: 'border-amber-400 bg-amber-50',
  },
  {
    id: 'carousel',
    name: '캐러셀 피드형',
    icon: <Layers size={24} />,
    description: '슬라이드 카드로 여러 콘텐츠 소개',
    details: '카드 2~6개 · 이미지 500×500px · 카드당 버튼 최대 2개',
    imageSpec: '500×500px',
    maxButtons: 2,
    maxChars: 400,
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
  const removeButton = (id: number) => onChange(buttons.filter((b) => b.id !== id));
  const updateButton = (id: number, field: keyof IButton, value: string) =>
    onChange(buttons.map((b) => (b.id === id ? { ...b, [field]: value } : b)));

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
        <div className="flex h-10 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">버튼을 추가하세요</div>
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
  label: string; spec: string; uploaded: boolean; onToggle: () => void;
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

// ─── 수신 대상 필터 ────────────────────────────────────────────────────────────

const GRADE_OPTIONS = ['전체', 'VIP', '골드', '실버', '일반', '신규'];
const DEMOGRAPHIC_GENDER = ['전체', '남성', '여성'];
const DEMOGRAPHIC_AGE = ['전체', '10대', '20대', '30대', '40대', '50대+'];

interface IRecipientFilter {
  grade: string;
  lastVisitDays: string;
  joinDateFrom: string;
  joinDateTo: string;
  purchaseMin: string;
  purchaseCount: string;
  gender: string;
  ageGroup: string;
}

function RecipientFilters({ campaignType, filter, onChange }: {
  campaignType: ICampaignType | undefined;
  filter: IRecipientFilter;
  onChange: (f: IRecipientFilter) => void;
}) {
  const set = (key: keyof IRecipientFilter, value: string) => onChange({ ...filter, [key]: value });
  const activeFilters = campaignType?.filters ?? [];
  const isBirthday = campaignType?.id === 'birthday';

  if (isBirthday) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-violet-50 py-10">
        <Gift size={32} className="mb-3 text-violet-500" />
        <p className="text-sm font-semibold text-violet-700">생일 고객 자동 대상</p>
        <p className="mt-1 text-xs text-muted-foreground">고객의 생일 정보를 기반으로 자동으로 대상이 설정됩니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeFilters.includes('grade') && (
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="mb-3 text-xs font-semibold">회원 등급</p>
          <div className="flex flex-wrap gap-2">
            {GRADE_OPTIONS.map((g) => (
              <button
                key={g}
                onClick={() => set('grade', g)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs transition-colors',
                  filter.grade === g ? 'border-foreground bg-foreground text-white' : 'border-border hover:border-gray-400'
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeFilters.includes('lastVisit') && (
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="mb-3 text-xs font-semibold">최종 접속일</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">최근</span>
            <input
              type="number"
              value={filter.lastVisitDays}
              onChange={(e) => set('lastVisitDays', e.target.value)}
              placeholder="30"
              className="w-20 rounded-lg border border-border px-3 py-2 text-xs outline-none focus:border-primary"
            />
            <span className="text-xs text-muted-foreground">일 이상 미접속</span>
          </div>
        </div>
      )}

      {activeFilters.includes('joinDate') && (
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="mb-3 text-xs font-semibold">가입일 범위</p>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filter.joinDateFrom}
              onChange={(e) => set('joinDateFrom', e.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-xs outline-none focus:border-primary"
            />
            <span className="text-xs text-muted-foreground">~</span>
            <input
              type="date"
              value={filter.joinDateTo}
              onChange={(e) => set('joinDateTo', e.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-xs outline-none focus:border-primary"
            />
          </div>
        </div>
      )}

      {activeFilters.includes('purchase') && (
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="mb-3 text-xs font-semibold">구매 이력</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[10px] text-muted-foreground">최소 구매 금액 (원)</label>
              <input
                type="number"
                value={filter.purchaseMin}
                onChange={(e) => set('purchaseMin', e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-border px-3 py-2 text-xs outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] text-muted-foreground">최소 구매 횟수</label>
              <input
                type="number"
                value={filter.purchaseCount}
                onChange={(e) => set('purchaseCount', e.target.value)}
                placeholder="1"
                className="w-full rounded-lg border border-border px-3 py-2 text-xs outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      )}

      {activeFilters.includes('demographic') && (
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="mb-3 text-xs font-semibold">성별 / 연령</p>
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-[10px] text-muted-foreground">성별</p>
              <div className="flex gap-2">
                {DEMOGRAPHIC_GENDER.map((g) => (
                  <button
                    key={g}
                    onClick={() => set('gender', g)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs transition-colors',
                      filter.gender === g ? 'border-foreground bg-foreground text-white' : 'border-border hover:border-gray-400'
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] text-muted-foreground">연령대</p>
              <div className="flex flex-wrap gap-2">
                {DEMOGRAPHIC_AGE.map((a) => (
                  <button
                    key={a}
                    onClick={() => set('ageGroup', a)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs transition-colors',
                      filter.ageGroup === a ? 'border-foreground bg-foreground text-white' : 'border-border hover:border-gray-400'
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 메인 폼 ──────────────────────────────────────────────────────────────────

interface ICrmCampaignCreateFormProps {
  onCancel: () => void;
  onComplete: () => void;
}

export function CrmCampaignCreateForm({ onCancel, onComplete }: ICrmCampaignCreateFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignName, setCampaignName] = useState('');

  // Step 1
  const [selectedCampaignTypeId, setSelectedCampaignTypeId] = useState<string | null>(null);

  // Step 2
  const [recipientFilter, setRecipientFilter] = useState<IRecipientFilter>({
    grade: '전체', lastVisitDays: '', joinDateFrom: '', joinDateTo: '',
    purchaseMin: '', purchaseCount: '', gender: '전체', ageGroup: '전체',
  });

  // Step 3
  const [selectedMessageTypeId, setSelectedMessageTypeId] = useState<string | null>(null);
  const [bodyText, setBodyText] = useState('');
  const [headerText, setHeaderText] = useState('');
  const [buttons, setButtons] = useState<IButton[]>([]);
  const [couponEnabled, setCouponEnabled] = useState(false);
  const [couponName, setCouponName] = useState('');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [wideItems, setWideItems] = useState<IWideItem[]>([
    { id: 1, title: '', description: '', imageUploaded: false },
    { id: 2, title: '', description: '', imageUploaded: false },
  ]);
  const [carouselCards, setCarouselCards] = useState<ICarouselCard[]>([
    { id: 1, title: '', description: '', imageUploaded: false, buttons: [] },
    { id: 2, title: '', description: '', imageUploaded: false, buttons: [] },
  ]);

  // Step 4
  const [sendOption, setSendOption] = useState<'now' | 'reserved'>('now');
  const [sendDate, setSendDate] = useState('');
  const [sendTime, setSendTime] = useState('');

  const selectedCampaignType = CAMPAIGN_TYPES.find((t) => t.id === selectedCampaignTypeId);
  const selectedMessageType = MESSAGE_TYPES.find((t) => t.id === selectedMessageTypeId);

  const canNext: Record<number, boolean> = {
    1: !!selectedCampaignTypeId,
    2: selectedCampaignType?.id === 'birthday' || true,
    3: !!selectedMessageTypeId && bodyText.trim().length > 0,
    4: sendOption === 'now' || (!!sendDate && !!sendTime),
  };

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

  const estimatedCost = (() => {
    const UNIT_PRICE = 15;
    const count = recipientFilter.grade === '전체' ? 3200 : 320;
    return (count * UNIT_PRICE).toLocaleString();
  })();

  return (
    <div>
      {/* Step Indicator */}
      <div className="mb-8 flex items-center justify-center gap-1">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => { if (step.id < currentStep) setCurrentStep(step.id); }}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                currentStep === step.id ? 'bg-foreground text-white' :
                currentStep > step.id ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
              )}
            >
              {currentStep > step.id ? <Check size={12} /> : step.icon}
              {step.label}
            </button>
            {idx < STEPS.length - 1 && (
              <div className={cn('mx-1.5 h-px w-6', currentStep > step.id ? 'bg-green-300' : 'bg-border')} />
            )}
          </div>
        ))}
      </div>

      {/* 캠페인명 (공통) */}
      <div className="mx-auto mb-5 max-w-3xl">
        <div className="rounded-xl border border-border bg-white p-4">
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

      <div className="mx-auto max-w-3xl">

        {/* ── STEP 1: 캠페인 유형 선택 ── */}
        {currentStep === 1 && (
          <div>
            <h2 className="mb-1 text-base font-semibold">어떤 캠페인을 만드시겠어요?</h2>
            <p className="mb-5 text-xs text-muted-foreground">목적에 맞는 캠페인 유형을 선택하면 최적의 설정을 안내해 드려요</p>
            <div className="grid grid-cols-2 gap-3">
              {CAMPAIGN_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedCampaignTypeId(type.id)}
                  className={cn(
                    'relative flex items-start gap-4 overflow-hidden rounded-xl border-2 p-4 text-left transition-all',
                    selectedCampaignTypeId === type.id
                      ? 'border-foreground bg-gray-50 shadow-sm'
                      : 'border-border bg-white hover:border-gray-300 hover:shadow-sm'
                  )}
                >
                  {/* gradient accent bar */}
                  <div className={cn('absolute left-0 top-0 h-full w-1 bg-gradient-to-b', type.gradient)} />

                  <div className={cn('mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl', type.iconBg)}>
                    {type.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{type.name}</p>
                    <p className="text-[11px] text-muted-foreground">{type.subtitle}</p>
                    <p className="mt-1.5 text-xs leading-snug text-muted-foreground">{type.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {type.hashtags.map((tag) => (
                        <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {selectedCampaignTypeId === type.id && (
                    <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
                      <Check size={11} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: 수신 대상 설정 ── */}
        {currentStep === 2 && (
          <div>
            <h2 className="mb-1 text-base font-semibold">수신 대상을 설정해주세요</h2>
            {selectedCampaignType && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                <div className={cn('flex h-6 w-6 items-center justify-center rounded-md', selectedCampaignType.iconBg)}>
                  {selectedCampaignType.icon}
                </div>
                <span className="text-xs font-medium">{selectedCampaignType.name}</span>
                <span className="text-xs text-muted-foreground">· {selectedCampaignType.subtitle}</span>
              </div>
            )}
            <RecipientFilters
              campaignType={selectedCampaignType}
              filter={recipientFilter}
              onChange={setRecipientFilter}
            />
          </div>
        )}

        {/* ── STEP 3: 메시지 작성 ── */}
        {currentStep === 3 && (
          <div>
            <h2 className="mb-1 text-base font-semibold">메시지 유형과 내용을 작성해주세요</h2>
            <p className="mb-4 text-xs text-muted-foreground">카카오 브랜드 메시지 유형을 선택하고 내용을 입력하세요</p>

            {/* 메시지 유형 선택 */}
            <div className="mb-4 grid grid-cols-5 gap-2">
              {MESSAGE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedMessageTypeId(type.id)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all',
                    selectedMessageTypeId === type.id ? type.color : 'border-border bg-white hover:border-gray-300'
                  )}
                >
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', selectedMessageTypeId === type.id ? 'bg-white/70' : 'bg-muted')}>
                    {type.icon}
                  </div>
                  <p className="text-[11px] font-semibold leading-tight">{type.name}</p>
                </button>
              ))}
            </div>

            {selectedMessageType && (
              <div className="mb-4 rounded-lg border border-border bg-gray-50 px-4 py-2.5 text-xs text-muted-foreground">
                {selectedMessageType.details}
              </div>
            )}

            {/* 메시지 내용 */}
            {selectedMessageTypeId === 'text' && (
              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-white p-4">
                  <label className="mb-1.5 block text-xs font-medium">헤더 텍스트 <span className="text-muted-foreground">(선택)</span></label>
                  <input
                    type="text"
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    placeholder="상단 헤더 문구"
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="rounded-xl border border-border bg-white p-4">
                  <div className="mb-1.5 flex justify-between">
                    <label className="text-xs font-medium">본문 내용 <span className="text-red-500">*</span></label>
                    <span className={cn('text-xs', bodyText.length > 380 ? 'text-red-500' : 'text-muted-foreground')}>{bodyText.length}/400</span>
                  </div>
                  <textarea
                    rows={6}
                    value={bodyText}
                    onChange={(e) => { if (e.target.value.length <= 400) setBodyText(e.target.value); }}
                    placeholder={'메시지 본문을 입력하세요\n\n변수 사용: #{고객명}, #{쿠폰코드} 등'}
                    className="w-full resize-none rounded-lg border border-border p-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="rounded-xl border border-border bg-white p-4">
                  <ButtonBuilder buttons={buttons} maxButtons={5} onChange={setButtons} />
                </div>
              </div>
            )}

            {(selectedMessageTypeId === 'image' || selectedMessageTypeId === 'wide-image') && (
              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-white p-4">
                  <label className="mb-2 block text-xs font-medium">
                    이미지 업로드 <span className="text-red-500">*</span>
                    <span className="ml-1 font-normal text-muted-foreground">({selectedMessageType?.imageSpec})</span>
                  </label>
                  <ImageUploadBox
                    label="이미지를 드래그하거나 클릭하세요"
                    spec={`권장 ${selectedMessageType?.imageSpec} · JPG/PNG · 최대 5MB`}
                    uploaded={imageUploaded}
                    onToggle={() => setImageUploaded((v) => !v)}
                  />
                </div>
                <div className="rounded-xl border border-border bg-white p-4">
                  <div className="mb-1.5 flex justify-between">
                    <label className="text-xs font-medium">본문 내용 <span className="text-red-500">*</span></label>
                    <span className={cn('text-xs', bodyText.length > (selectedMessageType?.maxChars ?? 400) - 20 ? 'text-red-500' : 'text-muted-foreground')}>
                      {bodyText.length}/{selectedMessageType?.maxChars}
                    </span>
                  </div>
                  <textarea
                    rows={selectedMessageTypeId === 'wide-image' ? 3 : 5}
                    value={bodyText}
                    onChange={(e) => {
                      const max = selectedMessageType?.maxChars ?? 400;
                      if (e.target.value.length <= max) setBodyText(e.target.value);
                    }}
                    placeholder={'이미지 아래 본문을 입력하세요\n\n변수 사용: #{고객명}, #{쿠폰코드} 등'}
                    className="w-full resize-none rounded-lg border border-border p-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="rounded-xl border border-border bg-white p-4">
                  <ButtonBuilder buttons={buttons} maxButtons={selectedMessageType?.maxButtons ?? 2} onChange={setButtons} />
                </div>
              </div>
            )}

            {selectedMessageTypeId === 'wide-item-list' && (
              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-xs font-medium">아이템 목록 <span className="text-red-500">*</span> <span className="font-normal text-muted-foreground">(2~4개)</span></label>
                    {wideItems.length < 4 && (
                      <button onClick={addWideItem} className="flex items-center gap-1 rounded-lg border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary">
                        <Plus size={11} /> 아이템 추가
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {wideItems.map((item, idx) => (
                      <div key={item.id} className="flex gap-3 rounded-lg border border-border p-3">
                        <div
                          onClick={() => setWideItems((prev) => prev.map((w) => w.id === item.id ? { ...w, imageUploaded: !w.imageUploaded } : w))}
                          className={cn('flex h-14 w-14 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-xs', item.imageUploaded ? 'border-green-400 bg-green-50 text-green-600' : 'border-border text-muted-foreground hover:border-gray-400')}
                        >
                          {item.imageUploaded ? <Check size={14} /> : <Image size={14} />}
                        </div>
                        <div className="flex flex-1 flex-col gap-1.5">
                          <p className="text-[10px] text-muted-foreground">아이템 {idx + 1}</p>
                          <input type="text" value={item.title} onChange={(e) => setWideItems((prev) => prev.map((w) => w.id === item.id ? { ...w, title: e.target.value } : w))} placeholder="타이틀" className="rounded-md border border-border px-2.5 py-1.5 text-xs outline-none focus:border-primary" />
                          <input type="text" value={item.description} onChange={(e) => setWideItems((prev) => prev.map((w) => w.id === item.id ? { ...w, description: e.target.value } : w))} placeholder="설명" className="rounded-md border border-border px-2.5 py-1.5 text-xs outline-none focus:border-primary" />
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
                <div className="rounded-xl border border-border bg-white p-4">
                  <div className="mb-1.5 flex justify-between">
                    <label className="text-xs font-medium">본문 내용 <span className="text-red-500">*</span></label>
                    <span className="text-xs text-muted-foreground">{bodyText.length}/400</span>
                  </div>
                  <textarea rows={4} value={bodyText} onChange={(e) => { if (e.target.value.length <= 400) setBodyText(e.target.value); }} placeholder="리스트 하단 본문을 입력하세요" className="w-full resize-none rounded-lg border border-border p-3 text-sm outline-none focus:border-primary" />
                </div>
                <div className="rounded-xl border border-border bg-white p-4">
                  <ButtonBuilder buttons={buttons} maxButtons={2} onChange={setButtons} />
                </div>
              </div>
            )}

            {selectedMessageTypeId === 'carousel' && (
              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-white p-4">
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
                      <div key={card.id} className="min-w-[180px] flex-shrink-0 rounded-xl border border-border bg-gray-50 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-muted-foreground">카드 {idx + 1}</span>
                          {carouselCards.length > 2 && (
                            <button onClick={() => removeCarouselCard(card.id)} className="text-muted-foreground hover:text-red-500"><Trash2 size={11} /></button>
                          )}
                        </div>
                        <div
                          onClick={() => setCarouselCards((prev) => prev.map((c) => c.id === card.id ? { ...c, imageUploaded: !c.imageUploaded } : c))}
                          className={cn('mb-2 flex h-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-xs', card.imageUploaded ? 'border-green-400 bg-green-50 text-green-600' : 'border-border text-muted-foreground')}
                        >
                          {card.imageUploaded ? <><Check size={13} /><span className="ml-1">이미지</span></> : <><Image size={13} /><span className="ml-1">500×500px</span></>}
                        </div>
                        <input type="text" value={card.title} onChange={(e) => setCarouselCards((prev) => prev.map((c) => c.id === card.id ? { ...c, title: e.target.value } : c))} placeholder="타이틀" className="mb-1.5 w-full rounded-md border border-border bg-white px-2 py-1.5 text-xs outline-none focus:border-primary" />
                        <input type="text" value={card.description} onChange={(e) => setCarouselCards((prev) => prev.map((c) => c.id === card.id ? { ...c, description: e.target.value } : c))} placeholder="설명" className="mb-2 w-full rounded-md border border-border bg-white px-2 py-1.5 text-xs outline-none focus:border-primary" />
                        <ButtonBuilder buttons={card.buttons} maxButtons={2} onChange={(btns) => setCarouselCards((prev) => prev.map((c) => c.id === card.id ? { ...c, buttons: btns } : c))} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 쿠폰 연동 */}
            {selectedMessageTypeId && (
              <div className="mt-3 rounded-xl border border-border bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium">쿠폰 연동 <span className="text-muted-foreground">(선택)</span></p>
                    <p className="text-[10px] text-muted-foreground">메시지에 쿠폰을 포함하여 발송합니다</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCouponEnabled((v) => !v)}
                    className={cn('relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors', couponEnabled ? 'bg-foreground' : 'bg-gray-200')}
                  >
                    <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', couponEnabled ? 'translate-x-4' : 'translate-x-0')} />
                  </button>
                </div>
                {couponEnabled && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[10px] text-muted-foreground">쿠폰명</label>
                      <input type="text" value={couponName} onChange={(e) => setCouponName(e.target.value)} placeholder="예) 봄맞이 10% 할인" className="w-full rounded-lg border border-border px-3 py-2 text-xs outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] text-muted-foreground">유효기간</label>
                      <input type="date" className="w-full rounded-lg border border-border px-3 py-2 text-xs outline-none focus:border-primary" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 4: 발송 설정 ── */}
        {currentStep === 4 && (
          <div>
            <h2 className="mb-4 text-base font-semibold">발송 일정을 설정해주세요</h2>
            <div className="space-y-3">
              {[
                { id: 'now' as const, icon: '⚡', label: '즉시 발송', sub: '저장 즉시 메시지를 발송합니다' },
                { id: 'reserved' as const, icon: '📅', label: '예약 발송', sub: '지정한 날짜와 시간에 자동 발송합니다' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSendOption(opt.id)}
                  className={cn('flex w-full items-center gap-4 rounded-xl border-2 p-5 text-left transition-all', sendOption === opt.id ? 'border-foreground bg-gray-50' : 'border-border hover:border-gray-300')}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <p className="font-medium">{opt.label}</p>
                    <p className="text-sm text-muted-foreground">{opt.sub}</p>
                  </div>
                  {sendOption === opt.id && (
                    <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
                      <Check size={11} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
              {sendOption === 'reserved' && (
                <div className="ml-12 rounded-xl border border-border bg-white p-4">
                  <div className="flex gap-4">
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">날짜</label>
                      <input type="date" value={sendDate} onChange={(e) => setSendDate(e.target.value)} className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">시간</label>
                      <input type="time" value={sendTime} onChange={(e) => setSendTime(e.target.value)} className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 5: 최종 확인 ── */}
        {currentStep === 5 && (
          <div>
            <h2 className="mb-1 text-base font-semibold">발송 전 최종 확인</h2>
            <p className="mb-5 text-xs text-muted-foreground">아래 내용을 확인하고 발송하세요</p>
            <div className="space-y-3">
              {/* 요약 카드 */}
              <div className="rounded-xl border border-border bg-white p-5">
                <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">캠페인 정보</p>
                <div className="space-y-2.5 text-sm">
                  {[
                    { label: '캠페인명', value: campaignName || '-' },
                    { label: '캠페인 유형', value: selectedCampaignType?.name || '-' },
                    { label: '메시지 유형', value: selectedMessageType?.name || '-' },
                    { label: '수신 대상', value: selectedCampaignType?.id === 'birthday' ? '생일 고객 (자동)' : `${recipientFilter.grade} 등급` },
                    { label: '버튼 수', value: `${buttons.length}개` },
                    { label: '쿠폰 연동', value: couponEnabled ? couponName || '설정됨' : '없음' },
                    { label: '발송 방식', value: sendOption === 'now' ? '즉시 발송' : `예약 발송 · ${sendDate} ${sendTime}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="w-24 text-xs text-muted-foreground">{label}</span>
                      <span className="text-xs font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 예상 비용 */}
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                <p className="mb-2 text-xs font-semibold text-amber-700">예상 발송 비용</p>
                <div className="flex items-end justify-between">
                  <div className="space-y-1 text-xs text-amber-700">
                    <p>대상 고객 수: 약 {recipientFilter.grade === '전체' ? '3,200' : '320'}명</p>
                    <p>건당 단가: 15 포인트</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-amber-600">총 예상 비용</p>
                    <p className="text-xl font-bold text-amber-700">{estimatedCost} P</p>
                  </div>
                </div>
              </div>

              {/* 주의사항 */}
              <div className="rounded-xl border border-border bg-gray-50 p-4 text-xs text-muted-foreground">
                <p className="mb-1.5 font-medium text-foreground">발송 전 체크리스트</p>
                <ul className="space-y-1 list-disc pl-4">
                  <li>메시지 내용에 오탈자가 없는지 확인하세요</li>
                  <li>수신 거부 고객은 자동으로 제외됩니다</li>
                  <li>발송 후 취소는 예약 발송만 가능합니다</li>
                </ul>
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
            {currentStep < 5 ? (
              <button
                onClick={() => { if (canNext[currentStep]) setCurrentStep((prev) => prev + 1); }}
                disabled={!canNext[currentStep]}
                className={cn(
                  'rounded-lg px-5 py-2.5 text-sm font-medium transition-colors',
                  canNext[currentStep] ? 'bg-foreground text-white hover:bg-gray-800' : 'cursor-not-allowed bg-muted text-muted-foreground'
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
