import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_CUSTOMERS, MOCK_SEND_HISTORY } from '@/mocks/customers';
import type { ICustomerDto, ISendHistoryDto } from '@/models/interface/dto';

export function useCustomerList() {
  return useQuery<ICustomerDto[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return MOCK_CUSTOMERS;

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('lastAccess', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCustomerSendHistory(customerId: string) {
  return useQuery<ISendHistoryDto[]>({
    queryKey: ['send_history', customerId],
    queryFn: async () => {
      if (!isSupabaseConfigured) return MOCK_SEND_HISTORY;

      const { data, error } = await supabase
        .from('send_history')
        .select('*')
        .eq('customerId', customerId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!customerId,
  });
}
