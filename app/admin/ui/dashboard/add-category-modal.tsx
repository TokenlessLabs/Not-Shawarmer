import React from "react";

interface AddCategoryModalProps {
  onClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50">
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
            onClick={onClose}
            className="bg-red-500 text-white font-bold px-4 py-2 rounded shadow-xl hover:px-5 hover:bg-red-700 transition-all duration-200"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="bg-theme-blue text-white font-bold px-4 py-2 rounded shadow-xl hover:px-5 hover:bg-theme-dark-blue transition-all duration-200"
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
