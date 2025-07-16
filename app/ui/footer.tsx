import { PhoneIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";

const footerInfo = {
  about: "Serving delicious food since 1999",
  contact: "+92 300 1234567",
  location: "123 Food Street, Lahore",
  hours: "12PM – 11PM",
};

export default function Footer() {
  return (
    <footer className="w-full h-[90px] bg-theme-light-blue border-t-3 border-theme-dark-blue px-6 flex items-center justify-between text-theme-dark-blue text-sm">
      {/* Left: Logo Only */}
      <div className="flex items-center">
        <img src="/Logo.svg" alt="Logo" className="h-[60px] w-auto" />
      </div>

      {/* Center: About Us */}
      <div className="text-center hidden sm:block">
        <p className="text-lg font-medium">{footerInfo.about}</p>
      </div>

      {/* Right: Contact Info */}
      <div className="flex flex-col text-right leading-tight text-xs sm:text-sm gap-0.5">
        <p className="flex items-center justify-end gap-1">
          <PhoneIcon className="w-4 h-4" />
          {footerInfo.contact}
        </p>
        <p className="flex items-center justify-end gap-1">
          <MapPinIcon className="w-4 h-4" />
          {footerInfo.location}
        </p>
        <p className="flex items-center justify-end gap-1">
          <ClockIcon className="w-4 h-4" />
          {footerInfo.hours}
        </p>
      </div>
    </footer>
  );
}
