import { getPastOrders } from "../../lib/data";
import OrderCompo from "@/app/user/ui/orders/order-component";
import Link from "next/link";

export default async function Pastorder() {
  const orders = await getPastOrders();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-center mb-6 space-x-6">
        <Link
          href="/user/orders"
          className="text-gray-600 hover:text-blue-600 font-semibold pb-1 border-b-2 border-transparent hover:border-blue-400"
        >
          Current Orders
        </Link>
        <button className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">
          Past Orders
        </button>
      </div>

      {!orders || orders.length === 0 ? (
        <p className="text-center text-gray-500">No past orders found.</p>
      ) : (
        orders.map((order) => <OrderCompo key={order.id} order={order} />)
      )}
    </div>
  );
}
