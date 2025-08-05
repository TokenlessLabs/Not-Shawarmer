// app/components/LogoutListener.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LogoutListener = () => {
    const router = useRouter();

    useEffect(() => {
        const handleLogout = (event: StorageEvent) => {
            if (event.key === "logout") {
                router.push("/"); // Or refresh if using middleware
            }
        };

        window.addEventListener("storage", handleLogout);

        return () => window.removeEventListener("storage", handleLogout);
    }, [router]);

    return null;
};

export default LogoutListener;
