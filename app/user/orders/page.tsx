import { getCurrentOrders } from "../lib/data";
import OrderCompo from "@/app/user/ui/orders/orderComponent";
import Link from "next/link";

export default async function Currentorder() {
  const orders = await getCurrentOrders();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-center mb-6 space-x-6">
        <button
          className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
        >
          Current Orders
        </button>
        <Link href="/user/orders/past" className="text-gray-600 hover:text-blue-600 font-semibold pb-1 border-b-2 border-transparent hover:border-blue-400">
          Past Orders
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No past orders found.</p>
      ) : (
        orders.map((order) => <OrderCompo key={order.id} order={order} />)
      )}
    </div>
  );
}
