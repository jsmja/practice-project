import type { IPagination } from '@/components/common/DataTable';

const noop = () => {};

export const NOOP_PAGINATION: IPagination = {
  currentPage: 1,
  totalPages: 1,
  onPageChange: noop,
};

export const PERIOD_TABS = ['어제', '일주일', '이번달'] as const;
