import Link from 'next/link';
import { getAdminCurrentOrders } from '@/app/user/lib/data';
import OrderComponent from '../ui/dashboard/ordercomponent';
import { Order } from '@/app/user/lib/definitions';

export default async function CurrentOrdersPage() {
  const orders = await getAdminCurrentOrders();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-center mb-6 space-x-6">
        <span className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">
          Current Orders
        </span>
        <Link
          href="/admin/orders/past-order"
          className="text-gray-600 hover:text-blue-600 font-semibold pb-1 border-b-2 border-transparent hover:border-blue-400"
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
