import { getRestaurantDetails } from "@/app/user/lib/data";
import RestaurantClient, { Restaurant } from "../ui/editrestaurant/res-client";
import RestaurantSkeleton from "./loading";
import { Suspense, useEffect, useState } from "react";

export default function RestaurantPageWrapper() {
  return (
    <Suspense fallback={<RestaurantSkeleton />}>
      <RestaurantPage />
    </Suspense>
  );
}

async function RestaurantPage() {
  // Optional: add artificial delay to see skeleton
  await new Promise((resolve) => setTimeout(resolve, 3000)); // 1.5 second delay

  const rawData = await getRestaurantDetails();

  const restaurant: Restaurant = {
    name: rawData.name,
    address: rawData.address,
    about: rawData.about,
    startTime: rawData.operatinghoursstart,
    endTime: rawData.operatinghoursend,
    contact: rawData.contact,
    delivery_fee: rawData.delivery_fee,
  };

  return <RestaurantClient restaurant={restaurant} />;
}
