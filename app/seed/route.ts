import postgres from "postgres";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function dropTables() {
  await sql`
    DROP TABLE IF EXISTS OrderDetails, Orders, ItemCategories, Items, Categories, RestDetails, Users CASCADE;
  `;
}

async function createTables() {
  await sql`
  CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    contact VARCHAR(20) NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'User' CHECK (role IN ('User', 'Admin')),
    address TEXT
  );
`;

  await sql`
  CREATE TABLE RestDetails (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    operatingHoursStart TIME NOT NULL,
    operatingHoursEnd TIME NOT NULL,
    about TEXT,
    contact VARCHAR(20) NOT NULL,
    delivery_fee NUMERIC(6,2) DEFAULT 0 CHECK (delivery_fee >= 0)
  );
`;

  await sql`
  CREATE TABLE Categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
  );
`;

  await sql`
  CREATE TABLE Items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Unavailable')),
    image TEXT
  );
`;

  await sql`
  CREATE TABLE ItemCategories (
    itemId INTEGER NOT NULL,
    categoryId INTEGER NOT NULL,
    PRIMARY KEY (itemId, categoryId),
    FOREIGN KEY (itemId) REFERENCES Items(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES Categories(id) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

  await sql`
  CREATE TABLE Orders (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deliveredAt TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'Cooking' CHECK (status IN ('Cooking', 'Dispatched', 'Delivered', 'Cancelled')),
    instructions TEXT,
    address TEXT,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE
  );
`;

  await sql`
CREATE TABLE OrderDetails (
  id SERIAL PRIMARY KEY,
  orderId INTEGER NOT NULL,
  itemId INTEGER,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (itemId) REFERENCES Items(id) ON DELETE SET NULL ON UPDATE CASCADE
);
`;
}

async function seedUsers() {
  const users = [
    {
      username: "john_doe",
      email: "john@example.com",
      contact: "1234567890",
      password: await bcrypt.hash("password123", 10),
      role: "User",
      address: "123 Main Street",
    },
    {
      username: "admin_user",
      email: "admin@example.com",
      contact: "0987654321",
      password: await bcrypt.hash("adminpassword", 10),
      role: "Admin",
      address: "456 Admin Lane",
    },
  ];

  for (const user of users) {
    await sql`
      INSERT INTO Users (username, email, contact, password, role, address)
      VALUES (${user.username}, ${user.email}, ${user.contact}, ${user.password}, ${user.role}, ${user.address});
    `;
  }
}

async function seedRestaurants() {
  await sql`
    INSERT INTO RestDetails (name, address, operatingHoursStart, operatingHoursEnd, about, contact, delivery_fee)
    VALUES 
      ('Not Shawarmer', '12 Italy Street', '10:00', '22:00', 'Authentic Arabian Cuisine', '03334567898', 200)
  `;
}

async function seedCategories() {
  const categories = ["Fast Food", "Italian", "Drinks", "Dessert"];

  for (const name of categories) {
    await sql`INSERT INTO Categories (name) VALUES (${name});`;
  }
}

async function seedItems() {
  await sql`
    INSERT INTO Items (name, description, price, status)
    VALUES 
      ('Cheeseburger', 'Grilled beef patty with cheese and pickles', 499.99, 'Available'),
      ('Spaghetti Carbonara', 'Classic Italian pasta with bacon and egg', 899.99, 'Available'),
      ('Coke', 'Chilled soft drink', 99.00, 'Available'),
      ('Tiramisu', 'Coffee-flavored Italian dessert', 399.00, 'Available');
  `;
}

async function seedItemCategories() {
  await sql`
    INSERT INTO ItemCategories (itemId, categoryId)
    VALUES 
      (1, 1), -- Cheeseburger -> Fast Food
      (2, 2), -- Carbonara -> Italian
      (3, 3), -- Coke -> Drinks
      (4, 4); -- Tiramisu -> Dessert
  `;
}

async function seedOrders() {
  await sql`
    INSERT INTO Orders (userId, status, instructions, address)
    VALUES 
      (1, 'Cooking', 'Extra cheese please', '123 Main Street'),
      (1, 'Delivered', 'No onions', '123 Main Street');
  `;
}

async function seedOrderDetails() {
  await sql`
    INSERT INTO OrderDetails (orderId, itemId, quantity)
    VALUES 
      (1, 1, 2), -- Cheeseburger x2
      (1, 3, 1), -- Coke x1
      (2, 2, 1), -- Carbonara x1
      (2, 4, 1); -- Tiramisu x1
  `;
}

export async function GET() {
  try {
    await sql.begin(async (sql) => {
      await dropTables();
      await createTables();
      await seedUsers();
      await seedRestaurants();
      await seedCategories();
      await seedItems();
      await seedItemCategories();
      await seedOrders();
      await seedOrderDetails();
    });

    return NextResponse.json({ message: "✅ Database seeded successfully." });
  } catch (error) {
    console.error("Seed failed:", error);
    return NextResponse.json({ error: "Seeding failed." }, { status: 500 });
  }
}
