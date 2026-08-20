// app/ui/session-sync.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";

const fetcher = () => fetch("/api/session").then((res) => {
    if (!res.ok) return null;
    return res.json();
});

export default function SessionSync() {
    const router = useRouter();
    const pathname = usePathname();
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
        const isProtectedRoute = pathname.startsWith("/user") ||
            pathname.startsWith("/admin") || pathname.startsWith("/profile");

        if (session === null && isProtectedRoute) {
            router.push("/");
        }
    }, [pathname, session, router]);

    return null;
}
