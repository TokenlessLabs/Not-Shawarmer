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
  role SMALLINT NOT NULL DEFAULT 0, -- 0: User, 1: Admin
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6)
);
`;

  await sql`
  CREATE TABLE RestDetails (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
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
  isAvailable BOOLEAN NOT NULL DEFAULT TRUE,  -- TRUE = Available, FALSE = Unavailable
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
  userId INTEGER,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  deliveredAt TIMESTAMP,
  status SMALLINT NOT NULL DEFAULT 0 CHECK (status IN (0, 1, 2, 3)), -- 0: Cooking, 1: Dispatched, 2: Delivered, 3: Cancelled
  instructions TEXT,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
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
      role: 0,
      latitude: 31.5204,
      longitude: 74.3587,
    },
    {
      username: "admin_user",
      email: "admin@example.com",
      contact: "0987654321",
      password: await bcrypt.hash("adminpassword", 10),
      role: 1,
      latitude: 31.5090,
      longitude: 74.4000,
    },
  ];

  for (const user of users) {
    await sql`
      INSERT INTO Users (username, email, contact, password, role, latitude, longitude)
      VALUES (${user.username}, ${user.email}, ${user.contact}, ${user.password}, ${user.role}, ${user.latitude}, ${user.longitude});
    `;
  }
}

async function createTriggers() {
  await sql`
    CREATE OR REPLACE FUNCTION update_order_updatedat()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updatedAt := NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `;

  // Attach the simple trigger to Orders table
  await sql`
    CREATE TRIGGER trigger_update_updatedat
    BEFORE UPDATE ON Orders
    FOR EACH ROW
    EXECUTE FUNCTION update_order_updatedat();
  `;
}

async function seedRestaurants() {
  await sql`
    INSERT INTO RestDetails (name, latitude, longitude, operatingHoursStart, operatingHoursEnd, about, contact, delivery_fee)
    VALUES 
      ('Not Shawarmer', 31.5216, 74.3568, '10:00', '22:00', 'Authentic Arabian Cuisine', '03334567898', 200);
  `;
}

async function seedCategories() {
  const categories = ["Starters", "Fast Food", "Italian", "Drinks", "Desserts"];

  for (const name of categories) {
    await sql`INSERT INTO Categories (name) VALUES (${name});`;
  }
}

async function seedItems() {
  await sql`
    INSERT INTO Items (name, description, price, isAvailable, image) VALUES
      ('Cheeseburger', 'Grilled beef patty with cheese and pickles', 499.99, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753771402/items/ca967ztq2tyvninjybyg.png'),
      ('Spaghettis', 'Classic spaghettis topped with meatballs.', 899.99, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753773671/items/a2aryffhbyh9bzkatfce.jpg'),
      ('Mint Margarita', 'Fusion of freshly squeezed lime juice, mint leaves, simple syrup and water in a cocktail shaker.', 398.98, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753774032/items/tekqequab1bm1arfylgo.jpg'),
      ('Fresh Lame', 'Resonant freshness of lemons and a perfect refreshing fizz in your life.', 499.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753774116/items/pg8dn8jvxkox5ygkjkgd.jpg'),
      ('Pizza', 'Bread topped with cheese, pickles, onions, and chicken chunks', 1699.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753773708/items/eww2nnjulgpsknjisofc.jpg'),
      ('Taco (4 pcs)', 'Traditional Mexican dish consisting of a small hand-sized corn- or wheat-based tortilla topped with a filling.', 1200.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753788520/items/wurqn3bi9gu2ukhlk3cd.jpg'),
      ('Fried Chicken (8 pcs)', 'A dish consisting of chicken pieces that have been coated with seasoned flour or batter and deep fried.', 1600.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753771665/items/dgl1la8htiiut0djmfiu.jpg'),
      ('Hot Dawg', 'A boiled sausage served in the slit of a partially sliced bun.', 499.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753771821/items/szqyrqtee6sewsagjvrk.jpg'),
      ('Dynamite Chicken (6 pcs.)', 'Made by frying chicken chunks served in a spicy and tangy mayo sauce (Dynamite Sauce).', 699.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753772101/items/cnrpcotumtcv4urtraa0.jpg'),
      ('Cheesy Sticks (4 pcs.)', 'Bread filled with cheese?', 499.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753772423/items/brw3es4pidq9ytdxwcrx.jpg'),
      ('Chicken Strips', 'Fried Boneless Chicken fried to perfection.', 498.88, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753772581/items/yjyfifoz6pp3q3m9brko.jpg'),
      ('Sesame Chicken', 'Fried chicken topped with our special sesame sauce.', 699.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753788511/items/tcydrpg88ifwvwohx5ex.jpg'),
      ('Grilled Burger', 'Burger tossed with a grilled patty, cheese, pickles, tomatoes, onions.', 799.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753773058/items/dohjsevk511xidezql6z.jpg'),
      ('Club Sandwich', 'Three-layer sandwich with cooked poultry, bacon, lettuce, tomato, and mayo.', 499.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753773175/items/sgfjs3bbzmzjdcmfbo8t.jpg'),
      ('Stuffed Chicken', 'Chicken stuffed with cheese.', 1299.99, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753773252/items/s3bovwomigvcokwlwmdt.webp'),
      ('Chicken Wrap', 'Pita bread with chicken strips, mayonnaise, ketchup, tomatoes, lettuce, and cheese.', 699.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753773450/items/nvtnoqvcxrvshj91rptm.jpg'),
      ('Alfredo Pasta', 'Fettuccine tossed with butter and Parmesan cheese.', 1100.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753773600/items/jxqgm6gxysxx4otgmeyz.webp'),
      ('Lasagna', 'Layers of flat pasta, meat sauce, and cheese.', 1600.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753773848/items/smtln445c83usnnbmokh.jpg'),
      ('Chicken Nuggers', 'Classic iPad kid dish.', 499.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753773921/items/t3aney9hxgavbvfbolyw.jpg'),
      ('Pina Colada', 'A cocktail with rum, cream of coconut, and pineapple juice.', 699.99, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753774190/items/xlosytisrnoehrk9wjxc.jpg'),
      ('Soft Drink (any)', 'Chilled drink.', 199.99, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753774269/items/ppeaficlbyvvg6mtkksf.jpg'),
      ('Icecream', 'Frozen dessert made from milk.', 499.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753774669/items/l71b1otralwv6vydv1om.jpg'),
      ('Icecream Shake', 'Blended milk, ice cream, and flavorings.', 499.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753774811/items/ypwnugx7khmf4isnitl8.jpg'),
      ('Molten Lava', 'Chocolate cake with a liquid core.', 399.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753775049/items/azmvudfkocci4nrejobf.jpg'),
      ('Chocolate Brownie', 'Chocolate baked dessert bar.', 399.99, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753782737/items/c7jyvqdcqymthlbcvu6v.jpg'),
      ('Garlic Bread (3 pcs.)', 'Topped with garlic, olive oil and butter.', 499.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753775413/items/s7cyei85h0jrsgtbbtn1.jpg'),
      ('Cheesy Fries', 'French fries topped with cheese.', 399.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753775465/items/jr6ok45fear4tygyh8h3.jpg'),
      ('Tempuras', 'Seafood and vegetables coated in thin batter and deep fried.', 399.00, true, 'https://res.cloudinary.com/de7l3dvdl/image/upload/v1753775772/items/ohktu2ito29kxukemsip.jpg');
  `;
}

