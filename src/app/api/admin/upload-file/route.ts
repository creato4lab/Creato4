import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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

  let file: File | null = null;
  let prefix = "uploads";

  try {
    const formData = await req.formData();
    file = formData.get("file") as File | null;
    prefix = (formData.get("prefix") as string) || "uploads";
  } catch (parseErr) {
    console.warn("[/api/admin/upload-file] req.formData parse error:", parseErr);
    return NextResponse.json(
      { error: "Payload too large for server route. Use direct presigned upload." },
      { status: 413 }
    );
  }

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const timestamp = Date.now();
    const cleanFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const objectKey = `${prefix}/${timestamp}-${cleanFilename}`;

    // 2. Stream upload to Cloudflare R2 using @aws-sdk/lib-storage Upload manager
    if (s3Client) {
      const { Readable } = await import("stream");
      const { Upload } = await import("@aws-sdk/lib-storage");

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const nodeStream = Readable.from(fileBuffer);

      const parallelUploads3 = new Upload({
        client: s3Client,
        params: {
          Bucket: R2_BUCKET,
          Key: objectKey,
          Body: nodeStream,
          ContentType: file.type || "application/octet-stream",
        },
        queueSize: 4,
        partSize: 5 * 1024 * 1024, // 5MB chunks
        leavePartsOnError: false,
      });

      await parallelUploads3.done();
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
