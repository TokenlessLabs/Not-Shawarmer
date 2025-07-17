"use server";

import bcrypt from "bcryptjs";
import postgres from "postgres";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export type ErrorState = {
  success?: boolean;
  message?: string | null;
  errors?: string[];
};

const userSchema = z.object({
  username: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  contact: z
    .string()
    .min(6, 'Contact number must be at least 6 digits')
    .max(20, 'Contact number must be at most 20 digits')
    .regex(/^\d+$/, 'Contact must contain only digits'),
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
};

export async function updateUser(
  prevState: ErrorState,
  formData: FormData
): Promise<ErrorState> {
  try {
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const contact = formData.get('contact') as string;

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
      message: '',
      errors: [],
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: 'Failed to update user.',
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