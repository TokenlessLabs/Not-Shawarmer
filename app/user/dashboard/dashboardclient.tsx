"use client";

import React, { useRef, useState } from "react";
import AddressBar from "../ui/dashboard/address-bar";
import Card from "../ui/dashboard/menu-item-card"; 
import Cart from "../ui/dashboard/cart";
import OrderHandle from "../ui/dashboard/order-handle";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";


const categories: string[] = [
  "Starters", "Main Course", "Drinks", "Desserts",
  "Snacks", "Combos", "Pizza", "Burgers",
  "Snacks1", "Combos1", "Pizza1", "Burgers1",
  "Snacks3", "Combos3", "Pizza3", "Burgers3",
];

export default function DashboardClient() {
  const categoryBarRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);

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

  return (
    <>
      <AddressBar />

      <div className="flex justify-center mt-7">
        <div className="flex items-center gap-2 w-full max-w-5xl mx-auto mt-8 px-4">
          <MagnifyingGlassIcon className="text-gray-500 w-8 h-8" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-grow px-4 py-2 rounded-full border border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400"
          />
        </div>
      </div>

      <div
        ref={categoryBarRef}
        className="sticky top-0 bg-white z-10 overflow-x-auto whitespace-nowrap py-3 shadow-sm border-b my-6 pl-6 md:pl-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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

      {/* ✅ UPDATED SECTION — passing onClick properly to each Card */}
      <div className="px-6 md:px-10">
        {categories.map((category, idx) => (
          <div key={idx} id={category} className="mb-12 scroll-mt-24">
            <h2 className="text-2xl my-5 border-b-2">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <Card onClick={() => console.log(`Clicked 1 in ${category}`)} />
              <Card onClick={() => console.log(`Clicked 2 in ${category}`)} />
              <Card onClick={() => console.log(`Clicked 3 in ${category}`)} />
            </div>
          </div>
        ))}
      </div>

      <Cart />
      <OrderHandle />
    </>
  );
}
