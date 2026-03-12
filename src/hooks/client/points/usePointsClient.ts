import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_POINT_HISTORY } from '@/mocks/points';
import type { IPointHistoryDto } from '@/models/interface/dto';

export function usePointHistory() {
  return useQuery<IPointHistoryDto[]>({
    queryKey: ['point_history'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return MOCK_POINT_HISTORY;

      const { data, error } = await supabase
        .from('point_history')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}
