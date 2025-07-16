import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Cart() {
  return (
    <Link
      href="/user/dashboard/cart"
      className="w-16 h-16 rounded-full shadow-lg bg-theme-blue flex items-center justify-center"
    >
      <ShoppingCartIcon className="w-6 h-6 text-white" />
    </Link>
  );
}
