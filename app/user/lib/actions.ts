"use server";

import bcrypt from "bcryptjs";
import postgres from "postgres";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth, signOut } from "@/auth";
import { ErrorState} from "./definitions";
import { OrderStatuses } from "./definitions";


const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const userSchema = z.object({
  username: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  contact: z
    .string()
    .min(6, "Contact number must be at least 6 digits")
    .max(20, "Contact number must be at most 20 digits")
    .regex(/^\d+$/, "Contact must contain only digits"),
});

export async function updateUserAddress(
  coordinates: Coordinates
): Promise<ErrorState> {
  try {
    if (!coordinates || coordinates.latitude == null || coordinates.longitude == null) {
      return {
        success: false,
        message: "",
        errors: ["Coordinates are invalid."],
      };
    }

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        message: "User doesn't exist.",
        errors: [""],
      };
    }

    await sql`
      UPDATE users
      SET latitude = ${coordinates.latitude}, longitude = ${coordinates.longitude}
      WHERE id = ${userId}
    `;

    revalidatePath("/user/profile");
    revalidatePath("/admin/profile");

    return {
      success: true,
      message: "Address updated successfully.",
    };
  } catch (error: unknown) {
    console.error("Failed to update address:", error);
    return {
      success: false,
      message: "Failed to update address.",
    };
  }
}

export async function updateUser(
  prevState: ErrorState,
  formData: FormData
): Promise<ErrorState> {
  try {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const contact = formData.get("contact") as string;

    const result = userSchema.safeParse({ username, email, contact });

    if (!result.success) {
      return {
        errors: result.error.issues.map((e) => e.message),
      };
    }

    const session = await auth();

    const userId = session?.user?.id;

    if (!userId)
      return {
        success: false,
        message: "User does not exist.",
        errors: [],
      };

    // Uniqueness check (excluding current user)
    const [existingUser] = await sql`
      SELECT * FROM users
      WHERE (username = ${username} OR email = ${email}) AND id <> ${userId}
    `;

    const errors: string[] = [];

    if (existingUser) {
      if (existingUser.username === username) {
        errors.push("Username is already taken");
      }
      if (existingUser.email === email) {
        errors.push("Email is already registered");
      }
    }

    if (errors.length > 0) {
      return { errors };
    }

    await sql`
      UPDATE users
      SET username = ${username}, email = ${email}, contact = ${contact}
      WHERE id = ${userId}
    `;

    revalidatePath("/user/profile");
    revalidatePath("/admin/profile");

    return {
      success: true,
      message: "",
      errors: [],
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      message: "Failed to update user.",
      errors: [],
    };
  }
}

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .regex(/\d/, "New password must include at least one digit"),
});

export async function changePassword(
  prevState: ErrorState,
  formData: FormData
): Promise<ErrorState> {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  const result = passwordSchema.safeParse({ currentPassword, newPassword });

  if (!result.success) {
    return {
      errors: result.error.issues.map((e) => e.message),
    };
  }

  const session = await auth();

  const userId = session?.user?.id;

  if (!userId)
    return {
      success: false,
      message: "User does not exist.",
      errors: [],
    };

  try {
    const users = await sql`SELECT * FROM users WHERE id = ${userId}`;
    const user = users[0];

    if (!user) return { message: "User not found" };

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return { message: "Current password is incorrect" };

    const hashed = await bcrypt.hash(newPassword, 10);
    await sql`UPDATE users SET password = ${hashed} WHERE id = ${userId}`;

    return { success: true };
  } catch (err) {
    console.error(err);
    return { message: "Something went wrong" };
  }
}

// --- ORDER STATUS MANAGEMENT ---

export async function updateOrderStatus(
  orderId: number,
  newStatus: number
): Promise<ErrorState> {
  try {
    if (newStatus === 2) {
      await sql`
        UPDATE Orders
        SET status = ${newStatus},
            deliveredAt = NOW()
        WHERE id = ${orderId}
      `;
    } else {
      await sql`
        UPDATE Orders
        SET status = ${newStatus}
        WHERE id = ${orderId}
      `;
    }

    revalidatePath("/admin/orders");

    return { success: true, message: "Status updated" };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, message: "Failed to update status" };
  }
}

export async function cancelOrder(orderId: number): Promise<ErrorState> {
  try {
    await sql`
      UPDATE Orders
      SET status = ${OrderStatuses.Cancelled}
      WHERE id = ${orderId}
    `;

    revalidatePath("/admin/orders/currentorders");
    return { success: true, message: "Order cancelled" };
  } catch (error) {
    console.error("Failed to cancel order:", error);
    return { success: false, message: "Failed to cancel order" };
  }
}

