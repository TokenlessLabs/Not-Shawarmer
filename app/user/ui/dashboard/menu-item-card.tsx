'use client'
import Image from "next/image";
import { useState } from "react";

export default function ProductCard() {
  const [showCardDescription , setShowCardDescription ] =useState(false);
  const [quantity, setQuantity] = useState(1);
  return (
    <>
     <div className="max-w-xs rounded-2xl overflow-hidden shadow-lg bg-white">
      <Image
        src="/images/burger.jpg" 
        alt="Product"
        width={400}
        height={300}
        className="w-full h-48 object-cover"
        onClick={()=>setShowCardDescription(true)}
      />
      <div className="p-4 flex flex-row  justify-between">
        <p className="text-lg font-semibold  text-gray-800">  Item name </p>
        <p className="text-lg centered  text-gray-600">
          Rs. 2,499
        </p>
      </div>
    </div>

    { showCardDescription && 
    <div className="fixed inset-0 z-40 flex justify-center items-center">
     <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md relative overflow-hidden">
      
      <div className="w-full h-52 relative">
        <Image
          src="/images/burger.jpg "
          alt="Item Image"
          layout="fill"
          objectFit="cover"
          className="rounded-2xl "
        />
      </div>
      <div className="p-6 space-y-5">
        <h2 className="text-2xl font-bold text-gray-800">Spicy Chicken Burger</h2>
        <p className="text-gray-500 text-sm">
          Juicy grilled chicken, fresh lettuce, spicy mayo, served on a toasted bun.
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Quantity:</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl"
            >
              –
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl"
            >
              +
            </button>
          </div>
        </div>
       <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowCardDescription(false)}
                className="bg-red-500 text-white font-bold px-4 py-2 rounded shadow-xl hover:px-5 hover:bg-red-700 transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={() => setShowCardDescription(false)}
                className="bg-theme-blue text-white font-bold px-4 py-2 rounded shadow-xl hover:px-5 hover:bg-theme-dark-blue transition-all duration-200"
              >
                Add Item <span className="ml-3"> Rs. 1,2334</span>
              </button>
            </div>
        
      </div>
    </div>
    </div>  
    }

    </>
   
  );
}
