'use client';
 
//import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
//import { Button } from '@/app/ui/button';
import { useActionState } from 'react';
import { authenticate } from '../lib/actions';
import { useSearchParams } from 'next/navigation';

 
export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
 
  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={` mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <button className="mt-4 w-full" aria-disabled={isPending}>
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}





// "use client";

// import { useActionState } from "react";
// import { loginUser, LoginErrorState } from "@/app/signup/actions";
// import Link from "next/link";
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function LoginForm() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);

//   const initialState: LoginErrorState = {
//     message: null,
//     success: false,
//     errors: [],
//   };

//   const [state, formAction] = useActionState(loginUser, initialState);

//   useEffect(() => {
//     if (state.success) {
//       router.push("/user/dashboard");
//     }
//   }, [state.success, router]);

//   return (
//     <form
//       action={formAction}
//       className="border rounded-xl border-gray-300 p-6 w-1/2 max-w-md flex flex-col gap-4 shadow-md bg-white"
//     >
//       <div className="flex flex-col">
//         <label htmlFor="email" className="text-sm font-medium mb-1">
//           Email
//         </label>
//         <input
//           id="email"
//           name="email"
//           type="email"
//           placeholder="example@gmail.com"
//           required
//           className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-light-blue"
//         />
//       </div>

//       <div className="flex flex-col relative">
//         <label htmlFor="password" className="text-sm font-medium mb-1">
//           Password
//         </label>
//         <input
//           id="password"
//           name="password"
//           type={showPassword ? "text" : "password"}
//           placeholder="******"
//           required
//           className="border rounded-md px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-theme-light-blue"
//         />
//         <button
//           type="button"
//           onClick={() => setShowPassword((prev) => !prev)}
//           className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
//           aria-label="Toggle password visibility"
//         >
//           {showPassword ? (
//             <EyeSlashIcon className="h-5 w-5" />
//           ) : (
//             <EyeIcon className="h-5 w-5" />
//           )}
//         </button>
//       </div>

//       {((state.errors?.length ?? 0) > 0 || state.message) && (
//   <div className="space-y-1 mt-2">
//     {state.errors?.map((err, i) => (
//       <p key={i} className="text-sm text-red-600">
//         {err}
//       </p>
//     ))}
//     {state.message && (
//       <p className="text-sm text-red-600">{state.message}</p>
//     )}
//   </div>
// )}


//       <button
//         type="submit"
//         className="bg-theme-blue hover:bg-theme-bluehighlighted text-white py-2 rounded-md mt-2 font-medium"
//       >
//         Sign In
//       </button>

//       <p className="text-sm text-center">
//         No Account?{" "}
//         <Link
//           href="/signup"
//           className="text-theme-dark-blue underline font-semibold"
//         >
//           Sign Up!
//         </Link>
//       </p>
//     </form>
//   );
// }
