import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_BANNERS, MOCK_BANNER_TEMPLATES } from '@/mocks/banners';
import type { IBannerDto, IBannerTemplateDto } from '@/models/interface/dto';

export function useBannerList() {
  return useQuery<IBannerDto[]>({
    queryKey: ['banners'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return MOCK_BANNERS;

      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useBannerTemplates() {
  return useQuery<IBannerTemplateDto[]>({
    queryKey: ['banner-templates'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return MOCK_BANNER_TEMPLATES;

      const { data, error } = await supabase
        .from('banner_templates')
        .select('*')
        .order('usage_count', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}
