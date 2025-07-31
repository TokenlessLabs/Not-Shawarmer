// app/api/menu/route.ts
import { NextResponse } from "next/server";
import { getMenuItems } from "@/app/user/lib/data";

export async function GET() {
  const items = await getMenuItems();
  return NextResponse.json(items);
}
