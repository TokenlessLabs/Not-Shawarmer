// cart.tsx
"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Cart() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const handleCartAdd = () => {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 500); // Reset after 500ms
    };

    window.addEventListener("cart-add", handleCartAdd);
    return () => window.removeEventListener("cart-add", handleCartAdd);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link
        href="/user/dashboard/cart"
        className={`w-16 h-16 rounded-full shadow-lg bg-theme-blue flex items-center justify-center transition-transform duration-300 ${
          animate ? "scale-10" : ""
        }`}
      >
        <ShoppingCartIcon className="w-6 h-6 text-white" /> 
      </Link>
    </div>
  );
}
