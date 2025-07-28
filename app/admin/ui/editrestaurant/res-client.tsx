"use client";

import React, { useState, useEffect } from "react";
import RestaurantForm from "./res-form";
import { updateRestaurant } from "@/app/user/lib/actions";
import { useActionState } from "react";
import RestaurantSkeleton from "../../editrestaurant/loading";

export type Restaurant = {
  name: string;
  address: string;
  about: string;
  startTime: string;
  endTime: string;
  contact: string;
  delivery_fee: number;
};

export default function RestaurantClient({
  restaurant: initialData,
}: {
  restaurant: Restaurant;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Restaurant | null>(null);

  const [state, formAction, isPending] = useActionState(updateRestaurant, {
    success: false,
    message: null,
    errors: [],
  });

  useEffect(() => {
    // Simulate loading time if you want skeleton to show
    const timeout = setTimeout(() => {
      setFormData(initialData);
    }, 300); // you can remove this delay in production
    return () => clearTimeout(timeout);
  }, [initialData]);

  const handleChange = (field: keyof Restaurant, value: string) => {
    if (!formData) return;
    setFormData((prev) => ({
      ...prev!,
      [field]: field === "delivery_fee" ? parseFloat(value) : value,
    }));
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  if (!formData) return <RestaurantSkeleton />;

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
        {Object.entries(formData).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}

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
