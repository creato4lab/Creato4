import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "creato4-digital-assets";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

const s3Client =
  R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY
    ? new S3Client({
        region: "auto",
        endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: R2_ACCESS_KEY_ID,
          secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
      })
    : null;

const mimeMap: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".pdf": "application/pdf",
};

/**
 * Serves uploaded images, videos, and media assets by key.
 * Checks local disk first; if not found, streams directly from Cloudflare R2!
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ key: string[] }> }
) {
  const { key: keySegments } = await context.params;
  if (!keySegments || keySegments.length === 0) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  // Prevent path traversal
  const safeParts = keySegments.map((s) => s.replace(/\.\./g, ""));
  const lastFileName = safeParts[safeParts.length - 1];
  const r2ObjectKey = safeParts.join("/");

  // 1. Check local disk candidate paths
  const candidatePaths = [
    path.join(process.cwd(), "public", "uploads", ...safeParts),
    path.join(process.cwd(), "public", ...safeParts),
    path.join(process.cwd(), "public", "uploads", "images", lastFileName),
    path.join(process.cwd(), "public", "uploads", "videos", lastFileName),
    path.join(process.cwd(), "public", "uploads", "cad-files", lastFileName),
  ];

  const localPath = candidatePaths.find((p) => fs.existsSync(p));

  if (localPath) {
    const ext = path.extname(localPath).toLowerCase();
    const contentType = mimeMap[ext] ?? "application/octet-stream";
    const stat = fs.statSync(localPath);
    const fileSize = stat.size;
    const range = req.headers.get("range");

    if (range && (contentType.startsWith("video/") || contentType.startsWith("audio/"))) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;

      const fileStream = fs.createReadStream(localPath, { start, end });
      const stream = new ReadableStream({
        start(controller) {
          fileStream.on("data", (chunk) => controller.enqueue(chunk));
          fileStream.on("end", () => controller.close());
          fileStream.on("error", (err) => controller.error(err));
        },
      });

      return new NextResponse(stream as any, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize.toString(),
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    const fileBuffer = fs.readFileSync(localPath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
        "Content-Length": fileSize.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // 2. Fallback to Cloudflare R2 bucket streaming
  if (s3Client) {
    const candidateR2Keys = Array.from(
      new Set([
        r2ObjectKey,
        `images/${lastFileName}`,
        `videos/${lastFileName}`,
        `cad-files/${lastFileName}`,
      ])
    );

    const rangeHeader = req.headers.get("range") || undefined;

    for (const keyToTry of candidateR2Keys) {
      try {
        const command = new GetObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: keyToTry,
          Range: rangeHeader,
        });

        const response = await s3Client.send(command);

        if (response.Body) {
          const stream = response.Body.transformToWebStream();
          const ext = path.extname(lastFileName).toLowerCase();
          const contentType = response.ContentType || mimeMap[ext] || "application/octet-stream";
          const isPartial = !!response.ContentRange;

          return new NextResponse(stream as any, {
            status: isPartial ? 206 : 200,
            headers: {
              "Content-Type": contentType,
              "Accept-Ranges": "bytes",
              ...(response.ContentRange ? { "Content-Range": response.ContentRange } : {}),
              ...(response.ContentLength ? { "Content-Length": response.ContentLength.toString() } : {}),
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        }
      } catch (err: any) {
        // Try next candidate key in R2
      }
    }
  }

  return NextResponse.json({ error: "File not found" }, { status: 404 });
}
