"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-screen w-full flex text-theme-dark-blue">
     
      <div className="w-1/2 h-full bg-theme-light-blue flex items-center justify-center">
        <img src="/logo.svg" alt="Logo" className="w-[90%] h-auto" />
      </div>

      {/* Right Panel */}
      <div className="w-1/2 h-full flex flex-col items-center justify-center gap-6">
        <p className="text-4xl font-bold">Login</p>

        <form
          
          className="border rounded-xl border-gray-300 p-6 w-1/2 max-w-md flex flex-col gap-4 shadow-md bg-white"
        >
          {/* Email */}
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

          {/* Password */}
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
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-theme-blue hover:bg-theme-bluehighlighted text-white py-2 rounded-md mt-2 font-medium"
          >
            Sign In
          </button>

          {/* Sign Up Link */}
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
