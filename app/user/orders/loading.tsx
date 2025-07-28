import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100 p-5 animate-pulse mt-3">
      <div className="flex justify-center mb-6 space-x-6">
        <div className="w-32 h-6 bg-blue-200 rounded" />
        <div className="w-32 h-6 bg-gray-300 rounded" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white shadow rounded-lg p-6 border border-gray-200 flex justify-between items-start"
          >
            {/* Left content placeholders */}
            <div className="space-y-2 w-full">
              <div className="h-7 bg-gray-300 rounded w-1/11 " />
              <div className="h-5 bg-gray-200 rounded w-1/9 mt-1" />
              <div className="h-5 bg-gray-100 rounded w-1/7 mt-1" />
            </div>

            {/* Right-side vertical buttons */}
            <div className="flex flex-col space-y-2 ml-4">
              <div className="w-20 h-8 bg-gray-300 rounded" />
              <div className="w-20 h-8 bg-gray-200 rounded mt-7"   />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
