import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { createWatermarkedPDF, createProfessionalPDF } from "@/lib/pdfGenerator";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { licenseId, type = "watermarked", teamName, college, customProjectTitle } = body;

    if (!licenseId) {
      return NextResponse.json({ error: "Missing licenseId" }, { status: 400 });
    }

    // 1. Fetch license with product & order details
    const license = await prisma.license.findFirst({
      where: {
        id: licenseId,
        userId: session.user.id,
        isActive: true,
      },
      include: {
        product: true,
        user: true,
      },
    });

    if (!license || !license.product) {
      return NextResponse.json({ error: "License or product not found" }, { status: 404 });
    }

    const customerName = session.user.name || license.user?.name || session.user.email || "Valued Customer";
    const licenseKey = license.licenseKey;
    const orderId = `ORD-${license.id.slice(-8).toUpperCase()}`;
    const purchaseDate = new Date(license.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const product = license.product;

    // Increment downloads count
    await prisma.license.update({
      where: { id: license.id },
      data: { downloadsUsed: { increment: 1 } },
    });

    let pdfBytes: Uint8Array;

    if (type === "professional") {
      pdfBytes = await createProfessionalPDF({
        customerName,
        licenseKey,
        orderId,
        purchaseDate,
        productTitle: product.title,
        customProjectTitle: customProjectTitle || product.title,
        teamName: teamName || "Engineering Team",
        college: college || "Academic Institution",
        category: product.category,
        description: product.description,
        shortDescription: product.shortDescription,
        hardwareUsed: product.hardwareUsed,
        softwareUsed: product.softwareUsed,
        features: product.features,
        whatsIncluded: product.whatsIncluded,
        safetyWarning: product.safetyWarning,
        faqs: (product.faqs as any) || [],
      });
    } else {
      pdfBytes = await createWatermarkedPDF({
        customerName,
        licenseKey,
        orderId,
        purchaseDate,
        productTitle: product.title,
        category: product.category,
        description: product.description,
        shortDescription: product.shortDescription,
        hardwareUsed: product.hardwareUsed,
        softwareUsed: product.softwareUsed,
        features: product.features,
        whatsIncluded: product.whatsIncluded,
        safetyWarning: product.safetyWarning,
        faqs: (product.faqs as any) || [],
      });
    }

    const filename = `${product.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${type}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: "Failed to generate PDF document" }, { status: 500 });
  }
}
