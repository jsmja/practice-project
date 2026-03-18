import {
  Filter,
  RefreshCw,
  UserCheck,
  Heart,
  Gift,
  Star,
  Check,
  UserX,
  ShoppingCart,
  PackageX,
  Users,
  CalendarHeart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ICampaignSubType {
  id: string;
  label: string;
}

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
  /** 서브타입 옵션 (없으면 서브타입 선택 불필요) */
  subTypes?: ICampaignSubType[];
}

export const CAMPAIGN_TYPES: ICampaignType[] = [
  {
    id: 'custom',
    name: '커스텀 캠페인',
    subtitle: '전체 고객 대상',
    description: '나에게 맞는 캠페인이 없다면? 나만의 캠페인을 제작해 보세요!',
    icon: <Filter size={22} />,
    gradient: 'from-slate-500 to-slate-700',
    iconBg: 'bg-slate-100 text-slate-600',
    hashtags: ['#원하는대로커스텀', '#자유로운알림설정'],
    filters: ['grade', 'joinDate', 'lastVisit', 'cartOwnership', 'purchaseStatus'],
  },
  {
    id: 'welcome-back',
    name: '웰컴백 캠페인',
    subtitle: '장기 미접속 고객',
    description: '오랫동안 방문하지 않은 고객을 다시 불러오세요',
    icon: <RefreshCw size={22} />,
    gradient: 'from-blue-500 to-indigo-600',
    iconBg: 'bg-blue-100 text-blue-600',
    hashtags: ['#웰컴백이벤트', '#다시만나반가워요', '#휴면회원전환'],
    filters: ['grade', 'dormantPeriod'],
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
    filters: ['grade', 'joinDate', 'lastVisit', 'purchaseStatus'],
    subTypes: [
      { id: 'new-member-30', label: '신규회원 이탈방지\n30일' },
      { id: 'new-member-custom', label: '신규회원 이탈방지\n자유 설정' },
    ],
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
  {
    id: 'long-inactive',
    name: '장기 미접속 이탈방지',
    subtitle: '장기 미접속 고객',
    description: '오랫동안 접속하지 않은 고객에게 복귀 혜택을 제공하여 이탈을 방지하세요',
    icon: <UserX size={22} />,
    gradient: 'from-red-500 to-rose-600',
    iconBg: 'bg-red-100 text-red-600',
    hashtags: ['#잠자는고객을깨워라', '#고객이떠나지않도록'],
    filters: ['grade', 'joinDate', 'lastVisit'],
    subTypes: [
      { id: 'long-inactive-2m', label: '장기 미접속 이탈방지\n2개월' },
      { id: 'long-inactive-custom', label: '장기 미접속 이탈방지\n자유 설정' },
    ],
  },
  {
    id: 'cart-reminder',
    name: '장바구니 리마인딩',
    subtitle: '장바구니 보유 고객',
    description: '장바구니에 상품을 담아둔 고객에게 구매를 유도하는 리마인드 메시지를 보내세요',
    icon: <ShoppingCart size={22} />,
    gradient: 'from-cyan-500 to-blue-600',
    iconBg: 'bg-cyan-100 text-cyan-600',
    hashtags: ['#잊고있던상품알려주기'],
    filters: ['grade', 'joinDate', 'lastVisit', 'cartOwnership', 'cartPeriod'],
    subTypes: [
      { id: 'cart-1-3', label: '장바구니 리마인딩\n1-3일' },
      { id: 'cart-4-7', label: '장바구니 리마인딩\n4-7일' },
      { id: 'cart-custom', label: '장바구니 리마인딩\n자유 설정' },
    ],
  },
  {
    id: 'long-no-purchase',
    name: '장기 미구매 구매 유도',
    subtitle: '장기 미구매 고객',
    description: '한동안 구매가 없는 고객에게 특별 할인으로 재구매를 이끌어 내세요',
    icon: <PackageX size={22} />,
    gradient: 'from-orange-500 to-red-600',
    iconBg: 'bg-orange-100 text-orange-600',
    hashtags: ['#잊고있던상품알려주기'],
    filters: ['grade', 'joinDate', 'lastVisit', 'cartOwnership', 'purchaseStatus', 'purchaseHistory'],
    subTypes: [
      { id: 'no-purchase-2m', label: '장기 미구매 구매 유도\n2개월' },
      { id: 'no-purchase-6m', label: '장기 미구매 구매 유도\n6개월' },
      { id: 'no-purchase-custom', label: '장기 미구매 구매 유도\n자유 설정' },
    ],
  },
  {
    id: 'all-friends',
    name: '전체 친구 대상',
    subtitle: '카카오톡 전체 친구',
    description: '카카오톡 채널의 모든 친구에게 공지, 이벤트 등 대량 메시지를 발송하세요',
    icon: <Users size={22} />,
    gradient: 'from-indigo-500 to-violet-600',
    iconBg: 'bg-indigo-100 text-indigo-600',
    hashtags: ['#대량메시지발송', '#회원가입무관', '#높은도달률'],
    filters: [],
  },
  {
    id: 'seasonal',
    name: '시즌 캠페인',
    subtitle: '시즌별 이벤트 고객',
    description: '크리스마스, 빼빼로데이, 발렌타인 등 시즌에 맞춘 특별 캠페인을 발송하세요',
    icon: <CalendarHeart size={22} />,
    gradient: 'from-rose-500 to-pink-600',
    iconBg: 'bg-rose-100 text-rose-600',
    hashtags: ['#시즌이벤트', '#크리스마스', '#빼빼로데이'],
    filters: ['grade', 'joinDate', 'lastVisit', 'purchaseStatus'],
    subTypes: [
      { id: 'season-christmas', label: '크리스마스' },
      { id: 'season-pepero', label: '빼빼로데이' },
      { id: 'season-valentine', label: '발렌타인데이' },
      { id: 'season-chuseok', label: '추석' },
      { id: 'season-newyear', label: '새해' },
      { id: 'season-custom', label: '자유 설정' },
    ],
  },
];

interface ICampaignTypeStepProps {
  selectedTypeId: string | null;
  onSelectType: (typeId: string) => void;
  selectedSubTypeId: string | null;
  onSelectSubType: (subTypeId: string) => void;
}

export function CampaignTypeStep({ selectedTypeId, onSelectType, selectedSubTypeId, onSelectSubType }: ICampaignTypeStepProps) {
  const selectedType = CAMPAIGN_TYPES.find((t) => t.id === selectedTypeId);
  const hasSubTypes = selectedType?.subTypes && selectedType.subTypes.length > 0;

  return (
    <div>
      <h2 className="mb-1 text-base font-semibold">어떤 캠페인을 만드시겠어요?</h2>
      <p className="mb-5 text-xs text-muted-foreground">목적에 맞는 캠페인 유형을 선택하면 최적의 설정을 안내해 드려요</p>
      <div className="grid grid-cols-2 gap-3">
        {CAMPAIGN_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelectType(type.id)}
            className={cn(
              'relative flex items-start gap-4 overflow-hidden rounded-xl border-2 p-4 text-left transition-all',
              selectedTypeId === type.id
                ? 'border-primary bg-gray-50 shadow-sm'
                : 'border-border bg-white hover:border-gray-300 hover:shadow-sm'
            )}
          >
            <div className={cn('absolute left-0 top-0 h-full w-1 bg-gradient-to-b', type.gradient)} />
            <div className={cn('mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl', type.iconBg)}>
              {type.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">{type.name}</p>
              <p className="text-xs text-muted-foreground">{type.subtitle}</p>
              <p className="mt-1.5 text-xs leading-snug text-muted-foreground">{type.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {type.hashtags.map((tag) => (
                  <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-muted-foreground">{tag}</span>
                ))}
              </div>
            </div>
            {selectedTypeId === type.id && (
              <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                <Check size={11} className="text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* 서브타입 선택 */}
      {hasSubTypes && (
        <div className="mt-6 flex gap-3">
          {selectedType.subTypes!.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onSelectSubType(sub.id)}
              className={cn(
                'relative flex-1 rounded-xl border-2 px-4 py-5 text-center text-sm font-medium whitespace-pre-line transition-all',
                selectedSubTypeId === sub.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border/60 hover:border-primary/30'
              )}
            >
              {sub.label}
              {selectedSubTypeId === sub.id && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check size={11} className="text-white" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
