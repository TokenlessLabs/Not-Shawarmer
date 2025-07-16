"use client";

import AddressModal from "./address-modal";
import React, { useState } from "react";

export default function AddressBar() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [savedAddress, setSavedAddress] = useState<string>("Emporium Mall");
  return (
    <>
      {openModal && (
        <AddressModal
          savedAddress={savedAddress}
          onClose={() => setOpenModal(false)}
          onSave={(add) => setSavedAddress(add)}
        />
      )}
      <div className="flex justify-center w-full">
        <nav className="bg-theme-blue p-4 rounded-b-lg shadow-md flex items-center gap-4 w-full ">
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
