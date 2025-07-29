import type { NextAuthConfig } from 'next-auth';

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
    const role = user.role?.toLowerCase();

    if (role === 'admin' && !path.startsWith('/admin') && !path.startsWith('/profile')) {
      return Response.redirect(new URL('/admin/dashboard', nextUrl));
    }

    if (role === 'user' && !path.startsWith('/user') && !path.startsWith('/profile')) {
      return Response.redirect(new URL('/user/dashboard', nextUrl));
    }
  }

  return true;
},

    async jwt({ token, user }) {
      // First login — attach user info to token
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role; // store role in token
      }
      return token;
    },

    async session({ session, token }) {
      // Attach info to session from token
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.role = token.role as string;
      return session;
    },
  },

  providers: [], // still empty because you're using `auth.ts` for actual provider
} satisfies NextAuthConfig;
