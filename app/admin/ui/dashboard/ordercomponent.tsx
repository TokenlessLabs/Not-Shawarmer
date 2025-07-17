'use client'

import { useState } from "react";
import { Order } from "@/app/user/lib/definitions"; // adjust path if needed

type Props = {
  order: Order;
};

export default function OrderComponent({ order }: Props) {
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
const deliveryCharges = order.delivery_fee ?? 0;

  const subtotal = order.items?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) ?? 0;

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 mb-4 border-l-4 border-blue-500 transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-lg font-semibold">Order #{order.id}</h2>
          <p className="text-sm text-gray-500">
            Order Time: {new Date(order.createdat).toLocaleTimeString()}
          </p>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <div
            className={`${currentStatus.color} text-sm font-medium px-3 py-1 rounded-full cursor-pointer flex items-center space-x-2`}
          >
            <span>{currentStatus.label}</span>
            <button onClick={handleStatusClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061a1.125 1.125 0 01-1.683-.977V8.69Z" />
              </svg>
            </button>
          </div>
          <button className="bg-red-500 text-white text-xs px-3 py-1 rounded shadow hover:bg-red-600 transition">
            Cancel Order
          </button>
        </div>
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
        <div className="mt-4 text-sm text-gray-700">
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Items:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {order.items?.map((item, index) => (
                <li key={index}>
                  {item.name} x{item.quantity} – Rs. {item.price}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-1">Delivery Address:</h3>
            <p>{order.address ?? "No address provided"}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-1">
  <span>Subtotal</span>
  <span>Rs. {subtotal}</span>
</div>
<div className="flex justify-between mb-1">
  <span>Delivery Charges</span>
  <span>Rs. {deliveryCharges}</span>
</div>
<div className="flex justify-between font-bold text-base mt-2">
  <span>Total</span>
  <span>Rs. {subtotal + deliveryCharges}</span>
</div>

          </div>
        </div>
      )}
    </div>
  );
}
