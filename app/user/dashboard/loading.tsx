
"use client";
import React from "react";

// 🟦 Search bar skeleton
function SearchBarSkeleton() {
  return (
    <div className="flex justify-center mt-7">
      <div className="flex items-center gap-2 w-full max-w-5xl mx-auto mt-8 px-4">
        <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
        <div className="flex-grow h-10 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

// 🟦 Category button skeleton
function CategorySkeleton() {
  return (
    <div className="h-8 w-24 bg-gray-300 rounded-full animate-pulse" />
  );
}

// 🟦 Card layout skeleton
function CardSkeleton() {
  return (
    <div className="animate-pulse bg-white/30 rounded-xl p-4 border border-gray-200 shadow-sm space-y-4">
      <div className="bg-gray-300 h-32 w-full rounded-md" /> {/* Image */}
      <div className="h-4 bg-gray-300 rounded w-3/4" />       {/* Title */}
      <div className="h-4 bg-gray-200 rounded w-1/2" />       {/* Price */}
    </div>
  );
}

// 🟦 Address bar skeleton
function AddressBarSkeleton() {
  return (
    <div className="flex justify-center w-full mt-4">
      <nav className="bg-theme-blue p-4 rounded-b-lg shadow-md flex items-center gap-4 w-full max-w-5xl">
        <div className="text-white w-32 h-4 bg-white/30 rounded animate-pulse" />
        <div className="flex-grow h-10 bg-white/70 rounded-md animate-pulse" />
        <div className="w-20 h-10 bg-white rounded-md animate-pulse" />
      </nav>
    </div>
  );
}

// 🟦 Page-level skeleton
export default function Loading() {
  return (
    <div className="px-6 md:px-10">
      {/* Address Bar */}
      <AddressBarSkeleton />

      {/* Search Bar */}
      <SearchBarSkeleton />

      {/* Category Bar */}
      <div
        className="sticky top-0 bg-white z-10 overflow-x-auto whitespace-nowrap py-3 shadow-sm border-t border-b my-6 pl-6 md:pl-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex gap-4 w-max">
          {Array.from({ length: 6 }).map((_, idx) => (
            <CategorySkeleton key={idx} />
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {Array.from({ length: 8 }).map((_, idx) => (
          <CardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}
