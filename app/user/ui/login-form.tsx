"use client";

import { useActionState } from "react";
import { authenticate } from "@/app/signup/actions";
import Link from "next/link";
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <form
      action={formAction}
      className="border rounded-xl border-gray-300 p-6 w-1/2 max-w-md flex flex-col gap-4 shadow-md bg-white"
    >
      <div className="flex flex-col">
        <label htmlFor="username" className="text-sm font-medium mb-1">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Ali123"
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
          className="border rounded-md px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-theme-light-blue"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
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

      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <button
        type="submit"
        disabled={isPending}
        className={`py-2 rounded-md mt-2 font-medium text-white ${
          isPending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-theme-blue hover:bg-theme-bluehighlighted"
        }`}
      >
        {isPending ? "Logging in..." : "Log In"}
      </button>

      <div
        className="flex max-h-8 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {errorMessage && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{errorMessage}</p>
          </>
        )}
      </div>

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
  );
}
