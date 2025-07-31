"use client";

import React, { useState, useEffect } from "react";
import RestaurantForm from "./res-form";
import { updateRestaurant } from "@/app/user/lib/actions";
import { useActionState } from "react";
import { Restaurant, ErrorState } from "@/app/user/lib/definitions";
import RestaurantSkeleton from "../../editrestaurant/loading";

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
  const [actionState, setActionState] = useState<ErrorState>({
    success: false,
    message: null,
    errors: [],
  });

  useEffect(() => {
    setFormData({
      ...initialData,
      delivery_fee: Number(initialData.delivery_fee),
    });
  }, [initialData]);

  const handleChange = (field: keyof Restaurant, value: string | number) => {
    if (!formData) return;
    setFormData((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
    setActionState({
      message: null,
      success: false,
      errors: [],
    });
  };

  useEffect(() => {
    setActionState(state);
  }, [state]);

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
            Array.isArray(actionState.errors) &&
            actionState.errors.map((err, i) => (
              <p key={i} className="text-red-500 text-sm">
                {err}
              </p>
            ))}

          {isEditing && !actionState.success && actionState.message && (
            <p className="text-red-500 text-sm">{actionState.message}</p>
          )}

          {isEditing && actionState.success && actionState.message && (
            <p className="text-green-500 text-sm">{actionState.message}</p>
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
                className="bg-theme-blue text-white px-4 py-2 rounded-md font-medium hover:bg-theme-bluehighlighted cursor-pointer"
              >
                {isPending ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-800 cursor-pointer"
              >
                Close
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-theme-blue text-white px-4 py-2 rounded-md font-medium hover:bg-theme-bluehighlighted cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>
      </form>
    </main>
  );
}
