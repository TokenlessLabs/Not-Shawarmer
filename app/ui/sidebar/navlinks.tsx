"use client";

import React from "react";
import Link from "next/link";
import {
  Squares2X2Icon,
  ShoppingBagIcon,
  UserCircleIcon,
  PencilSquareIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useUser } from "../../user/lib/hooks/useUser";

type NavItem = {
  name: string;
  href: string;
};

type NavLinksProps = {
  items: NavItem[];
};


const iconMap: Record<string, React.ElementType> = {
  Dashboard: Squares2X2Icon,
  Orders: ShoppingBagIcon,
  Profile: UserCircleIcon,
  "Edit Restaurant": PencilSquareIcon,
  Statistics: ChartBarIcon,
};

const NavLinks: React.FC<NavLinksProps> = ({ items }) => {
  const pathname = usePathname();
  const {user} =useUser();
  console.log("User from hook:", user);
  const usename = user?.name ;

  return (
    <nav className="flex flex-col gap-4 flex-grow text-theme-dark-blue">
      {items.map(({ name, href }) => {
        const isActive = pathname.startsWith(href);
        const Icon = iconMap[name];

         const displayName =( name === "Profile" && usename ? `${name} (${usename})` : name);

        return (
          <Link
            key={name}
            href={href}
            className={`w-full rounded-lg transition-all duration-200 ${
              isActive ? "bg-theme-blue text-white" : "hover:bg-blue-200"
            }`}
          >
            <div className="flex items-center gap-4 text-xl px-4 py-3 font-medium">
              <Icon className="h-10 w-10" />
              <span>{displayName}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default NavLinks;
