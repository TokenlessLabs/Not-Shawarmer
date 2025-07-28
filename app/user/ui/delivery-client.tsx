"use client";

import React, { useState } from "react";
import { LatLngExpression } from "leaflet";
import dynamic from "next/dynamic";
import { Order } from "@/app/user/lib/definitions";

const DynamicMap = dynamic(() => import("../ui/map"), {
  ssr: false,
});

const deliveryLocation = {
  lat: 31.5204,
  lng: 74.3587,
};

export default function DeliveryClient({ order }: { order: Order | null }) {
  const [location, setLocation] = useState<LatLngExpression | null>(
    deliveryLocation
  );

  const steps = [
    { label: "Cooking", colorClass: "bg-yellow-400" },
    { label: "Dispatched", colorClass: "bg-orange-400" },
    { label: "Delivered", colorClass: "bg-green-500" },
  ];

  if (!order) {
    return <div className="p-10 text-center text-red-500">No active delivery found.</div>;
  }

  let currentFound = false;

  return (
    <div className="h-screen w-full flex flex-col md:flex-row text-theme-dark-blue">
      {/* Left Side - Map */}
      <div className="w-full md:w-1/2 h-full flex-1">
        <DynamicMap
          editable={false}
          location={location}
          onLocationChange={setLocation}
        />
      </div>

      {/* Right Side - Delivery Info */}
      <div className="w-full md:w-1/2 flex flex-col px-6 py-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">Delivery Status</h2>

        <div className="flex flex-col gap-5 mt-4">
          {steps.map(({ label, colorClass }) => {
            if (!currentFound && label === order.status) currentFound = true;

            const isCurrent = label === order.status;
            const isPast = !currentFound && !isCurrent;
            const isFuture = currentFound && !isCurrent;

            return (
              <div
                key={label}
                className={`flex items-center gap-4 ${isPast
                    ? "text-gray-400"
                    : isFuture
                      ? "text-gray-500/70"
                      : "font-bold"
                  }`}
              >
                <div
                  className={`h-4 w-4 rounded-full ${isPast
                      ? "bg-gray-400"
                      : isCurrent
                        ? colorClass
                        : "bg-gray-200"
                    }`}
                ></div>
                <span className="flex items-center gap-2">
                  {label}
                  {isCurrent && label === "Dispatched" && (
                    <span className="text-sm font-semibold text-theme-dark-blue/70">
                      (ETA: 25 mins)
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        <hr className="border-theme-dark-blue/30 my-4" />

        <div className="overflow-y-auto">
          <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
          <ul className="space-y-2 text-sm">
            {order.items.map((item, index) => (
              <li key={`${item.itemId}-${index}`} className="flex justify-between">

                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>PKR {item.price * item.quantity}</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between text-sm mt-4">
            <span className="font-medium">Delivery Fee</span>
            <span>PKR {order.delivery_fee}</span>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex justify-between text-lg font-bold border-t border-theme-dark-blue/30 pt-4">
            <span>Total</span>
            <span>
              PKR{" "}
              {order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                order.delivery_fee
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
