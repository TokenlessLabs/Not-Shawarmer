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

type NavItem = {
  name: string;
  href: string;
};

type NavLinksProps = {
  items: NavItem[];
  username?: string;
};

const iconMap: Record<string, React.ElementType> = {
  Dashboard: Squares2X2Icon,
  Orders: ShoppingBagIcon,
  Profile: UserCircleIcon,
  "Edit Restaurant": PencilSquareIcon,
  Statistics: ChartBarIcon,
};

const NavLinks: React.FC<NavLinksProps> = ({ items, username }) => {
  const pathname = usePathname();
  console.log(username)
  return (
    <nav className="flex flex-col gap-4 flex-grow text-theme-dark-blue">
      {items.map(({ name, href }) => {

        const isActive = pathname ? pathname.startsWith(href) : false;

        const Icon = iconMap[name] || Squares2X2Icon; // Default icon fallback


        const displayName = name === "Profile" && username ? `${name} (${username})` : name;

        return (
          <Link
            key={name}
            href={href}
            className={`w-full rounded-lg transition-all duration-200 ${isActive ? "bg-theme-blue text-white" : "hover:bg-blue-200"
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
