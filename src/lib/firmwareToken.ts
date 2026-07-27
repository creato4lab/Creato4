/**
 * Firmware Flash Token — Phase 3 Secure Firmware Delivery
 *
 * Issues short-lived (5 min) signed tokens that authorize exactly ONE firmware
 * flash session for a specific (license, chipId, product) combination.
 * Tokens are single-use: the stream endpoint marks the DeviceActivation row's
 * firmwareTokenId/firmwareTokenUsed after consumption.
 *
 * We use a simple HMAC-SHA256 approach (no external JWT library needed) so
 * this module works in both Node.js (server actions) and the Next.js Edge
 * Runtime (middleware / API routes).
 */

import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.AUTH_SECRET || "change-me-in-production";
const TTL_SECONDS = 5 * 60; // 5 minutes

export interface FirmwareTokenPayload {
  jti: string;          // unique token ID (used for one-time invalidation)
  licenseId: string;
  productId: string;
  chipId: string;
  boardType: string;    // e.g. "ESP32-WROOM-32"
  activationId: string; // DeviceActivation.id — used to mark token as used
  iat: number;          // issued at (Unix seconds)
  exp: number;          // expiry (Unix seconds)
}

// ─── Encode / Decode ─────────────────────────────────────────────────────────

function base64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function encodePayload(payload: FirmwareTokenPayload): string {
  return base64url(Buffer.from(JSON.stringify(payload)));
}

function decodePayload(encoded: string): FirmwareTokenPayload {
  const json = Buffer.from(encoded, "base64").toString("utf8");
  return JSON.parse(json);
}

function sign(data: string): string {
  return base64url(createHmac("sha256", SECRET).update(data).digest());
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Create a signed firmware token. Returns an opaque string. */
export function signFirmwareToken(
  payload: Omit<FirmwareTokenPayload, "jti" | "iat" | "exp">
): string {
  const now = Math.floor(Date.now() / 1000);
  const full: FirmwareTokenPayload = {
    ...payload,
    jti: crypto.randomUUID(),
    iat: now,
    exp: now + TTL_SECONDS,
  };
  const encoded = encodePayload(full);
  const sig = sign(encoded);
  return `${encoded}.${sig}`;
}

/** Verify and decode a firmware token. Throws if invalid or expired. */
export function verifyFirmwareToken(token: string): FirmwareTokenPayload {
  const parts = token.split(".");
  if (parts.length !== 2) throw new Error("INVALID_TOKEN_FORMAT");

  const [encoded, sig] = parts;
  const expectedSig = sign(encoded);

  // Constant-time comparison to prevent timing attacks
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    throw new Error("INVALID_TOKEN_SIGNATURE");
  }

  const payload = decodePayload(encoded);
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) throw new Error("TOKEN_EXPIRED");

  return payload;
}
