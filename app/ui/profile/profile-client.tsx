"use client";

import React, { useState } from "react";
import { useActionState } from "react";
import { updateUser } from "@/app/lib/actions";
import ProfileForm from "./profile-form";
import { User, ErrorState } from "../../lib/definitions";

export default function ProfileClient({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const initialState: ErrorState = {
    success: undefined,
    message: null,
    errors: [],
  };
  const [state, formAction, isPending] = useActionState(
    updateUser,
    initialState
  );

  const handleChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      action={formAction}
      className="bg-theme-light-blue shadow rounded-lg p-6 space-y-6"
    >
      <ProfileForm
        formData={formData}
        onChange={handleChange}
        isEditing={isEditing}
      />

      <div>
        {isEditing &&
          state.errors?.map((err, i) => (
            <p key={i} className="text-red-500 text-sm">
              {err}
            </p>
          ))}

        {isEditing && state.message && (
          <p className="text-red-500 text-sm">{state.message}</p>
        )}

        {isEditing && state.success && (
          <p className="text-green-600 text-sm">
            Information updated successfully!
          </p>
        )}
      </div>

      <div className="flex justify-end items-center gap-4 pt-4">
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
              onClick={() => {
                setFormData(user);
                setIsEditing(false);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-800"
            >
              Close
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-theme-blue text-white px-4 py-2 rounded-md font-medium hover:bg-theme-bluehighlighted"
            >
              Edit
            </button>
            <button
              type="button"
              //onClick={() => setIsEditing(true)}
              className="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600"
            >
              Delete Account
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
