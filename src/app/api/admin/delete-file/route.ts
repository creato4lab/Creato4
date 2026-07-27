import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

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

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (dbUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { key } = await req.json();

    if (!key) {
      return NextResponse.json({ error: "Missing object key" }, { status: 400 });
    }

    if (s3Client) {
      const command = new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
      });

      await s3Client.send(command);
    }

    return NextResponse.json({ success: true, deletedKey: key });
  } catch (err: any) {
    console.error("[/api/admin/delete-file] Error deleting object:", err);
    return NextResponse.json({ error: "Failed to delete file from R2" }, { status: 500 });
  }
}
