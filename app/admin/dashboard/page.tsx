'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "../ui/dashboard/card";
import FloatingButton from "../ui/dashboard/addbtn";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

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

  const [showEdit, setShowEdit] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    { label: "Available", color: "bg-yellow-100 text-yellow-800" },
    { label: "Unavailable", color: "bg-red-100 text-red-800" },
  ];

  const handleStatusClick = () => {
    const nextIndex = (statusIndex + 1) % statuses.length;
    setStatusIndex(nextIndex);
  };

  const currentStatus = statuses[statusIndex];

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

  const showBlur = showEdit || showUpload;

  return (
    <>
      {/* Background Blur Overlay */}
      {showBlur && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 z-10 pointer-events-none select-none"></div>
      )}

      {/* Search + Filter */}
      <div className="flex justify-center mt-7 px-4 pt-5 transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl">
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
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-full bg-white text-gray-700"
          >
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
              <Card
                key={item.id}
                itemname={item.name}
                itemprice={item.price}
                onClick={() => setShowEdit(true)}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No items found.</p>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="bg-theme-light-blue p-6 rounded-xl shadow-2xl w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Item to Menu</h2>
         <div className="relative bg-white rounded-xl p-2">
  <img
    src="/images/burger.jpg"
    alt="image"
    className="h-50 w-full object-cover rounded-lg"
  />
  <button
    onClick={() => {
      setShowUpload(true);
     
    }}
    className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 z-10"
  >
    📷
  </button>
</div>


            <div className="space-y-4 mt-4">
              <input className="w-full p-2 rounded shadow-xl" placeholder="Name" />
              <input className="w-full p-2 rounded shadow-xl" type="number" placeholder="Price" />
              <input className="w-full p-2 rounded shadow-xl" placeholder="Category" />
              <div
                className={`${currentStatus.color} text-sm font-medium px-3 py-1 rounded-full cursor-pointer flex items-center space-x-2 w-fit`}
              >
                <span>{currentStatus.label}</span>
                <button onClick={handleStatusClick}>🔄</button>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowEdit(false)}
                className="bg-red-500 text-white font-bold px-4 py-2 rounded shadow-xl"
              >
                Close
              </button>
              <button className="bg-theme-blue text-white font-bold px-4 py-2 rounded shadow-xl">
                Edit Item
              </button>
              <button className="bg-theme-blue text-white font-bold px-4 py-2 rounded shadow-xl">
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}

      
      {showUpload && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="bg-theme-light-blue p-6 rounded-xl shadow-2xl w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
            <input type="file" className="w-full h-52 relative bg-white rounded-xl flex items-center justify-center text-gray-500"/>
              
           
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowUpload(false)}
                className="bg-theme-blue text-white font-bold px-4 py-2 rounded shadow-xl"
              >
                Upload Image
              </button>
              <button
                onClick={() => setShowUpload(false)}
                className="bg-red-500 text-white font-bold px-4 py-2 rounded shadow-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <FloatingButton />
    </>
  );
}
