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

export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignNo: number) => {
      if (!isSupabaseConfigured) {
        const idx = MOCK_CAMPAIGNS.findIndex((c) => c.no === campaignNo);
        if (idx !== -1) MOCK_CAMPAIGNS.splice(idx, 1);
        return;
      }
      const { error } = await supabase.from('campaigns').delete().eq('no', campaignNo);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}

export function useDuplicateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaign: ICampaignDto) => {
      const maxNo = MOCK_CAMPAIGNS.reduce((max, c) => Math.max(max, c.no), 0);
      const newCampaign: ICampaignDto = {
        ...campaign,
        no: maxNo + 1,
        name: `${campaign.name} (복사)`,
        status: '예정',
        sendRound: 0,
        successCount: 0,
        failCount: 0,
        failReason: undefined,
        createdDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
        lastModifiedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };

      if (!isSupabaseConfigured) {
        MOCK_CAMPAIGNS.push(newCampaign);
        return newCampaign;
      }

      const { data, error } = await supabase.from('campaigns').insert(newCampaign).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}

export function useToggleCampaignPause() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignNo, newStatus }: { campaignNo: number; newStatus: string }) => {
      if (!isSupabaseConfigured) {
        const campaign = MOCK_CAMPAIGNS.find((c) => c.no === campaignNo);
        if (campaign) campaign.status = newStatus;
        return;
      }
      const { error } = await supabase.from('campaigns').update({ status: newStatus }).eq('no', campaignNo);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
