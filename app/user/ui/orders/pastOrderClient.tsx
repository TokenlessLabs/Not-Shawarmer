
"use client";
import OrderCompo from "@/app/user/ui/orders/order-component";
import Loading from "../../orders/loading";
import { usePastOrdersClient } from "../../lib/SWR-hooks/usePastOrder";


export default function PastOrdersClient() {
  const { orders, isLoading, isError } = usePastOrdersClient();


  if (isLoading) return <Loading />;
if (isError) return <p className="text-center text-red-500">Failed to load orders.</p>;

  if (!orders || orders.length === 0) {
    return <p className="text-center text-gray-500">No past orders found.</p>;
  }

  return (
    <>
      {orders.map((order) => (
        <OrderCompo key={order.id} order={order} user={"user"} />
      ))}
    </>
  );
}
