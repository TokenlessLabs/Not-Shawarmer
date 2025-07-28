"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "../ui/dashboard/menu-item-card";
import Cart from "../ui/dashboard/cart";
import OrderHandle from "../ui/dashboard/order-handle";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { MenuItem } from "../lib/definitions";
import MenuItemModal from "../ui/dashboard/menu-item-modal";

type DashboardClientProps = {
  categories: string[];
  menuItems: MenuItem[];
};

export default function DashboardClient({
  categories,
  menuItems,
}: DashboardClientProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedItem, setSelectedItem] = useState<MenuItem>();

  const categoryBarRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [searchValue, setSearchValue] = useState(searchQuery);

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const debounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      searchValue ? params.set("query", searchValue) : params.delete("query");
      router.replace(`?${params.toString()}`);
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchValue]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute("id");
          if (sectionId) {
            setActiveCategory(sectionId);
          }
          break;
        }
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    categories.forEach((category) => {
      const section = document.getElementById(category);
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      categories.forEach((category) => {
        const section = document.getElementById(category);
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, [categories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const scrollToCategory = (category: string, idx: number) => {
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

  return (
    <>
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
        className="sticky top-0 bg-white z-10 overflow-x-auto whitespace-nowrap py-3 shadow-sm border-t border-b my-6 pl-6 md:pl-10"
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

      {/* Items */}
      <div className="px-6 md:px-10">
        {searchQuery ? (
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
                    onClick={() => {
                      setSelectedItem(item);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          categories.map((category, idx) => {
            const itemsInCategory = menuItems.filter(
              (item) => item.category === category
            );

            return (
              <div key={idx} id={category} className="mb-12 scroll-mt-24">
                <h2 className="text-2xl my-5 border-b-2">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {itemsInCategory.length > 0 ? (
                    itemsInCategory.map((item) => (
                      <Card
                        key={item.id}
                        item={item}
                        onClick={() => {
                          setSelectedItem(item);
                        }}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center text-gray-500 italic">
                      No items in this category.
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(undefined)}
        />
      )}

      <Cart />
      <OrderHandle />
    </>
  );
}
