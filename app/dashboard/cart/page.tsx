'use client';

import React from 'react';
import Link from 'next/link';

const CartPage = () => {
  return (
    <div className="max-h-screen overflow-y-hidden  text-theme-dark-blue flex flex-col">
      {/* Cart Heading */}
      <h1 className="text-3xl font-bold mb-10">My Cart</h1>

      {/* Grid Layout */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-7xl mx-auto flex-grow">
        {/* Left Section */}
        <div className="flex-1 space-y-6">
          {/* Order Summary */}
          <div className="bg-white/10 backdrop-blur-md border border-theme-dark-blue/40 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <ul className="space-y-3">
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
          </div>

          {/* Delivery Address */}
          <div className="bg-white/10 backdrop-blur-md border border-theme-dark-blue/40 rounded-xl p-6">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-semibold">Delivery Address</h2>
              <Link
                href="/map"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                ✏️ Edit
              </Link>
            </div>
            <p className="text-sm">
              123 Street, Sector A, Lahore, Pakistan
            </p>
          </div>

          {/* Special Instructions */}
          <div className="bg-white/10 backdrop-blur-md border border-theme-dark-blue/40 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">Special Instructions</h2>
            <textarea
              rows={3}
              placeholder="Add any extra notes..."
              className="w-full p-3 rounded-lg text-sm bg-white/5 border border-theme-dark-blue/40 placeholder-theme-dark-blue/60 outline-none"
            />
          </div>
        </div>

        {/* Right Section: Summary */}
        <div className="w-full md:w-96 flex-shrink-0 bg-white/10 backdrop-blur-md border border-theme-dark-blue/40 rounded-xl p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>PKR 1650</span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Delivery</span>
            <span>PKR 250</span>
          </div>

          <hr className="border-theme-dark-blue/20 mb-4" />

          <div className="flex justify-between text-lg font-bold mb-6">
            <span>Total</span>
            <span>PKR 1900</span>
          </div>

          {/* Payment Instruction */}
          <div className="bg-theme-blue/10 border border-theme-dark-blue/30 rounded-md px-4 py-3 mb-4 text-sm text-theme-dark-blue">
            <strong>Payment:</strong> Cash on Delivery
          </div>

          <button className="w-full bg-theme-blue hover:bg-theme-bluehighlighted text-white py-3 rounded-lg font-semibold transition">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
