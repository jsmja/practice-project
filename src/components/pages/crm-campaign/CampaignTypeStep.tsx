import {
  Filter,
  RefreshCw,
  UserCheck,
  Heart,
  Gift,
  Star,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

export const CAMPAIGN_TYPES: ICampaignType[] = [
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

interface ICampaignTypeStepProps {
  selectedTypeId: string | null;
  onSelectType: (typeId: string) => void;
}

export function CampaignTypeStep({ selectedTypeId, onSelectType }: ICampaignTypeStepProps) {
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
                ? 'border-foreground bg-gray-50 shadow-sm'
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
              <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
                <Check size={11} className="text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
