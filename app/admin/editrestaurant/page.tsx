import { getRestaurantDetails } from "@/app/user/lib/data";
import RestaurantClient from "../ui/editrestaurant/res-client";
import { Restaurant } from "@/app/user/lib/definitions";
import RestaurantSkeleton from "./loading";
import { Suspense } from "react";

export default function RestaurantPageWrapper() {
  return (
    <Suspense fallback={<RestaurantSkeleton />}>
      <RestaurantPage />
    </Suspense>
  );
}

async function RestaurantPage() {
  const rawData = await getRestaurantDetails();

  const restaurant: Restaurant = {
    name: rawData.name,
    latitude: rawData.latitude,         // ✅ use directly
    longitude: rawData.longitude,       // ✅ use directly
    about: rawData.about,
    startTime: rawData.operatinghoursstart,
    endTime: rawData.operatinghoursend,
    contact: rawData.contact,
    delivery_fee: rawData.delivery_fee,
  };

  return <RestaurantClient restaurant={restaurant} />;
}
