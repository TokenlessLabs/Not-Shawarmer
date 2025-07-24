"use client";

import React, { useState } from "react";
import RestaurantForm from "./res-form";
import { updateRestaurant } from "../../lib/actions";
import { useActionState } from "react";

export type Restaurant = {
  name: string;
  address: string;
  about: string;
  startTime: string;
  endTime: string;
  contact: string;
};

export default function RestaurantClient({
  restaurant,
}: {
  restaurant: Restaurant;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Restaurant>(restaurant);

  const [state, formAction] = useActionState(updateRestaurant, {
    success: false,
    message: null,
    errors: [],
  });

  const handleChange = (field: keyof Restaurant, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData(restaurant);
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 w-full max-w-2xl mx-auto mt-8 space-y-6">
      <h2 className="text-3xl text-center font-bold text-gray-800 mb-2">
        Restaurant Profile
      </h2>

      <form className="pt-6 space-y-4" action={formAction}>
        <RestaurantForm
          formData={formData}
          onChange={handleChange}
          isEditing={isEditing}
        />

        <input type="hidden" name="name" value={formData.name} />
        <input type="hidden" name="address" value={formData.address} />
        <input type="hidden" name="about" value={formData.about} />
        <input type="hidden" name="startTime" value={formData.startTime} />
        <input type="hidden" name="endTime" value={formData.endTime} />
        <input type="hidden" name="contact" value={formData.contact} />

        <div className="flex justify-end gap-4 pt-4">
          {isEditing ? (
            <>
              <button
                type="submit"
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

        {state?.message && (
          <p className="text-sm text-center text-green-600">{state.message}</p>
        )}

        {Array.isArray(state?.errors) && state.errors.length > 0 && (
          <ul className="text-sm text-red-600 list-disc pl-6">
            {state.errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
}
