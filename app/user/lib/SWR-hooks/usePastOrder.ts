"use client";
import useSWR from "swr";
import { Order } from "@/app/user/lib/definitions";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
export function usePastOrdersClient() {
  const { data, error, isLoading, mutate } = useSWR<Order[]>(
    "/api/user/pastOrder", 
    fetcher,
    {
      refreshInterval: 3000,
    }
  );

  console.log("Fetched orders from SWR:", data); 

  return {
    orders: data,
    isLoading,
    isError: error,
    mutate,
  };
}
