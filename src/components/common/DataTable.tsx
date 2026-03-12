import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IColumn<T> {
  key: string;
  header: string;
  width?: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

export interface IPagination {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface IDataTableProps<T> {
  columns: IColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  pagination?: IPagination;
  selectable?: boolean;
  selectedRows?: Set<number>;
  onSelectionChange?: (selected: Set<number>) => void;
  totalLabel?: string;
}

const EMPTY_MESSAGE = '데이터가 없습니다.';

export function DataTable<T>({
  columns,
  data,
  onRowClick,
  pagination,
  selectable = false,
  selectedRows,
  onSelectionChange,
  totalLabel,
}: IDataTableProps<T>) {
  const [internalSelected, setInternalSelected] = useState<Set<number>>(new Set());
  const selected = selectedRows ?? internalSelected;
  const setSelected = onSelectionChange ?? setInternalSelected;

  const toggleAll = () => {
    if (selected.size === data.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.map((_, i) => i)));
    }
  };

  const toggleRow = (index: number) => {
    const next = new Set(selected);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setSelected(next);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      {totalLabel && (
        <div className="border-b border-border px-5 py-3">
          <span className="text-sm text-muted-foreground">{totalLabel}</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50/80">
              {selectable && (
                <th className="w-10 px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selected.size === data.length}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-medium text-muted-foreground',
                    col.sortable && 'cursor-pointer hover:text-foreground'
                  )}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                  {col.sortable && <span className="ml-1">↕</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-border transition-colors last:border-b-0',
                  onRowClick && 'cursor-pointer hover:bg-gray-50',
                  selected.has(rowIndex) && 'bg-blue-50/50'
                )}
              >
                {selectable && (
                  <td className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selected.has(rowIndex)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleRow(rowIndex);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 rounded border-border accent-primary"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-foreground">
                    {col.render ? col.render(row, rowIndex) : String((row as Record<string, unknown>)[col.key] ?? '-')}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {EMPTY_MESSAGE}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="flex items-center justify-center gap-2 border-t border-border px-5 py-3">
          <button
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
          >
            <ChevronLeft size={14} /> 이전
          </button>
          <span className="flex h-8 min-w-[32px] items-center justify-center rounded-lg border border-border bg-white px-2.5 text-sm font-medium">
            {pagination.currentPage}
          </span>
          <button
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
          >
            다음 <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
