import { useState } from "react";

export default function FloatingButton() {
  const [showOptions, setShowOptions] = useState(false);
  const [showAddItemBox, setShowAddItemBox] = useState(false);
  const [showAddCatagory, setShowAddCatagory] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative">
          {showOptions && (
            <ul className="absolute bottom-20 right-0 bg-white shadow-lg rounded-xl p-2 space-y-1 border border-gray-200 animate-slide-up w-44">
              <li
                onClick={() => {
                  setShowAddCatagory(false);
                  setShowAddItemBox(true);
                  setShowOptions(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                Add Item
              </li>
              <li
                onClick={() => {
                  setShowAddCatagory(true); 
                  setShowOptions(false);
                  setShowAddItemBox(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                Add Category
              </li>
            </ul>
          )}

          <button
            onClick={() => setShowOptions(!showOptions)}
            className="bg-theme-blue text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-theme-dark-blue transition"
            title="Actions"
          >
            +
          </button>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddItemBox && (
        <div className="fixed inset-0 z-40 flex justify-center items-center">
          <div className="bg-theme-light-blue p-6 rounded-xl shadow-2xl w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Item to Menu</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="block mb-1 font-medium">Name:</span>
                <input
                  type="text"
                  placeholder="Enter item name"
                  className="w-full p-2 rounded shadow-xl"
                />
              </label>
              <label className="block">
                <span className="block mb-1 font-medium">Price:</span>
                <input
                  type="number"
                  placeholder="Enter price"
                  className="w-full p-2 rounded shadow-xl"
                />
              </label>
              <label className="block">
                <span className="block mb-1 font-medium">Category:</span>
                <input
                  type="text"
                  placeholder="Enter category"
                  className="w-full p-2 rounded shadow-xl"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddItemBox(false)}
                className="bg-red-500 text-white font-bold px-4 py-2 rounded shadow-xl hover:px-5 hover:bg-red-700 transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={() => setShowAddItemBox(false)}
                className="bg-theme-blue text-white font-bold px-4 py-2 rounded shadow-xl hover:px-5 hover:bg-theme-dark-blue transition-all duration-200"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddCatagory && (
        <div className="fixed inset-0 z-40 flex justify-center items-center">
          <div className="bg-theme-light-blue p-6 rounded-xl shadow-2xl w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Category</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="block mb-1 font-medium">Category Name:</span>
                <input
                  type="text"
                  placeholder="Enter category name"
                  className="w-full p-2 rounded shadow-xl"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddCatagory(false)} // ✅ fixed setter
                className="bg-red-500 text-white font-bold px-4 py-2 rounded shadow-xl hover:px-5 hover:bg-red-700 transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={() => setShowAddCatagory(false)}
                className="bg-theme-blue text-white font-bold px-4 py-2 rounded shadow-xl hover:px-5 hover:bg-theme-dark-blue transition-all duration-200"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
