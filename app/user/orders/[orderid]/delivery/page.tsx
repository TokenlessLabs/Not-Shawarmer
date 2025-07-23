import { getOrderById } from "@/app/user/lib/data"; 
import DeliveryClient from "@/app/user/ui/delivery-client";
import { notFound } from "next/navigation";

export default async function DeliveryPage({ params }: { params: { orderid: string } }) {
  const orderId = parseInt(params.orderid, 10);
  if (isNaN(orderId)) return notFound();

  const order = await getOrderById(orderId); 

  if (!order) return notFound();

  return <DeliveryClient order={order} />;
}
