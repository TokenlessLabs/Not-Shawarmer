import postgres from "postgres";
import { User } from "./definitions";
import { Order } from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function getUserData(): Promise<User> {
  const result = await sql<User[]>`
    SELECT id, username, email, contact, role, address
    FROM Users
    WHERE id = ${1}
    LIMIT 1;
  `;
  return result[0];
}
export async function getPastOrders(): Promise<Order[]> {
  const userId = 1;

  const result = await sql`
    SELECT 
      o.id AS id,
      o.userId AS userId,
      o.createdAt,
      o.deliveredAt,
      o.status,
      o.instructions,
      o.address,
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
    WHERE o.userId = ${userId} AND o.status in ('Delivered','Cancelled')
    GROUP BY o.id
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
    items: row.items ?? [],
  }));

  return orders;
}

export async function getCurrentOrders(): Promise<Order[]> {
  const userId = 1;

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
    LEFT JOIN RestDetails r ON r.id = 1 -- temporary static join
    WHERE o.userId = ${userId} AND o.status IN ('Cooking', 'Dispatched')
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
    items: row.items ?? [],
    delivery_fee: parseFloat(row.delivery_fee),
  }));

  return orders;
}
