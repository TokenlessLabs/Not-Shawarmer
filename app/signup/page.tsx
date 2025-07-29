// app/signup/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useActionState } from "react";
import { signupUser } from "./actions";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [state, formAction] = useActionState(signupUser,  {
    message: null,
    success: false,
    errors: [],
  });

  return (
    <div className="h-screen w-full flex text-theme-dark-blue">
      {/* Left Panel */}
      <div className="w-1/2 h-full bg-theme-light-blue flex items-center justify-center">
        <img src="/logo.svg" alt="Logo" className="w-[90%] h-auto" />
      </div>

      {/* Right Panel */}
      <div className="w-1/2 h-full flex flex-col items-center justify-center gap-6 overflow-y-scroll">
        <h1 className="text-4xl font-bold text-theme-dark-blue">Sign Up</h1>

        <form
          action={formAction}
          className="border rounded-xl border-gray-300 p-6 w-1/2 max-w-md flex flex-col gap-4 shadow-md bg-white"
        >
          {/* Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              className="border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              className="border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <label className="text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="border rounded-md px-3 py-2 text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[33px] text-gray-500 hover:text-gray-700"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col relative">
            <label className="text-sm font-medium mb-1">Confirm Password</label>
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter Password"
              className="border rounded-md px-3 py-2 text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[33px] text-gray-500 hover:text-gray-700"
              aria-label="Toggle password visibility"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-theme-blue hover:bg-theme-bluehighlighted text-white py-2 rounded-md mt-2 font-medium"
          >
            Sign Up
          </button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/" className="text-theme-dark-blue underline font-semibold">
              Log in!
            </Link>
          </p>

            {/* Error Display */}
                {state?.errors && state.errors.length > 0 && (
          <ul className="text-red-600 text-sm">
            {state.errors.map((err, idx) => (
              <li key={idx}>• {err}</li>
            ))}
          </ul>
        )}
        </form>
      </div>
    </div>
  );
}