async function seedItemCategories() {
  await sql`
    INSERT INTO ItemCategories (itemId, categoryId) VALUES
      (1, 2),  -- Cheeseburger -> Fast Food
      (2, 3),  -- Spaghettis -> Italian
      (3, 4),  -- Mint Margarita -> Drinks
      (4, 4),  -- Fresh Lame -> Drinks
      (5, 2),  -- Pizza -> Fast Food
      (6, 2),  -- Taco -> Fast Food
      (7, 2),  -- Fried Chicken -> Fast Food
      (8, 2),  -- Hot Dawg -> Fast Food
      (9, 1),  -- Dynamite Chicken -> Starters
      (10, 1), -- Cheesy Sticks -> Starters
      (11, 1), -- Chicken Strips -> Starters
      (12, 2), -- Sesame Chicken -> Fast Food
      (13, 2), -- Grilled Burger -> Fast Food
      (14, 2), -- Club Sandwich -> Fast Food
      (15, 1), -- Stuffed Chicken -> Starters
      (16, 2), -- Chicken Wrap -> Fast Food
      (17, 3), -- Alfredo Pasta -> Italian
      (18, 3), -- Lasagna -> Italian
      (19, 1), -- Chicken Nuggers -> Starters
      (20, 4), -- Pina Colada -> Drinks
      (21, 4), -- Soft Drink -> Drinks
      (22, 5), -- Icecream -> Desserts
      (23, 5), -- Icecream Shake -> Desserts
      (24, 5), -- Molten Lava -> Desserts
      (25, 5), -- Chocolate Brownie -> Desserts
      (26, 1), -- Garlic Bread -> Starters
      (27, 1), -- Cheesy Fries -> Starters
      (28, 1); -- Tempuras -> Starters
  `;
}

async function seedOrders() {
await sql`
INSERT INTO Orders (userId, status, instructions, latitude, longitude, deliveredAt)
VALUES 
  (1, 0, 'Extra cheese please', 31.5212, 74.3571, NULL),
  (1, 2, 'Leave at the gate', 31.5225, 74.3599, NOW()),
  (2, 1, 'Be quick!', 31.5190, 74.3600, NULL);
`;
}

async function seedOrderDetails() {
  await sql`
    INSERT INTO OrderDetails (orderId, itemId, quantity) VALUES
      (1, 1, 2),  -- Cheeseburger x2
      (1, 3, 1),  -- Mint Margarita x1
      (2, 5, 1),  -- Pizza x1
      (2, 21, 2), -- Soft Drink x2
      (3, 7, 1),  -- Fried Chicken x1
      (3, 10, 2); -- Cheesy Sticks x2
  `;
}

export async function GET() {
  try {
    await sql.begin(async () => {
      await dropTables();
      await createTables();
      await createTriggers();
      await seedUsers();
      await seedRestaurants();
      await seedCategories();
      await seedItems();
      await seedItemCategories();
      await seedOrders();
      await seedOrderDetails();
    });

    return NextResponse.json({ message: "Database seeded successfully." });
  } catch (error) {
    console.error("Seed failed:", error);
    return NextResponse.json({ error: "Seeding failed." }, { status: 500 });
  }
}
