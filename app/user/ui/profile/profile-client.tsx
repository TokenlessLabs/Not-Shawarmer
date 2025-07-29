"use client";

import React, {
  useState,
  useTransition,
  useActionState,
  useEffect,
} from "react";
import { updateUser, deleteUserAccountAndLogout } from "../../lib/actions";
import { User, ErrorState } from "../../lib/definitions";
import ProfileForm from "./profile-form";
import ConfirmModal from "@/app/admin/ui/confirmation-modal";

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
  const [actionState, setActionState] = useState<ErrorState>({
    success: false,
    message: null,
    errors: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [isPendingDelete, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      deleteUserAccountAndLogout();
    });
  };

  const handleChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setActionState(state);
  }, [state]);

  const resetForm = () => {
    setFormData(user);
    setIsEditing(false);
    setActionState({
      message: null,
      success: false,
      errors: [],
    });
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
          actionState.errors?.map((err, i) => (
            <p key={i} className="text-red-500 text-sm">
              {err}
            </p>
          ))}

        {isEditing && actionState.message && (
          <p className="text-red-500 text-sm">{actionState.message}</p>
        )}

        {isEditing && actionState.success && (
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
              onClick={() => resetForm()}
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
            {user.role === "User" && (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600"
              >
                Delete Account
              </button>
            )}
            {showModal && (
              <ConfirmModal
                heading="Delete Your Account?"
                message="This action is irreversible. Are you sure you want to delete your account?"
                onAccept={handleDelete}
                onCancel={() => setShowModal(false)}
                isProcessing={isPendingDelete}
                acceptLabel="Yes, Delete"
                cancelLabel="Cancel"
              />
            )}
          </div>
        )}
      </div>
    </form>
  );
}
