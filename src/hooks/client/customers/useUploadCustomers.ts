import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_CUSTOMERS } from '@/mocks/customers';
import type { ICustomerDto } from '@/models/interface/dto';

export function useUploadCustomers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customers: ICustomerDto[]) => {
      if (!isSupabaseConfigured) {
        MOCK_CUSTOMERS.push(...customers);
        return customers;
      }

      const { data, error } = await supabase
        .from('customers')
        .insert(customers)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}
