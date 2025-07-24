"use server";

import bcrypt from "bcryptjs";
import postgres from "postgres";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ErrorState } from "@/app/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

type CartItem = {
  name: string;
  quantity: number;
  price: number;
};

export async function placeOrder(
  cartItems: CartItem[],
  address: string,
  instructions?: string 
) {
  try {
    if (!cartItems.length) {
      throw new Error("Cart is empty");
    }

    // 1. Insert into Orders table
    const orderResult = await sql`
      INSERT INTO Orders (userid,createdat, status ,  instructions, address)
      VALUES (${1},${"2025-07-24"},${"Cooking"},${instructions || null},${address})
      RETURNING id;
    `;

    const orderId = orderResult[0].id;

    // 2. Get item IDs from Items table
    const itemNames = cartItems.map((item) => item.name);
    const itemRows = await sql`
      SELECT id, name FROM items WHERE name = ANY(${itemNames});
    `;

    const itemIdMap = new Map<string, number>();
   for (const row of itemRows) {  
  itemIdMap.set(row.name, row.id);
}

    // 3. Insert into OrderDetails table
    for (const item of cartItems) {
      const itemId = itemIdMap.get(item.name);
      if (!itemId) {
        throw new Error(`Item not found: ${item.name}`);
      }

       await sql`
    INSERT INTO OrderDetails (orderid, itemid, quantity)
    VALUES (${orderId}, ${itemId}, ${item.quantity});
  `;
    }

    console.log("✅ Order placed successfully with ID:", orderId);
    return { success: true, orderId };
  } catch (error: any) {
    console.error("❌ Error placing order:", error.message);
    return { success: false, error: error.message || "Unknown error" };
  }
};