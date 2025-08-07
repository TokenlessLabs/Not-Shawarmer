"use client";

import { useState, useEffect  } from "react";
import { Order } from "../../lib/definitions";
import { reverseGeocode } from "../../lib/utils";
import { OrderStatuses } from "../../lib/definitions";
import {
  ClockIcon,
  ShoppingBagIcon,
  MapPinIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { formatDateWithOffset } from "../../lib/utils";
import { StarIcon as StarSolid , StarIcon as StarOutline } from '@heroicons/react/20/solid';
import ConfirmModal from "@/app/admin/ui/confirmation-modal";
import { UpdateOrderRating } from "../../lib/actions";

type OrderCompoProps = {
  order: Order;
  user: string;
};
export default function OrderCompo({ order , user }: OrderCompoProps  ) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [address, setAddress] = useState("Loading...");
  const [rating, setRating] = useState<number>(Number(order.rating ?? 0));
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

    
 

  useEffect(() => {
    async function fetchAddress() {
      const addr = await reverseGeocode(order.latitude, order.longitude);
      setAddress(addr);
    }

    if (
      address === "Loading..." &&
      isExpanded &&
      order.latitude &&
      order.longitude
    ) {
      fetchAddress();
    }
  }, [isExpanded, order.latitude, order.longitude]);

  const deliveryCharges = order.delivery_fee ?? 0;

  const subtotal =
    order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ??
    0;

  const total = subtotal + deliveryCharges;
  const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0);

  const OrderStatusLabels = {
    [OrderStatuses.Cooking]: "Cooking",
    [OrderStatuses.Dispatched]: "Dispatched",
    [OrderStatuses.Delivered]: "Delivered",
    [OrderStatuses.Cancelled]: "Cancelled",
  };
 

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mb-4 border-l-4 border-theme-blue transition-all duration-300">
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

     
         <span
          className={`
            text-sm font-medium px-4 py-1 rounded-full
            ${
              order.status === OrderStatuses.Cooking
                ? "bg-yellow-100 text-yellow-800"
                : ""
            }
            ${
              order.status === OrderStatuses.Dispatched
                ? "bg-blue-100 text-blue-800"
                : ""
            }
            ${
              order.status === OrderStatuses.Delivered
                ? "bg-green-100 text-green-800"
                : ""
            }
            ${
              order.status === OrderStatuses.Cancelled
                ? "bg-red-100 text-red-800"
                : ""
            }
          `}
        >
          {OrderStatusLabels[order.status]}
        </span>
      </div>

      <div className="flex justify-between items-center mt-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-theme-blue underline focus:outline-none"
        >
          {isExpanded ? "Hide Details" : "View Details"}
        </button>

        {[OrderStatuses.Cooking, OrderStatuses.Dispatched].includes(
          order.status
        ) && (
          <a
            href={`/user/orders/${order.id}/delivery/`}
            className="text-sm text-theme-blue underline ml-4"
          >
            View Delivery Status
          </a>
        )}
         {order.status === OrderStatuses.Delivered && rating === 0 && user != "admin" && (
              <p className="text-sm text-gray-500 mb-2">Would you like to rate this order?</p>
        )}  
       
 {order.status === OrderStatuses.Delivered && user != "admin" &&(
               <div className="flex gap-1 mt-4 text-xl">
  {Array.from({ length: 5 }).map((_, index) => (
    <button
      key={index}
      onClick={() => {
        if (rating === 0) {
          setSelectedRating(index + 1);
          setShowModal(true);
        }
      }}
      className={`transition-colors ${
        rating === 0 ? "cursor-pointer hover:text-yellow-400" : "cursor-default"
      }`}
      disabled={rating !== 0}
    >
      {index <rating ? (
        <StarSolid className="w-6 h-6 text-yellow-500" />
      ) : (
        <StarOutline className="w-6 h-6 text-gray-400" />
      )}
    </button>
  ))}
</div>
)}  </div>

     
{showModal && (
  <ConfirmModal
    heading="Confirm Your Rating"
    message={`Are you sure you want to give this order a ${selectedRating}-star rating?`}
    acceptLabel="Yes, Rate"
    cancelLabel="Cancel"
    good={true}
    onAccept={async () => {
      setRating(selectedRating);
      setShowModal(false);
      await UpdateOrderRating(order.id, selectedRating); 
    }}
    onCancel={() => {
      setSelectedRating(0);
      setShowModal(false);
    }}
  />
)}
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
              {order.latitude && order.longitude ? (
                <p>{address}</p>
              ) : (
                <p>Not found </p>
              )}
            </div>
          </div>

          {order.status === OrderStatuses.Delivered && order.deliveredat && (
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <ClockIcon className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <span className="font-semibold">Delivered At:</span>{" "}
                {formatDateWithOffset(order.deliveredat)}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
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
  );
}
