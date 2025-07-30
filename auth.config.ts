import type { NextAuthConfig } from 'next-auth';
import { Roles } from './app/user/lib/definitions';

export const authConfig = {
  pages: {
    signIn: '/',
  },
  callbacks: {
authorized({ auth, request: { nextUrl } }) {
  const user = auth?.user;
  const isLoggedIn = !!user;
  const path = nextUrl.pathname;

  // Public route (login page)
  if (!isLoggedIn && path === '/') return true;

  // Protected routes
  if (!isLoggedIn && path.startsWith('/user')) return false;
  if (!isLoggedIn && path.startsWith('/admin')) return false;
  if (!isLoggedIn && path.startsWith('/profile')) return false;

  // Redirect users trying to access each other's dashboards
  if (isLoggedIn) {
    const role = user.role as Roles;

    if (role === Roles.Admin && !path.startsWith('/admin') && !path.startsWith('/profile')) {
      return Response.redirect(new URL('/admin/dashboard', nextUrl));
    }

    if (role === Roles.User && !path.startsWith('/user') && !path.startsWith('/profile')) {
      return Response.redirect(new URL('/user/dashboard', nextUrl));
    }
  }

  return true;
},

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      // Attach info to session from token
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.role = token.role as number;
      return session;
    },
  },

  providers: [],
} satisfies NextAuthConfig;
