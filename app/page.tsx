// app/page.tsx (or wherever your page is)
import PasswordInput from "../app/ui/login/password-input";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-full flex text-theme-dark-blue">
      {/* Left Panel */}
      <div className="w-1/2 h-full bg-theme-light-blue flex items-center justify-center">
        <img src="/logo.svg" alt="Logo" className="w-[90%] h-auto" />
      </div>

      {/* Right Panel */}
      <div className="w-1/2 h-full flex flex-col items-center justify-center gap-6">
        <p className="text-4xl font-bold">Login</p>

        <div className="border rounded-xl border-gray-300 p-6 w-1/2 max-w-md flex flex-col gap-4 shadow-md bg-white">
          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-light-blue"
            />
          </div>

          {/* Password - Client Component */}
          <PasswordInput />

          {/* Sign In Button */}
          <button className="bg-[#0099e5] hover:bg-[#007fcc] text-white py-2 rounded-md mt-2 font-medium">
            Sign In
          </button>

          {/* Sign Up Link */}
          <p className="text-sm text-center">
            No Account?{" "}
            <Link
              href="/signup"
              className="text-theme-dark-blue underline font-semibold"
            >
              Sign Up!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
