"use client";

import React, { useState, useEffect } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import AddressModal from "@/app/user/ui/dashboard/address-modal";
import { Restaurant } from "@/app/user/lib/definitions";
import { reverseGeocode } from "@/app/user/lib/utils";

type Props = {
  formData: Restaurant;
  onChange: (field: keyof Restaurant, value: string | number) => void;
  isEditing: boolean;
};

export default function RestaurantForm({
  formData,
  onChange,
  isEditing,
}: Props) {
  const editableFields = [
    { label: "About Us", key: "about" },
    { label: "Contact Number", key: "contact", type: "tel" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [geoAddress, setGeoAddress] = useState<string>("Loading address...");

  useEffect(() => {
    const fetchAddress = async () => {
      if (formData.latitude && formData.longitude) {
        try {
          const address = await reverseGeocode(
            formData.latitude,
            formData.longitude
          );
          setGeoAddress(address);
        } catch {
          setGeoAddress("Failed to fetch address");
        }
      } else {
        setGeoAddress("Coordinates not set");
      }
    };

    fetchAddress();
  }, [formData.latitude, formData.longitude]);

  return (
    <div className="flex flex-col gap-7">
      {/* Restaurant Name */}
      <div className="flex flex-col gap-1">
        <label className="text-xl font-semibold text-theme-dark-blue">
          Restaurant Name
        </label>
        <p className="text-base font-medium text-gray-600">{formData.name}</p>
      </div>

      {/* Address */}
      <div className="flex flex-col gap-1">
        <label className="text-xl font-semibold text-theme-dark-blue">
          Address
        </label>
        <div className="flex items-center justify-between">
          <p className="text-base font-medium text-gray-600">{geoAddress}</p>
          {isEditing && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="p-1 text-theme-blue hover:text-theme-bluehighlighted transition cursor-pointer"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
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
                value={formData[key as keyof Restaurant] as string}
                onChange={(e) =>
                  onChange(key as keyof Restaurant, e.target.value)
                }
                className="border rounded px-4 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-theme-light-blue"
              />
            ) : (
              <input
                type={type || "text"}
                value={formData[key as keyof Restaurant] as string}
                onChange={(e) =>
                  onChange(key as keyof Restaurant, e.target.value)
                }
                className="border rounded px-4 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-theme-light-blue"
              />
            )
          ) : (
            <p className="text-base font-medium text-gray-600 whitespace-pre-line">
              {formData[key as keyof Restaurant]}
            </p>
          )}
        </div>
      ))}

      {/* Delivery Fee */}
      <div className="flex flex-col gap-1">
        <label className="text-xl font-semibold text-theme-dark-blue">
          Delivery Fee (Rs)
        </label>
        {isEditing ? (
          <input
            type="number"
            value={formData.delivery_fee}
            onChange={(e) => onChange("delivery_fee", e.target.value)}
            className="border rounded px-4 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-theme-light-blue"
          />
        ) : (
          <p className="text-base font-medium text-gray-600">
            Rs. {formData.delivery_fee}
          </p>
        )}
      </div>

      {/* Operating Hours */}
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
                className="border rounded px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                className="border rounded px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        ) : (
          <p className="text-base font-medium text-gray-600">
            {formData.startTime} - {formData.endTime}
          </p>
        )}
      </div>

      {/* Address Modal */}
      {showModal && (
        <AddressModal
          savedAddress={{
            latitude: formData.latitude,
            longitude: formData.longitude,
          }}
          onClose={() => setShowModal(false)}
          onSave={(newAddress) => {
            if (newAddress) {
              onChange("latitude", newAddress.latitude);
              onChange("longitude", newAddress.longitude);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
