"use client";

import React from "react";

type ConfirmModalProps = {
  heading?: string;
  message: string;
  onAccept: () => void;
  onCancel: () => void;
  acceptLabel?: string;
  cancelLabel?: string;
  isProcessing?: boolean;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  heading = "Are you sure?",
  message,
  onAccept,
  onCancel,
  acceptLabel = "Confirm",
  cancelLabel = "Cancel",
  isProcessing = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center space-y-5 transition-all duration-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          {heading}
        </h2>
        <p className="text-sm sm:text-base text-gray-600">{message}</p>

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onAccept}
            disabled={isProcessing}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : acceptLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
