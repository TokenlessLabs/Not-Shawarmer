"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col relative">
      <label className="text-sm font-medium mb-1">Password</label>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="******"
        className="border rounded-md px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-theme-light-blue"
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-[55%] text-gray-500 hover:text-gray-700"
        aria-label="Toggle password visibility"
      >
        {showPassword ? (
          <EyeSlashIcon className="w-5 h-5" />
        ) : (
          <EyeIcon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
