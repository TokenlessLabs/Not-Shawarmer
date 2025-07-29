"use client";

import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import AddItemModal from "./add-item-modal";
import AddCategoryModal from "./add-category-modal";

type FloatingButtonProps = {
  categories: string[];
};

export default function FloatingButton({ categories }: FloatingButtonProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [shiftUp, setShiftUp] = useState(false);

  // Observe footer intersection
  useEffect(() => {
    const footer = document.getElementById("page-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShiftUp(entry.isIntersecting);
        });
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Floating Action Button */}
      <div
        className={`fixed right-4 z-50 transition-all duration-300 ${
          shiftUp ? "bottom-24" : "bottom-4"
        }`}
      >
        <div className="relative">
          {showOptions && (
            <ul className="absolute bottom-20 right-0 bg-white shadow-lg rounded-xl p-2 space-y-1 border border-gray-200 animate-slide-up w-44">
              <li
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setShowAddItemModal(true);
                  setShowOptions(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                Add Item
              </li>
              <li
                onClick={() => {
                  setShowAddCategoryModal(true);
                  setShowOptions(false);
                  setShowAddItemModal(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                Add Category
              </li>
            </ul>
          )}

          <button
            onClick={() => setShowOptions(!showOptions)}
            className="bg-theme-blue p-4 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-theme-dark-blue transition"
            title="Actions"
          >
            <PlusIcon />
          </button>
        </div>
      </div>

      {showAddItemModal && (
        <AddItemModal
          categories={categories}
          onClose={() => setShowAddItemModal(false)}
        />
      )}

      {showAddCategoryModal && (
        <AddCategoryModal onClose={() => setShowAddCategoryModal(false)} />
      )}
    </>
  );
}
