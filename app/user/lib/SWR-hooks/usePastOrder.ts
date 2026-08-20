"use client";
import useSWR from "swr";
import { Order } from "@/app/user/lib/definitions";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
export function usePastOrdersClient(enabled = true) {
  const { data, error, isLoading, mutate } = useSWR<Order[]>(
    enabled ? "/api/user/pastOrder" : null,
    fetcher,
    {
      refreshInterval: 3000,
    }
  );

  return {
    orders: data,
    isLoading,
    isError: error,
    mutate,
  };
}
