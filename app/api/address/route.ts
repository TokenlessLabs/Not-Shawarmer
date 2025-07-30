import { auth } from "@/auth"; 
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  try {
    const result = await sql`
      SELECT latitude, longitude 
      FROM users
      WHERE id = ${userId};
    `;

    if (result.length === 0 || result[0].latitude === null) {
      return new Response("No address found", { status: 404 });
    }

    return Response.json({ address: result[0] }); // ✅ wrap in { address: ... }
  } catch (error) {
    console.error("Error fetching address:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
