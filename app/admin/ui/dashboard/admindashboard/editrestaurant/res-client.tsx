"use client";

import React, { useState } from "react";
import RestaurantForm from "./res-form";

export type Restaurant = {
  name: string;
  address: string;
  about: string;
  startTime: string; 
  endTime: string;  
  contact: string;
};


// ✅ Main Component
export default function RestaurantClient({
  restaurant,
}: {
  restaurant: Restaurant;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Restaurant>(restaurant);
  const [savedData, setSavedData] = useState<Restaurant>(restaurant);

  const handleChange = (field: keyof Restaurant, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSavedData(formData);
    setIsEditing(false);
    alert("Changes saved (dummy)");
  };

  const handleCancel = () => {
    setFormData(savedData);
    setIsEditing(false);
  };

  return (
    <form className="bg-white shadow rounded-xl p-6 space-y-6 w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-3xl text-center font-bold text-gray-800 mb-4">Restaurant Profile</h2>

      <RestaurantForm
        formData={formData}
        onChange={handleChange}
        isEditing={isEditing}
      />

      <div className="flex justify-end gap-4 pt-4">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Edit
          </button>
        )}
      </div>
    </form>
  );
}
