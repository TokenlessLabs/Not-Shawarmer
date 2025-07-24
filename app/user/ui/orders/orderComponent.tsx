"use client";

import { useState } from "react";
import { Order } from "../../../lib/definitions";
import { OrderItem } from "../../../lib/definitions";

export default function OrderCompo({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const deliveryCharges = order.delivery_fee ?? 0;

  const subtotal =
    order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ??
    0;

  const total = subtotal + deliveryCharges;

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mb-4 border-l-4 border-blue-500 transition-all duration-300">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl font-semibold">Order #{order.id}</h2>
          <p className="text-sm text-gray-500">
            Order Time: {new Date(order.createdat).toLocaleTimeString()}
          </p>
        </div>
        <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-1 rounded-full">
          {order.status}
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
              {order.items?.length > 0 ? (
                order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} x{item.quantity} – Rs.{" "}
                    {item.price * item.quantity}
                  </li>
                ))
              ) : (
                <li>No items found.</li>
              )}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-md font-semibold mb-1">Delivery Address:</h3>
            <p className="text-sm text-gray-700">{order.address}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Subtotal</span>
              <span>Rs. {subtotal}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Delivery Charges</span>
              <span>Rs. {deliveryCharges}</span>
            </div>
            <div className="flex justify-between font-bold text-base mt-2">
              <span>Total</span>
              <span>Rs. {total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
