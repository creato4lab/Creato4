"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// ─── Max activations per license type ────────────────────
/** Returns the maximum allowed device activations for a given license type. */
export async function getMaxActivations(type: string): Promise<number> {
  if (type === "COMMERCIAL") return 5;
  if (type === "ENTERPRISE") return 999;
  return 2; // STUDENT, SOURCE_CODE_ONLY, REPORT_*, FIRMWARE_FLASH
}

// ─── Fetch all licenses for logged-in user ────────────────
export async function getMyLicenses() {
  const session = await auth();
  if (!session?.user?.id) return { licenses: [], error: "Unauthorized" };

  try {
    const licenses = await prisma.license.findMany({
      where: { userId: session.user.id },
      include: {
        product: true,
        activations: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { licenses, error: null };
  } catch (err) {
    console.error("getMyLicenses error:", err);
    return { licenses: [], error: "Failed to load licenses" };
  }
}

// ─── Get single license detail (for the connect board modal) ─
export async function getLicenseDetails(licenseId: string) {
  const session = await auth();
  if (!session?.user?.id) return { license: null, error: "Unauthorized" };

  try {
    const license = await prisma.license.findFirst({
      where: { id: licenseId, userId: session.user.id },
      include: {
        product: true,
        activations: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!license) return { license: null, error: "License not found" };
    return { license, error: null };
  } catch (err) {
    console.error("getLicenseDetails error:", err);
    return { license: null, error: "Failed to load license" };
  }
}

// ─── Activate a device ────────────────────────────────────
export async function activateDevice(
  licenseId: string,
  chipId: string,
  boardType: string,
  usbVendorId: number | null,
  usbProductId: number | null,
  nickname?: string
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    // 1. Verify the user owns this license
    const license = await prisma.license.findFirst({
      where: { id: licenseId, userId: session.user.id, isActive: true },
      include: { activations: { where: { isActive: true } } },
    });

    if (!license) return { error: "License not found or inactive" };

    // Check if a permanent global hardware identity exists for this chipId
    const globalActivation = await prisma.deviceActivation.findFirst({
      where: { chipId, nickname: { not: null } },
      orderBy: { createdAt: "asc" },
      select: { nickname: true },
    });

    const finalNickname = globalActivation?.nickname?.trim() || nickname?.trim() || undefined;

    // 2. Check if this chipId is already registered on this license
    const existing = await prisma.deviceActivation.findUnique({
      where: { licenseId_chipId: { licenseId, chipId } },
    });

    if (existing) {
      if (existing.isActive) {
        // Already registered — just update lastSeenAt
        await prisma.deviceActivation.update({
          where: { id: existing.id },
          data: { lastSeenAt: new Date(), boardType, nickname: finalNickname ?? existing.nickname },
        });
        return { success: true, activationId: existing.id, alreadyRegistered: true };
      } else {
        // Was deactivated — reactivate if slot is available
        const activeCount = license.activations.filter(a => a.id !== existing.id).length;
        if (activeCount >= license.maxActivations) {
          return {
            error: `Activation limit reached (${license.maxActivations} devices). Remove a device to register this one.`,
          };
        }
        await prisma.deviceActivation.update({
          where: { id: existing.id },
          data: { isActive: true, lastSeenAt: new Date(), boardType, nickname: finalNickname },
        });
        return { success: true, activationId: existing.id };
      }
    }

    // 3. Check activation slot count
    if (license.activations.length >= license.maxActivations) {
      return {
        error: `Activation limit reached (${license.maxActivations} devices maximum). Remove a device first.`,
      };
    }

    // 4. Create new activation with preserved hardware identity
    const activation = await prisma.deviceActivation.create({
      data: {
        licenseId,
        chipId,
        boardType,
        nickname: finalNickname,
        usbVendorId,
        usbProductId,
        isActive: true,
        lastSeenAt: new Date(),
      },
    });

    return {
      success: true,
      activationId: activation.id,
      remainingSlots: license.maxActivations - license.activations.length - 1,
    };
  } catch (err) {
    console.error("activateDevice error:", err);
    return { error: "Failed to activate device" };
  }
}

// ─── Remove / deactivate a device ────────────────────────
export async function removeDevice(activationId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    // Verify ownership via license → user
    const activation = await prisma.deviceActivation.findFirst({
      where: { id: activationId },
      include: { license: true },
    });

    if (!activation || activation.license.userId !== session.user.id) {
      return { error: "Activation not found" };
    }

    await prisma.deviceActivation.update({
      where: { id: activationId },
      data: { isActive: false },
    });

    return { success: true };
  } catch (err) {
    console.error("removeDevice error:", err);
    return { error: "Failed to remove device" };
  }
}

// ─── Dashboard stats helper ───────────────────────────────
export async function getDashboardStats() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const [licenses, orders, activations] = await Promise.all([
      prisma.license.count({ where: { userId: session.user.id } }),
      prisma.order.count({ where: { userId: session.user.id, status: "COMPLETED" } }),
      prisma.deviceActivation.count({
        where: { license: { userId: session.user.id }, isActive: true },
      }),
    ]);

    const totalDownloads = await prisma.license.aggregate({
      where: { userId: session.user.id },
      _sum: { downloadsUsed: true },
    });

    return {
      totalLicenses: licenses,
      totalOrders: orders,
      activeDevices: activations,
      totalDownloads: totalDownloads._sum.downloadsUsed || 0,
    };
  } catch (err) {
    console.error("getDashboardStats error:", err);
    return null;
  }
}

// ─── Fetch existing nickname for a chip ID ───────────────────
export async function getExistingDeviceNickname(chipId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const existing = await prisma.deviceActivation.findFirst({
      where: {
        chipId,
        nickname: { not: null },
        license: { userId: session.user.id },
      },
      orderBy: { lastSeenAt: "desc" },
      select: { nickname: true },
    });

    return existing?.nickname ?? null;
  } catch (err) {
    return null;
  }
}
