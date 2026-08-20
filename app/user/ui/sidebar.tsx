'use client'

import React from "react";
import NavLinks from "@/app/ui/sidebar/navlinks";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useUser } from "../lib/SWR-hooks/useUser";
import { Roles } from "../lib/definitions";
import { logout } from "@/app/signup/actions";

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
    return (
      <aside className="h-full w-full bg-theme-light-blue text-white px-2 pt-6 pb-3 flex flex-col border-r-3 border-theme-dark-blue animate-pulse">
        <div className="h-10 w-50 bg-theme-blue/50 rounded  my-3 mx-auto" />

        <div className="border-t-3 border-theme-dark-blue mt-6 mb-6 -mx-2"></div>

        {/* Fake nav links */}
        <div className="flex flex-col gap-7 h-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 text-xl px-4 py-3 rounded-lg bg-theme-blue/70"
            >
              <div className="h-10 w-10 bg-theme-blue/50 rounded" />
              <div className="h-5 w-3/4 bg-theme-blue/50 rounded" />
            </div>
          ))}
        </div>

        <div className="border-t-3 border-theme-dark-blue mt-4 mb-3 -mx-2"></div>

        {/* Logout button skeleton */}
        <div className="flex items-center gap-4 text-xl px-4 py-3 rounded-lg bg-red-200 mt-auto">
          <div className="h-10 w-10 bg-red-300 rounded" />
          <div className="h-5 w-1/2 bg-red-300 rounded" />
        </div>
      </aside>
    )

  }

  const navItems = user.role === Roles.Admin ? adminLinks : userLinks;
  const username = user.username;

  return (
    <aside className="h-full w-full bg-theme-light-blue text-white px-2 pt-6 pb-3 flex flex-col border-r-3 border-theme-dark-blue">
      <img src="/Logo.svg" alt="Logo" className="my-3" />

      <div className="border-t-3 border-theme-dark-blue mt-6 mb-6 -mx-2"></div>

      <NavLinks items={navItems} username={username} />

      <div className="border-t-3 border-theme-dark-blue mt-4 mb-3 -mx-2"></div>

      {/* ✅ Use the server action from separate file */}
      <form action={logout}>
        <button className="flex items-center gap-4 text-xl px-4 py-3 rounded-lg transition-all duration-200 text-red-400 hover:text-white hover:bg-red-400 font-medium w-full text-left cursor-pointer">
          <ArrowRightStartOnRectangleIcon className="h-10 w-10" />
          <span>Logout</span>
        </button>
      </form>

      {/* Local logout effect */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            localStorage.setItem('logout', Date.now().toString());
          `,
        }}
      />
    </aside>
  );
};

export default Sidebar;
