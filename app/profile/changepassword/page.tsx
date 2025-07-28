"use client";

import Link from "next/link";
import { useActionState } from "react";
import { changePassword } from "@/app/user/lib/actions";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ErrorState } from "@/app/user/lib/definitions";

export default function ChangePasswordForm() {
  const initialState: ErrorState = {
    success: undefined,
    message: null,
    errors: [],
  };
  const [state, formAction] = useActionState(changePassword, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        action={formAction}
        className="w-full max-w-md p-8 bg-white shadow-md rounded-xl space-y-6"
      >
        {/* Back link */}
        <div>
          <Link
            href="/profile"
            className="inline-flex items-center text-theme-blue hover:underline text-sm"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Profile
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800">
          Change Password
        </h2>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            name="currentPassword"
            type="password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-bluehighlighted"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            name="newPassword"
            type="password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-bluehighlighted"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-theme-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-theme-bluehighlighted transition duration-300"
        >
          Change Password
        </button>

        <div>
          {state.errors?.map((err: string, i: number) => (
            <p key={i} className="text-red-500 text-sm">
              {err}
            </p>
          ))}

          {state.message && (
            <p className="text-red-500 text-sm">{state.message}</p>
          )}

          {state.success && (
            <p className="text-green-600 text-sm">
              Password changed successfully!
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
