import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { DashboardClient } from "./DashboardClient";

export const metadata = {
  title: "Client Portal & Engineering Dashboard — Creato4 Lab",
  description:
    "Manage your purchased engineering blueprints, WebSerial firmware flashing, customized reports, hardware devices, support tickets, and invoices.",
};

export default async function DashboardPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const searchParams = await props.searchParams;
  const isSuccess = searchParams.success === "true";

  // Load all user data concurrently
  const [licenses, orders, tickets] = await Promise.all([
    prisma.license.findMany({
      where: { userId: session.user.id },
      include: {
        product: true,
        activations: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: { title: true, category: true, slug: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.ticket.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Serialize dates for client components
  const serializedLicenses = licenses.map((l) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
    product: l.product,
    activations: l.activations.map((a) => ({
      ...a,
      lastSeenAt: a.lastSeenAt.toISOString(),
      createdAt: a.createdAt.toISOString(),
    })),
  }));

  const serializedOrders = orders.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }));

  const serializedTickets = tickets.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  return (
    <DashboardClient
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
      licenses={serializedLicenses}
      orders={serializedOrders}
      tickets={serializedTickets}
      isSuccessNotification={isSuccess}
    />
  );
}
