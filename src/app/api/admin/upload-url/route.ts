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

    // Generate presigned PUT URL using official AWS SDK S3 request presigner
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");

    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY || !R2_SECRET_KEY) {
      return NextResponse.json({ error: "R2 credentials are not configured on the server." }, { status: 501 });
    }

    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY,
        secretAccessKey: R2_SECRET_KEY,
      },
    });

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: objectKey,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return NextResponse.json({ uploadUrl, key: objectKey });
  } catch (err) {
    console.error("[/api/admin/upload-url] Error:", err);
    return NextResponse.json({ error: "Internal server error generating upload URL" }, { status: 500 });
  }
}
