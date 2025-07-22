'use client';

import React, { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AddressBar from "../ui/dashboard/address-bar";
import Card from "../ui/dashboard/menu-item-card";
import Cart from "../ui/dashboard/cart";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import OrderHandle from "../ui/dashboard/order-handle";

const categories: string[] = [
  "Starters", "Main Course", "Drinks", "Desserts",
  "Snacks", "Combos", "Pizza", "Burgers",
  "Snacks1", "Combos1", "Pizza1", "Burgers1",
  "Snacks3", "Combos3", "Pizza3", "Burgers3",
];

// Dummy item data to simulate search filter
const allItems = categories.flatMap((category, i) => [
  { id: `${category}-1`, title: `${category} Item 1`, category },
  { id: `${category}-2`, title: `${category} Item 2`, category },
  { id: `${category}-3`, title: `${category} Item 3`, category },
]);

const DashboardPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);

  const categoryBarRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [searchValue, setSearchValue] = useState(searchQuery);

  const filteredItems = allItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToCategory = (category: string, idx: number) => {
    setActiveCategory(category);

    const section = document.getElementById(category);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);

    const params = new URLSearchParams(searchParams);
    if (newValue) {
      params.set("query", newValue);
    } else {
      params.delete("query");
    }
    router.replace(`?${params.toString()}`);
  };

  return (
    <>
      <AddressBar />

      {/* Search bar */}
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

      {/* Category bar */}
      <div
        ref={categoryBarRef}
        className="sticky top-0 bg-white z-10 overflow-x-auto whitespace-nowrap py-3 shadow-sm border-b my-6 pl-6 md:pl-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-4 w-max">
          {categories.map((category, idx) => (
            <button
              key={idx}
              ref={(el) => {
                buttonRefs.current[idx] = el;
              }}
              onClick={() => scrollToCategory(category, idx)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition 
                ${
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

      {/* Display Filtered or All Items */}
      <div className="px-6 md:px-10">
        {searchQuery ? (
          <div className="mb-12 scroll-mt-24">
            <h2 className="text-2xl my-5 border-b-2">Search Results</h2>
            {filteredItems.length === 0 ? (
              <p>No items found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <Card key={item.id} onClick={() => setShowModal(true)} />
                ))}
              </div>
            )}
          </div>
        ) : (
          categories.map((category, idx) => (
            <div key={idx} id={category} className="mb-12 scroll-mt-24">
              <h2 className="text-2xl my-5 border-b-2">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Card onClick={() => setShowModal(true)} />
                <Card onClick={() => setShowModal(true)} />
                <Card onClick={() => setShowModal(true)} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-md flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md relative overflow-hidden">
            <div className="w-full h-52 relative">
              <img
                src="/images/burger.jpg"
                alt="image"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
            </div>

            <div className="p-6 space-y-5">
              <h2 className="text-2xl font-bold text-gray-800">Spicy Chicken Burger</h2>
              <p className="text-gray-500 text-sm">
                Juicy grilled chicken, fresh lettuce, spicy mayo, served on a toasted bun.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl"
                  >
                    –
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-red-500 text-white font-bold px-4 py-2 rounded shadow-xl hover:px-5 hover:bg-red-700 transition-all duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-theme-blue text-white font-bold px-4 py-2 rounded shadow-xl hover:px-5 hover:bg-theme-dark-blue transition-all duration-200"
                >
                  Add to Cart <span className="ml-3">Rs. 1,2334</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Cart />
      <OrderHandle />
    </>
  );
};

export default DashboardPage;
