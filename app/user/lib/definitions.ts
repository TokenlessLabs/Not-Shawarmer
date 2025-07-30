export enum Roles {
  User = 0,
  Admin = 1,
}

export const RoleNames: Record<Roles, string> = {
  [Roles.User]: 'User',
  [Roles.Admin]: 'Admin',
};

export enum OrderStatuses {
  Cooking = 0,
  Dispatched = 1,
  Delivered = 2,
  Cancelled = 3,
}

export const OrderStatusNames: Record<OrderStatuses, string> = {
  [OrderStatuses.Cooking]: 'Cooking',
  [OrderStatuses.Dispatched]: 'Dispatched',
  [OrderStatuses.Delivered]: 'Delivered',
  [OrderStatuses.Cancelled]: 'Cancelled',
};

export type Coordinates = { latitude: number; longitude: number } | null;

export type User = {
  id: number;
  username: string;
  email: string;
  contact: string;
  role: Roles;
  longitude: number;
  latitude: number;
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
  updatedat: string;
  status: OrderStatuses;
  instructions: string | null;
  longitude: number;
  latitude: number;
  delivery_fee: number;
  items: OrderItem[];
};

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
  category: string;
  isAvailable: boolean;
};

export type ErrorState = {
  success?: boolean;
  message?: string | null;
  errors?: string[];
};

export type Restaurant = {
  name: string;
  longitude: number;
  latitude: number;
  about: string;
  startTime: string;
  endTime: string;
  contact: string;
  delivery_fee: number;
};

export type Credentials = {
  username: string;
  password: string;
};