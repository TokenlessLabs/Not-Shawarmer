
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPastOrders } from "@/app/user/lib/data"; 

export async function GET() {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await getPastOrders();
  // console.log(orders)
  return NextResponse.json(orders);
}
