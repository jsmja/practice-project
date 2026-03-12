import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Badge } from '@/components/common/Badge';
import {
  MessageSquare,
  Send,
  CheckCircle,
  Coins,
  ShoppingBag,
  Instagram,
  Youtube,
  MessageCircle,
  Zap,
  ArrowRight,
} from 'lucide-react';

const SERVICE_LINKS = [
  { icon: <ShoppingBag size={20} />, label: '커머스', sub: '카페24', color: 'text-blue-600' },
  { icon: <Instagram size={20} />, label: '소셜미디어', sub: '인스타그램', color: 'text-pink-500' },
  { icon: <Youtube size={20} />, label: '소셜미디어', sub: '유튜브', color: 'text-red-500' },
  { icon: <MessageCircle size={20} />, label: '부가 서비스(유료)', sub: '채팅상담', color: 'text-gray-600' },
  { icon: <Zap size={20} />, label: '기본 서비스', sub: '헤이데어', color: 'text-amber-500' },
  { icon: <CheckCircle size={20} />, label: '부가 서비스(유료)', sub: '마케팅 수신 동의', color: 'text-green-500' },
  { icon: <MessageSquare size={20} />, label: '카카오채널', sub: '알림톡/친구톡', color: 'text-yellow-500', isNew: true },
];

export function DashboardPage() {
  return (
    <div>
      <PageHeader title="대시보드" />

      {/* 헤이보드 현황 + 마케팅 현황 */}
      <div className="mb-6 grid grid-cols-2 gap-6">
        {/* 헤이보드 현황 */}
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">헤이보드 현황 ⓘ</h3>
            <button className="text-xs text-muted-foreground hover:underline">상세보기</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">사용 중인 헤이보드</p>
              <p className="mt-1 text-xl font-bold">1개</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">사용 중인 헤이버튼</p>
              <p className="mt-1 text-xl font-bold">2개</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">사용 중인 카드</p>
              <p className="mt-1 text-xl font-bold">11개</p>
            </div>
          </div>
        </div>

        {/* 마케팅 현황 */}
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">마케팅 현황 ⓘ</h3>
            <button className="text-xs text-muted-foreground hover:underline">상세보기</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">진행중 마케팅</p>
              <p className="mt-1 text-xl font-bold">0건</p>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">마케팅 수신 동의 전환 수 ⓘ</p>
                <p className="mt-1 text-xl font-bold">1명</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CRM 현황 (NEW) */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">CRM 발송 현황</h3>
          <Badge variant="kakao">NEW</Badge>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            title="오늘 발송 건수"
            value="0건"
            icon={<Send size={18} />}
          />
          <StatCard
            title="발송 성공률"
            value="0%"
            description="최근 7일 기준"
            icon={<CheckCircle size={18} />}
          />
          <StatCard
            title="이번 달 총 발송"
            value="0건"
            icon={<MessageSquare size={18} />}
          />
          <StatCard
            title="잔여 포인트"
            value="0P"
            description="충전하기 →"
            icon={<Coins size={18} />}
          />
        </div>
      </div>

      {/* 서비스 연동 현황 */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-foreground">서비스 연동 현황 ⓘ</h3>
        <div className="flex gap-3 overflow-x-auto">
          {SERVICE_LINKS.map((service, idx) => (
            <div
              key={idx}
              className="flex min-w-[160px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 transition-colors hover:border-gray-300"
            >
              <div className={service.color}>{service.icon}</div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{service.label}</p>
                <p className="flex items-center gap-1 text-sm font-medium">
                  {service.sub}
                  {service.isNew && (
                    <Badge variant="kakao" className="text-[10px]">NEW</Badge>
                  )}
                </p>
              </div>
              <ArrowRight size={14} className="text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>

      {/* 서비스 통계 */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">서비스 통계 ⓘ</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <button className="rounded-md border border-border px-2 py-1 hover:bg-muted">어제</button>
            <button className="rounded-md border border-primary bg-primary px-2 py-1 text-primary-foreground">일주일</button>
            <button className="rounded-md border border-border px-2 py-1 hover:bg-muted">이번달</button>
            <span className="ml-2">📅 2026-03-04 ~ 2026-03-10</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="mb-2 text-xs text-muted-foreground">🔥 헤이버튼 클릭 사용자 ⓘ</p>
            <p className="text-2xl font-bold">0</p>
            <p className="mt-1 text-xs text-muted-foreground">비교할 데이터가 없습니다.</p>
            <div className="mt-4 h-32 rounded-lg bg-gray-50" />
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="mb-2 text-xs text-muted-foreground">⏱ 헤이버튼 체류 시간 ⓘ</p>
            <p className="text-2xl font-bold">00:00:00 <span className="text-sm font-normal text-muted-foreground">평균</span></p>
            <p className="mt-1 text-xs text-muted-foreground">최소00:00:00 최대00:00:00</p>
            <div className="mt-4 h-32 rounded-lg bg-gray-50" />
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="mb-3 text-xs text-muted-foreground">헤이버튼 클릭 TOP 3 ⓘ</p>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="py-1 text-left">헤이보드명</th>
                  <th className="py-1 text-left">헤이버튼명</th>
                  <th className="py-1 text-right">클릭률</th>
                  <th className="py-1 text-right">클릭 수</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((rank) => (
                  <tr key={rank} className="border-t border-border">
                    <td className="py-1.5">
                      <Badge variant={rank === 1 ? 'info' : rank === 2 ? 'success' : 'warning'}>
                        TOP {rank}
                      </Badge>
                    </td>
                    <td className="py-1.5">-</td>
                    <td className="py-1.5 text-right">0%</td>
                    <td className="py-1.5 text-right">0</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
