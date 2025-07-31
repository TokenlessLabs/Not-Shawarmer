import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/app/user/lib/data";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderid: string } }
) {
  const orderId = parseInt(params.orderid, 10);

  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }

  const order = await getOrderById(orderId);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order, { status: 200 });
}
