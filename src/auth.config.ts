import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Admin emails from environment variable (comma-separated)
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

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
          if (isAdminEmail(auth.user?.email)) {
            return Response.redirect(new URL("/admin", nextUrl));
          }
          return true;
        }
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // If user is already logged in and tries to access login/register, redirect appropriately
        if (nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")) {
          if (isAdminEmail(auth.user?.email)) {
            return Response.redirect(new URL("/admin", nextUrl));
          }
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
