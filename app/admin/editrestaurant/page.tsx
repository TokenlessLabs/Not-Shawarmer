import { getRestaurantDetails } from "@/app/user/lib/data";
import RestaurantClient, { Restaurant } from "../ui/editrestaurant/res-client";

export default async function RestaurantPage() {
  const rawData = await getRestaurantDetails();

  const restaurant: Restaurant = {
    name: rawData.name,
    address: rawData.address,
    about: rawData.about,
    startTime: rawData.operatinghoursstart,
    endTime: rawData.operatinghoursend,

    contact: rawData.contact,
  };

  return <RestaurantClient restaurant={restaurant} />;
}
