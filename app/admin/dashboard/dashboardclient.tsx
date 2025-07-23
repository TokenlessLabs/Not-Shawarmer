"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/app/user/ui/dashboard/menu-item-card";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { MenuItem } from "@/app/user/lib/definitions";
import MenuItemModal from "../ui/dashboard/menu-item-modal";
import FloatingButton from "../ui/dashboard/addbtn";

type DashboardClientProps = {
  categories: string[];
  menuItems: MenuItem[];
};

export default function DashboardClient({
  categories,
  menuItems,
}: DashboardClientProps) {
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menuItems);
  const [searchValue, setSearchValue] = useState("");

  const statuses = [
    { label: "Available", color: "bg-yellow-100 text-yellow-800" },
    { label: "Unavailable", color: "bg-red-100 text-red-800" },
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedItem, setSelectedItem] = useState<MenuItem>();

  const categoryBarRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const value = searchValue.toLowerCase();
    const filtered = menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(value);
      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && item.status === "Available") ||
        (availabilityFilter === "unavailable" && item.status === "Unavailable");
      return matchesSearch && matchesAvailability;
    });
    setFilteredItems(filtered);
  }, [searchValue, availabilityFilter, menuItems]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      searchValue ? params.set("query", searchValue) : params.delete("query");
      router.replace(`?${params.toString()}`);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchValue, searchParams, router]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const scrollToCategory = (category: string, idx: number) => {
    setActiveCategory(category);
    const section = document.getElementById(category);
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });

    const button = buttonRefs.current[idx];
    const container = categoryBarRef.current;
    if (button && container) {
      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.offsetWidth;
      const containerWidth = container.offsetWidth;

      container.scrollTo({
        left: buttonLeft - containerWidth / 2 + buttonWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const handleDeleteCategory = (categoryName: string) => {
    // Add confirmation or logic to delete
    console.log(`Delete category: ${categoryName}`);
  };

  return (
    <>
      {/* Search + Filter */}
      <div className="flex justify-center mt-7 px-4 pt-5">
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
            className="w-42 px-3 py-2 border border-gray-300 rounded-full bg-white text-gray-700"
          >
            <option value="all">Filter: All</option>
            <option value="available">Filter: Available</option>
            <option value="unavailable">Filter: Unavailable</option>
          </select>
        </div>
      </div>

      {/* Category bar */}
      <div
        ref={categoryBarRef}
        className="sticky top-0 bg-white z-10 overflow-x-auto whitespace-nowrap py-3 shadow-sm border-t border-b my-6 pl-6 md:pl-10"
      >
        <div className="flex gap-4 w-max">
          {categories.map((category, idx) => (
            <button
              key={idx}
              ref={(el) => {
                buttonRefs.current[idx] = el;
              }}
              onClick={() => scrollToCategory(category, idx)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeCategory === category
                  ? "bg-theme-bluehighlighted text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 md:px-10">
        {searchValue ? (
          <div className="mb-12 scroll-mt-24">
            <h2 className="text-2xl my-5 border-b-2">Search Results</h2>
            {filteredItems.length === 0 ? (
              <p>No items found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    item={item}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          categories.map((category, idx) => {
            const itemsInCategory = filteredItems.filter(
              (item) => item.category === category
            );
            return (
              <div key={idx} id={category} className="mb-12 scroll-mt-24">
                <div className="flex items-center justify-between my-5 border-b-2">
                  <h2 className="text-2xl">{category}</h2>
                  <TrashIcon
                    className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-700 transition"
                    onClick={() => handleDeleteCategory(category)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {itemsInCategory.map((item) => (
                    <Card
                      key={item.id}
                      item={item}
                      onClick={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal for editing item */}
      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(undefined)}
        />
      )}

      <FloatingButton />
    </>
  );
}
