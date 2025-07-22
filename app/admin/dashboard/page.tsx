"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "../ui/dashboard/card";
import FloatingButton from "../ui/dashboard/addbtn";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

// Mock menu with availability
const menuItems = [
  { id: 1, name: "Chicken Wings", price: 500, available: true },
  { id: 2, name: "Garlic Bread", price: 350, available: true },
  { id: 3, name: "Spring Rolls", price: 400, available: false },
  { id: 4, name: "French Fries", price: 300, available: true },
  { id: 5, name: "Cheese Balls", price: 450, available: false },
  { id: 6, name: "Samosa", price: 200, available: true },
  { id: 7, name: "Nuggets", price: 480, available: false },
  { id: 8, name: "Onion Rings", price: 370, available: true },
];

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("query") || "");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [filteredItems, setFilteredItems] = useState(menuItems);

  useEffect(() => {
    const value = searchValue.toLowerCase();

    const filtered = menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(value);
      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && item.available) ||
        (availabilityFilter === "unavailable" && !item.available);
      return matchesSearch && matchesAvailability;
    });

    setFilteredItems(filtered);
  }, [searchValue, availabilityFilter]);

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
      {/* Search & Filter Bar */}
<div className="flex justify-center mt-7 px-4 pt-5">
  <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl">
    {/* Search */}
    <div className="flex items-center gap-2 w-full md:w-3/4">
      <MagnifyingGlassIcon className="text-gray-500 w-6 h-6" />
      <input
        type="text"
        placeholder="Search..."
        value={searchValue}
        onChange={handleSearchChange}
        className="w-full px-4 py-2 rounded-full border border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400"
      />
    </div>

    {/* Filter */}
    <select
      value={availabilityFilter}
      onChange={(e) => setAvailabilityFilter(e.target.value)}
      className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-full bg-white text-gray-700">
      <option value="all">All</option>
      <option value="available">Available</option>
      <option value="unavailable">Unavailable</option>
    </select>
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
