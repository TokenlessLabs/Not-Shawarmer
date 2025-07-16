import RestaurantClient from "@/app/admin/ui/dashboard/admindashboard/editrestaurant/res-client";

const dummyRestaurant = {
  name: "Shawarmer",
  address: "123 Food Street, Lahore",
  about: "We serve bold and authentic shawarmas.",
  startTime: "11:00",
  endTime: "23:00",
  contact: "+92 300 1234567",
};


export default async function RestaurantPage() {

  const restaurant = dummyRestaurant;

  return (  
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-12 text-theme-dark-blue">
        Edit Restaurant Info
      </h1>
      <RestaurantClient restaurant={restaurant} />
    </main>
  );
}
