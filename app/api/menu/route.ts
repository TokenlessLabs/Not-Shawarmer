import { NextResponse } from "next/server";
import { getAllMenuItems } from "@/app/user/lib/data";

export async function GET() {
  const items = await getAllMenuItems();
  return NextResponse.json(items);
}
