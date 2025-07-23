import { getCategories, getMenuItems } from "../lib/data";
import DashboardClient from "./dashboardclient";
import AddressBar from "../ui/dashboard/address-bar";

export default async function DashboardPage() {
  const categories = await getCategories();
  const menuItems = await getMenuItems();

  return (
    <>
      <AddressBar />
      <DashboardClient menuItems={menuItems} categories={categories} />
    </>
  );
}
