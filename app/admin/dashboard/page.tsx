import { getCategories } from "@/app/user/lib/data";
import DashboardClient from "./dashboardclient";
import AddressBar from "@/app/user/ui/dashboard/address-bar";
import { getMenuItems } from "../lib/data";

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
