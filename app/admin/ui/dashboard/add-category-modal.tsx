"use client";

import React, { useState } from "react";
import { addCategory } from "../../lib/actions";

interface AddCategoryModalProps {
  onClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    setError("");
    setIsLoading(true);
    const res = await addCategory(name);
    setIsLoading(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-[90%] max-w-md border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Add Category
        </h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Category Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Beverages"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-theme-blue focus:border-theme-blue"
            />
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={isLoading}
            className="bg-theme-blue text-white px-4 py-2 rounded hover:bg-theme-bluehighlighted transition disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
