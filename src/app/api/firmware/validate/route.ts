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

    // ── 2. Determine default firmware object path ────────────────────────────
    const firmwareKey = license.product.firmwareBinPath || license.product.firmwareUf2Path || "firmware/1785231700947-Blink.ino.hex";

    // ── 3. Check or Auto-Register Device Activation ─────────────────────────
    let activation = await prisma.deviceActivation.findUnique({
      where: { licenseId_chipId: { licenseId, chipId } },
    });

    if (activation) {
      if (!activation.isActive) {
        // Reactivate existing record if slot is available
        const activeCount = await prisma.deviceActivation.count({
          where: { licenseId, isActive: true },
        });
        if (activeCount >= license.maxActivations) {
          return NextResponse.json(
            { error: `Activation limit reached (${license.maxActivations} devices). Remove a device first.` },
            { status: 422 }
          );
        }
        activation = await prisma.deviceActivation.update({
          where: { id: activation.id },
          data: { isActive: true, lastSeenAt: new Date() },
        });
      }
    } else {
      // Auto-register board on first connect
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

      // Check if global hardware identity nickname exists
      const globalActivation = await prisma.deviceActivation.findFirst({
        where: { chipId, nickname: { not: null } },
        orderBy: { createdAt: "asc" },
        select: { nickname: true },
      });

      activation = await prisma.deviceActivation.create({
        data: {
          licenseId,
          chipId,
          boardType: "Arduino / Microcontroller Board",
          nickname: globalActivation?.nickname ?? undefined,
          isActive: true,
        },
      });
    }

    // ── 4. Issue a signed firmware token ──────────────────────────────────────
    const token = signFirmwareToken({
      licenseId,
      productId: license.productId,
      chipId,
      boardType: activation.boardType,
      activationId: activation.id,
    });

    // ── 5. Store the token JTI so we can invalidate it after one use ──────────
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
      firmwareVersion: license.product.firmwareBuildVersion ?? "v1.0.0",
      productTitle: license.product.title,
    });
  } catch (err: any) {
    console.error("[/api/firmware/validate] Error:", err);
    return NextResponse.json({ error: err.message || "Failed to validate firmware license" }, { status: 422 });
  }
}
