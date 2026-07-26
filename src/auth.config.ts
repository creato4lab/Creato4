import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      
      if (isOnDashboard) {
        if (isLoggedIn) {
          if (auth.user?.email === "creato4lab@gmail.com") {
            return Response.redirect(new URL("/admin", nextUrl));
          }
          return true;
        }
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // If user is already logged in and tries to access login/register, redirect appropriately
        if (nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")) {
          if (auth.user?.email === "creato4lab@gmail.com") {
            return Response.redirect(new URL("/admin", nextUrl));
          }
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
