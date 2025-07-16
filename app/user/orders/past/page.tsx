import OrderCompo from "@/app/user/ui/orders/orderComponent";
import Link from "next/link";

export default function Pastorder() {
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

      <OrderCompo />
      <OrderCompo />
      <OrderCompo />
      <OrderCompo />
      <OrderCompo />
      <OrderCompo />
      <OrderCompo />
      <OrderCompo />
    </div>
  );
}
