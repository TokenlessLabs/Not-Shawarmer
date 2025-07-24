import { getCategories } from "@/app/user/lib/data";
import DashboardClient from "./dashboardclient";
import { getMenuItems } from "../lib/data";

export default async function DashboardPage() {
  const categories = await getCategories();
  const menuItems = await getMenuItems();

  return (
    <>
      <DashboardClient menuItems={menuItems} categories={categories} />
    </>
  );
}
