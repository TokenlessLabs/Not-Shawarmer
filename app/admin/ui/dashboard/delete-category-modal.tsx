"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory } from "../../lib/actions";

interface DeleteCategoryModalProps {
  category: string;
  onClose: () => void;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  category,
  onClose,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    const result = await deleteCategory(category);
    setLoading(false);

    if (result.success) {
      onClose(); // Close modal first
      router.refresh(); // Triggers revalidatePath on server
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center text-theme-dark-blue">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm border">
        <h2 className="text-lg font-semibold mb-4">Delete Category</h2>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete{" "}
          <span className="font-medium text-theme-dark-blue">{category}</span>?
        </p>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;
