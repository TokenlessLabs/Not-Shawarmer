"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Loading() {
  const pathname = usePathname();

  if (pathname !== "/user/orders" && pathname !== "/user/orders/past") {
    // Custom skeleton for delivery page
    return (
      <div className="h-screen w-full flex flex-col md:flex-row animate-pulse bg-white text-theme-dark-blue">
        {/* Left - Map Placeholder */}
        <div className="w-full md:w-1/2 h-96 md:h-full bg-gray-200 rounded" />

        {/* Right - Delivery Info */}
        <div className="w-full md:w-1/2 flex flex-col px-6 py-8 space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto" />

          {/* Delivery Steps */}
          <div className="flex flex-col gap-5 mt-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-4 rounded-full bg-gray-400" />
                <div className="h-4 w-32 bg-gray-300 rounded" />
              </div>
            ))}
          </div>

          <hr className="border-theme-dark-blue/30 my-4" />

          {/* Order Summary */}
          <div className="overflow-y-auto flex-1">
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-3" />

            {/* Order items */}
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex justify-between text-sm mb-2 items-center"
              >
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            ))}

            {/* Delivery fee */}
            <div className="flex justify-between text-sm mt-4">
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Total */}
          <div className="pt-4 mt-auto">
            <div className="flex justify-between text-lg font-bold border-t border-theme-dark-blue/30 pt-4">
              <div className="h-6 w-1/4 bg-gray-300 rounded" />
              <div className="h-6 w-24 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default orders skeleton
  return (
    <div className="min-h-screen bg-gray-100 p-5 animate-pulse mt-3">

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white shadow rounded-lg p-6 border border-gray-200 flex justify-between items-start"
          >
            <div className="space-y-2 w-full">
              <div className="h-7 bg-gray-300 rounded w-1/11 " />
              <div className="h-5 bg-gray-200 rounded w-1/9 mt-1" />
              <div className="h-5 bg-gray-100 rounded w-1/7 mt-1" />
            </div>
            <div className="flex flex-col space-y-2 ml-4">
              <div className="w-20 h-8 bg-gray-300 rounded" />
              <div className="w-20 h-8 bg-gray-200 rounded mt-7" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
