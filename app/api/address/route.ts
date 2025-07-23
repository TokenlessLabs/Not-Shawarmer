import { NextResponse } from "next/server";
import { getUserAddress } from "@/app/user/lib/data";

export async function GET() {
  try {
    const address = await getUserAddress();
    return NextResponse.json({ address });
  } catch (err) {
    console.error("Failed to fetch address", err);
    return NextResponse.json(
      { error: "Failed to fetch address" },
      { status: 500 }
    );
  }
}
