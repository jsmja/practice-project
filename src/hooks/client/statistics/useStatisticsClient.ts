import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_CRM_STATS, MOCK_PAGE_STATS, MOCK_CRM_SUMMARY } from '@/mocks/statistics';
import type { ICrmStatDto, IPageStatDto, ICrmSummaryDto } from '@/models/interface/dto';

export function useCrmSummary() {
  return useQuery<ICrmSummaryDto>({
    queryKey: ['crm_summary'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return MOCK_CRM_SUMMARY;

      const { data, error } = await supabase.from('crm_summary').select('*').single();
      if (error) throw error;
      return data;
    },
  });
}

export function useCrmStats() {
  return useQuery<ICrmStatDto[]>({
    queryKey: ['crm_statistics'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return MOCK_CRM_STATS;

      const { data, error } = await supabase
        .from('crm_statistics')
        .select('*')
        .order('sendDate', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function usePageStats() {
  return useQuery<IPageStatDto[]>({
    queryKey: ['page_statistics'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return MOCK_PAGE_STATS;

      const { data, error } = await supabase
        .from('page_statistics')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}
