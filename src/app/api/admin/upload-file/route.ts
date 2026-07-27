import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID ?? "";
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY_ID ?? "";
const R2_SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY ?? "";
const R2_BUCKET = process.env.R2_BUCKET_NAME ?? "creato4-digital-assets";

const s3Client =
  R2_ACCOUNT_ID && R2_ACCESS_KEY && R2_SECRET_KEY
    ? new S3Client({
        region: "auto",
        endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: R2_ACCESS_KEY,
          secretAccessKey: R2_SECRET_KEY,
        },
      })
    : null;

export async function POST(req: NextRequest) {
  const session = await auth();

  // 1. Strict Admin check
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
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const prefix = (formData.get("prefix") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const timestamp = Date.now();
    const cleanFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const objectKey = `${prefix}/${timestamp}-${cleanFilename}`;

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // 2. Upload to Cloudflare R2
    if (s3Client) {
      const command = new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: objectKey,
        Body: fileBuffer,
        ContentType: file.type || "application/octet-stream",
      });

      await s3Client.send(command);
    } else {
      console.warn("[/api/admin/upload-file] R2 credentials missing, simulating upload.");
    }

    return NextResponse.json({
      success: true,
      key: objectKey,
      url: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${objectKey}`,
    });
  } catch (err: any) {
    console.error("[/api/admin/upload-file] Error uploading file:", err);
    return NextResponse.json({ error: err.message || "Failed to upload file to R2" }, { status: 500 });
  }
}
