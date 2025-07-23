"use server";

import bcrypt from "bcryptjs";
import postgres from "postgres";
import { z } from "zod";
import { revalidatePath } from "next/cache";


const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type ErrorState = {
  success?: boolean;
  message?: string | null;
  errors?: string[];
};

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
  newAddress: string
): Promise<ErrorState> {
  try {
    if (!newAddress || newAddress.trim().length === 0) {
      return {
        success: false,
        message: "",
        errors: ["Address cannot be empty."],
      };
    }

    await sql`
      UPDATE users
      SET address = ${newAddress}
      WHERE id = ${1}
    `;

    revalidatePath("/user/profile");

    return {
      success: true,
      message: "Address updated successfully.",
    };
  } catch (error: any) {
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

    // Uniqueness check (excluding current user)
    const [existingUser] = await sql`
      SELECT * FROM users
      WHERE (username = ${username} OR email = ${email}) AND id <> ${1}
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
      WHERE id = ${1}
    `;

    revalidatePath("/user/profile");

    return {
      success: true,
      message: "",
      errors: [],
    };
  } catch (error: any) {
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

  try {
    const users = await sql`SELECT * FROM users WHERE id = ${1}`; // Replace with session user
    const user = users[0];

    if (!user) return { message: "User not found" };

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return { message: "Current password is incorrect" };

    const hashed = await bcrypt.hash(newPassword, 10);
    await sql`UPDATE users SET password = ${hashed} WHERE id = ${1}`;

    return { success: true };
  } catch (err) {
    return { message: "Something went wrong" };
  }
}

// --- ORDER STATUS MANAGEMENT ---

export async function updateOrderStatus(
  orderId: number,
  newStatus: string
): Promise<ErrorState> {
  try {
    await sql`
      UPDATE Orders
      SET status = ${newStatus}
      WHERE id = ${orderId}
    `;

    revalidatePath("/admin/orders/currentorders"); // Adjust path if needed
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
      SET status = 'Cancelled'
      WHERE id = ${orderId}
    `;

    revalidatePath("/admin/orders/currentorders");
    return { success: true, message: "Order cancelled" };
  } catch (error) {
    console.error("Failed to cancel order:", error);
    return { success: false, message: "Failed to cancel order" };
  }
}

export async function updateRestaurant(
  prevState: { success: boolean; message: string | null; errors: string[] },
  formData: FormData
): Promise<{ success: boolean; message: string | null; errors: string[] }> {
  try {
    const name = formData.get("name")?.toString().trim() ?? "";
    const address = formData.get("address")?.toString().trim() ?? "";
    const about = formData.get("about")?.toString().trim() ?? "";
    const startTime = formData.get("startTime")?.toString().trim() ?? "";
    const endTime = formData.get("endTime")?.toString().trim() ?? "";
    const contact = formData.get("contact")?.toString().trim() ?? "";

    if (!name || !address || !startTime || !endTime || !contact) {
      return {
        success: false,
        message: null,
        errors: ["All fields except 'about' are required."],
      };
    }

    await sql`
      UPDATE RestDetails
      SET name = ${name},
          address = ${address},
          about = ${about},
          operatingHoursStart = ${startTime},
          operatingHoursEnd = ${endTime},
          contact = ${contact}
      WHERE id = 1
    `;

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