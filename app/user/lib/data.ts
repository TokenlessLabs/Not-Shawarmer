import postgres from "postgres";
import { User } from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function getUserData(): Promise<User> {
await new Promise((resolve) => setTimeout(resolve, 3000));
  const result = await sql<User[]>`
    SELECT id, username, email, contact, role, address
    FROM Users
    WHERE id = ${1}
    LIMIT 1;
  `;
console.log(result);
  return result[0];
}
