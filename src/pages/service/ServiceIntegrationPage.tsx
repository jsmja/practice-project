import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/common/Badge';
import { cn } from '@/lib/utils';
import {
  ShoppingBag,
  Instagram,
  Youtube,
  MessageCircle,
  Zap,
  CheckCircle,
  ArrowRight,
  Info,
} from 'lucide-react';

const SERVICES = [
  { icon: <ShoppingBag size={24} />, label: '커머스', sub: '카페24', connected: true },
  { icon: <Instagram size={24} />, label: '소셜미디어', sub: '인스타그램', connected: false },
  { icon: <Youtube size={24} />, label: '소셜미디어', sub: '유튜브', connected: false },
  { icon: <MessageCircle size={24} />, label: '부가 서비스(유료)', sub: '채팅상담', connected: false },
  { icon: <Zap size={24} />, label: '기본 서비스', sub: '헤이데어', connected: true },
  { icon: <CheckCircle size={24} />, label: '부가 서비스(유료)', sub: '마케팅 수신 동의', connected: true },
];

const KAKAO_SERVICES = [
  { name: '알림톡', status: '정상', statusType: 'success' as const, date: '서비스 신청일 : 2023-09-18 17:27' },
  { name: '친구톡', status: '계정확인완료', statusType: 'success' as const, date: '서비스 신청일 : 2023-10-20 10:27' },
  { name: '브랜드 메시지', status: '미사용', statusType: 'default' as const, date: null },
];

export function ServiceIntegrationPage() {
  return (
    <div>
      <PageHeader title="서비스 연동" />

      {/* 기존 서비스 카드 */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {SERVICES.map((service, idx) => (
          <div
            key={idx}
            className="flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-white p-4 transition-colors hover:border-gray-300"
          >
            <div className="text-gray-500">{service.icon}</div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{service.label}</p>
              <p className="text-sm font-medium">{service.sub}</p>
            </div>
            {service.connected && <Badge variant="success">연동됨</Badge>}
            <ArrowRight size={16} className="text-muted-foreground" />
          </div>
        ))}
      </div>

      {/* 채널현황 */}
      <section className="mb-6 rounded-xl border border-border bg-white p-6">
        <h3 className="mb-4 flex items-center gap-1.5 text-base font-semibold">
          채널현황 <Info size={14} className="text-muted-foreground" />
        </h3>
        <div className="rounded-lg border border-border p-5">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">연결 계정</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold">카카오톡 채널</span>
                <Badge variant="default">일반</Badge>
              </div>
              <p className="mt-0.5 text-sm text-blue-600">@luna_crm</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  정상
                </span>
                <span className="text-xs text-muted-foreground">서비스 신청일 : 2023-09-18 17:27</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 서비스 현황 */}
      <section className="mb-6 rounded-xl border border-border bg-white p-6">
        <h3 className="mb-4 text-base font-semibold">서비스 현황</h3>
        <p className="mb-3 text-sm font-medium text-muted-foreground">서비스 목록</p>
        <div className="space-y-3">
          {KAKAO_SERVICES.map((service) => (
            <div key={service.name} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">{service.name}</span>
                <Info size={14} className="text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3">
                <span className={cn('inline-flex items-center gap-1 text-xs', service.statusType === 'success' ? 'text-green-600' : 'text-muted-foreground')}>
                  <span className={cn('h-2 w-2 rounded-full', service.statusType === 'success' ? 'bg-green-500' : 'bg-gray-400')} />
                  {service.status}
                </span>
                {service.date && (
                  <span className="text-xs text-muted-foreground">{service.date}</span>
                )}
                {!service.date && (
                  <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted">
                    신청하기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 주의사항 */}
      <section className="rounded-xl border border-border bg-white p-6">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold">
          <Info size={16} className="text-blue-500" />
          주의사항
        </h3>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <p className="mb-1 font-semibold text-foreground">카카오채널</p>
            <ul className="list-inside space-y-0.5 text-xs">
              <li>· 카카오 채널은 비즈니스 인증을 받은 채널만 연동 가능해요.</li>
              <li>· 타 업체에서 이미 카카오 알림톡 서비스를 사용하고 있다면, 해당 업체에 등록했던 카카오 채널 이름으로 서비스를 신청할 경우 알림톡이 중복 발송될 수 있어요.</li>
            </ul>
          </div>
          <div>
            <p className="mb-1 font-semibold text-foreground">알림톡/친구톡</p>
            <ul className="list-inside space-y-0.5 text-xs">
              <li>· SMS를 충전하여 이용하는 서비스에요. 알림톡 1건당 SMS 충전 수 0.7건이 차감돼요.</li>
              <li>· 친구톡 캠페인은 1건당 SMS 충전 수에서 텍스트형 1.9건 차감, 이미지형은 2.2건 차감돼요.</li>
              <li>· 알림톡은 광고성 메시지가 아니어서 고객의 수신 동의가 필요하지 않아요.</li>
              <li>· 알림톡 메시지 내용은 카카오의 검수를 반드시 받아야 해요.</li>
              <li>· 카카오 알림톡 발송 실패 후 SMS로 대체 발송될 경우, 쇼핑몰에서 설정한 SMS 메시지 내용으로 자동 발송되어요.</li>
            </ul>
          </div>
          <div>
            <p className="mb-1 font-semibold text-foreground">브랜드 메시지</p>
            <ul className="list-inside space-y-0.5 text-xs">
              <li>· 카카오 비즈니스 인증 채널만 사용할 수 있어요.</li>
              <li>· 채널 친구가 아닌 쇼핑몰 회원에게도 메시지를 보내려면 추가 조건들이 필요해요.</li>
              <li>· 브랜드 메시지는 발송 실패되더라도 SMS로 대체되지 않아요.</li>
              <li>· 반드시 광고성 정보 수신 동의를 받은 사용자에게만 메시지를 발송해야 해요.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
