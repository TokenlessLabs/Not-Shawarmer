import {
  getOrderById,
  getUserAddress,
  getRestaurantDetails,
} from "@/app/user/lib/data";
import DeliveryClient from "@/app/user/ui/delivery-client";
import { notFound } from "next/navigation";

export default async function DeliveryPage(props: {
  params: Promise<{ orderid: string }>;
}) {
  const params = await props.params;
  const orderId = parseInt(params.orderid, 10);
  if (isNaN(orderId)) return notFound();

  const order = await getOrderById(orderId);
  if (!order) return notFound();

  const [userAddress, restaurantAddress] = await Promise.all([
    getUserAddress(),
    getRestaurantDetails(),
  ]);

  return (
    <DeliveryClient
      orderId={order.id} // ✅ Pass the ID instead
      userLocation={userAddress}
      restaurantLocation={{
        longitude: restaurantAddress.longitude,
        latitude: restaurantAddress.latitude,
      }}
    />

  );
}
