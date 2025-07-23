"use client";

import { Suspense, useActionState } from "react";
import { loginUser, LoginErrorState } from "@/app/signup/actions";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// 🔽 IMPORT YOUR COMPONENT
import LoginForm from "./user/ui/login-form";

export default function Login() {
  const router = useRouter();
 

  const initialState: LoginErrorState = {
    message: null,
    success: false,
    errors: [],
  };

  const [state, formAction] = useActionState(loginUser, initialState);

  useEffect(() => {
    if (state.success) {
      router.push("/user/dashboard");
    }
  }, [state.success, router]);

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
