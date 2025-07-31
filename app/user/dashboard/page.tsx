import { getCategories, getUserAddress } from "../lib/data";
import DashboardClient from "./dashboardclient";
import AddressBar from "../ui/dashboard/address-bar";

export default async function DashboardPage() {
  const categories = await getCategories();
  const coordinates = await getUserAddress();

  return (
    <>
      <AddressBar coordinates={coordinates} />
      <DashboardClient categories={categories} />
    </>
  );
}
