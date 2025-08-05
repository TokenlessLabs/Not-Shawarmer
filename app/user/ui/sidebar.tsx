"use client";

import React from "react";
import NavLinks from "@/app/ui/sidebar/navlinks";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useUser } from "../lib/hooks/useUser";
import { Roles } from "../lib/definitions";
import { handleSignOut } from "../lib/actions";

const userLinks = [
  { name: "Dashboard", href: "/user/dashboard" },
  { name: "Orders", href: "/user/orders" },
  { name: "Profile", href: "/profile" },
];

const adminLinks = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Orders", href: "/admin/orders" },
  { name: "Edit Restaurant", href: "/admin/editrestaurant" },
  { name: "Profile", href: "/profile" },
];

const Sidebar = () => {
  const { user, isLoading } = useUser();

  if (isLoading || !user) {
    return <div className="p-4 text-gray-500">Loading sidebar...</div>;
  }

  const navItems =
    user.role === Roles.Admin ? adminLinks : userLinks;

  const username = user.username;

  return (
    <aside className="h-full w-full bg-theme-light-blue text-white px-2 pt-6 pb-3 flex flex-col border-r-3 border-theme-dark-blue">
      <img src="/Logo.svg" alt="Logo" className="my-3" />

      <div className="border-t-3 border-theme-dark-blue mt-6 mb-6 -mx-2"></div>

      <NavLinks items={navItems} username={username} />

      <div className="border-t-3 border-theme-dark-blue mt-4 mb-3 -mx-2"></div>

      <form action={handleSignOut}>
        <button className="flex items-center gap-4 text-xl px-4 py-3 rounded-lg transition-all duration-200 text-red-400 hover:text-white hover:bg-red-400 font-medium w-full text-left cursor-pointer">
          <ArrowRightStartOnRectangleIcon className="h-10 w-10" />
          <span>Logout</span>
        </button>
      </form>
    </aside>
  );
};

export default Sidebar;
