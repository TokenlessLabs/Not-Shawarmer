"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [glitchText, setGlitchText] = useState("404");

  // Fake "glitch" effect by randomly changing the text briefly
  useEffect(() => {
    const glitchChars = ["4Ø4", "4O4", "⧖4⧗", "Ξ04", "4⚠️4", "X_X"];
    const interval = setInterval(() => {
      const random = glitchChars[Math.floor(Math.random() * glitchChars.length)];
      setGlitchText(random);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen  px-4">
      <h1 className="text-7xl font-extrabold text-red-600 tracking-wider mb-4 animate-pulse">
        {glitchText}
      </h1>
      <p className="text-2xl font-semibold  mb-2">Uh oh! Page not found.</p>
      <p className="text-gray-400 text-center max-w-md mb-6">
        Either the page is lost in space, or it never existed. Let’s bring you back to base.
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-200 shadow"
      >
        Return Home 🚀
      </button>
    </div>
  );
}
