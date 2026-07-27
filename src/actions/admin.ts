"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { decodeSteganography } from "@/lib/watermark";

async function requireAdmin() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return session.user;
}

export async function getDashboardStats() {
  await requireAdmin();

  const totalRevenueData = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: "COMPLETED" },
  });

  const totalSales = await prisma.order.count({
    where: { status: "COMPLETED" },
  });

  const totalUsers = await prisma.user.count();

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: { product: { select: { title: true } } },
      },
    },
  });

  return {
    totalRevenue: totalRevenueData._sum.total || 0,
    totalSales,
    totalUsers,
    recentOrders,
  };
}

export async function getAdminProducts() {
  await requireAdmin();
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createProduct(data: {
  title: string;
  description: string;
  shortDescription: string;
  price: number | string;
  category: string;
  difficulty: string;
  hardwareUsed?: string;
  softwareUsed?: string;
  whatsIncluded?: string;
  images?: string;
  sourceCodePath?: string;
  cadFilePath?: string;
  pdfDocPath?: string;
  pcbGerberPath?: string;
  firmwareBinPath?: string;
  firmwareUf2Path?: string;
  firmwareBuildVersion?: string;
}) {
  await requireAdmin();

  const { validateProductInput } = await import("@/lib/validation");
  const validation = validateProductInput(data);
  if (!validation.valid) {
    return { error: validation.errors.join(" ") };
  }

  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  try {
    const product = await prisma.product.create({
      data: {
        title: data.title.trim(),
        slug,
        description: data.description.trim(),
        shortDescription: data.shortDescription.trim(),
        price: Number(data.price),
        category: data.category as any,
        difficulty: data.difficulty as any,
        hardwareUsed: data.hardwareUsed ? data.hardwareUsed.split(",").map((s) => s.trim()) : [],
        softwareUsed: data.softwareUsed ? data.softwareUsed.split(",").map((s) => s.trim()) : [],
        whatsIncluded: data.whatsIncluded ? data.whatsIncluded.split(",").map((s) => s.trim()) : [],
        images: data.images ? data.images.split(",").map((s) => s.trim()).filter(Boolean) : [],
        sourceCodePath: data.sourceCodePath || null,
        cadFilePath: data.cadFilePath || null,
        pdfDocPath: data.pdfDocPath || null,
        pcbGerberPath: data.pcbGerberPath || null,
        firmwareBinPath: data.firmwareBinPath || null,
        firmwareUf2Path: data.firmwareUf2Path || null,
        firmwareBuildVersion: data.firmwareBuildVersion || null,
      },
    });
    return { success: true, product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { error: "Failed to create product. Check if the title is unique." };
  }
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  try {
    await prisma.product.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { error: "Failed to delete product." };
  }
}

/**
 * Phase 5 Admin Forensic Inspector Action
 * Scans code text or file content for zero-width steganography or header comments,
 * then resolves buyer identity & license records.
 */
export async function inspectLeakedCode(rawCodeText: string) {
  await requireAdmin();

  let downloadId: string | null = null;
  let userId: string | null = null;
  let licenseId: string | null = null;
  let detectionMethod = "None";

  // 1. Check for Zero-Width Unicode Steganography
  const stegoPayload = decodeSteganography(rawCodeText);
  if (stegoPayload) {
    // Format: C4L:<downloadId>:<userId>:<licenseId>
    const parts = stegoPayload.split(":");
    if (parts.length >= 4) {
      downloadId = parts[1];
      userId = parts[2];
      licenseId = parts[3];
      detectionMethod = "Invisible Zero-Width Steganography (Non-Removable)";
    }
  }

  // 2. Check for Header Comment metadata if steganography wasn't found
  if (!downloadId) {
    const licenseMatch = rawCodeText.match(/License ID\s*:\s*([a-zA-Z0-9_\-]+)/);
    const customerMatch = rawCodeText.match(/Customer ID\s*:\s*([a-zA-Z0-9_\-]+)/);
    const downloadMatch = rawCodeText.match(/Download Ref\s*:\s*([a-zA-Z0-9_\-]+)/);

    if (downloadMatch?.[1]) downloadId = downloadMatch[1];
    if (customerMatch?.[1]) userId = customerMatch[1];
    if (licenseMatch?.[1]) licenseId = licenseMatch[1];

    if (downloadId || licenseId || userId) {
      detectionMethod = "Comment Header Pattern Matching";
    }
  }

  if (!downloadId && !licenseId && !userId) {
    return {
      success: false,
      error: "No digital watermark or steganographic signature was detected in the provided code snippet.",
    };
  }

  // 3. Resolve records from DB
  let logRecord = null;
  if (downloadId) {
    logRecord = await prisma.downloadLog.findFirst({
      where: { fingerprint: downloadId },
    });
  }

  const activeLicenseId = licenseId || logRecord?.licenseId;
  const activeUserId = userId || logRecord?.userId;

  const license = activeLicenseId
    ? await prisma.license.findUnique({
        where: { id: activeLicenseId },
        include: {
          product: { select: { id: true, title: true, slug: true } },
          user: { select: { id: true, name: true, email: true, createdAt: true } },
        },
      })
    : null;

  const user = activeUserId && !license?.user
    ? await prisma.user.findUnique({
        where: { id: activeUserId },
        select: { id: true, name: true, email: true, createdAt: true },
      })
    : license?.user;

  return {
    success: true,
    detectionMethod,
    downloadId,
    licenseId: activeLicenseId,
    userId: activeUserId,
    user,
    license,
    logRecord: logRecord
      ? {
          ...logRecord,
          createdAt: logRecord.createdAt.toISOString(),
        }
      : null,
  };
}

export async function getAdminLicenses() {
  await requireAdmin();
  const licenses = await prisma.license.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, title: true, slug: true, category: true } },
      activations: {
        where: { isActive: true },
        select: { id: true, chipId: true, boardType: true, nickname: true, lastSeenAt: true },
      },
    },
  });

  return licenses.map((l) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
    activations: l.activations.map((a) => ({
      ...a,
      lastSeenAt: a.lastSeenAt.toISOString(),
    })),
  }));
}

export async function toggleLicenseStatus(licenseId: string) {
  await requireAdmin();
  try {
    const existing = await prisma.license.findUnique({
      where: { id: licenseId },
      select: { isActive: true },
    });

    if (!existing) return { error: "License not found" };

    const updated = await prisma.license.update({
      where: { id: licenseId },
      data: { isActive: !existing.isActive },
    });

    return { success: true, isActive: updated.isActive };
  } catch (err) {
    console.error("Error toggling license status:", err);
    return { error: "Failed to update license status." };
  }
}

