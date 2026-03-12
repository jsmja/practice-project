import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_MARKETING_DATA } from '@/mocks/marketing';
import type { IMarketingDto } from '@/models/interface/dto';

export function useMarketingList() {
  return useQuery<IMarketingDto[]>({
    queryKey: ['marketing'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return MOCK_MARKETING_DATA;

      const { data, error } = await supabase
        .from('marketing_records')
        .select('*')
        .order('no', { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });
}
