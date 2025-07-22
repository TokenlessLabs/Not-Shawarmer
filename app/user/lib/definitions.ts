export type User = {
  id: number;
  username: string;
  email: string;
  contact: string;
  role: string;
  address: string;
  password: string;
};

export type OrderItem = {
  itemId: number;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: number;
  userId: number;
  createdat: string;
  deliveredat: string | null;
  status: "Cooking" | "Dispatched" | "Delivered" | "Cancelled";
  instructions: string | null;
  address: string;
  delivery_fee: number;
  items: OrderItem[];
};

export type MenuItem = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  status: "Available" | "Unavailable";
  image: string | null;
  category: string;
};
