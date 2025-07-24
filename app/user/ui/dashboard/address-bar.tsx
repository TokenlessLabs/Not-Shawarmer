"use client";

import AddressModal from "../../../ui/address/address-modal";
import React, { useEffect, useState } from "react";
import { updateAddress } from "@/app/lib/actions";

export default function AddressBar() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [savedAddress, setSavedAddress] = useState<string>("");

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await fetch("/api/address");
        const data = await res.json();
        if (data.address) setSavedAddress(data.address);
        else setSavedAddress("No address found");
      } catch (err) {
        console.error("Failed to load address", err);
        setSavedAddress("Error loading address");
      }
    };

    fetchAddress();
  }, []);

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
              updateAddress(newAddress);
            }
          }}
        />
      )}
      <div className="flex justify-center w-full">
        <nav className="bg-theme-blue p-4 rounded-b-lg shadow-md flex items-center gap-4 w-full">
          <label className="text-white whitespace-nowrap">
            Current Address:
          </label>

          <div className="flex-grow px-4 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none">
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
