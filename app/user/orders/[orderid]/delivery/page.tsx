import { getCurrentOrders } from "@/app/user/lib/data";
import DeliveryClient from "../../../ui/delivery-client"; // You'll write this inline below

export default async function DeliveryPage() {
  const orders = await getCurrentOrders();
  const currentOrder = orders.length > 0 ? orders[0] : null;

  return <DeliveryClient order={currentOrder} />;
}
