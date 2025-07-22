import { NextResponse } from "next/server";
import { getCurrentOrders } from "@/app/user/lib/data";

export async function GET() {
  try {
    const orders = await getCurrentOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch current orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch current orders" },
      { status: 500 }
    );
  }
}
