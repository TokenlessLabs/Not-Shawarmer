// app/user/ui/orders/CurrentOrdersClient.tsx
"use client";
import OrderCompo from "@/app/user/ui/orders/order-component";
import { useCustomerOrders } from "../../lib/useCustomerOrders";
import Loading from "../../orders/loading";

export default function CurrentOrdersClient() {
  const { orders, isLoading, isError } = useCustomerOrders();

  if (isLoading) return <Loading />;
if (isError) return <p className="text-center text-red-500">Failed to load orders.</p>;

  if (!orders || orders.length === 0) {
    return <p className="text-center text-gray-500">No current orders found.</p>;
  }

  return (
    <>
      {orders.map((order) => (
        <OrderCompo key={order.id} order={order} />
      ))}
    </>
  );
}
