import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  RefreshCw,
  UserCheck,
  MessageSquare,
  Instagram,
  Youtube,
  MessageCircle,
  Info,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/lib/utils';

interface IServiceBadge {
  label: string;
  className: string;
}

interface IServiceItem {
  id: string;
  iconBg: string;
  iconContent: ReactNode;
  name: string;
  isNew?: boolean;
  badges?: IServiceBadge[];
  description: string;
  extraNote?: string;
  actionType: 'chevron' | 'apply' | 'update' | 'none';
  path?: string;
}

export function ServiceIntegrationPage() {
  const navigate = useNavigate();

  const SERVICES: IServiceItem[] = [
    {
      id: 'heythere',
      iconBg: 'bg-gray-900',
      iconContent: <span className="text-[10px] font-bold text-white">Hey</span>,
      name: '헤이데어',
      badges: [
        { label: '기본', className: 'rounded bg-gray-100 px-1.5 py-0.5 text-xs text-muted-foreground' },
      ],
      description: "사이트에 헤이데어 스크립트 삽입 필수입니다. (카페24의 경우 '플러그인 설치'를 진행해주세요.)",
      actionType: 'chevron',
    },
    {
      id: 'marketing-consent',
      iconBg: 'bg-blue-50',
      iconContent: <UserCheck size={20} className="text-blue-600" />,
      name: '마케팅 수신 동의',
      isNew: true,
      badges: [
        { label: '유료', className: 'rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground' },
        { label: '유료 사용중', className: 'text-xs font-medium text-green-600' },
        { label: '만료일 27.03.10', className: 'text-xs font-medium text-red-500' },
      ],
      description: '마케팅 수신 동의한 고객에게 매력적인 수신유도용 마케팅 메시지를 사용할 수 있어요.',
      extraNote: '사용 해지를 원하실 경우 [고객센터]로 문의주세요.',
      actionType: 'none',
    },
    {
      id: 'chat-support',
      iconBg: 'bg-gray-900',
      iconContent: <MessageSquare size={18} className="text-white" />,
      name: '채팅상담',
      isNew: true,
      badges: [
        { label: '무료/유료', className: 'rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground' },
        { label: '무료 사용중', className: 'text-xs font-medium text-green-600' },
      ],
      description:
        '카카오 / 네이버 / 해피톡 고객용 채팅상담 서비스를 사용할 수 있어요. 무료는 100건, 유료는 무제한으로 사용하실 수 있어요.',
      actionType: 'chevron',
    },
    {
      id: 'kakao-brand-message',
      iconBg: 'bg-yellow-400',
      iconContent: <MessageCircle size={18} className="text-white" />,
      name: '카카오 브랜드메시지',
      badges: [
        { label: '메시지', className: 'rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700' },
        { label: '미신청', className: 'text-xs text-muted-foreground' },
      ],
      description:
        '카카오톡 채널 친구 및 수신 동의 회원에게 다양한 마케팅 메시지를 발송할 수 있어요.',
      actionType: 'apply',
      path: '/service-integration/kakao-message',
    },
    {
      id: 'cafe24',
      iconBg: 'border border-border bg-white',
      iconContent: <span className="text-[9px] font-bold text-gray-500">cafe24</span>,
      name: '카페24',
      badges: [{ label: '인증 만료 13일 전', className: 'text-xs font-medium text-red-500' }],
      description: '카페24의 고객 정보를 바탕으로 마케팅 메시지를 보낼 수 있어요.',
      actionType: 'chevron',
    },
    {
      id: 'instagram',
      iconBg: 'border border-border bg-white',
      iconContent: <Instagram size={20} className="text-pink-500" />,
      name: '인스타그램',
      badges: [{ label: '인증 만료 11일 전', className: 'text-xs font-medium text-red-500' }],
      description: '인스타그램 피드를 연동하여 마케팅에 활용할 수 있습니다.',
      actionType: 'update',
    },
    {
      id: 'youtube',
      iconBg: 'border border-border bg-white',
      iconContent: <Youtube size={20} className="text-red-500" />,
      name: '유튜브',
      description: '유튜브 채널의 특정 영상을 마케팅에 활용할 수 있습니다.',
      actionType: 'chevron',
    },
  ];

  const handleRowClick = (item: IServiceItem) => {
    if (item.actionType === 'none') return;
    if (item.path) navigate(item.path);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="서비스 연동" description="웹사이트에 서비스를 연동해 보세요." />

      <h3 className="mb-3 text-sm font-semibold">연동 서비스</h3>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        {SERVICES.map((item, idx) => (
          <div key={item.id}>
            <div
              onClick={() => handleRowClick(item)}
              className={cn(
                'flex items-center gap-4 px-5 py-4',
                item.actionType !== 'none' && 'cursor-pointer transition-colors hover:bg-gray-50',
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl',
                  item.iconBg,
                )}
              >
                {item.iconContent}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-sm font-semibold">{item.name}</span>
                  {item.isNew && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                      N
                    </span>
                  )}
                  {item.badges?.map((badge, bIdx) => (
                    <span key={bIdx} className={badge.className}>
                      {badge.label}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                {item.extraNote && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.extraNote}</p>
                )}
              </div>

              {/* Actions */}
              <div
                className="flex flex-shrink-0 items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {item.actionType === 'apply' && (
                  <button
                    onClick={() => item.path && navigate(item.path)}
                    className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-600"
                  >
                    신청하기
                  </button>
                )}
                {item.actionType === 'update' && (
                  <button className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted">
                    업데이트 <RefreshCw size={11} />
                  </button>
                )}
                {item.actionType !== 'none' && (
                  <ChevronRight size={16} className="text-muted-foreground" />
                )}
              </div>
            </div>
            {idx < SERVICES.length - 1 && <div className="mx-5 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* 서비스 이용 안내 */}
      <section className="mt-6 rounded-xl border border-border bg-white p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Info size={15} className="text-blue-500" />
          서비스 이용 안내
        </h3>
        <div className="space-y-3 text-xs text-muted-foreground">
          <div>
            <p className="mb-1 font-semibold text-foreground">카카오 브랜드메시지</p>
            <ul className="space-y-0.5">
              <li>· 카카오 비즈니스 인증 채널만 사용할 수 있어요.</li>
              <li>· 반드시 광고성 정보 수신 동의를 받은 사용자에게만 메시지를 발송해야 해요.</li>
              <li>· 브랜드 메시지는 발송 실패되더라도 SMS로 대체되지 않아요.</li>
            </ul>
          </div>
          <div>
            <p className="mb-1 font-semibold text-foreground">채팅상담</p>
            <ul className="space-y-0.5">
              <li>· 카카오, 네이버, 해피톡 연동이 가능해요.</li>
              <li>· 무료 플랜은 하루 100건까지 노출되며 이후 버튼이 비노출돼요.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
