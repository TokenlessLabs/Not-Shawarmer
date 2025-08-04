// lib/hooks/useAdminOrders.ts

import useSWR from 'swr';
import { Order } from '@/app/user/lib/definitions';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useAdminOrders() {
  const { data, error, isLoading, mutate } = useSWR<Order[]>('/api/admin/orders', fetcher  );

  return {
    orders: data,
    isLoading,
    isError: error,
    mutate,
  };
}
