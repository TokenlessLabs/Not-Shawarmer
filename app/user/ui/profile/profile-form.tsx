"use client";

import React, { useState, useEffect } from "react";
import { User, Roles } from "../../lib/definitions";
import AddressModal from "../dashboard/address-modal";
import Link from "next/link";
import { updateUserAddress } from "../../lib/actions";
import { reverseGeocode } from "../../lib/utils";
import Loading from "@/app/profile/loading";

export default function ProfileForm({
  formData,
  onChange,
  isEditing,
}: {
  formData: User;
  onChange: (field: keyof User, value: string) => void;
  isEditing: boolean;
}) {
  const [showAddressModal, setShowAddressModal] = useState(false);

  const fields: { label: string; key: keyof User; type?: string }[] = [
    { label: "Username", key: "username" },
    { label: "Email", key: "email", type: "email" },
    { label: "Phone", key: "contact", type: "tel" },
  ];

  const [address, setAddress] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(true);

  useEffect(() => {
    const getAddress = async () => {
      setLoadingAddress(true);
      if (formData.latitude && formData.longitude) {
        const addr = await reverseGeocode(
          formData.latitude,
          formData.longitude
        );
        setAddress(addr);
      }
      setLoadingAddress(false);
    };

    getAddress();
  }, [formData.latitude, formData.longitude]);

  return (
    <>
      {fields.map(({ label, key, type }) => (
        <div key={key} className="flex flex-col mb-4">
          <label className="text-sm font-medium text-gray-600 mb-1">
            {label}
          </label>
          {isEditing ? (
            <input
              name={key}
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
      {formData.role === Roles.User && (
        <div className="flex flex-col mb-4">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Address
          </label>
          {isEditing ? (
            <>
              {loadingAddress ? (
                <div className="w-2/3 h-4 bg-theme-blue rounded animate-pulse mb-1" />
              ) : (
                <p className="text-sm mb-1">{address}</p>
              )}
              <button
                type="button"
                onClick={() => setShowAddressModal(true)}
                className="text-theme-blue hover:underline text-left text-sm cursor-pointer"
              >
                Edit Address
              </button>
            </>
          ) : loadingAddress ? (
            <div className="w-2/3 h-5 bg-theme-blue rounded animate-pulse" />
          ) : (
            <p className="text-lg font-medium">{address}</p>
          )}
        </div>
      )}

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
            <Link
              href="/profile/changepassword"
              className="text-theme-blue hover:underline text-left text-sm"
            >
              Change Password
            </Link>
          </>
        ) : (
          <p className="text-lg font-bold tracking-widest select-none">
            ********
          </p>
        )}
      </div>

      {/* Modals */}
      {showAddressModal && (
        <AddressModal
          savedAddress={{
            latitude: formData.latitude,
            longitude: formData.longitude,
          }}
          onClose={() => setShowAddressModal(false)}
          onSave={(newAddress) => {
            setShowAddressModal(false);

            if (
              newAddress &&
              (newAddress?.latitude !== formData.latitude ||
                newAddress.longitude !== formData.longitude)
            ) {
              formData.longitude = newAddress?.longitude;
              formData.latitude = newAddress.latitude;
              updateUserAddress(newAddress);
            }
          }}
        />
      )}
    </>
  );
}
