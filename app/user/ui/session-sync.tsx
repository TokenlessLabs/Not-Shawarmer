// app/ui/session-sync.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

const fetcher = () => fetch("/api/session").then((res) => {
    if (!res.ok) return null;
    return res.json();
});

export default function SessionSync() {
    const router = useRouter();
    const { data: session, mutate } = useSWR("/api/session", fetcher, {
        refreshInterval: 0,
    });

    // Listen for logout across tabs
    useEffect(() => {
        const onStorageChange = (e: StorageEvent) => {
            if (e.key === "logout") {
                mutate(); // revalidate session
            }
        };

        window.addEventListener("storage", onStorageChange);
        return () => window.removeEventListener("storage", onStorageChange);
    }, [mutate]);

    // Redirect if no session
    useEffect(() => {
        if (session === null) {
            router.push("/");
        }
    }, [session, router]);

    return null;
}