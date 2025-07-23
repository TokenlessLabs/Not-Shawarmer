import React from "react";
import Link from "next/link";
import { Restaurant } from "./res-client";
import { PencilIcon } from "@heroicons/react/24/outline";

export default function RestaurantForm({
  formData,
  onChange,
  isEditing,
}: {
  formData: Restaurant;
  onChange: (field: keyof Restaurant, value: string) => void;
  isEditing: boolean;
}) {
  const editableFields: { label: string; key: keyof Restaurant; type?: string }[] = [
    { label: "About Us", key: "about" },
    { label: "Contact Number", key: "contact", type: "tel" },
  ];

  return (
    <div className="flex flex-col gap-7">
      {/* Restaurant Name (Always Visible, Never Editable) */}
      <div className="flex flex-col gap-1">
        <label className="text-xl font-semibold text-theme-dark-blue">
          Restaurant Name
        </label>
        <p className="text-base font-medium text-theme-dark-blue">
          {formData.name}
        </p>
      </div>

      {/* Address (Read-only, with Edit button in edit mode) */}
      <div className="flex flex-col gap-1">
        <label className="text-xl font-semibold text-theme-dark-blue">Address</label>
        <div className="flex items-center justify-between">
          <p className="text-base font-medium text-theme-dark-blue">
            {formData.address}
          </p>
          {isEditing && (
            <Link
  href="/dashboard/restaurant/edit-address"
  className="p-1 text-blue-600 hover:text-blue-800 transition"
>
  <PencilIcon className="w-5 h-5" />
</Link>

          )}
        </div>
      </div>

      {/* Editable Fields */}
      {editableFields.map(({ label, key, type }) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="text-xl font-semibold text-theme-dark-blue">
            {label}
          </label>
          {isEditing ? (
            key === "about" ? (
              <textarea
                value={formData[key]}
                onChange={(e) => onChange(key, e.target.value)}
                className="border rounded px-4 py-3 text-sm text-theme-dark-blue focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            ) : (
              <input
                type={type || "text"}
                value={formData[key]}
                onChange={(e) => onChange(key, e.target.value)}
                className="border rounded px-4 py-3 text-sm text-theme-dark-blue focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            )
          ) : (
            <p className="text-base font-medium text-theme-dark-blue whitespace-pre-line">
              {formData[key]}
            </p>
          )}
        </div>
      ))}

      {/* Time Pickers */}
      <div className="flex flex-col gap-1">
        <label className="text-xl font-semibold text-theme-dark-blue">
          Operating Hours
        </label>
        {isEditing ? (
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-theme-dark-blue font-medium mb-1">
                Start Time
              </span>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => onChange("startTime", e.target.value)}
                className="border rounded px-4 py-2 text-sm text-theme-dark-blue focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-theme-dark-blue font-medium mb-1">
                End Time
              </span>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => onChange("endTime", e.target.value)}
                className="border rounded px-4 py-2 text-sm text-theme-dark-blue focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        ) : (
          <p className="text-base font-medium text-theme-dark-blue">
            {formData.startTime} - {formData.endTime}
          </p>
        )}
      </div>
    </div>
  );
}
