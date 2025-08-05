// /app/api/user/route.ts
import { auth } from "@/auth";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const userId = session.user.id;

  const user = await sql`
    SELECT id, username, email, contact, role, latitude, longitude
    FROM users
    WHERE id = ${userId}
  `;

  if (user.length === 0) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  return new Response(JSON.stringify(user[0]), { status: 200 });
}
