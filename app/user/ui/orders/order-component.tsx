"use client";

import { useState } from "react";
import { Order } from "../../lib/definitions";
import {
  ClockIcon,
  ShoppingBagIcon,
  MapPinIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

export default function OrderCompo({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const deliveryCharges = order.delivery_fee ?? 0;

  const subtotal =
    order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ??
    0;

  const total = subtotal + deliveryCharges;
  const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mb-4 border-l-4 border-theme-blue transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-xl font-semibold">Order</h2>
          <div className="flex items-center text-sm text-gray-500 gap-1">
            <ClockIcon className="h-4 w-4" />
            <span>
              {" "}
              {new Date(order.createdat).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 gap-1 mt-1">
            <ShoppingBagIcon className="h-4 w-4" />
            <span>
              {totalItems} items • Rs. {total}
            </span>
          </div>
        </div>

        <span
          className={`
            text-sm font-medium px-4 py-1 rounded-full
            ${order.status === "Cooking" ? "bg-yellow-100 text-yellow-800" : ""}
            ${order.status === "Dispatched" ? "bg-blue-100 text-blue-800" : ""}
            ${order.status === "Delivered" ? "bg-green-100 text-green-800" : ""}
            ${order.status === "Cancelled" ? "bg-red-100 text-red-800" : ""}
          `}
        >
          {order.status}
        </span>
      </div>

      <div className="flex justify-between items-center mt-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-theme-blue underline focus:outline-none"
        >
          {isExpanded ? "Hide Details" : "View Details"}
        </button>

        {["Cooking", "Dispatched"].includes(order.status) && (
          <a
            href={`/user/orders/${order.id}/delivery/`}
            className="text-sm text-theme-blue underline ml-4"
          >
            View Delivery Status
          </a>
        )}
      </div>


      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div>
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

          {order.instructions && (
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <PencilIcon className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <span className="font-semibold">Instructions:</span>{" "}
                {order.instructions}
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 text-sm text-gray-700">
            <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <span className="font-semibold">Delivery Address:</span>{" "}
              {order.address}
            </div>
          </div>

          {order.status === "Delivered" && order.deliveredat && (
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <ClockIcon className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <span className="font-semibold">Delivered At:</span>{" "}
                {new Date(order.deliveredat).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
            </div>
          )}

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
