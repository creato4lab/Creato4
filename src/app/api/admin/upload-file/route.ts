import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

export const maxDuration = 60;

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
    const rawFilename = req.headers.get("x-filename");
    const prefix = req.headers.get("x-prefix") || "uploads";
    const contentType = req.headers.get("content-type") || "application/octet-stream";

    let filename = rawFilename ? decodeURIComponent(rawFilename) : "file.bin";
    let fileBuffer: Buffer;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "No file in form data" }, { status: 400 });
      }
      filename = file.name;
      fileBuffer = Buffer.from(await file.arrayBuffer());
    } else {
      const arrayBuffer = await req.arrayBuffer();
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        return NextResponse.json({ error: "Empty payload provided" }, { status: 400 });
      }
      fileBuffer = Buffer.from(arrayBuffer);
    }

    const timestamp = Date.now();
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const objectKey = `${prefix}/${timestamp}-${cleanFilename}`;
    let fileUrl = "";

    let r2Success = false;

    // 2. Attempt Cloudflare R2 Upload if configured
    if (s3Client) {
      try {
        const { Upload } = await import("@aws-sdk/lib-storage");
        const parallelUploads3 = new Upload({
          client: s3Client,
          params: {
            Bucket: R2_BUCKET,
            Key: objectKey,
            Body: fileBuffer,
            ContentType: contentType.includes("multipart/form-data") ? "application/octet-stream" : contentType,
          },
          queueSize: 4,
          partSize: 5 * 1024 * 1024,
          leavePartsOnError: false,
        });

        await parallelUploads3.done();
        r2Success = true;
        fileUrl = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${objectKey}`;
      } catch (r2Err: any) {
        console.warn("[/api/admin/upload-file] R2 Upload failed, switching to local disk fallback:", r2Err.message);
      }
    }

    // 3. Fallback to Local Disk Storage if R2 is absent or fails
    if (!r2Success) {
      const targetDir = path.join(process.cwd(), "public", "uploads", prefix);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const localFilePath = path.join(targetDir, `${timestamp}-${cleanFilename}`);
      await fs.promises.writeFile(localFilePath, fileBuffer);

      fileUrl = `/uploads/${prefix}/${timestamp}-${cleanFilename}`;
    }

    return NextResponse.json({
      success: true,
      key: objectKey,
      url: fileUrl,
    });
  } catch (err: any) {
    console.error("[/api/admin/upload-file] File processing error:", err);
    return NextResponse.json({ error: err.message || "Failed to upload file" }, { status: 500 });
  }
}
