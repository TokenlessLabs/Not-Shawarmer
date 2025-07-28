import Link from "next/link";
import { getAdminCurrentOrders } from "@/app/user/lib/data";
import OrderComponent from "../ui/orders/order-component";

export default async function CurrentOrdersPage() {
  const orders = await getAdminCurrentOrders();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-center mb-6 space-x-6">
        <span className="text-theme-blue hover:text-theme-bluehighlighted font-semibold border-b-2 border-theme-bluehighlighted pb-1">
          Current Orders
        </span>
        <Link
          href="/admin/orders/past-order"
          className="text-gray-600 hover:text-theme-bluehighlighted font-semibold pb-1 border-b-2 border-transparent hover:border-theme-bluehighlighted"
        >
          Past Orders
        </Link>
      </div>

      {/* Render current orders */}
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No current orders found.</p>
      ) : (
        orders.map((order) => <OrderComponent key={order.id} order={order} />)
      )}
    </div>
  );
}
