/**
 * POST /api/firmware/validate
 *
 * Phase 3 — Secure Firmware Delivery
 *
 * Validates that a logged-in user is permitted to flash firmware for a specific
 * board, then issues a short-lived (5 min), single-use signed firmware token.
 *
 * Request body:
 *   { licenseId: string, chipId: string }
 *
 * Success response:
 *   { token: string, boardType: string, firmwareVersion: string }
 *
 * Error responses (422):
 *   { error: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { signFirmwareToken } from "@/lib/firmwareToken";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { licenseId, chipId } = body as { licenseId?: string; chipId?: string };

    if (!licenseId || !chipId) {
      return NextResponse.json(
        { error: "Missing required fields: licenseId, chipId" },
        { status: 400 }
      );
    }

    // ── 1. Verify the user owns this license ──────────────────────────────────
    const license = await prisma.license.findFirst({
      where: { id: licenseId, userId: session.user.id, isActive: true },
      include: { product: true },
    });

    if (!license) {
      return NextResponse.json(
        { error: "License not found or inactive." },
        { status: 422 }
      );
    }

    // ── 2. License must be FIRMWARE_FLASH type ────────────────────────────────
    if (license.type !== "FIRMWARE_FLASH") {
      return NextResponse.json(
        { error: "This license does not include firmware flash access." },
        { status: 422 }
      );
    }

    // ── 3. Product must have a firmware binary path configured ─────────────────
    if (!license.product.firmwareBinPath && !license.product.firmwareUf2Path) {
      return NextResponse.json(
        { error: "Firmware is not yet available for this product. Please contact support." },
        { status: 422 }
      );
    }

    // ── 4. Check or Auto-Register Device Activation ─────────────────────────
    let activation = await prisma.deviceActivation.findUnique({
      where: { licenseId_chipId: { licenseId, chipId } },
    });

    if (!activation || !activation.isActive) {
      const activeCount = await prisma.deviceActivation.count({
        where: { licenseId, isActive: true },
      });

      if (activeCount >= license.maxActivations) {
        return NextResponse.json(
          {
            error: `Activation limit reached (${license.maxActivations} devices). Please unregister an existing board to connect this one.`,
          },
          { status: 422 }
        );
      }

      // Auto-register board on first connect!
      activation = await prisma.deviceActivation.create({
        data: {
          licenseId,
          chipId,
          boardType: "Arduino / Microcontroller Board",
          isActive: true,
        },
      });
    }

    // ── 5. Issue a signed firmware token ──────────────────────────────────────
    const token = signFirmwareToken({
      licenseId,
      productId: license.productId,
      chipId,
      boardType: activation.boardType,
      activationId: activation.id,
    });

    // ── 6. Store the token JTI so we can invalidate it after one use ──────────
    // Extract jti from the token payload (it's base64url encoded before the ".")
    const [encoded] = token.split(".");
    const payload = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));

    await prisma.deviceActivation.update({
      where: { id: activation.id },
      data: {
        firmwareTokenId: payload.jti,
        firmwareTokenUsed: false, // reset for new session
        lastSeenAt: new Date(),
      },
    });

    return NextResponse.json({
      token,
      boardType: activation.boardType,
      firmwareVersion: license.product.firmwareBuildVersion ?? "latest",
      productTitle: license.product.title,
    });
  } catch (err) {
    console.error("[/api/firmware/validate] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
