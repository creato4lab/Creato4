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
  videoUrl?: string;
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
        tags: [],
        features: [],
        compatibleBoards: [],
        hardwareUsed: data.hardwareUsed ? data.hardwareUsed.split(",").map((s) => s.trim()) : [],
        softwareUsed: data.softwareUsed ? data.softwareUsed.split(",").map((s) => s.trim()) : [],
        whatsIncluded: data.whatsIncluded ? data.whatsIncluded.split(",").map((s) => s.trim()) : [],
        images: data.images ? data.images.split(",").map((s) => s.trim()).filter(Boolean) : [],
        videoUrl: data.videoUrl ? data.videoUrl.trim() : null,
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

export async function getProductById(id: string) {
  await requireAdmin();
  return prisma.product.findUnique({ where: { id } });
}

export async function updateProduct(
  id: string,
  data: {
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
    videoUrl?: string;
    sourceCodePath?: string;
    cadFilePath?: string;
    pdfDocPath?: string;
    pcbGerberPath?: string;
    firmwareBinPath?: string;
    firmwareUf2Path?: string;
    firmwareBuildVersion?: string;
  }
) {
  await requireAdmin();

  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  try {
    const product = await prisma.product.update({
      where: { id },
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
        videoUrl: data.videoUrl ? data.videoUrl.trim() : null,
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
    console.error("Error updating product:", error);
    return { error: "Failed to update product. The title might conflict with another product." };
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

export async function getAdminSalesAnalytics() {
  await requireAdmin();
  const orders = await prisma.order.findMany({
    where: { status: "COMPLETED" },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: { select: { title: true, category: true } },
        },
      },
    },
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalSales = orders.length;

  return {
    totalRevenue,
    totalSales,
    orders: orders.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    })),
  };
}

export async function getAdminCustomersList() {
  await requireAdmin();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orders: { where: { status: "COMPLETED" }, select: { total: true } },
      licenses: { select: { id: true, isActive: true } },
    },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
    ordersCount: u.orders.length,
    totalSpent: u.orders.reduce((sum, o) => sum + o.total, 0),
    activeLicensesCount: u.licenses.filter((l) => l.isActive).length,
  }));
}

export async function getAdminActivationsList() {
  await requireAdmin();
  const activations = await prisma.deviceActivation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      license: {
        include: {
          user: { select: { name: true, email: true } },
          product: { select: { title: true, slug: true } },
        },
      },
    },
  });

  return activations.map((a) => ({
    ...a,
    lastSeenAt: a.lastSeenAt.toISOString(),
    createdAt: a.createdAt.toISOString(),
    userEmail: a.license.user.email,
    userName: a.license.user.name,
    productTitle: a.license.product.title,
    licenseKey: a.license.licenseKey,
  }));
}

export async function adminUnregisterDevice(activationId: string) {
  await requireAdmin();
  try {
    await prisma.deviceActivation.update({
      where: { id: activationId },
      data: { isActive: false },
    });
    return { success: true };
  } catch (err) {
    console.error("Error unregistering device:", err);
    return { error: "Failed to unregister device." };
  }
}

export async function pushFirmwareUpdateAction(data: {
  productId: string;
  version: string;
  notes: string;
  firmwareBinPath?: string;
  firmwareUf2Path?: string;
}) {
  await requireAdmin();
  try {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      select: { versionHistory: true },
    });

    if (!product) return { error: "Product not found" };

    const existingHistory = Array.isArray(product.versionHistory)
      ? (product.versionHistory as any[])
      : [];

    const newHistoryEntry = {
      version: data.version.trim(),
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      notes: data.notes.trim(),
    };

    const updatedHistory = [newHistoryEntry, ...existingHistory];

    await prisma.product.update({
      where: { id: data.productId },
      data: {
        version: data.version.trim(),
        firmwareBuildVersion: data.version.trim(),
        lastUpdated: new Date(),
        versionHistory: updatedHistory,
        ...(data.firmwareBinPath ? { firmwareBinPath: data.firmwareBinPath } : {}),
        ...(data.firmwareUf2Path ? { firmwareUf2Path: data.firmwareUf2Path } : {}),
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Error pushing firmware update:", err);
    return { error: "Failed to push firmware update." };
  }
}

export async function toggleUserRoleAction(userId: string) {
  await requireAdmin();
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) return { error: "User not found" };

    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return { success: true, role: newRole };
  } catch (err) {
    console.error("Error toggling user role:", err);
    return { error: "Failed to update user role." };
  }
}

