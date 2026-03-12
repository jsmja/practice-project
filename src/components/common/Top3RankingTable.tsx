import { Badge } from './Badge';
import type { BadgeVariantType } from '@/models/type';

const RANK_VARIANTS: BadgeVariantType[] = ['info', 'success', 'warning'];

interface ITop3RankingTableProps {
  title: string;
  columns?: { header: string; key: string }[];
  data?: { rank: number; values: string[] }[];
}

export function Top3RankingTable({ title, columns, data }: ITop3RankingTableProps) {
  const ranks = data ?? [1, 2, 3].map((rank) => ({ rank, values: ['-', '-'] }));

  return (
    <div>
      <p className="mb-3 text-xs font-semibold text-muted-foreground">{title}</p>
      <table className="w-full text-xs">
        {columns && (
          <thead>
            <tr className="text-muted-foreground">
              <th className="py-1 text-left" />
              {columns.map((col) => (
                <th key={col.key} className="py-1 text-left">{col.header}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {ranks.map((item) => (
            <tr key={item.rank} className="border-t border-border">
              <td className="py-1.5">
                <Badge variant={RANK_VARIANTS[item.rank - 1] ?? 'default'}>
                  TOP {item.rank}
                </Badge>
              </td>
              {item.values.map((val, i) => (
                <td key={i} className="py-1.5 text-muted-foreground">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
