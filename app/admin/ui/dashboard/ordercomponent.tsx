'use client'
import { useState } from "react";

export default function OrderComponent() {
  const [isExpanded, setIsExpanded] = useState(false);

  const statuses = [
    { label: "Preparing", color: "bg-yellow-100 text-yellow-800" },
    { label: "Cooking", color: "bg-orange-100 text-orange-800" },
    { label: "Order Dispatched", color: "bg-blue-100 text-blue-800" },
    { label: "Delivered", color: "bg-green-100 text-green-800" },
  ];
  const [statusIndex, setStatusIndex] = useState(0);

  const handleStatusClick = () => {
    const nextIndex = (statusIndex + 1) % statuses.length;
    setStatusIndex(nextIndex);
  };

  const currentStatus = statuses[statusIndex];

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mb-4 border-l-4 border-blue-500 transition-all duration-300">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl font-semibold">Order #001</h2>
          <p className="text-sm text-gray-500">Order Time: 2:15 PM</p>
        </div>

       
        <span
          className={`${currentStatus.color} text-md font-medium px-4 py-1 rounded-full cursor-pointer transition-all duration-300 `}
        >
          {currentStatus.label}
          <button onClick={handleStatusClick} className="mx-2"> 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
            </svg>
            </button>
        </span>
        
      </div>

      <div className="text-right">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 underline focus:outline-none"
        >
          {isExpanded ? "Hide Details" : "View Details"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4">
          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2">Items:</h3>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li>Zinger Burger x2 – Rs. 900</li>
              <li>Fries x1 – Rs. 200</li>
              <li>Cold Drink x2 – Rs. 300</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-md font-semibold mb-1">Delivery Address:</h3>
            <p className="text-sm text-gray-700">
              123-B Street, Model Town, Lahore
            </p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Subtotal</span>
              <span>Rs. 1400</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Delivery Charges</span>
              <span>Rs. 150</span>
            </div>
            <div className="flex justify-between font-bold text-base mt-2">
              <span>Total</span>
              <span>Rs. 1550</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
