import { NextResponse } from "next/server";
import { getAdminCurrentOrders } from "@/app/user/lib/data";

export async function GET() {
  try {
    const orders = await getAdminCurrentOrders();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
