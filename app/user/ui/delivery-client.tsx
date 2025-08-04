"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";
import {
  Coordinates,
  Order,
  OrderStatuses,
  OrderStatusNames,
} from "@/app/user/lib/definitions";
import Loading from "../orders/loading";
import { reverseGeocode } from "../lib/utils";
import { MapPinIcon } from "@heroicons/react/24/solid";


const DynamicMap = dynamic(() => import("../ui/newmap"), { ssr: false });

const fetcher = (url: string) => fetch(url).then(res => res.json());

type Props = {
  orderId: number;
  userLocation: Coordinates;
  restaurantLocation: Coordinates;
};

export default function DeliveryClient({
  orderId,
  userLocation,
  restaurantLocation,
}: Props) {
  const [location, setLocation] = useState<Coordinates>(restaurantLocation);
  const [eta, setEta] = useState<number | null>(null);
  const [userAddressText, setUserAddressText] = useState<string>("");

  const {
    data: order,
    error: orderError,
    isLoading: orderLoading,
  } = useSWR<Order>(`/api/orders/${orderId}/delivery`, fetcher, {
    refreshInterval: 5000,
  });

  const {
    data: userAddress,
    error: addressError,
    isLoading: addressLoading,
  } = useSWR<{ address: Coordinates }>("/api/address", fetcher);

  useEffect(() => {
    if (userAddress?.address) {
      const { latitude, longitude } = userAddress.address;
      reverseGeocode(latitude, longitude).then(setUserAddressText);
    }
  }, [userAddress]);

  if (orderLoading) return <Loading />;

  if (orderError || !order || !restaurantLocation) {
    return (
      <div className="p-10 text-center text-red-500">
        No active delivery found.
      </div>
    );
  }

  const isDispatched = order.status === OrderStatuses.Dispatched;

  const steps = [
    { label: OrderStatuses.Cooking, colorClass: "bg-yellow-400" },
    { label: OrderStatuses.Dispatched, colorClass: "bg-blue-400" },
    { label: OrderStatuses.Delivered, colorClass: "bg-green-400" },
  ];

  let currentFound = false;

  return (
    <div className="h-screen w-full flex flex-col md:flex-row text-theme-dark-blue">
      {/* Map Section */}
      <div className="w-full md:w-1/2 h-full flex-1">
        <DynamicMap
          editable={false}
          location={location}
          onLocationChange={setLocation}
          userLocation={userLocation}
          showPath={isDispatched}
          onEtaChange={setEta}
        />
      </div>

      {/* Delivery Info Section */}
      <div className="w-full md:w-1/2 flex flex-col px-6 py-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">Delivery Status</h2>


        {/* Status Steps */}
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
                  {OrderStatusNames[label]}
                  {isCurrent && label === OrderStatuses.Dispatched && (
                    <span className="text-sm font-semibold text-theme-dark-blue/70">
                      (ETA: {eta !== null ? `${eta} mins` : "Calculating..."})
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>


        {/* User Address */}
        {addressLoading ? (
          <p className="text-sm text-gray-500">Loading address...</p>
        ) : addressError ? (
          <p className="text-sm text-red-500">Failed to load address.</p>
        ) : (
          userAddressText && (
            <div className="flex items-start gap-3 text-sm text-gray-700 mt-3">
              <MapPinIcon className="h-5 w-5 text-theme-dark-blue shrink-0" />
              <span>{userAddressText}</span>
            </div>
          )
        )}

        <hr className="border-theme-dark-blue/30 my-4" />

        {/* Order Summary */}
        <div className="overflow-y-auto">
          <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
          <ul className="space-y-2 text-sm">
            {order.items.map((item, index) => (
              <li
                key={`${item.itemId}-${index}`}
                className="flex justify-between"
              >
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

        {/* Total */}
        <div className="mt-auto pt-4">
          <div className="flex justify-between text-lg font-bold border-t border-theme-dark-blue/30 pt-4">
            <span>Total</span>
            <span>
              PKR{" "}
              {order.items
                .reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  order.delivery_fee
                )
                .toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
