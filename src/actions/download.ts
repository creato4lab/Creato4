"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function generateDownloadUrl(
  productId: string,
  fileType: "sourceCode" | "cadFile" | "pdfDoc" = "sourceCode"
) {
  const session = await auth();

  // 1. Authenticate user
  if (!session || !session.user || !session.user.id) {
    return { error: "You must be logged in to download files." };
  }

  // 2. Authorize user (Check if they own a valid license for this product)
  const license = await prisma.license.findFirst({
    where: {
      userId: session.user.id,
      productId: productId,
      isActive: true,
    },
  });

  if (!license) {
    return { error: "Forbidden: You do not own a valid license for this product." };
  }

  // 3. Get the product to verify file path exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { sourceCodePath: true, cadFilePath: true, pdfDocPath: true, title: true },
  });

  if (!product) {
    return { error: "Product not found." };
  }

  let objectKey: string | null = null;
  if (fileType === "sourceCode") objectKey = product.sourceCodePath;
  if (fileType === "cadFile") objectKey = product.cadFilePath;
  if (fileType === "pdfDoc") objectKey = product.pdfDocPath;

  if (!objectKey) {
    return { error: `This product does not have a ${fileType} file uploaded yet.` };
  }

  // 4. Return endpoint for watermarked server stream (Phase 5 Protection)
  const downloadUrl = `/api/download?productId=${encodeURIComponent(productId)}&fileType=${encodeURIComponent(fileType)}`;

  return {
    success: true,
    url: downloadUrl,
    isWatermarked: true,
  };
}
