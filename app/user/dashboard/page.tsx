import React from "react";
import AddressBar from "../ui/dashboard/address-bar";
import Card from "../ui/dashboard/menu-item-card";
import Cart from "../ui/dashboard/cart";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

const DashboardPage = () => {
  return (
    <>
      <AddressBar />
      <div className="flex justify-center mt-7">
        <div className="flex items-center gap-2 w-full max-w-md mx-auto mt-8 px-4">
          <MagnifyingGlassIcon className="text-gray-500 w-8 h-8" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-grow px-4 py-2 rounded border border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400"
          />
        </div>
      </div>
      <div className="m-10">
        <h1 className="text-2xl my-5 border-b-2 ">Starter </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          <Card />
        
        </div>
      </div>

      <Cart />
    </>
  );
};

export default DashboardPage;
