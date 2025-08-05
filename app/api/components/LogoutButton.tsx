import { signOut } from "@/auth";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

export default function LogoutButton() {
    return (
        <form
            action={async () => {
                // 'use server'
                localStorage.setItem("logout", Date.now().toString());
                await signOut({ redirect: false }); // prevent automatic redirect
                window.location.href = "/"; // force reload so the session is re-checked
            }}
            className="flex items-center gap-4 text-xl px-4 py-3 rounded-lg transition-all duration-200 text-red-400 hover:text-white hover:bg-red-400 font-medium w-full text-left cursor-pointer"
        >
            <ArrowRightStartOnRectangleIcon className="h-10 w-10" />
            <span>Logout</span>
        </form>
    );
}
