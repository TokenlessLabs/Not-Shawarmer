"use client";

export default function Signup() {
  return (
    <div className="h-screen w-full flex text-theme-dark-blue">
      {/* Left Panel */}
      <div className="w-1/2 h-full bg-theme-light-blue flex items-center justify-center">
        <img src="/logo.svg" alt="Logo" className="w-[90%] h-auto" />
      </div>

      {/* Right Panel */}
      <div className="w-1/2 h-full flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold text-theme-dark-blue">Sign Up</h1>

        <form
          className="border rounded-xl border-gray-300 p-6 w-1/2 max-w-md flex flex-col gap-4 shadow-md bg-white"
          onSubmit={(e) => e.preventDefault()} // placeholder for now
        >
          {/* Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-light-blue"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-light-blue"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-light-blue"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-light-blue"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-light-blue"
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="bg-theme-blue hover:bg-theme-bluehighlighted text-white py-2 rounded-md mt-2 font-medium"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
