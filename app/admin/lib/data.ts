import postgres from "postgres";
import { MenuItem } from "@/app/user/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function getMenuItems(): Promise<MenuItem[]> {
  const result = await sql<MenuItem[]>`
    SELECT Items.ID, Items.Name, Items.Description, Items.Price, Items.Image, Items.Status, Categories.Name as Category
    FROM Items
    LEFT JOIN ItemCategories ON Items.ID = ItemCategories.ItemID
    LEFT JOIN Categories ON ItemCategories.CategoryID = Categories.ID
    ORDER BY id ASC;
  `;
  return result;
}