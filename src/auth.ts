import NextAuth from "next-auth";
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
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account }) {
      // On initial sign-in, user and account are populated
      if (user && user.email) {
        const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());
        const role = isAdmin ? "ADMIN" : "USER";

        // Upsert user into DB so we always have a record
        try {
          const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            create: {
              email: user.email,
              name: user.name || null,
              image: user.image || null,
              role,
            },
            update: {
              name: user.name || undefined,
              image: user.image || undefined,
              ...(isAdmin ? { role: "ADMIN" } : {}),
            },
            select: { id: true, role: true },
          });

          token.role = dbUser.role;
          token.id = dbUser.id;
        } catch (err) {
          console.error("[auth] DB upsert failed, using fallback:", err);
          token.role = role;
          token.id = user.id;
        }
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
    signIn({ user }) {
      if (!user.email) return;

      const name = user.name || user.email.split("@")[0];
      const now = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });

      // Fire and forget email notification so it doesn't block the login flow!
      Promise.resolve().then(async () => {
        try {
          // Check if user already existed before this sign-in
          const existing = await prisma.user.findUnique({
            where: { email: user.email },
            select: { createdAt: true },
          });

          const isNew = !existing || 
            (Date.now() - existing.createdAt.getTime()) < 10_000; // created within last 10s = new

          if (isNew) {
            await sendEmail({
              to: user.email,
              subject: "Welcome to Creato4 Lab 🚀 — Your Engineering Journey Starts Now",
              html: getWelcomeEmail({ name, email: user.email }),
            });
          } else {
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
        } catch (err) {
          console.error("[auth] Email notification failed:", err);
        }
      });
    },
  },
});
