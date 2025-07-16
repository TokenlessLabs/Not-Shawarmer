'use client';
import { useRouter } from 'next/navigation';
import OrderComponent from '../ui/dashboard/ordercomponent';

export default function CurrentOrdersPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-center mb-6 space-x-6">
        <button
          className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
        >
          Current Orders
        </button>
        <button
          onClick={() => router.push('/admin/orders/past-order')}
          className="text-gray-600 hover:text-blue-600 font-semibold pb-1 border-b-2 border-transparent hover:border-blue-400"
        >
          Past Orders
        </button>
      </div>

      {/* Render current orders */}
            <OrderComponent/>
            <OrderComponent/>
            <OrderComponent/>
    </div>
  );
}
