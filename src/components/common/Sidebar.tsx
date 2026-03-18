import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CirclePlus,
  Contact,
  Megaphone,
  Network,
  BarChart2,
  UserRound,
  CreditCard,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Copy,
} from 'lucide-react';


interface IMenuChildItem {
  label: string;
  path: string;
  highlight?: boolean;
}

interface IMenuItem {
  label: string;
  icon?: React.ReactNode;
  path?: string;
  highlight?: boolean;
  children?: IMenuChildItem[];
}

const MENU_ITEMS: IMenuItem[] = [
  { label: '대시보드', icon: <LayoutDashboard size={18} />, path: '/dashboard', highlight: true },
  {
    label: '헤이보드',
    icon: <CirclePlus size={18} />,
    children: [
      { label: '버튼/카드관리', path: '/heyboard/buttons' },
      { label: '카드 템플릿 관리', path: '/heyboard/templates' },
    ],
  },
  {
    label: '고객 관리',
    icon: <Contact size={18} />,
    children: [{ label: '고객 리스트', path: '/customers', highlight: true }],
  },
  {
    label: '마케팅',
    icon: <Megaphone size={18} />,
    children: [
      { label: '배너 관리', path: '/marketing/event-banners', highlight: true },
      { label: '메시지 관리', path: '/marketing/crm', highlight: true },
      { label: '포인트 관리', path: '/settings/points', highlight: true },
    ],
  },
  {
    label: '서비스 연동',
    icon: <Network size={18} />,
    path: '/service-integration',
    highlight: true,
  },
  {
    label: '통계',
    icon: <BarChart2 size={18} />,
    children: [
      { label: '고객 유입 통계', path: '/statistics/customers' },
      { label: '마케팅 통계', path: '/statistics/marketing' },
      { label: '메시지 발송 통계', path: '/statistics/crm', highlight: true },
    ],
  },
  { label: '멤버 관리', icon: <UserRound size={18} />, path: '/members' },
  {
    label: '결제 관리',
    icon: <CreditCard size={18} />,
    children: [
      { label: '구독현황', path: '/payment/subscription', highlight: true },
      { label: '서비스 신청', path: '/payment/apply', highlight: true },
      { label: '결제내역', path: '/payment/history', highlight: true },
    ],
  },
  {
    label: '설정',
    icon: <SlidersHorizontal size={18} />,
    children: [
      { label: '회사 정보 관리', path: '/settings/company' },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    '고객 관리': true,
    '마케팅': true,
    '통계': true,
    '설정': true,
    '결제 관리': true,
  });

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isChildActive = (children?: { path: string }[]) => {
    if (!children) {
      return false;
    }
    return children.some((child) => location.pathname.startsWith(child.path));
  };

  return (
    <aside className="flex h-screen w-[220px] flex-shrink-0 flex-col border-r border-border bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-4">
        <span className="text-lg font-bold text-foreground">Hey-there</span>
        <Copy size={14} className="text-muted-foreground" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {MENU_ITEMS.map((item) => (
          <div key={item.label} className="mb-0.5">
            {item.children ? (
              <>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                    isChildActive(item.children)
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {item.icon}
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {expandedMenus[item.label] ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
                {expandedMenus[item.label] && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-3">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
                            isActive
                              ? 'bg-amber-50 font-medium text-foreground'
                              : child.highlight
                                ? 'text-amber-700 hover:bg-amber-50 hover:text-amber-800'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          )
                        }
                      >
                        {child.highlight && (
                          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                        )}
                        <span className={cn(child.highlight && 'font-medium')}>{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.path ?? '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-amber-50 font-medium text-foreground'
                      : item.highlight
                        ? 'text-amber-700 hover:bg-amber-50 hover:text-amber-800'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )
                }
              >
                {item.icon}
                <span className="flex-1 font-medium">{item.label}</span>
                {item.highlight && (
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                )}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom links */}
      <div className="border-t border-border px-5 py-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="cursor-pointer hover:underline">가이드</span>
          <span>•</span>
          <span className="cursor-pointer hover:underline">업데이트</span>
        </div>
      </div>

      {/* User info */}
      <div className="flex items-center gap-2.5 border-t border-border px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          <SlidersHorizontal size={14} className="text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium">헤이데어dd</span>
            <span className="text-xs text-orange-500">소유자</span>
          </div>
          <p className="truncate text-xs text-muted-foreground">ja@happytalk.io</p>
        </div>
      </div>
    </aside>
  );
}
