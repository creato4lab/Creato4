import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./auth.config";
import prisma from "./lib/prisma";
import { sendEmail } from "./lib/mailer";
import { getLoginAlertEmail, getWelcomeEmail } from "./lib/emailTemplates";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma as any),
  session: { strategy: "jwt" },
  events: {
    async signIn({ user, isNewUser }) {
      if (!user.email) return;

      const name = user.name || user.email.split("@")[0];
      const now = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });

      if (isNewUser) {
        // Send welcome email for brand new users
        await sendEmail({
          to: user.email,
          subject: "Welcome to Creato4 Lab 🚀 — Your Engineering Journey Starts Now",
          html: getWelcomeEmail({ name, email: user.email }),
        });
      } else {
        // Send login alert for returning users
        await sendEmail({
          to: user.email,
          subject: "🔐 New Sign-In Detected — Creato4 Lab",
          html: getLoginAlertEmail({
            name,
            email: user.email,
            time: now,
            device: "Web Browser",
            location: "India",
          }),
        });
      }
    },
  },
});

