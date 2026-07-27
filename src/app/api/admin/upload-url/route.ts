import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const R2_ACCOUNT_ID  = process.env.R2_ACCOUNT_ID  ?? "";
const R2_ACCESS_KEY  = process.env.R2_ACCESS_KEY_ID ?? "";
const R2_SECRET_KEY  = process.env.R2_SECRET_ACCESS_KEY ?? "";
const R2_BUCKET      = process.env.R2_BUCKET_NAME  ?? "creato4-digital-assets";
const R2_ENDPOINT    = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  
  // Strict admin check against DB
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (dbUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
  }

  try {
    const { filename, contentType, prefix } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });
    }

    // Determine the object key (path in R2)
    // We add a timestamp to ensure uniqueness and prevent overwriting
    const timestamp = Date.now();
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const objectPrefix = prefix ? `${prefix}/` : "uploads/";
    const objectKey = `${objectPrefix}${timestamp}-${cleanFilename}`;

    // Generate presigned PUT URL
    const { SignatureV4 } = await import("@smithy/signature-v4");
    const { Sha256 } = await import("@aws-crypto/sha256-js");

    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY || !R2_SECRET_KEY) {
      return NextResponse.json({ error: "R2 credentials are not configured on the server." }, { status: 501 });
    }

    const signer = new SignatureV4({
      credentials: { accessKeyId: R2_ACCESS_KEY, secretAccessKey: R2_SECRET_KEY },
      region: "auto",
      service: "s3",
      sha256: Sha256,
    });

    const url = new URL(`${R2_ENDPOINT}/${R2_BUCKET}/${objectKey}`);
    const signed = await signer.presign(
      {
        method: "PUT",
        hostname: url.hostname,
        path: url.pathname,
        protocol: "https:",
        headers: { 
          host: url.hostname,
          "Content-Type": contentType
        },
      },
      { expiresIn: 3600 } // URL valid for 1 hour
    );

    const uploadUrl = `${signed.protocol}//${signed.hostname}${signed.path}?${new URLSearchParams(
      signed.query as Record<string, string>
    ).toString()}`;

    return NextResponse.json({ uploadUrl, key: objectKey });
  } catch (err) {
    console.error("[/api/admin/upload-url] Error:", err);
    return NextResponse.json({ error: "Internal server error generating upload URL" }, { status: 500 });
  }
}
