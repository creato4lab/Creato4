"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { sendEmail } from "@/lib/mailer";
import { redirect } from "next/navigation";

export async function createConsultationTicket(data: {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message?: string;
}) {
  try {
    const session = await auth();
    const userId = session?.user?.id || null;

    // 1. Create Ticket in DB
    const ticket = await prisma.ticket.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        subject: data.subject || "Free Consultation Callback Request",
        message: data.message || "User requested a callback consultation from the website.",
        userId: userId,
        status: "OPEN",
      },
    });

    // 2. Dispatch Email Notification to Admin
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #1A3C2F; background-color: #FAF8F5;">
        <h2 style="color: #1A3C2F; border-bottom: 2px solid #C4A35A; padding-bottom: 8px;">
          🚀 New Consultation Callback Request!
        </h2>
        <p>A new lead just requested a consultation on Creato4 Lab website.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Name:</td>
            <td style="padding: 8px;">${data.name}</td>
          </tr>
          <tr style="background-color: #F5F0EA;">
            <td style="padding: 8px; font-weight: bold;">Phone Number:</td>
            <td style="padding: 8px; font-weight: bold; color: #1A3C2F;">${data.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Email:</td>
            <td style="padding: 8px;">${data.email || 'N/A'}</td>
          </tr>
          <tr style="background-color: #F5F0EA;">
            <td style="padding: 8px; font-weight: bold;">Project Type / Subject:</td>
            <td style="padding: 8px;">${ticket.subject}</td>
          </tr>
          <tr style="background-color: #F5F0EA;">
            <td style="padding: 8px; font-weight: bold;">Details:</td>
            <td style="padding: 8px;">${ticket.message}</td>
          </tr>
        </table>
        <p style="margin-top: 20px; font-size: 12px; color: #5C6B60;">
          View and manage this ticket in your Mission Control Admin Dashboard.
        </p>
      </div>
    `;

    await sendEmail({
      to: "creato4lab@gmail.com",
      subject: `[NEW LEAD] Consultation Request from ${data.name}`,
      html: emailHtml,
    });

    return { success: true, ticketId: ticket.id };
  } catch (error) {
    console.error("Error creating consultation ticket:", error);
    return { success: false, error: "Failed to submit request." };
  }
}

export async function getAdminTickets() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  return tickets;
}

export async function updateTicketStatus(ticketId: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const ticket = await prisma.ticket.update({
    where: { id: ticketId },
    data: { status },
  });

  return { success: true, ticket };
}
