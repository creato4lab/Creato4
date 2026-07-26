"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'creato4-digital-assets';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

// Initialize S3 Client for Cloudflare R2 only if credentials exist
const s3Client = (R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY) 
  ? new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

export async function generateDownloadUrl(productId: string, fileType: 'sourceCode' | 'cadFile' | 'pdfDoc') {
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
      status: "ACTIVE"
    }
  });

  if (!license) {
    return { error: "Forbidden: You do not own a valid license for this product." };
  }

  // 3. Get the product to find the file paths
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { sourceCodePath: true, cadFilePath: true, pdfDocPath: true, title: true }
  });

  if (!product) {
    return { error: "Product not found." };
  }

  // 4. Determine which file the user requested
  let objectKey = null;
  if (fileType === 'sourceCode') objectKey = product.sourceCodePath;
  if (fileType === 'cadFile') objectKey = product.cadFilePath;
  if (fileType === 'pdfDoc') objectKey = product.pdfDocPath;

  if (!objectKey) {
    return { error: `This product does not have a ${fileType} available.` };
  }

  // 5. Generate the secure URL
  if (s3Client) {
    // REAL IMPLEMENTATION (Cloudflare R2)
    try {
      const command = new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: objectKey,
        ResponseContentDisposition: `attachment; filename="${product.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${fileType}"`
      });

      // URL expires in 5 minutes (300 seconds)
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
      return { success: true, url: signedUrl };
      
    } catch (error) {
      console.error("Error generating signed URL:", error);
      return { error: "Failed to generate secure download link. Please contact support." };
    }
  } else {
    // MOCK IMPLEMENTATION (For development before R2 credentials are added)
    console.warn("⚠️ Cloudflare R2 Credentials not found in .env. Generating a mock download URL instead.");
    
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real scenario, this would be a real S3 URL.
    // For the mock, we'll just redirect to the website's homepage or a dummy file.
    const mockSignedUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?mock_download=${encodeURIComponent(objectKey)}&expires=in_5_minutes&token=mock_signature_12345`;
    
    return { 
      success: true, 
      url: mockSignedUrl, 
      isMock: true,
      message: "This is a simulated download link because Cloudflare R2 is not yet configured."
    };
  }
}
