import { NextResponse } from "next/server";
import { getRestaurantDetails } from "@/app/user/lib/data";

export async function GET() {
  try {
    const details = await getRestaurantDetails();
    return NextResponse.json({ deliveryFee: details.delivery_fee });
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
