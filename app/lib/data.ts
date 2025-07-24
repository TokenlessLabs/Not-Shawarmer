import postgres from "postgres";
import { User } from "./definitions";
import { auth } from "@/auth";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function getUserData(): Promise<User | null> {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) return null;

  const result = await sql<User[]>`
    SELECT id, username, email, contact, role, address
    FROM Users
    WHERE id = ${userId}
    LIMIT 1;
  `;

  return result[0] || null;
}

export async function getRestaurantDetails() {
  const result = await sql`
    SELECT name, address, about, contact, operatingHoursStart, operatingHoursEnd
    FROM RestDetails
    WHERE id = 1
    LIMIT 1;
  `;
  return result[0];
}

export async function getCategories(): Promise<string[]> {
  const result = await sql<{ name: string }[]>`
    SELECT name
    FROM Categories
    ORDER BY id ASC;
  `;
  return result.map((row) => row.name);
}

export async function getUserAddress(): Promise<string | null> {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) return null;

  const result = await sql`
    SELECT address
    FROM Users
    WHERE id = ${userId}
    LIMIT 1;
  `;
  return result.length > 0 ? result[0].address : null;
}