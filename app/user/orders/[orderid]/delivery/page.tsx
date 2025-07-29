import {
  getOrderById,
  getUserAddress,
  getRestaurantDetails,
} from "@/app/user/lib/data";
import DeliveryClient from "@/app/user/ui/delivery-client";
import { notFound } from "next/navigation";

async function geocodeAddress(
  address: string
): Promise<[number, number] | null> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`
  );
  const data = await response.json();

  if (data.length > 0) {
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  }

  return null;
}

export default async function DeliveryPage(props: {
  params: Promise<{ orderid: string }>;
}) {
  const params = await props.params;
  const orderId = parseInt(params.orderid, 10);
  if (isNaN(orderId)) return notFound();

  const order = await getOrderById(orderId);
  if (!order) return notFound();

  const [userAddress, restaurant] = await Promise.all([
    getUserAddress(),
    getRestaurantDetails(),
  ]);

  const [userLocation, restaurantLocation] = await Promise.all([
    userAddress ? geocodeAddress(userAddress) : null,
    restaurant?.address ? geocodeAddress(restaurant.address) : null,
  ]);

  return (
    <DeliveryClient
      order={order}
      userLocation={userLocation}
      restaurantLocation={restaurantLocation}
    />
  );
}
