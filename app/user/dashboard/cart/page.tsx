"use client";

import { useEffect, useState, useTransition } from "react";
import AddressModal, { Coordinates } from "../../ui/dashboard/address-modal";
import ConfirmModal from "@/app/admin/ui/confirmation-modal";
import { placeOrder, updateUserAddress } from "../../lib/actions";
import { useRouter } from "next/navigation";
import { reverseGeocode } from "../../lib/utils"; // for converting coordinates to string

type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

const CartPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [savedAddress, setSavedAddress] = useState<Coordinates>(null); // ✅ now coordinates
  const [savedAddressText, setSavedAddressText] = useState("Loading..."); // ✅ separate display string

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [instructions, setInstructions] = useState("");
  const [noItemsWarning, setNoItemsWarning] = useState(false);
  const router = useRouter();
  const [deliveryFee, setDeliveryFee] = useState<number>(0);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }

    const fetchAddress = async () => {
      try {
        const res = await fetch("/api/address");
        const data = res.ok ? await res.json() : {};
        const coords: Coordinates = data.address ?? null;
        setSavedAddress(coords);

        if (coords) {
          const text = await reverseGeocode(coords.latitude, coords.longitude);
          setSavedAddressText(text);
        } else {
          setSavedAddressText("No address found");
        }
      } catch (error) {
        console.error("Failed to fetch address", error);
        setSavedAddress(null);
        setSavedAddressText("Error loading address");
      }
    };

    const fetchDeliveryFee = async () => {
      try {
        const res = await fetch("/api/deliveryfee");
        const data = await res.json();
        if (res.ok) {
          setDeliveryFee(data.deliveryFee);
        } else {
          console.error("Failed to fetch delivery fee:", data.error);
        }
      } catch (error) {
        console.error("Error fetching delivery fee:", error);
      }
    };

    fetchAddress();
    fetchDeliveryFee();
  }, []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = Number(subtotal) + Number(deliveryFee);

  const handleConfirmPlaceOrder = () => {
    startTransition(async () => {
      const storedCart = localStorage.getItem("cart");
      const parsedCart = storedCart ? JSON.parse(storedCart) : [];

      const result = await placeOrder(
        parsedCart,
        savedAddress,
        instructions
      );


      if (result.success) {
        localStorage.removeItem("cart");
        setCartItems([]);
        router.push(`/user/orders/${result.orderId}/delivery`);
      } else {
        alert("❌ " + (result.error || "Something went wrong"));
      }

      setShowConfirmModal(false);
    });
  };

  const handleIncrement = (name: string) => {
    const updatedCart = cartItems.map((item) =>
      item.name === name ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDecrement = (name: string) => {
    const updatedCart = cartItems
      .map((item) =>
        item.name === name ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const isAddressInvalid = !savedAddress;

  return (
    <>
      {/* Address Modal */}
      {openModal && (
        <AddressModal
          savedAddress={savedAddress ?? undefined}
          onClose={() => setOpenModal(false)}
          onSave={async (newAddress) => {
            setOpenModal(false);
            setSavedAddress(newAddress);
            if (newAddress) {
              const text = await reverseGeocode(
                newAddress.latitude,
                newAddress.longitude
              );
              setSavedAddressText(text);
              updateUserAddress(newAddress); // ✅ store as coordinates
            }
          }}
        />
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <ConfirmModal
          heading="Confirm Your Order"
          message="Are you sure you want to place this order?"
          onAccept={handleConfirmPlaceOrder}
          onCancel={() => setShowConfirmModal(false)}
          acceptLabel="Yes, Place Order"
          cancelLabel="No, Go Back"
          isProcessing={isPending}
          good={true}
        />
      )}

      <div className="max-h-screen p-6 text-theme-dark-blue flex flex-col overflow-y-auto">
        <h1 className="text-3xl font-bold mb-10">My Cart</h1>

        <div className="flex flex-col md:flex-row gap-6 w-full max-w-7xl mx-auto flex-grow">
          {/* Left Section */}
          <div className="flex-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white/10 backdrop-blur-md border border-theme-dark-blue/40 rounded-xl p-6 overflow-y-auto max-h-[40vh]">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              {cartItems.length === 0 ? (
                <p className="text-sm text-theme-dark-blue/70">
                  Your cart is empty.
                </p>
              ) : (
                <ul className="space-y-3">
                  {cartItems.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-theme-dark-blue/10"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-theme-dark-blue/70">
                          PKR {item.price * item.quantity}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDecrement(item.name)}
                          className="w-6 h-6 flex items-center justify-center bg-theme-blue text-white rounded-full text-sm"
                        >
                          –
                        </button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleIncrement(item.name)}
                          className="w-6 h-6 flex items-center justify-center bg-theme-blue text-white rounded-full text-sm"
                        >
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
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
              <p className="text-sm text-theme-dark-blue/70">
                {savedAddressText ?? "Please enter an address..."}
              </p>
            </div>

            {/* Special Instructions */}
            <div className="bg-white/10 backdrop-blur-md border border-theme-dark-blue/40 rounded-xl p-4">
              <h2 className="text-xl font-semibold mb-2">
                Special Instructions
              </h2>
              <textarea
                onChange={(e) => setInstructions(e.target.value)}
                value={instructions}
                rows={3}
                placeholder="Add any extra notes..."
                className="w-full p-3 rounded-lg text-sm bg-white/5 border border-theme-dark-blue/40 placeholder-theme-dark-blue/60 outline-none h-[8vh]"
              />
            </div>
          </div>

          {/* Right Section */}
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
              <span>PKR {(total ?? 0).toFixed(2)}</span>
            </div>

            <div className="flex flex-col w-full gap-1">
              <div className="bg-theme-blue/10 border border-theme-dark-blue/30 rounded-md px-4 py-3 mb-4 text-sm text-theme-dark-blue">
                <strong>Payment:</strong> Cash on Delivery
              </div>

              <div className="w-full">
                <button
                  onClick={() => {
                    if (cartItems.length === 0 || isAddressInvalid) {
                      setNoItemsWarning(true);
                      setTimeout(() => setNoItemsWarning(false), 2000);
                    } else {
                      setShowConfirmModal(true);
                    }
                  }}
                  className={`w-full text-center py-3 rounded-lg font-semibold transition ${noItemsWarning
                      ? "animate-shake bg-red-600/80 text-white"
                      : "bg-theme-blue hover:bg-theme-bluehighlighted text-white cursor-pointer"
                    }`}

                >
                  {isPending ? "Placing Order..." : "Place Order"}
                </button>

                {noItemsWarning && (
                  <p className="text-red-600 text-sm font-medium mt-2 text-center">
                    {cartItems.length === 0
                      ? "No items in the cart!"
                      : "Please enter a delivery address before placing your order."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
