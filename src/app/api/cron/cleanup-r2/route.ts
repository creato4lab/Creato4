import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import prisma from "@/lib/prisma";

export const maxDuration = 60; // Max execution time

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

export async function GET(req: Request) {
  // Security check: Vercel sets a specific header for cron jobs
  const authHeader = req.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
    process.env.NODE_ENV === "production"
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!s3Client) {
    return NextResponse.json({ error: "S3 Client not configured" }, { status: 500 });
  }

  try {
    // 1. Fetch all published product keys from the database
    const products = await prisma.product.findMany({
      select: {
        sourceCodePath: true,
        cadFilePath: true,
        pdfDocPath: true,
        pcbGerberPath: true,
        firmwareBinPath: true,
        firmwareUf2Path: true,
        videoUrl: true,
        images: true,
      },
    });

    const activeKeys = new Set<string>();
    for (const product of products) {
      if (product.sourceCodePath) activeKeys.add(product.sourceCodePath);
      if (product.cadFilePath) activeKeys.add(product.cadFilePath);
      if (product.pdfDocPath) activeKeys.add(product.pdfDocPath);
      if (product.pcbGerberPath) activeKeys.add(product.pcbGerberPath);
      if (product.firmwareBinPath) activeKeys.add(product.firmwareBinPath);
      if (product.firmwareUf2Path) activeKeys.add(product.firmwareUf2Path);
      if (product.videoUrl) {
        // videoUrl might be a full R2 url, extract the key if so
        if (product.videoUrl.includes("pub-")) {
           const urlObj = new URL(product.videoUrl);
           activeKeys.add(urlObj.pathname.substring(1)); // remove leading slash
        } else {
           activeKeys.add(product.videoUrl);
        }
      }
      for (const img of product.images) {
        if (img.includes("pub-")) {
          const urlObj = new URL(img);
          activeKeys.add(urlObj.pathname.substring(1));
        } else {
          activeKeys.add(img);
        }
      }
    }

    // 2. Paginate through all R2 objects
    let isTruncated = true;
    let continuationToken: string | undefined = undefined;
    const keysToDelete: { Key: string }[] = [];

    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const now = new Date();

    while (isTruncated) {
      const listCommand = new ListObjectsV2Command({
        Bucket: R2_BUCKET,
        ContinuationToken: continuationToken,
      });

      const response = await s3Client.send(listCommand);

      if (response.Contents) {
        for (const item of response.Contents) {
          if (!item.Key) continue;

          // Check if key is actively used in the database
          if (!activeKeys.has(item.Key)) {
            // Check if it's older than 24 hours
            if (item.LastModified) {
              const age = now.getTime() - new Date(item.LastModified).getTime();
              if (age > ONE_DAY_MS) {
                keysToDelete.push({ Key: item.Key });
              }
            }
          }
        }
      }

      isTruncated = response.IsTruncated ?? false;
      continuationToken = response.NextContinuationToken;
    }

    // 3. Batch delete orphaned keys in chunks of 1000
    let totalDeleted = 0;
    for (let i = 0; i < keysToDelete.length; i += 1000) {
      const chunk = keysToDelete.slice(i, i + 1000);
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: R2_BUCKET,
        Delete: {
          Objects: chunk,
          Quiet: false,
        },
      });

      const delRes = await s3Client.send(deleteCommand);
      totalDeleted += (delRes.Deleted?.length || 0);
    }

    return NextResponse.json({ 
      success: true, 
      scannedActiveKeys: activeKeys.size,
      totalDeleted,
      message: `Successfully cleaned up ${totalDeleted} orphaned files.`
    });

  } catch (err: any) {
    console.error("Cron Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
