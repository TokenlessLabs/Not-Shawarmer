"use server";

import bcrypt from "bcryptjs";
import postgres from "postgres";
import { z } from "zod";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type ChangePasswordErrorState = {
  success?: boolean;
  message?: string | null;
  errors?: string[];
};

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .regex(/\d/, "New password must include at least one digit"),
});

export async function changePassword(
  prevState: ChangePasswordErrorState,
  formData: FormData
): Promise<ChangePasswordErrorState> {
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