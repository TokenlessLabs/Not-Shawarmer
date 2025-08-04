import postgres from "postgres";
import { User, Order, MenuItem, Coordinates } from "./definitions";
import { auth } from "@/auth";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function getUserData(): Promise<User | null> {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) return null;

  const result = await sql<User[]>`
    SELECT id, username, email, contact, role, longitude, latitude
    FROM Users
    WHERE id = ${userId}
    LIMIT 1;
  `;

  return result[0] || null;
}

export async function getPastOrders(): Promise<Order[] | null> {
   const session = await auth();

  const userId = session?.user?.id;

  if (!userId) return null;

  const result = await sql`
    SELECT 
      o.id AS id,
      o.userId AS userId,
      o.createdAt,
      o.deliveredAt,
      o.updatedAt,
      o.status,
      o.instructions,
      o.latitude,
      o.longitude,
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
    WHERE o.userId = ${userId} AND o.status >= 2
    GROUP BY o.id, r.delivery_fee
    ORDER BY o.createdAt DESC;
  `;

  const orders: Order[] = result.map((row):Order => ({
    id: row.id,
    userId: row.userId,
    createdat: row.createdat,
    deliveredat: row.deliveredat,
    updatedat: row.updatedat,
    status: row.status,
    instructions: row.instructions,
    longitude: row.longitude,
    latitude: row.latitude,
    delivery_fee: parseFloat(row.delivery_fee),
    items: row.items ?? [],
  }));

  return orders;
}

export async function getCurrentOrders(): Promise<Order[] | null> {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) return null;

  const result = await sql`
    SELECT 
      o.id AS id,
      o.userId AS userId,
      o.createdAt,
      o.deliveredAt,
      o.updatedAt,
      o.status,
      o.instructions,
      o.latitude,
      o.longitude,
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
    WHERE o.userId = ${userId} AND o.status <= 1
    GROUP BY o.id, r.delivery_fee
    ORDER BY o.createdAt DESC;
  `;

  const orders: Order[] = result.map((row):Order => ({
    id: row.id,
    userId: row.userId,
    createdat: row.createdat,
    deliveredat: row.deliveredat,
    updatedat: row.updatedat,
    status: row.status,
    instructions: row.instructions,
    longitude: row.longitude,
    latitude: row.latitude,
    delivery_fee: parseFloat(row.delivery_fee),
    items: row.items ?? [],
  }));
//console.log("useris : " ,  userId)
  return orders ;
}


export async function getAdminPastOrders(): Promise<Order[]> {
  const result = await sql`
    SELECT 
      o.id AS id,
      o.userId AS userId,
      o.createdAt,
      o.deliveredAt,
      o.updatedAt,
      o.status,
      o.instructions,
      o.latitude,
      o.longitude,
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
    WHERE o.status >= 2
    GROUP BY o.id, r.delivery_fee
    ORDER BY o.createdAt DESC;
  `;

  const orders: Order[] = result.map((row):Order => ({
    id: row.id,
    userId: row.userId,
    createdat: row.createdat,
    deliveredat: row.deliveredat,
    updatedat: row.updatedat,
    status: row.status,
    instructions: row.instructions,
    longitude: row.longitude,
    latitude: row.latitude,
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
      o.updatedAt,
      o.status,
      o.instructions,
      o.latitude,
      o.longitude,
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
    WHERE o.status <= 1
    GROUP BY o.id, r.delivery_fee
    ORDER BY o.createdAt DESC;
  `;

  const orders: Order[] = result.map((row):Order => ({
    id: row.id,
    userId: row.userId,
    createdat: row.createdat,
    deliveredat: row.deliveredat,
    updatedat: row.updatedat,
    status: row.status,
    instructions: row.instructions,
    longitude: row.longitude,
    latitude: row.latitude,
    delivery_fee: parseFloat(row.delivery_fee),
    items: row.items ?? [],
  }));

  return orders;
}

export async function getRestaurantDetails() {
  const result = await sql`
    SELECT name, latitude, longitude, about, contact, operatingHoursStart, operatingHoursEnd, delivery_fee
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

export async function getMenuItems(): Promise<MenuItem[]> {
  const result = await sql<MenuItem[]>`
    SELECT Items.ID, Items.Name, Items.Description, Items.Price, Items.Image, Items.isAvailable, Categories.Name as Category
    FROM Items
    LEFT JOIN ItemCategories ON Items.ID = ItemCategories.ItemID
    LEFT JOIN Categories ON ItemCategories.CategoryID = Categories.ID
    WHERE isAvailable = ${true}
    ORDER BY id ASC;
  `;
  return result;
}

export async function getOrderById(orderId: number): Promise<Order | null> {
  const result = await sql`
    SELECT 
      o.id AS id,
      o."id" AS userId,
      o."createdat" AS createdat,
      o."deliveredat" AS deliveredat,
      o."updatedat" AS updatedat,
      o.status,
      o.instructions,
      o.latitude,
      o.longitude,
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
    LEFT JOIN RestDetails r ON r.id = 1 -- assuming one restaurant
    WHERE o.id = ${orderId}
    GROUP BY o.id, r.delivery_fee
  `;

  if (result.length === 0) return null;

  const order = result[0];

  return {
    id: order.id,
    userId: order.userId,
    createdat: order.createdat,
    deliveredat: order.deliveredat,
    updatedat: order.updatedat,
    status: order.status,
    instructions: order.instructions,
    latitude: order.latitude,
    longitude: order.longitude,
    delivery_fee: parseFloat(order.delivery_fee),
    items: order.items ?? [],
  };
}

export async function getUserAddress(): Promise<Coordinates> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const result = await sql`
    SELECT CAST(latitude AS FLOAT) AS latitude,
           CAST(longitude AS FLOAT) AS longitude
    FROM Users
    WHERE id = ${userId}
    LIMIT 1;
  `;

  if (result.length > 0) {
    const { latitude, longitude } = result[0];
    return {
      latitude: Number(latitude),
      longitude: Number(longitude),
    };
  }

  return null;
}