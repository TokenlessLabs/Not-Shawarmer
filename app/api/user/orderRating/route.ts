
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { UpdateOrderRating } from "@/app/user/lib/actions";
import { z } from "zod";

const ratingSchema = z.object({
  orderId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsedBody = ratingSchema.safeParse(await request.json());
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid order or rating" }, { status: 400 });
  }

  const orderRating = await UpdateOrderRating(
    parsedBody.data.orderId,
    parsedBody.data.rating
  );
  return NextResponse.json(orderRating);
}
