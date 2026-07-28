/**
 * POST /api/firmware/stream
 *
 * Phase 3 — Secure Firmware Delivery
 *
 * Validates the firmware token issued by /api/firmware/validate, then fetches
 * the compiled firmware binary from the private R2 bucket and streams it to
 * the browser as a one-time download (never saved to disk on Netlify).
 *
 * The token is single-use: after a successful stream begins the activation row
 * is marked firmwareTokenUsed=true, preventing replay attacks.
 *
 * Request body:
 *   { token: string }
 *
 * Success response:
 *   Binary stream with Content-Type: application/octet-stream
 *
 * Error responses:
 *   { error: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyFirmwareToken } from "@/lib/firmwareToken";
import prisma from "@/lib/prisma";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// ─── R2 Config ────────────────────────────────────────────────────────────────
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID ?? "";
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY_ID ?? "";
const R2_SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY ?? "";
const R2_BUCKET     = process.env.R2_BUCKET_NAME ?? "creato4-digital-assets";
const R2_ENDPOINT   = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { token } = (await req.json()) as { token?: string };
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // ── 1. Verify the token signature and expiry ───────────────────────────────
    let payload;
    try {
      payload = verifyFirmwareToken(token);
    } catch (e: any) {
      const msg =
        e.message === "TOKEN_EXPIRED"
          ? "Firmware token has expired. Please restart the flash process."
          : "Invalid firmware token. Please restart the flash process.";
      return NextResponse.json({ error: msg }, { status: 401 });
    }

    // ── 2. Check token hasn't been used already (replay attack prevention) ─────
    const activation = await prisma.deviceActivation.findUnique({
      where: { id: payload.activationId },
      include: { license: { include: { product: true } } },
    });

    if (!activation || !activation.isActive) {
      return NextResponse.json(
        { error: "Board activation not found or revoked." },
        { status: 422 }
      );
    }

    if (activation.firmwareTokenId !== payload.jti) {
      return NextResponse.json(
        { error: "Firmware token is no longer valid. Please re-validate." },
        { status: 401 }
      );
    }

    if (activation.firmwareTokenUsed) {
      return NextResponse.json(
        {
          error:
            "This firmware token has already been used. Each token is single-use. Please restart the flash process.",
        },
        { status: 401 }
      );
    }

    // ── 3. Determine which firmware object to serve ────────────────────────────
    const product = activation.license.product;
    const objectKey = product.firmwareBinPath || product.firmwareUf2Path || "firmware/1785231700947-Blink.ino.hex";

    // ── 4. Mark token as used BEFORE streaming ─────────────────────────────────
    await prisma.deviceActivation.update({
      where: { id: activation.id },
      data: { firmwareTokenUsed: true, lastSeenAt: new Date() },
    });

    // ── 5. Fetch the binary from private R2 using S3Client ─────────────────────
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY || !R2_SECRET_KEY) {
      console.warn("[firmware/stream] R2 credentials not set — returning 501");
      return NextResponse.json(
        { error: "R2 storage not configured. Add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME to your environment variables." },
        { status: 501 }
      );
    }

    try {
      const r2Res = await s3.send(new GetObjectCommand({
        Bucket: R2_BUCKET,
        Key: objectKey,
      }));

      if (!r2Res.Body) {
        return NextResponse.json(
          { error: "Failed to retrieve firmware binary stream." },
          { status: 502 }
        );
      }

      const bytes = await r2Res.Body.transformToByteArray();
      const isUf2 = objectKey.endsWith(".uf2");
      const isHex = objectKey.endsWith(".hex");
      const ext = isUf2 ? "uf2" : isHex ? "hex" : "bin";

      return new Response(Buffer.from(bytes), {
        status: 200,
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Length": bytes.length.toString(),
          "Content-Disposition": `attachment; filename="${product.title.replace(/[^a-z0-9]/gi, "_")}_${payload.boardType}.${ext}"`,
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "X-Firmware-Version": product.firmwareBuildVersion ?? "latest",
          "X-Board-Type": payload.boardType,
        },
      });
    } catch (s3Err: any) {
      console.error("[firmware/stream] R2 S3 error:", s3Err);
      return NextResponse.json(
        { error: `Failed to retrieve firmware binary (${s3Err.message || "R2 Error"})` },
        { status: 502 }
      );
    }
  } catch (err: any) {
    console.error("[/api/firmware/stream] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
