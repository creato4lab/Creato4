import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./auth.config";
import prisma from "./lib/prisma";
import { sendEmail } from "./lib/mailer";
import { getLoginAlertEmail, getWelcomeEmail } from "./lib/emailTemplates";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma as any),
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user && user.email) {
        const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { role: true, id: true },
        });

        // Sync admin status in DB if email is in ADMIN_EMAILS
        if (isAdmin && dbUser && dbUser.role !== "ADMIN") {
          await prisma.user.update({
            where: { email: user.email },
            data: { role: "ADMIN" },
          });
          token.role = "ADMIN";
        } else {
          token.role = dbUser?.role || "USER";
        }
        token.id = dbUser?.id || user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role || "USER";
        (session.user as any).id = token.id || token.sub;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      if (!user.email) return;

      const name = user.name || user.email.split("@")[0];
      const now = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });

      // Ensure admin email is updated to ADMIN role in DB on sign in
      if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        await prisma.user.updateMany({
          where: { email: user.email },
          data: { role: "ADMIN" },
        });
      }

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

