import { PhoneIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import { getRestaurantDetails } from "../lib/data";

export default async function Footer() {
  const restDetails = await getRestaurantDetails();

  if (!restDetails) return null;

  return (
    <footer className="w-full h-[90px] bg-theme-light-blue border-t-3 border-theme-dark-blue px-6 flex items-center justify-between text-theme-dark-blue text-sm">
      {/* Left: Logo Only */}
      <div className="flex items-center">
        <img src="/Logo.svg" alt="Logo" className="h-[60px] w-auto" />
      </div>

      {/* Center: About Us */}
      <div className="text-center hidden sm:block">
        <p className="text-lg font-medium">{restDetails.about}</p>
      </div>

      {/* Right: Contact Info */}
      <div className="flex flex-col text-right leading-tight text-xs sm:text-sm gap-0.5">
        <p className="flex items-center justify-end gap-1">
          <PhoneIcon className="w-4 h-4" />
          {restDetails.contact}
        </p>
        <p className="flex items-center justify-end gap-1">
          <MapPinIcon className="w-4 h-4" />
          {restDetails.address}
        </p>
        <p className="flex items-center justify-end gap-1">
          <ClockIcon className="w-4 h-4" />
          {`${restDetails.operatinghoursstart?.slice(0, 5) || "N/A"} – ${
            restDetails.operatinghoursend?.slice(0, 5) || "N/A"
          }`}
        </p>
      </div>
    </footer>
  );
}
