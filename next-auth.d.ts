import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: number;
    };
  }

  interface User {
    id: string;
    username: string;
    role: number;
  }

  interface JWT {
    id: string;
    username: string;
    role: number;
  }
}
