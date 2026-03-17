import { cn } from '@/lib/utils';
import {
  ShoppingBag,
  Instagram,
  Youtube,
  MessageCircle,
  Zap,
  CheckCircle,
} from 'lucide-react';
import type { ReactNode } from 'react';

interface IChannelChip {
  icon: ReactNode;
  label: string;
  color: string;
  connected: boolean;
}

const CHANNELS: IChannelChip[] = [
  { icon: <ShoppingBag size={15} />, label: '카페24', color: 'text-blue-600', connected: true },
  { icon: <Instagram size={15} />, label: '인스타그램', color: 'text-pink-500', connected: false },
  { icon: <Youtube size={15} />, label: '유튜브', color: 'text-red-500', connected: true },
  { icon: <MessageCircle size={15} />, label: '채팅상담', color: 'text-gray-600', connected: true },
  { icon: <Zap size={15} />, label: '헤이데어', color: 'text-amber-500', connected: true },
  { icon: <CheckCircle size={15} />, label: '마케팅 수신 동의', color: 'text-green-500', connected: true },
];

function ChannelChip({ channel }: { channel: IChannelChip }) {
  return (
    <div
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 transition-colors',
        channel.connected
          ? 'border-border/60 bg-white shadow-sm hover:border-gray-300'
          : 'border-dashed border-gray-300 bg-gray-50 opacity-60 hover:opacity-80',
      )}
    >
      <span
        className={cn(
          'h-2 w-2 rounded-full',
          channel.connected ? 'bg-green-400' : 'bg-gray-300',
        )}
      />
      <span className={channel.connected ? channel.color : 'text-gray-400'}>{channel.icon}</span>
      <span className={cn('text-sm', channel.connected ? 'text-foreground' : 'text-muted-foreground')}>
        {channel.label}
      </span>
    </div>
  );
}

export function ChannelStatusBar() {
  const connected = CHANNELS.filter((ch) => ch.connected);
  const disconnected = CHANNELS.filter((ch) => !ch.connected);

  return (
    <div className="flex items-center gap-5 rounded-2xl border border-border/60 bg-white px-5 py-3 shadow-sm">
      {/* 연동 */}
      <div className="flex items-center gap-2.5">
        <span className="whitespace-nowrap text-sm font-medium text-green-600">연동</span>
        <div className="flex flex-wrap items-center gap-2">
          {connected.map((ch) => (
            <ChannelChip key={ch.label} channel={ch} />
          ))}
        </div>
      </div>

      {/* 구분선 */}
      {disconnected.length > 0 && (
        <div className="h-6 w-px bg-border" />
      )}

      {/* 미연동 */}
      {disconnected.length > 0 && (
        <div className="flex items-center gap-2.5">
          <span className="whitespace-nowrap text-sm font-medium text-muted-foreground">미연동</span>
          <div className="flex flex-wrap items-center gap-2">
            {disconnected.map((ch) => (
              <ChannelChip key={ch.label} channel={ch} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
