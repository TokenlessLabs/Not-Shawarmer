"use client";

import { useActionState } from "react";
import { loginUser , LoginErrorState } from "./signup/actions";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const initialState: LoginErrorState = {
    message: null,
    success: false,
    errors: [],
  };

  const [state, formAction] = useActionState(loginUser, initialState);

  // Redirect on success
  useEffect(() => {
    if (state.success) {
      router.push("/user/dashboard");
    }
  }, [state.success, router]);

  return (
    <div className="h-screen w-full flex text-theme-dark-blue">
      <div className="w-1/2 h-full bg-theme-light-blue flex items-center justify-center">
        <img src="/logo.svg" alt="Logo" className="w-[90%] h-auto" />
      </div>

      <div className="w-1/2 h-full flex flex-col items-center justify-center gap-6">
        <p className="text-4xl font-bold">Login</p>

        <form
          action={formAction}
          className="border rounded-xl border-gray-300 p-6 w-1/2 max-w-md flex flex-col gap-4 shadow-md bg-white"
        >
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="example@gmail.com"
              required
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-light-blue"
            />
          </div>

          <div className="flex flex-col relative">
            <label htmlFor="password" className="text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="******"
              required
              className="border rounded-md px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-theme-light-blue"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="space-y-1 mt-2">
            {(state.errors ?? []).map((err, i) => (
  <li key={i}>{err}</li>
))}

            {state.message && <p className="text-sm text-red-600">{state.message}</p>}
          </div>

          <button
            type="submit"
            className="bg-theme-blue hover:bg-theme-bluehighlighted text-white py-2 rounded-md mt-2 font-medium"
          >
            Sign In
          </button>

          <p className="text-sm text-center">
            No Account?{" "}
            <Link
              href="/signup"
              className="text-theme-dark-blue underline font-semibold"
            >
              Sign Up!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
