"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MenuItem } from "../../lib/definitions";
import { getImageUrl } from "../../lib/utils";

type MenuItemModalProps = {
  item: MenuItem;
  onClose: () => void;
};

const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, onClose }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-md flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md relative overflow-hidden">
        <div className="w-full h-52 relative">
          <Image
            src={getImageUrl(item.image)}
            alt={item.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover"
          />
        </div>

        <div className="p-6 space-y-5">
          <h2 className="text-2xl font-bold text-gray-800">{item.name}</h2>
          <p className="text-gray-500 text-sm">{item.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Quantity:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl"
              >
                –
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="bg-red-500 text-white font-bold px-4 py-2 rounded shadow-xl hover:px-5 hover:bg-red-700 transition-all duration-200"
            >
              Close
            </button>
            <button
              // onClick={handleSave}
              className="bg-theme-blue text-white font-bold px-4 py-2 rounded shadow-xl hover:px-5 hover:bg-theme-dark-blue transition-all duration-200"
            >
              Add to Cart{" "}
              <span className="ml-3">Rs. {item.price * quantity}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;
