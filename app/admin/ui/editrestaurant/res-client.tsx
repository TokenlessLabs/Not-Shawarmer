"use client";

import React, { useState, useEffect } from "react";
import RestaurantForm from "./res-form";
import { updateRestaurant } from "@/app/user/lib/actions";
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

  const [state, formAction, isPending] = useActionState(updateRestaurant, {
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
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-12 text-theme-dark-blue">
        Restaurant Profile
      </h1>

      <form
        action={formAction}
        className="bg-theme-light-blue shadow rounded-lg p-6 space-y-6"
      >
        <RestaurantForm
          formData={formData}
          onChange={handleChange}
          isEditing={isEditing}
        />

        {/* Hidden Inputs */}
        <input type="hidden" name="address" value={formData.address} />
        <input type="hidden" name="about" value={formData.about} />
        <input type="hidden" name="startTime" value={formData.startTime} />
        <input type="hidden" name="endTime" value={formData.endTime} />
        <input type="hidden" name="contact" value={formData.contact} />

        {/* Messages */}
        <div>
          {isEditing &&
            Array.isArray(state.errors) &&
            state.errors.map((err, i) => (
              <p key={i} className="text-red-500 text-sm">
                {err}
              </p>
            ))}

          {isEditing && !state.success && state.message && (
            <p className="text-red-500 text-sm">{state.message}</p>
          )}

          {isEditing && state.success && state.message && (
            <p className="text-green-500 text-sm">{state.message}</p>
          )}
        </div>

        {/* Buttons */}
        <div
          className="flex justify-end items-center gap-4 pt-4"
          key={isEditing ? "editing" : "viewing"}
        >
          {isEditing ? (
            <>
              <button
                type="submit"
                disabled={isPending}
                className="bg-theme-blue text-white px-4 py-2 rounded-md font-medium hover:bg-theme-bluehighlighted"
              >
                {isPending ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-800"
              >
                Close
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-theme-blue text-white px-4 py-2 rounded-md font-medium hover:bg-theme-bluehighlighted"
            >
              Edit
            </button>
          )}
        </div>
      </form>
    </main>
  );
}
