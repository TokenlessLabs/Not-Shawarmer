"use client";

import React, { useState, useTransition } from "react";
import { User } from "../../lib/definitions";
import ProfileForm from "./profile-form";

export default function ProfileClient({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [pending, startTransition] = useTransition();

  const handleChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsEditing(false);

  //   startTransition(async () => {
  //     for (const field in formData) {
  //       if (formData[field as keyof User] !== user[field as keyof User]) {
  //         await updateUser(field as keyof User, formData[field as keyof User]);
  //       }
  //     }
  //   });
  // };

  // const handleDelete = () => {
  //   if (confirm("Are you sure you want to delete your account?")) {
  //     startTransition(() => deleteUser());
  //   }
  // };

  return (
    <form
      //onSubmit={handleSubmit}
      className="bg-theme-light-blue shadow rounded-lg p-6 space-y-6"
    >
      <ProfileForm
        formData={formData}
        onChange={handleChange}
        isEditing={isEditing}
      />

      <div className="flex justify-end items-center gap-4 pt-4">
        {isEditing ? (
          <>
            <button
              type="submit"
              disabled={pending}
              className="bg-theme-blue text-white px-4 py-2 rounded-md font-medium hover:bg-theme-bluehighlighted"
            >
              {pending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData(user);
                setIsEditing(false);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-800"
            >
              Cancel
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
        {!isEditing && (
          <button
            type="button"
            // onClick={handleDelete}
            disabled={pending}
            className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-800"
          >
            {pending ? "Deleting..." : "Delete Account"}
          </button>
        )}
      </div>
    </form>
  );
}
