"use client";

import AddressModal from "./address-modal";
import React, { useEffect, useState } from "react";
import AddressBarSkeleton from "./address-bar-skeleton";
import { Coordinates } from "../../lib/definitions";
import { reverseGeocode } from "../../lib/utils";
import { updateUserAddress } from "../../lib/actions";

type AddressBarProps = {
  coordinates: Coordinates;
};

export default function AddressBar({ coordinates }: AddressBarProps) {
  const [openModal, setOpenModal] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Reverse geocode when coordinates change
  useEffect(() => {
    const fetchAddress = async () => {
      if (!coordinates) {
        setAddress(null);
        setLoading(false);
        return;
      }

      try {
        const addr = await reverseGeocode(
          coordinates.latitude,
          coordinates.longitude
        );
        setAddress(addr);
      } catch (err) {
        console.error("Failed to reverse geocode address:", err);
        setAddress("Unable to fetch address");
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [coordinates]);

  if (loading) {
    return <AddressBarSkeleton />;
  }

  return (
    <>
      {openModal && (
        <AddressModal
          savedAddress={coordinates}
          onClose={() => setOpenModal(false)}
          onSave={async (newCoordinates) => {
            setOpenModal(false);
            if (
              newCoordinates &&
              (!coordinates ||
                newCoordinates.latitude !== coordinates.latitude ||
                newCoordinates.longitude !== coordinates.longitude)
            ) {
              setLoading(true);
              await updateUserAddress(newCoordinates);
            }
          }}
        />
      )}
      <div className="flex justify-center w-full">
        <nav className="bg-theme-blue p-4 rounded-b-lg shadow-md flex items-center gap-4 w-full">
          <label className="text-white whitespace-nowrap">
            Current Address:
          </label>
          <div className="flex-grow px-4 py-2 bg-white text-black rounded-md border border-gray-300 text-ellipsis whitespace-nowrap overflow-hidden">
            {address || "No address found"}
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="bg-white text-theme-blue font-semibold px-4 py-2 rounded-md hover:scale-105 transition"
          >
            Edit
          </button>
        </nav>
      </div>
    </>
  );
}
