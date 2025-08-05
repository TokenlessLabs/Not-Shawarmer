// app/lib/hooks/useSession.ts
"use client";

import useSWR from "swr";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const fetcher = () => fetch("/api/session").then((res) => res.json());

export default function useSession() {
  const router = useRouter();

  const { data: session, mutate } = useSWR("/api/session", fetcher, {
    refreshInterval: 0, // no polling
  });

  // Listen to logout events from other tabs
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "logout") {
        mutate(); // re-fetch session
        router.refresh(); // optional: reload current route
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [mutate, router]);

  return { session, mutate };
}
