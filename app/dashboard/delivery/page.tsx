'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Map component
const DynamicMap = dynamic(() => import('../../ui/map'), { ssr: false });

const DeliveryPage = () => {
  const currentStep = 'Order Dispatched';

  const steps = [
    { label: 'Cooking', colorClass: 'bg-yellow-400' },
    { label: 'Order Dispatched', colorClass: 'bg-orange-400' },
    { label: 'Delivered', colorClass: 'bg-green-500' },
  ];

  let currentFound = false;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row text-theme-dark-blue">
      {/* Left Side - Map */}
      <div className="w-full md:w-1/2 h-72 md:h-auto">
        <DynamicMap />
      </div>

      {/* Right Side - Delivery Info */}
      <div className="w-full md:w-1/2 flex flex-col px-6 py-8 space-y-6">
        {/* Delivery Status Heading */}
        <h2 className="text-2xl font-bold text-center">Delivery Status</h2>

        {/* Status Steps */}
        <div className="flex flex-col gap-5 mt-4">
          {steps.map(({ label, colorClass }) => {
            if (!currentFound && label === currentStep) currentFound = true;

            const isCurrent = label === currentStep;
            const isPast = !currentFound && !isCurrent;
            const isFuture = currentFound && !isCurrent;

            return (
              <div
                key={label}
                className={`flex items-center gap-4 ${
                  isPast ? 'text-gray-400' : isFuture ? 'text-gray-500/70' : 'font-bold'
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-full ${
                    isPast ? 'bg-gray-400' : isCurrent ? colorClass : 'bg-gray-200'
                  }`}
                ></div>
                <span className="flex items-center gap-2">
                  {label}
                  {isCurrent && label === 'Order Dispatched' && (
                    <span className="text-sm font-semibold text-theme-dark-blue/70">
                      (ETA: 25 mins)
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <hr className="border-theme-dark-blue/30 my-4" />

        {/* Order Summary */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Chicken Shawarma x2</span>
              <span>PKR 1200</span>
            </li>
            <li className="flex justify-between">
              <span>Fries x1</span>
              <span>PKR 300</span>
            </li>
            <li className="flex justify-between">
              <span>Drink x1</span>
              <span>PKR 150</span>
            </li>
          </ul>

          {/* Delivery Fee */}
          <div className="flex justify-between text-sm mt-4">
            <span className="font-medium">Delivery Fee</span>
            <span>PKR 250</span>
          </div>
        </div>

        {/* Total */}
        <div className="mt-auto pt-4">
          <div className="flex justify-between text-lg font-bold border-t border-theme-dark-blue/30 pt-4">
            <span>Total</span>
            <span>PKR 1900</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;
