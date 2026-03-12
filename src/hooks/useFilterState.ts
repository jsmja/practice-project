import { useState, useCallback } from 'react';

interface IFilterOption {
  label: string;
  value: string;
}

export interface IFilter {
  key: string;
  label: string;
  value: string;
  options: IFilterOption[];
}

export function useFilterState(initialFilters: IFilter[]) {
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => prev.map((f) => (f.key === key ? { ...f, value } : f)));
  }, []);

  const handleReset = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return { filters, handleFilterChange, handleReset };
}
