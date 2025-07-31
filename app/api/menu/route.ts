// app/api/menu/route.ts
import { NextResponse } from "next/server";
import { getMenuItems } from "@/app/admin/lib/data";

export async function GET() {
  const items = await getMenuItems(); // fetch from DB
  return NextResponse.json(items);
}
