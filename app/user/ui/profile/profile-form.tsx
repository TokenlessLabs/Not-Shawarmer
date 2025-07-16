"use client";

import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { User } from "../../lib/definitions";

export default function ProfileForm({
  formData,
  onChange,
  isEditing,
}: {
  formData: User;
  onChange: (field: keyof User, value: string) => void;
  isEditing: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const fields: { label: string; key: keyof User; type?: string }[] = [
    { label: "Username", key: "username" },
    { label: "Email", key: "email", type: "email" },
    { label: "Phone", key: "phone", type: "tel" },
    { label: "Password", key: "password", type: "password" },
  ];

  return (
    <>
      {fields.map(({ label, key, type }) => (
        <div key={key} className="flex flex-col relative">
          <label className="text-sm font-medium text-gray-600 mb-1">
            {label}
          </label>
          {isEditing ? (
            <>
              <input
                type={key === "password" && !showPassword ? "password" : "text"}
                value={formData[key]}
                onChange={(e) => onChange(key, e.target.value)}
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-light-blue pr-10"
              />
              {key === "password" && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              )}
            </>
          ) : (
            <p className="text-lg font-medium">
              {key === "password" ? "••••••••" : formData[key]}
            </p>
          )}
        </div>
      ))}
    </>
  );
}
