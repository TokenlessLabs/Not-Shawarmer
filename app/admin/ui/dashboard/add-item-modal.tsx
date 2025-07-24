"use client";

import React, { useState, useRef, useActionState, useEffect } from "react";
import Image from "next/image";
import { addMenuItem } from "../../lib/actions";

interface AddItemModalProps {
  categories: string[];
  onClose: () => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ categories, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0] ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("/images/placeholder.jpg");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [state, formAction, isPending] = useActionState(addMenuItem, {
    success: false,
    message: null,
    errors: [],
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl("/images/placeholder.jpg");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  return (
    <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-md flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md relative overflow-hidden max-h-[98vh] overflow-y-auto">
        <form action={formAction}>
          {/* Image Upload */}
          <div className="w-full h-52 relative group">
            <Image
              src={previewUrl}
              alt={name || "New item image"}
              width={400}
              height={300}
              className="w-full h-52 object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                className="bg-white text-sm text-gray-700 px-3 py-1 rounded shadow"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isPending}
                className="bg-red-100 text-sm text-red-700 px-3 py-1 rounded shadow"
              >
                Remove Image
              </button>
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 border rounded px-3 py-2 text-gray-800"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Description</label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 border rounded px-3 py-2 h-11 text-gray-800"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Price</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full mt-1 border rounded px-3 py-2 text-gray-800"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Category</label>
              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1 border rounded px-3 py-2 text-gray-800"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Display errors */}
            {state.errors && state.errors?.length > 0 && (
              <div className="mt-2 space-y-1 text-sm text-red-600">
                {state.errors.map((error, i) => (
                  <div key={i}>• {error}</div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="bg-theme-blue hover:bg-theme-bluehighlighted text-white px-4 py-2 rounded"
              >
                {isPending ? "Adding..." : "Add Item"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
