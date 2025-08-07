
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { UpdateOrderRating } from "@/app/user/lib/actions";
 

export async function GET() {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orderRating = await UpdateOrderRating();
  // console.log(orders)
  return NextResponse.json(orderRating);
}
