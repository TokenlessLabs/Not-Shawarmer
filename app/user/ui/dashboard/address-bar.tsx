"use client";

import AddressModal from "./address-modal";
import React, { useEffect, useState } from "react";
import { updateUserAddress } from "../../lib/actions";
import AddressBarSkeleton from "./address-bar-skeleton"; // 👈 import skeleton

export default function AddressBar() {
  const [openModal, setOpenModal] = useState(false);
  const [savedAddress, setSavedAddress] = useState("");
  const [loading, setLoading] = useState(true); // 👈 add loading

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await fetch("/api/address");
        const data = await res.json();
        setSavedAddress(data.address || "No address found");
      } catch (err) {
        console.error("Failed to load address", err);
        setSavedAddress("Error loading address");
      } finally {
        setLoading(false); // 👈 end loading
      }
    };

    fetchAddress();
  }, []);

  // 👇 show skeleton while loading
  if (loading) {
    return <AddressBarSkeleton />;
  }

  return (
    <>
      {openModal && (
        <AddressModal
          savedAddress={savedAddress}
          onClose={() => setOpenModal(false)}
          onSave={(newAddress) => {
            setOpenModal(false);
            if (newAddress !== savedAddress) {
              setSavedAddress(newAddress);
              updateUserAddress(newAddress);
            }
          }}
        />
      )}
      <div className="flex justify-center w-full">
        <nav className="bg-theme-blue p-4 rounded-b-lg shadow-md flex items-center gap-4 w-full">
          <label className="text-white whitespace-nowrap">Current Address:</label>
          <div className="flex-grow px-4 py-2 bg-white text-black rounded-md border border-gray-300">
            {savedAddress}
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
