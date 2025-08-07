
"use client";

import { useState } from "react";
import CurrentOrdersClient from "../../ui/orders/CurrentOrdersClient";
import PastOrdersClient from "../../ui/orders/pastOrderClient";

export default function OrdersPage() {
  const [showPastOrders, setShowPastOrders] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-center mb-6 space-x-6">
        <button
          onClick={() => setShowPastOrders(false)}
          className={`font-semibold pb-1 border-b-2 ${
            !showPastOrders
              ? "text-theme-bluehighlighted border-theme-bluehighlighted"
              : "text-gray-600 border-transparent hover:text-theme-bluehighlighted hover:border-theme-bluehighlighted"
          }`}
        >
          Current Orders
        </button>
        <button
          onClick={() => setShowPastOrders(true)}
          className={`font-semibold pb-1 border-b-2 ${
            showPastOrders
              ? "text-theme-bluehighlighted border-theme-bluehighlighted"
              : "text-gray-600 border-transparent hover:text-theme-bluehighlighted hover:border-theme-bluehighlighted"
          }`}
        >
          Past Orders
        </button>
      </div>

      {showPastOrders ? <PastOrdersClient /> : <CurrentOrdersClient />}
    </div>
  );
}



// //import { getPastOrders } from "../../lib/data";
// //import OrderCompo from "@/app/user/ui/orders/order-component";
// import Link from "next/link";
// import CurrentOrdersClient from "../../ui/orders/CurrentOrdersClient";
// import PastOrdersClient from "../../ui/orders/pastOrderClient";

// export default async function Pastorder() {
//   //const orders = await getPastOrders();

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="flex justify-center mb-6 space-x-6">
//         <Link
//           href="/user/orders"
//           className="text-gray-600 hover:text-theme-bluehighlighted font-semibold pb-1 border-b-2 border-transparent hover:border-theme-bluehighlighted"
//         >
//           Current Orders
//         </Link>
//         <button className="text-theme-blue hover:text-theme-bluehighlighted font-semibold border-b-2 border-theme-bluehighlighted pb-1">
//           Past Orders
//         </button>
//       </div>

//           <CurrentOrdersClient />

//           <PastOrdersClient/>
//     </div>
//   );
// }
