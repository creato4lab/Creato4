import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * Serves locally-uploaded files by their R2-style object key.
 * e.g. GET /api/images/images/1785231324762-photo.jpeg
 *      → reads from public/uploads/images/1785231324762-photo.jpeg
 *
 * This bridges the gap between R2 object keys stored in the DB
 * and the local-disk fallback used in development.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const resolvedParams = await params;
  const keySegments = resolvedParams.key;
  if (!keySegments || keySegments.length === 0) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  // Prevent path traversal
  const safeParts = keySegments.map((s) => s.replace(/\.\./g, ""));
  const lastFileName = safeParts[safeParts.length - 1];

  // Possible paths to check for the file on disk
  const candidatePaths = [
    path.join(process.cwd(), "public", "uploads", ...safeParts),
    path.join(process.cwd(), "public", ...safeParts),
    path.join(process.cwd(), "public", "uploads", "images", lastFileName),
    path.join(process.cwd(), "public", "uploads", "cad-files", lastFileName),
  ];

  let localPath = candidatePaths.find((p) => fs.existsSync(p));

  if (!localPath) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(localPath);
  const ext = path.extname(localPath).toLowerCase();

  const mimeMap: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".avif": "image/avif",
    ".svg": "image/svg+xml",
  };

  const contentType = mimeMap[ext] ?? "application/octet-stream";

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