const restaurantUpdateSchema = z.object({
  latitude: z
    .string()
    .min(1, "Latitude is required")
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Latitude must be a valid number",
    }),
  longitude: z
    .string()
    .min(1, "Longitude is required")
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Longitude must be a valid number",
    }),
  about: z.string().min(1, "About Us is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  contact: z
    .string()
    .min(6, "Contact must be at least 6 digits")
    .max(20, "Contact must be at most 20 digits")
    .regex(/^\d+$/, "Contact must only contain digits"),
delivery_fee: z
  .string()
  .min(1, "Delivery fee is required")
  .regex(/^\d+$/, "Delivery fee must be a valid positive number")
  .refine((val) => parseInt(val) <= 9999, {
    message: "Delivery fee must be less than 10000",
  }),
});

export async function updateRestaurant(
  prevState: { success: boolean; message: string | null; errors: string[] },
  formData: FormData
): Promise<{ success: boolean; message: string | null; errors: string[] }> {
  try {
    const rawData = {
      latitude: formData.get("latitude")?.toString().trim() ?? "",
      longitude: formData.get("longitude")?.toString().trim() ?? "",
      about: formData.get("about")?.toString().trim() ?? "",
      startTime: formData.get("startTime")?.toString().trim() ?? "",
      endTime: formData.get("endTime")?.toString().trim() ?? "",
      contact: formData.get("contact")?.toString().trim() ?? "",
      delivery_fee: formData.get("delivery_fee")?.toString().trim() ?? "",
    };

    const parsed = restaurantUpdateSchema.safeParse(rawData);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => e.message);
      return { success: false, message: null, errors };
    }

    const {
      latitude,
      longitude,
      about,
      startTime,
      endTime,
      contact,
      delivery_fee,
    } = parsed.data;

    await sql`
      UPDATE RestDetails
      SET latitude = ${parseFloat(latitude)},
          longitude = ${parseFloat(longitude)},
          about = ${about},
          operatingHoursStart = ${startTime},
          operatingHoursEnd = ${endTime},
          contact = ${contact},
          delivery_fee = ${delivery_fee}
      WHERE id = 1
    `;

    revalidatePath("/admin/editrestaurant");

    return { success: true, message: "Restaurant updated!", errors: [] };
  } catch (error) {
    console.error("Update error:", error);
    return {
      success: false,
      message: "Update failed due to a server error. Please try again later.",
      errors: [],
    };
  }
}



type CartItem = {
  name: string;
  quantity: number;
  price: number;
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

export async function placeOrder(
  cartItems: CartItem[],
  coords: Coordinates | null,
  instructions?: string
) {
  try {
    if (!cartItems.length) {
      throw new Error("Cart is empty");
    }

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId)
      return {
        success: false,
      };

    if (!coords) {
      throw new Error("Coordinates are missing");
    }

    const { latitude, longitude } = coords;

    const orderResult = await sql`
      INSERT INTO Orders (userid, instructions, latitude, longitude)
      VALUES (${userId}, ${instructions || null}, ${latitude}, ${longitude})
      RETURNING id;
    `;

    const orderId = orderResult[0].id;

    const itemNames = cartItems.map((item) => item.name);
    const itemRows = await sql`
      SELECT id, name FROM items WHERE name = ANY(${itemNames});
    `;

    const itemIdMap = new Map<string, number>();
    for (const row of itemRows) {
      itemIdMap.set(row.name, row.id);
    }

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

    return { success: true, orderId };

  } catch (error: unknown) {
    console.error("❌ Error placing order:", error instanceof Error ? error.message : error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteUserAccountAndLogout() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    await sql`
      DELETE FROM users
      WHERE id = ${userId}
    `;

    await signOut({ redirectTo: "/" });
}


export async function UpdateOrderRating(orderId: number, rating: number) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, message: "User not authenticated" };
  }

  if (!Number.isInteger(orderId) || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { success: false, message: "Invalid order or rating" };
  }

  try {
    const result = await sql`
      UPDATE Orders
      SET rating = ${rating}
      WHERE id = ${orderId} AND userId = ${userId} AND status >= 2
      RETURNING id
    `;

    if (result.length === 0) {
      return { success: false, message: "Order not found" };
    }

    revalidatePath("/user/orders/past");
    return { success: true };
  } catch {
    return { success: false, message: "Failed to update rating" };
  }
}


export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}

