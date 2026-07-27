import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { watermarkZipBuffer, watermarkTextBuffer, WatermarkMetadata } from "@/lib/watermark";

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

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const fileType = (searchParams.get("fileType") || "sourceCode") as "sourceCode" | "cadFile" | "pdfDoc";

  if (!productId) {
    return NextResponse.json({ error: "Missing productId parameter." }, { status: 400 });
  }

  // 1. Check user ownership / valid license
  const license = await prisma.license.findFirst({
    where: {
      userId: session.user.id,
      productId: productId,
      isActive: true,
    },
    include: {
      product: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!license) {
    return NextResponse.json(
      { error: "Forbidden: You do not own a valid license for this product." },
      { status: 403 }
    );
  }

  // 2. Locate object key
  let objectKey: string | null = null;
  if (fileType === "sourceCode") objectKey = license.product.sourceCodePath;
  if (fileType === "cadFile") objectKey = license.product.cadFilePath;
  if (fileType === "pdfDoc") objectKey = license.product.pdfDocPath;

  if (!objectKey) {
    return NextResponse.json(
      { error: `This product does not have a ${fileType} file uploaded.` },
      { status: 444 }
    );
  }

  const chipIdParam = searchParams.get("chipId");

  // Lookup active device activation if not passed in query params
  let activeChipId = chipIdParam;
  if (!activeChipId) {
    const firstActivation = await prisma.deviceActivation.findFirst({
      where: { licenseId: license.id, isActive: true },
      select: { chipId: true },
    });
    if (firstActivation) {
      activeChipId = firstActivation.chipId;
    }
  }

  const downloadId = `dl_${crypto.randomUUID()}`;
  const nowIso = new Date().toISOString();

  const metadata: WatermarkMetadata = {
    downloadId,
    licenseId: license.id,
    licenseKey: license.licenseKey,
    licenseType: license.type,
    userId: session.user.id,
    userName: license.user.name,
    userEmail: license.user.email,
    productId: license.product.id,
    productTitle: license.product.title,
    purchasedAt: license.createdAt.toISOString(),
    downloadedAt: nowIso,
    chipId: activeChipId,
  };

  let rawBuffer: Buffer;
  let cleanFilename = `${license.product.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_watermarked`;

  // 3. Fetch binary stream from R2 or fallback mock
  if (s3Client) {
    try {
      const command = new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: objectKey,
      });

      const response = await s3Client.send(command);
      if (!response.Body) {
        throw new Error("Empty response body from R2");
      }

      const byteArray = await response.Body.transformToByteArray();
      rawBuffer = Buffer.from(byteArray);
    } catch (err) {
      console.error("[/api/download] S3 fetch error:", err);
      return NextResponse.json(
        { error: "Failed to retrieve product file from storage." },
        { status: 500 }
      );
    }
  } else {
    // Development Mock mode if R2 keys are not present
    const mockCode = `// Creato4 Sample Project Source Code\nvoid setup() {\n  Serial.begin(115200);\n}\nvoid loop() {\n  Serial.println("Running Creato4 Demo Firmware");\n  delay(1000);\n}\n`;
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    zip.file("main.ino", mockCode);
    zip.file("README.md", `# ${license.product.title}\nSample project documentation.`);
    const zipUint8 = await zip.generateAsync({ type: "nodebuffer" });
    rawBuffer = Buffer.from(zipUint8);
    objectKey = `${objectKey || "sample"}.zip`;
  }

  // 4. Apply Watermarking & Protection
  let watermarkedBuffer: Buffer = rawBuffer;
  const ext = objectKey.split(".").pop() || "txt";

  if (fileType === "cadFile") {
    // Deliver CAD files/ZIPs raw as-is without alteration
    watermarkedBuffer = rawBuffer;
    cleanFilename += `.${ext}`;
  } else if (fileType === "sourceCode" || ext === "zip" || ext === "rar") {
    try {
      watermarkedBuffer = await watermarkZipBuffer(rawBuffer, metadata);
      cleanFilename += ".zip";
    } catch (err) {
      console.warn("[/api/download] ZIP watermarking warning, serving original buffer:", err);
      watermarkedBuffer = rawBuffer;
      cleanFilename += `.${ext}`;
    }
  } else {
    watermarkedBuffer = await watermarkTextBuffer(rawBuffer, ext, metadata);
    cleanFilename += `.${ext}`;
  }

  // 5. Log audit trail to Database
  const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
  const userAgent = req.headers.get("user-agent") || "unknown";

  try {
    await prisma.$transaction([
      prisma.downloadLog.create({
        data: {
          licenseId: license.id,
          userId: session.user.id,
          productId: license.product.id,
          fileType,
          fingerprint: downloadId,
          ipAddress,
          userAgent,
        },
      }),
      prisma.license.update({
        where: { id: license.id },
        data: { downloadsUsed: { increment: 1 } },
      }),
      prisma.product.update({
        where: { id: license.product.id },
        data: { downloadCount: { increment: 1 } },
      }),
    ]);
  } catch (logErr) {
    console.error("[/api/download] Download audit log failed:", logErr);
  }

  // 6. Return watermarked stream
  const isZipHeader = ext === "zip" || ext === "rar" || fileType === "sourceCode";
  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", isZipHeader ? "application/zip" : "application/octet-stream");
  responseHeaders.set("Content-Disposition", `attachment; filename="${cleanFilename}"`);
  responseHeaders.set("Content-Length", watermarkedBuffer.length.toString());
  responseHeaders.set("X-Watermark-ID", downloadId);

  return new NextResponse(new Uint8Array(watermarkedBuffer), {
    status: 200,
    headers: responseHeaders,
  });
}
