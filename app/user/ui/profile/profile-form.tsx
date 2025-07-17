"use client";

import React, { useState } from "react";
import { User } from "../../lib/definitions";
import ChangePasswordModal from "./change-password-modal";
import AddressModal from "../dashboard/address-modal";

export default function ProfileForm({
  formData,
  onChange,
  isEditing,
}: {
  formData: User;
  onChange: (field: keyof User, value: string) => void;
  isEditing: boolean;
}) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const fields: { label: string; key: keyof User; type?: string }[] = [
    { label: "Username", key: "username" },
    { label: "Email", key: "email", type: "email" },
    { label: "Phone", key: "contact", type: "tel" },
  ];

  return (
    <>
      {fields.map(({ label, key, type }) => (
        <div key={key} className="flex flex-col mb-4">
          <label className="text-sm font-medium text-gray-600 mb-1">
            {label}
          </label>
          {isEditing ? (
            <input
              type={type || "text"}
              value={formData[key]}
              onChange={(e) => onChange(key, e.target.value)}
              className="border rounded px-3 py-2 text-sm focus:outline-none text-theme-dark-blue focus:ring-2 focus:ring-theme-light-blue"
            />
          ) : (
            <p className="text-lg font-medium">{formData[key]}</p>
          )}
        </div>
      ))}

      {/* Address Field */}
      <div className="flex flex-col mb-4">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Address
        </label>
        {isEditing ? (
          <>
            <p className="text-sm mb-1">{formData.address}</p>
            <button
              type="button"
              onClick={() => setShowAddressModal(true)}
              className="text-theme-blue hover:underline text-left text-sm"
            >
              Edit Address
            </button>
          </>
        ) : (
          <p className="text-lg font-medium">{formData.address}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="flex flex-col mb-4">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Password
        </label>
        {isEditing ? (
          <>
            <p className="text-lg font-medium tracking-widest select-none">
              ********
            </p>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="text-theme-blue hover:underline text-left text-sm"
            >
              Change Password
            </button>
          </>
        ) : (
          <p className="text-lg font-bold tracking-widest select-none">
            ********
          </p>
        )}
      </div>

      {/* Modals */}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
      {showAddressModal && (
        <AddressModal
          savedAddress={formData.address}
          onClose={() => setShowAddressModal(false)}
          onSave={(add) => (formData.address = add)}
        />
      )}
    </>
  );
}
