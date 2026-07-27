import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextResponse } from "next/server";

const getAppUrl = () => {
  if (process.env.NETLIFY === "true" || process.env.NODE_ENV === "production") {
    return process.env.URL || process.env.NEXT_PUBLIC_APP_URL || "https://creato4lab.netlify.app";
  }
  return process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

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
  trustHost: true,
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
    redirect({ url, baseUrl }) {
      const appUrl = getAppUrl();
      if (url.startsWith("/")) {
        return `${appUrl}${url}`;
      }
      if ((process.env.NETLIFY === "true" || process.env.NODE_ENV === "production") && url.includes("localhost:3000")) {
        return url.replace("http://localhost:3000", appUrl);
      }
      try {
        if (new URL(url).origin === new URL(appUrl).origin) {
          return url;
        }
      } catch {}
      return appUrl;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      
      if (isOnDashboard) {
        if (isLoggedIn) {
          if (isAdminEmail(auth.user?.email)) {
            return NextResponse.redirect(new URL("/admin", nextUrl));
          }
          return true;
        }
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // If user is already logged in and tries to access login/register, redirect appropriately
        if (nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")) {
          if (isAdminEmail(auth.user?.email)) {
            return NextResponse.redirect(new URL("/admin", nextUrl));
          }
          return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
