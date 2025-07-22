"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "../ui/dashboard/card";
import FloatingButton from "../ui/dashboard/addbtn";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

// Example static data
const menuItems = [
  { id: 1, name: "Chicken Wings", price: 500 },
  { id: 2, name: "Garlic Bread", price: 350 },
  { id: 3, name: "Spring Rolls", price: 400 },
  { id: 4, name: "French Fries", price: 300 },
  { id: 5, name: "Cheese Balls", price: 450 },
  { id: 6, name: "Samosa", price: 200 },
  { id: 7, name: "Nuggets", price: 480 },
  { id: 8, name: "Onion Rings", price: 370 },
];


export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("query") || "");
  const [filteredItems, setFilteredItems] = useState(menuItems);

  // Update filtered items on search change
  useEffect(() => {
    const value = searchValue.toLowerCase();
    const filtered = menuItems.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
    setFilteredItems(filtered);
  }, [searchValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);

    const params = new URLSearchParams(searchParams.toString());
    if (newValue) {
      params.set("query", newValue);
    } else {
      params.delete("query");
    }

    router.replace(`?${params.toString()}`);
  };

  return (
    <>
      {/* Search Bar */}
      <div className="flex justify-center mt-7">
        <div className="flex items-center gap-2 w-full max-w-5xl mx-auto mt-8 px-4">
          <MagnifyingGlassIcon className="text-gray-500 w-8 h-8" />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={handleSearchChange}
            className="flex-grow px-4 py-2 rounded-full border border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Menu Items */}
      <div className="m-10">
        <h1 className="text-2xl my-5 border-b-2">Starter</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
            <Card key={item.id} itemname={item.name} itemprice={item.price} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No items found.</p>
          )}
        </div>
      </div>

      <FloatingButton />
    </>
  );
}
