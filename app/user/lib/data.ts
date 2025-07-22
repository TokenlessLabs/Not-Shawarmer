import postgres from "postgres";
import { User } from "./definitions";
import { Order } from "./definitions";
import { MenuItem } from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function getUserData(): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 3000));
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
    LEFT JOIN RestDetails r ON r.id = 1 -- static for now
    WHERE o.userId = ${userId} AND o.status IN ('Delivered', 'Cancelled')
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

export async function getRestaurantDetails() {
  const result = await sql`
    SELECT name, address, about, contact, operatingHoursStart, operatingHoursEnd
    FROM RestDetails
    WHERE id = 1
    LIMIT 1;
  `;
  return result[0];
}

export async function getAllMenuItems(): Promise<MenuItem[]> {
  const result = await sql`
    SELECT 
      i.id, 
      i.name, 
      i.description, 
      i.price, 
      i.status, 
      i.image,
      c.name AS category
    FROM Items i
    JOIN ItemsCategory ic ON i.id = ic.itemId
    JOIN Categories c ON ic.categoryId = c.id
    WHERE i.status = 'Available'
    ORDER BY i.id ASC;
  `;

  return result.map((row: any) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: parseFloat(row.price),
    status: row.status,
    image: row.image,
    category: row.category,
  }));
}

export async function getItemsGroupedByCategory(): Promise<
  Record<string, MenuItem[]>
> {
  const rows = await sql<
    {
      category_name: string;
      id: number;
      name: string;
      price: number;
      image: string | null;
    }[]
  >`
    SELECT 
      c.name AS category_name,
      i.id,
      i.name,
      i.price,
      i.image
    FROM Items i
    JOIN ItemCategories ic ON i.id = ic.itemId
    JOIN Categories c ON c.id = ic.categoryId
    ORDER BY c.name, i.name;
  `;

  // Group by category name
  const grouped: Record<string, MenuItem[]> = {};

  for (const row of rows) {
    if (!grouped[row.category_name]) {
      grouped[row.category_name] = [];
    }
    grouped[row.category_name].push({
      id: row.id,
      name: row.name,
      price: row.price,
      image: row.image,
    });
  }

  return grouped;
}
