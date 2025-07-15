  'use client';

  import React from 'react';
  import Link from 'next/link';
  import { usePathname } from 'next/navigation';
  import {
    Squares2X2Icon,
    ShoppingBagIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
  } from '@heroicons/react/24/outline';

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Squares2X2Icon,
    },
    {
      name: 'Orders',
      href: '/dashboard/orders',
      icon: ShoppingBagIcon,
    },
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: UserCircleIcon,
    },
  ];

  const Sidebar = () => {
    const pathname = usePathname();

    return (
      <aside className="h-full w-full bg-theme-light-blue text-white px-2 py-6 flex flex-col">
        {/* Space for logo */}
        <div className="h-20 mb-2"></div>

        {/* Separator above menu */}
        <div className="border-t-3 border-theme-dark-blue mt-6 mb-6 -mx-2"></div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4 flex-grow text-theme-dark-blue">
          {menuItems.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');

            return (
              <Link
                key={name}
                href={href}
                className={`w-full rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-theme-blue text-white' : 'hover:bg-blue-200'
                }`}
              >
                <div className="flex items-center gap-4 text-xl px-4 py-3 font-medium">
                  <Icon className="h-10 w-10" />
                  <span>{name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

  {/* Thicker separator before logout */}
  <div className="border-t-3 border-theme-dark-blue mt-4 mb-2 -mx-2"></div>


        {/* Logout */}
        <Link
          href="/logout"
          className="w-full rounded-lg hover:bg-red-500/20 transition"
        >
          <div className="flex items-center gap-4 text-xl px-4 py-3 text-red-400 font-medium">
            <ArrowRightOnRectangleIcon className="h-10 w-10" />
            <span>Logout</span>
          </div>
        </Link>
      </aside>
    );
  };

  export default Sidebar;
