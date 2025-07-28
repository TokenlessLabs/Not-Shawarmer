import React from "react";
import NavLinks from "@/app/ui/sidebar/navlinks";
import { signOut, auth } from "@/auth";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

const userLinks = [
  {
    name: "Dashboard",
    href: "/user/dashboard",
  },
  {
    name: "Orders",
    href: "/user/orders",
  },
  {
    name: "Profile",
    href: "/profile",
  },
];

const adminLinks = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    name: "Orders",
    href: "/admin/orders",
  },
  {
    name: "Edit Restaurant",
    href: "/admin/editrestaurant",
  },
  // {
  //   name: "Statistics",
  //   href: "/admin/statistics",
  // },
  {
    name: "Profile",
    href: "/profile",
  },
];

const Sidebar = async () => {
  const session = await auth();

  const role = session?.user?.role;

  const navItems = role === "Admin" ? adminLinks : userLinks;

  return (
    <aside className="h-full w-full bg-theme-light-blue text-white px-2 pt-6 pb-3 flex flex-col border-r-3 border-theme-dark-blue">
      <img src="/Logo.svg" alt="Logo" className="my-3" />

      <div className="border-t-3 border-theme-dark-blue mt-6 mb-6 -mx-2"></div>

      <NavLinks items={navItems} />

      <div className="border-t-3 border-theme-dark-blue mt-4 mb-3 -mx-2"></div>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button className="flex items-center gap-4 text-xl px-4 py-3 rounded-lg transition-all duration-200 text-red-400 hover:text-white hover:bg-red-400 font-medium w-full text-left">
          <ArrowRightStartOnRectangleIcon className="h-10 w-10" />
          <span>Logout</span>
        </button>
      </form>
    </aside>
  );
};

export default Sidebar;
