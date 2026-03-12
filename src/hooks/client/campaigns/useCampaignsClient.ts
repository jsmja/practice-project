import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_CAMPAIGNS } from '@/mocks/campaigns';
import type { ICampaignDto } from '@/models/interface/dto';

export function useCampaignList() {
  return useQuery<ICampaignDto[]>({
    queryKey: ['campaigns'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return MOCK_CAMPAIGNS;

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('sendDate', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaign: Omit<ICampaignDto, 'no'>) => {
      const { data, error } = await supabase
        .from('campaigns')
        .insert(campaign)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
