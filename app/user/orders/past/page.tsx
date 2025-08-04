import { getPastOrders } from "../../lib/data";
//import OrderCompo from "@/app/user/ui/orders/order-component";
import Link from "next/link";
import CurrentOrdersClient from "../../ui/orders/CurrentOrdersClient";

export default async function Pastorder() {
  //const orders = await getPastOrders();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-center mb-6 space-x-6">
        <Link
          href="/user/orders"
          className="text-gray-600 hover:text-theme-bluehighlighted font-semibold pb-1 border-b-2 border-transparent hover:border-theme-bluehighlighted"
        >
          Current Orders
        </Link>
        <button className="text-theme-blue hover:text-theme-bluehighlighted font-semibold border-b-2 border-theme-bluehighlighted pb-1">
          Past Orders
        </button>
      </div>

          <CurrentOrdersClient />
    </div>
  );
}
