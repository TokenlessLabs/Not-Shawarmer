"use client";
import { useTransition } from "react";
import React, { useEffect, useState } from "react";
import AddressModal from "../../ui/dashboard/address-modal";
import { placeOrder } from "../../lib/actions";
import { updateUserAddress } from "../../lib/actions";

type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

const CartPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [savedAddress, setSavedAddress] = useState("Emporium Mall");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [instructions, setInstructions] = useState('');
  

  // Load cart items from localStorage when component mounts
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const deliveryFee = 250;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
  startTransition(async () => {
    const storedCart = localStorage.getItem("cart");
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];

    const result = await placeOrder(parsedCart, savedAddress , instructions); 

    if (result.success) {
      localStorage.removeItem("cart");
      setCartItems([]);
      alert("✅ Order placed successfully!");
    } else {
      alert("❌ " + result.error || "Something went wrong");
    }
  });
};


const handleRemove = (name: string) => {
  const updatedCart = cartItems.filter((item) => item.name !== name);
  setCartItems(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
};

const groupedItems = cartItems.reduce((acc, item) => {
  const existing = acc.find((i) => i.name === item.name);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    acc.push({ ...item }); // clone item
  }
  return acc;
}, [] as CartItem[]);

  return (
    <>
      {openModal && (
        <AddressModal
          savedAddress={savedAddress}
          onClose={() => setOpenModal(false)}
          onSave={(newAddress) => {
                     setOpenModal(false);
         
                     if (newAddress !== savedAddress) {
                       setSavedAddress(newAddress);
                       updateUserAddress(newAddress);
                     }
                    }
                  }
        />
      )}
      <div className="max-h-screen overflow-y-hidden p-6 text-theme-dark-blue flex flex-col">
        <h1 className="text-3xl font-bold mb-10">My Cart</h1>

        <div className="flex flex-col md:flex-row gap-6 w-full max-w-7xl mx-auto flex-grow">
          {/* Left Section */}
          <div className="flex-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white/10 backdrop-blur-md border border-theme-dark-blue/40 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <ul className="space-y-3">
                {cartItems.length === 0 ? (
                  <p className="text-sm text-theme-dark-blue/70">
                    Your cart is empty.
                  </p>
                ) : (
                  <ul>
  {groupedItems.map((item, index) => (
    <li key={index} className="flex justify-between">
      <span>
        {item.name} x{item.quantity}
      </span>
      <span>
        PKR {item.price * item.quantity}
        <button
          className="ml-5 text-sm text-blue-600 hover:underline font-medium"
          onClick={() => handleRemove(item.name)}
        >
          Remove
        </button>
      </span>
    </li>
  ))}
</ul>
                )}
              </ul>
            </div>

            {/* Delivery Address */}
            <div className="bg-white/10 backdrop-blur-md border border-theme-dark-blue/40 rounded-xl p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">Delivery Address</h2>
                <button
                  onClick={() => setOpenModal(true)}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  ✏️ Edit
                </button>
              </div>
              <p className="text-sm" >{savedAddress} </p>
            </div>

            {/* Special Instructions */}
            <div className="bg-white/10 backdrop-blur-md border border-theme-dark-blue/40 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-2">
                Special Instructions
              </h2>
              <textarea
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                value={instructions}
                placeholder="Add any extra notes..."
                className="w-full p-3 rounded-lg text-sm bg-white/5 border border-theme-dark-blue/40 placeholder-theme-dark-blue/60 outline-none"
              />
            </div>
          </div>

          <div className="w-full md:w-96 flex-shrink-0 bg-white/10 backdrop-blur-md border border-theme-dark-blue/40 rounded-xl p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>

            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>PKR {subtotal}</span>
            </div>

            <div className="flex justify-between mb-4">
              <span>Delivery</span>
              <span>PKR {deliveryFee}</span>
            </div>

            <hr className="border-theme-dark-blue/20 mb-4" />

            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span>PKR {total}</span>
            </div>

            <div className="flex flex-col w-full gap-1">
              <div className="bg-theme-blue/10 border border-theme-dark-blue/30 rounded-md px-4 py-3 mb-4 text-sm text-theme-dark-blue">
                <strong>Payment:</strong> Cash on Delivery
              </div>

             <button
  onClick={handlePlaceOrder}
  className="w-full text-center bg-theme-blue hover:bg-theme-bluehighlighted text-white py-3 rounded-lg font-semibold transition"
  disabled={cartItems.length === 0 || isPending}
>
  {isPending ? "Placing Order..." : "Place Order"}
</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
