"use client";

import React, { useState, useRef, useActionState, useEffect } from "react";
import Image from "next/image";
import { ErrorState, MenuItem } from "@/app/user/lib/definitions";
import { updateMenuItem, deleteMenuItem } from "../../lib/actions";
import { useTransition } from "react";
import ConfirmModal from "../confirmation-modal";

type UpdateMenuItemModalProps = {
  item: MenuItem;
  categories: string[];
  onClose: () => void;
};

const UpdateMenuItemModal: React.FC<UpdateMenuItemModalProps> = ({
  item,
  categories,
  onClose,
}) => {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description ?? "");
  const [price, setPrice] = useState(Number(item.price).toFixed(2));
  const [isavailable, setIsAvailable] = useState<boolean>(
    item.isavailable ?? true
  );
  const [category, setCategory] = useState(item.category);
  const [showConfirm, setShowConfirm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    item.image ? item.image : "/images/placeholder.jpg"
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<ErrorState, FormData>(
    updateMenuItem,
    {
      success: undefined,
      message: null,
      errors: [],
    }
  );

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
    const loadInitialImage = async () => {
      if (item.image && !imageFile) {
        try {
          const response = await fetch(item.image);
          const blob = await response.blob();

          // Extract filename from URL or use a default
          const filename = item.image.split("/").pop() || "image.jpg";
          const file = new File([blob], filename, { type: blob.type });

          setImageFile(file);
        } catch (error) {
          console.error("Error converting Cloudinary URL to file:", error);
        }
      }
    };

    loadInitialImage();
  }, [item.image, imageFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", item.id.toString());
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("isavailable", String(isavailable));
    formData.append("category", category);
    if (imageFile !== null) {
      formData.append("image", imageFile);
    } else {
      formData.append("removeImage", "true");
    }

    startTransition(async () => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteMenuItem(item.id);
    setIsDeleting(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-md flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md relative overflow-y-auto max-h-[98vh]">
          <form onSubmit={handleSubmit}>
            {/* Image Preview */}
            <div className="w-full h-52 relative group">
              <Image
                src={previewUrl}
                alt={name}
                width={400}
                height={300}
                className="w-full h-52 object-cover"
              />

              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending || isDeleting}
                  className="bg-white text-sm text-gray-700 px-3 py-1 rounded shadow"
                >
                  Change Image
                </button>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isPending || isDeleting}
                  className="bg-red-100 text-sm text-red-700 px-3 py-1 rounded shadow"
                >
                  Remove Image
                </button>

                <input
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
                  className="w-full mt-1 border rounded px-3 py-2 h-17 text-gray-800"
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

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="isavailable"
                  name="isavailable"
                  checked={isavailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="isavailable" className="text-sm text-gray-700">
                  {isavailable ? "Available" : "Unavailable"}
                </label>
              </div>

              {state?.errors && state?.errors?.length > 0 && (
                <ul className="text-red-500 text-sm mt-2 space-y-1">
                  {state.errors.map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                </ul>
              )}

              <div className="mt-6 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  disabled={isPending || isDeleting}
                  className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-700 cursor-pointer"
                >
                  Delete Item
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isPending || isDeleting}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending || isDeleting}
                    className="bg-theme-blue hover:bg-theme-bluehighlighted text-white px-4 py-2 rounded cursor-pointer"
                  >
                    {isPending ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      {showConfirm && (
        <ConfirmModal
          heading="Delete Menu Item"
          message="Are you sure you want to delete this item? This action cannot be undone."
          onAccept={handleDelete}
          onCancel={() => setShowConfirm(false)}
          isProcessing={isDeleting}
          acceptLabel="Yes, Delete"
          cancelLabel="Cancel"
        />
      )}
    </>
  );
};

export default UpdateMenuItemModal;
