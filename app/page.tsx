"use client";

import { Suspense } from "react";

import LoginForm from "./user/ui/login-form";

export default function Login() {
  return (
    <div className="h-screen w-full flex text-theme-dark-blue">
      <div className="w-1/2 h-full bg-theme-light-blue flex items-center justify-center">
        <img src="/logo.svg" alt="Logo" className="w-[90%] h-auto" />
      </div>

      <div className="w-1/2 h-full flex flex-col items-center justify-center gap-6">
        <p className="text-4xl font-bold">Login</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
