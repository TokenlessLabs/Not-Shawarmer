import { NextResponse } from "next/server";
import { getItemsGroupedByCategory } from "@/app/user/lib/data";

export async function GET() {
  const data = await getItemsGroupedByCategory();

  // Transform Record<string, MenuItem[]> to array of { category, items }
  const result = Object.entries(data).map(([category, items]) => ({
    category,
    items,
  }));

  return NextResponse.json(result);
}
