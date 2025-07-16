"use server";

import { revalidatePath } from "next/cache";
import { User } from "./definitions";


export async function getUserData(): Promise<User> {
  // Simulate DB call
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return {
    username: "john_doe",
    email: "john@example.com",
    phone: "+923001112233",
    password: "secure ahh password",
  };
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
