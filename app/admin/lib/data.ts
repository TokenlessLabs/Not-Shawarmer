import postgres from "postgres";
import { MenuItem, Order } from "@/app/lib/definitions";

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

export async function getAdminPastOrders(): Promise<Order[]> {
  const result = await sql`
    SELECT 
      o.id AS id,
      o.userId AS userId,
      o.createdAt,
      o.deliveredAt,
      o.status,
      o.instructions,
      o.address,
      r.delivery_fee,
      COALESCE(
        json_agg(
          json_build_object(
            'itemId', i.id,
            'name', i.name,
            'price', i.price,
            'quantity', od.quantity
          )
        ) FILTER (WHERE i.id IS NOT NULL),
        '[]'
      ) AS items
    FROM Orders o
    LEFT JOIN OrderDetails od ON o.id = od.orderId
    LEFT JOIN Items i ON i.id = od.itemId
    LEFT JOIN RestDetails r ON r.id = 1 -- default restaurant
    WHERE o.status IN ('Delivered', 'Cancelled')
    GROUP BY o.id, r.delivery_fee
    ORDER BY o.createdAt DESC;
  `;

  const orders: Order[] = result.map((row: any) => ({
    id: row.id,
    userId: row.userId,
    createdat: row.createdat,
    deliveredat: row.deliveredat,
    status: row.status,
    instructions: row.instructions,
    address: row.address,
    delivery_fee: parseFloat(row.delivery_fee),
    items: row.items ?? [],
  }));

  return orders;
}

export async function getAdminCurrentOrders(): Promise<Order[]> {
  const result = await sql`
    SELECT 
      o.id AS id,
      o.userId AS userId,
      o.createdAt,
      o.deliveredAt,
      o.status,
      o.instructions,
      o.address,
      r.delivery_fee,
      COALESCE(
        json_agg(
          json_build_object(
            'itemId', i.id,
            'name', i.name,
            'price', i.price,
            'quantity', od.quantity
          )
        ) FILTER (WHERE i.id IS NOT NULL),
        '[]'
      ) AS items
    FROM Orders o
    LEFT JOIN OrderDetails od ON o.id = od.orderId
    LEFT JOIN Items i ON i.id = od.itemId
    LEFT JOIN RestDetails r ON r.id = 1 -- default restaurant
    WHERE o.status IN ('Cooking', 'Dispatched')
    GROUP BY o.id, r.delivery_fee
    ORDER BY o.createdAt DESC;
  `;

  const orders: Order[] = result.map((row: any) => ({
    id: row.id,
    userId: row.userId,
    createdat: row.createdat,
    deliveredat: row.deliveredat,
    status: row.status,
    instructions: row.instructions,
    address: row.address,
    delivery_fee: parseFloat(row.delivery_fee),
    items: row.items ?? [],
  }));

  return orders;
}