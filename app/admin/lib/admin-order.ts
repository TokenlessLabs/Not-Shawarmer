// lib/hooks/useAdminOrders.ts

import useSWR from 'swr';
import { Order } from '@/app/user/lib/definitions';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch admin orders");
  }
  return response.json();
};

export function useAdminOrders() {
  const { data, error, isLoading, mutate } = useSWR<Order[]>('/api/admin/orders', fetcher  );

  return {
    orders: data,
    isLoading,
    isError: error,
    mutate,
  };
}
