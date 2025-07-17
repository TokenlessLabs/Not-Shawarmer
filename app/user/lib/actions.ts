"use server";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import postgres from "postgres";
import { User } from "./definitions";
import { revalidatePath } from "next/cache";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(req: NextRequest) {
  const { currentPassword, newPassword } = await req.json();

  // Get user ID from session (or token, depending on your auth system)
  const userId = 1; // ← Replace with real session logic

  const user = await sql`SELECT password FROM users WHERE id = ${userId}`;

  if (!user[0]) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const passwordMatch = await bcrypt.compare(currentPassword, user[0].password);

  if (!passwordMatch) {
    return NextResponse.json({ message: "Incorrect current password" }, { status: 401 });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await sql`UPDATE users SET password = ${hashed} WHERE id = ${userId}`;

  return NextResponse.json({ message: "Password updated successfully" });
}

export async function updateUser(field: keyof User, value: string) {
  console.log(`Updating ${field}: ${value}`);
  // Update DB logic here...
  revalidatePath("/profile");
}

export async function deleteUser() {
  console.log("User deleted");
  // DB delete logic here...
}
