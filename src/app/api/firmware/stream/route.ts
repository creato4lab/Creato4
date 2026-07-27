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

// ─── R2 Config ────────────────────────────────────────────────────────────────
// We use native fetch against the Cloudflare R2 S3-compatible endpoint.
// Credentials must be set in Netlify environment variables:
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
//
// For signed requests to a private bucket we use AWS Signature V4 (pure fetch).

const R2_ACCOUNT_ID  = process.env.R2_ACCOUNT_ID  ?? "";
const R2_ACCESS_KEY  = process.env.R2_ACCESS_KEY_ID ?? "";
const R2_SECRET_KEY  = process.env.R2_SECRET_ACCESS_KEY ?? "";
const R2_BUCKET      = process.env.R2_BUCKET_NAME  ?? "creato4-firmware";
const R2_ENDPOINT    = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

/** Minimal AWS Signature V4 request signer for a single GET. */
async function signedR2Url(objectKey: string, expiresInSeconds = 60): Promise<string> {
  const { SignatureV4 } = await import("@smithy/signature-v4");
  const { Sha256 } = await import("@aws-crypto/sha256-js");

  const signer = new SignatureV4({
    credentials: { accessKeyId: R2_ACCESS_KEY, secretAccessKey: R2_SECRET_KEY },
    region: "auto",
    service: "s3",
    sha256: Sha256,
  });

  const url = new URL(`${R2_ENDPOINT}/${R2_BUCKET}/${objectKey}`);
  const signed = await signer.presign(
    {
      method: "GET",
      hostname: url.hostname,
      path: url.pathname,
      protocol: "https:",
      headers: { host: url.hostname },
    },
    { expiresIn: expiresInSeconds }
  );

  return `${signed.protocol}//${signed.hostname}${signed.path}?${new URLSearchParams(
    signed.query as Record<string, string>
  ).toString()}`;
}

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
    // Default to .bin (ESP32/ESP8266); UI will request the correct type
    const objectKey = product.firmwareBinPath ?? product.firmwareUf2Path;
    if (!objectKey) {
      return NextResponse.json(
        { error: "Firmware binary not configured for this product." },
        { status: 422 }
      );
    }

    // ── 4. Mark token as used BEFORE streaming ─────────────────────────────────
    // Do this first so that if the stream is interrupted, the token is still
    // consumed (preventing partial-flash retries without re-validation).
    await prisma.deviceActivation.update({
      where: { id: activation.id },
      data: { firmwareTokenUsed: true, lastSeenAt: new Date() },
    });

    // ── 5. Fetch the binary from private R2 using a short-lived presigned URL ──
    // If R2 credentials are not configured, fall back to a dev-mode error.
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY || !R2_SECRET_KEY) {
      // ── DEV MODE: serve from /public/firmware-test.bin if it exists ──────────
      console.warn("[firmware/stream] R2 credentials not set — returning 501");
      return NextResponse.json(
        { error: "R2 storage not configured. Add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME to your environment variables." },
        { status: 501 }
      );
    }

    const presignedUrl = await signedR2Url(objectKey, 30);
    const r2Res = await fetch(presignedUrl);

    if (!r2Res.ok) {
      console.error("[firmware/stream] R2 fetch failed:", r2Res.status, r2Res.statusText);
      return NextResponse.json(
        { error: "Failed to retrieve firmware binary. Please contact support." },
        { status: 502 }
      );
    }

    const isUf2 = objectKey.endsWith(".uf2");
    const contentType = isUf2 ? "application/octet-stream" : "application/octet-stream";

    // Stream the body directly to the client
    return new Response(r2Res.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${product.title.replace(/[^a-z0-9]/gi, "_")}_${payload.boardType}.${isUf2 ? "uf2" : "bin"}"`,
        // Prevent any caching of firmware binaries
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Firmware-Version": product.firmwareBuildVersion ?? "latest",
        "X-Board-Type": payload.boardType,
      },
    });
  } catch (err) {
    console.error("[/api/firmware/stream] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
