"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Cart() {
  const [animate, setAnimate] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [shiftUp, setShiftUp] = useState(false);

  // Function to calculate total items in the cart
  const updateCartCount = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalCount = storedCart.reduce(
      (sum: number, item: { quantity: number }) => sum + item.quantity,
      0
    );
    setItemCount(totalCount);
  };

  useEffect(() => {
    updateCartCount(); // Initial count on mount

    const handleCartAdd = () => {
      setAnimate(true);
      updateCartCount(); // Update count on item add
      setTimeout(() => setAnimate(false), 500); // Reset animation
    };

    window.addEventListener("cart-add", handleCartAdd);
    return () => window.removeEventListener("cart-add", handleCartAdd);
  }, []);

  // Observe footer intersection
  useEffect(() => {
    const footer = document.getElementById("page-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShiftUp(entry.isIntersecting);
        });
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed right-4 z-50 transition-all duration-300 ${
        shiftUp ? "bottom-24" : "bottom-4"
      }`}
    >
      <Link
        href="/user/dashboard/cart"
        className={`relative w-16 h-16 rounded-full shadow-lg bg-theme-blue flex items-center justify-center transition-transform duration-300 ${
          animate ? "scale-110" : ""
        }`}
      >
        <ShoppingCartIcon className="w-6 h-6 text-white" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {itemCount}
          </span>
        )}
      </Link>
    </div>
  );
}
