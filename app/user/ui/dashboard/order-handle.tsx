"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Order } from "@/app/user/lib/definitions";

const OrderHandle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/current-orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch current orders:", error);
      }
    }
    fetchOrders();
  }, []);

  return (
    <>
      {/* Sliding Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg border-l border-gray-300 z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0 w-80" : "translate-x-full w-80"
        }`}
      >
        <div className="p-6 overflow-y-auto h-full space-y-8">
          {!orders || orders.length === 0 ? (
            <p className="text-sm text-gray-500">No active orders found.</p>
          ) : (
            orders.map((order, index) => {
              const total = order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );

              return (
                <div key={index} className="space-y-4">
                  {/* Order Heading */}
                  <h2 className="text-xl font-bold text-theme-dark-blue">
                    Order #{order.id}
                  </h2>

                  {/* Items List */}
                  <div>
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm text-gray-800"
                      >
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span>Rs {item.quantity * item.price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between text-base font-semibold text-theme-dark-blue">
                    <span>Total:</span>
                    <span>Rs {total}</span>
                  </div>

                  {/* Address */}
                  <div>
                    <p className="text-sm font-semibold text-theme-dark-blue">
                      Delivering to:
                    </p>
                    <p className="text-sm text-gray-700">{order.address}</p>
                  </div>

                  {/* Status and Show Details Button */}
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-sm font-semibold text-theme-dark-blue">
                        Status:
                      </p>
                      <span
                        className={`
                          inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full
                          ${
                            order.status === "Cooking"
                              ? "bg-yellow-200 text-yellow-800"
                              : ""
                          }
                          ${
                            order.status === "Dispatched"
                              ? "bg-blue-200 text-blue-800"
                              : ""
                          }
                          ${
                            order.status === "Delivered"
                              ? "bg-green-200 text-green-800"
                              : ""
                          }
                          ${
                            order.status === "Cancelled"
                              ? "bg-red-200 text-red-800"
                              : ""
                          }
                        `}
                      >
                        {order.status}
                      </span>
                    </div>

                    <Link
                      href={`/user/orders/${order.id}/delivery`}
                      className="text-sm mt-5 text-blue-600 font-medium underline hover:text-blue-800"
                    >
                      Show Details
                    </Link>
                  </div>

                  {/* Divider */}
                  {index !== orders.length - 1 && (
                    <hr className="border-t border-gray-300" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Arrow Handle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 right-0 transform -translate-y-1/2 z-50 bg-gray-300 hover:bg-gray-400 w-6 h-20 rounded-l-md flex items-center justify-center cursor-pointer transition-all duration-200`}
      >
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </div>
    </>
  );
};

export default OrderHandle;
