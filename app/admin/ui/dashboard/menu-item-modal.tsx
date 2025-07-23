"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { MenuItem } from "@/app/user/lib/definitions";
import { updateMenuItem, deleteMenuItem } from "../../lib/actions";

type MenuItemModalProps = {
  item: MenuItem;
  onClose: () => void;
};

const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, onClose }) => {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description ?? "");
  const [price, setPrice] = useState(Number(item.price).toFixed(2));
  const [status, setStatus] = useState(item.status ?? "Available");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    item.image ? item.image : "/images/placeholder.jpg"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData();
    formData.append("id", item.id.toString());
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("status", status);
    if (imageFile !== null) {
      formData.append("image", imageFile);
    } else {
      formData.append("removeImage", "true");
    }

    await updateMenuItem(formData);
    setIsSaving(false);
    onClose();
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    setIsDeleting(true);
    await deleteMenuItem(item.id);
    setIsDeleting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-md flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md relative overflow-hidden">
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
                disabled={isSaving || isDeleting}
                className="bg-white text-sm text-gray-700 px-3 py-1 rounded shadow"
              >
                Change Image
              </button>

              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isSaving || isDeleting}
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
              <label className="text-sm text-gray-500">Status</label>
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-1 border rounded px-3 py-2 text-gray-800"
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving || isDeleting}
                className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-700"
              >
                {isDeleting ? "Deleting..." : "Delete Item"}
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving || isDeleting}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isDeleting}
                  className="bg-theme-blue hover:bg-theme-bluehighlighted text-white px-4 py-2 rounded"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemModal;
