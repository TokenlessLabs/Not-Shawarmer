"use client";

import { useState, useTransition , useEffect } from "react";
import { Order } from "@/app/user/lib/definitions";
import { updateOrderStatus, cancelOrder } from "@/app/user/lib/actions";
import {
  ClockIcon,
  ShoppingBagIcon,
  MapPinIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import ConfirmModal from "../confirmation-modal";
import { formatDateWithOffset } from "@/app/user/lib/utils";
import toast from "react-hot-toast";
import { reverseGeocode } from "@/app/user/lib/utils";
import { OrderStatuses } from "@/app/user/lib/definitions";
import { useAdminOrders } from "../../lib/admin-order";

type Props = {
  order: Order;
};

export default function OrderComponent({ order }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdatingStatus, startStatusTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, startCancelTransition] = useTransition();
  const [address, setAddress] = useState("Loading...");

   useEffect(() => {
    async function fetchAddress() {
      const addr = await reverseGeocode(order.latitude, order.longitude);
      setAddress(addr);
    }

    if (order.latitude && order.longitude) {
      fetchAddress();
    }
  }, [order.latitude, order.longitude]);


  const statusOptions = [
    {
      label: "Cooking",
      value: 0,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      label: "Dispatched",
      value: 1,
      color: "bg-blue-100 text-blue-800",
    },
    {
      label: "Delivered",
      value: 2,
      color: "bg-green-100 text-green-800",
    },
  ];
  
  const { mutate  } = useAdminOrders();
const handleStatusChange = (newStatus: number ) => {
  const popUpStatus = statusOptions.find((s) => s.value === newStatus)?.label ?? "Updated";

  startStatusTransition(async () => {
    try {
      await updateOrderStatus(order.id, newStatus);
      toast.success(`Order marked as ${popUpStatus}`);
        mutate();
    } catch (error) {
      toast.error("Failed to update order status");
    }
  });
};

 const currentStatus = statusOptions.find(option => option.value === order.status);

  const deliveryCharges = order.delivery_fee ?? 0;
  const subtotal =
    order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ??
    0;

  const totalItems =
    order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const total = subtotal + deliveryCharges;

  return (
    <>
      
      {showConfirm && (
        <ConfirmModal
          heading="Cancel Order"
          message="Are you sure you want to cancel this order? This action cannot be undone."
          onAccept={() => {
            startCancelTransition(() => {
              cancelOrder(order.id);
              setShowConfirm(false);
            });
          }}
          onCancel={() => setShowConfirm(false)}
          acceptLabel="Yes, Cancel"
          cancelLabel="No"
          isProcessing={isProcessing}
        />
      )}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-4 border-l-4 border-blue-500 transition-all duration-300">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-semibold">Order</h2>
            <div className="flex items-center text-sm text-gray-500 gap-1">
              <ClockIcon className="h-4 w-4" />
              <span> {formatDateWithOffset(order.createdat)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 gap-1 mt-1">
              <ShoppingBagIcon className="h-4 w-4" />
              <span>
                {totalItems} items • Rs. {total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
           {order.status !== OrderStatuses.Cancelled && order.status !== OrderStatuses.Delivered && (
              <button
                onClick={() => setShowConfirm(true)}
                className="bg-red-500 text-white text-xs px-3 py-1 rounded shadow hover:bg-red-600 transition"
                disabled={showConfirm}
              >
                {showConfirm ? "Cancelling..." : "Cancel Order"}
              </button>
            )}


            <div className="relative inline-block">
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(Number(e.target.value))}
            className={`appearance-none pr-6 ${currentStatus?.color} text-sm font-medium px-3 py-1 rounded-full cursor-pointer ${
              isUpdatingStatus ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isUpdatingStatus}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value} className="text-black">
                {option.label}
               
              </option>
            ))}
          </select>

          {/* Down arrow icon */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>
          </div>
        </div>





        <div className="flex justify-between items-center mt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-theme-blue underline focus:outline-none"
          >
            {isExpanded ? "Hide Details" : "View Details"}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="text-md font-semibold mb-2">Items:</h3>
              <ul className="list-disc pl-5 space-y-1">
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
              <div className="flex items-start gap-2">
                <PencilIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <span className="font-semibold">Instructions:</span>{" "}
                  {order.instructions}
                </div>
              </div>
            )}

            <div className="flex items-start gap-2">
              <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <span className="font-semibold">Delivery Address:</span>{" "}
               {order.latitude && order.longitude ?( <p>{address}</p>): (
               <p>Not found </p>
              
            )}
              </div>
            </div>

            {order.status === OrderStatuses.Delivered && order.deliveredat && (
              <div className="flex items-start gap-2">
                <ClockIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <span className="font-semibold">Delivered At:</span>{" "}
                  {new Date(order.deliveredat).toLocaleString()}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between mb-1">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Delivery Charges</span>
                <span>Rs. {deliveryCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base mt-2">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
