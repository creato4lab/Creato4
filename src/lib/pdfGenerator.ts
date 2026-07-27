import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";

export interface WatermarkPDFOptions {
  customerName: string;
  licenseKey: string;
  orderId?: string;
  purchaseDate: string;
  productTitle: string;
  category: string;
  description: string;
  shortDescription?: string;
  hardwareUsed?: string[];
  softwareUsed?: string[];
  features?: string[];
  whatsIncluded?: string[];
  safetyWarning?: string | null;
  faqs?: { question: string; answer: string }[];
}

export interface ProfessionalPDFOptions extends WatermarkPDFOptions {
  teamName?: string;
  college?: string;
  customProjectTitle?: string;
}

// Color palette
const PRIMARY_GREEN = rgb(0.1, 0.24, 0.18); // #1A3C2F
const GOLD = rgb(0.77, 0.64, 0.35);         // #C4A35A
const TEXT_MUTED = rgb(0.36, 0.42, 0.38);    // #5C6B60
const LIGHT_BG = rgb(0.98, 0.97, 0.96);      // #FAF8F5
const ACCENT_RED = rgb(0.85, 0.25, 0.2);     // Warning red
const WATERMARK_COLOR = rgb(0.1, 0.24, 0.18); // Light green opacity

export async function createWatermarkedPDF(options: WatermarkPDFOptions): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const title = options.productTitle;
  const customerName = options.customerName || "Valued Customer";
  const licenseKey = options.licenseKey || "CRT4-DEMO-000000";
  const orderId = options.orderId || "ORD-PENDING";
  const purchaseDate = options.purchaseDate || new Date().toLocaleDateString();

  // Helper to add a page with header, footer, and watermark
  const addStandardPage = (isWatermarked: boolean) => {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait
    const { width, height } = page.getSize();

    // Background accent top bar
    page.drawRectangle({
      x: 0,
      y: height - 6,
      width,
      height: 6,
      color: GOLD,
    });

    // Header metadata block
    page.drawRectangle({
      x: 0,
      y: height - 42,
      width,
      height: 36,
      color: LIGHT_BG,
    });

    page.drawText(`Prepared for: ${customerName}`, {
      x: 25,
      y: height - 26,
      size: 8.5,
      font: fontBold,
      color: PRIMARY_GREEN,
    });

    page.drawText(`Order ID: ${orderId}`, {
      x: 200,
      y: height - 26,
      size: 8,
      font: fontRegular,
      color: TEXT_MUTED,
    });

    page.drawText(`License: ${licenseKey}`, {
      x: 340,
      y: height - 26,
      size: 8.5,
      font: fontBold,
      color: PRIMARY_GREEN,
    });

    page.drawText(`Date: ${purchaseDate}`, {
      x: 490,
      y: height - 26,
      size: 8,
      font: fontRegular,
      color: TEXT_MUTED,
    });

    // Top border line
    page.drawLine({
      start: { x: 0, y: height - 42 },
      end: { x: width, y: height - 42 },
      thickness: 0.5,
      color: PRIMARY_GREEN,
    });

    // Footer
    page.drawLine({
      start: { x: 25, y: 35 },
      end: { x: width - 25, y: 35 },
      thickness: 0.5,
      color: PRIMARY_GREEN,
    });

    page.drawText("© Creato4 Lab — All Rights Reserved | Official Engineering Blueprint", {
      x: 25,
      y: 22,
      size: 8,
      font: fontRegular,
      color: TEXT_MUTED,
    });

    page.drawText(`License ID: ${licenseKey}`, {
      x: width - 165,
      y: 22,
      size: 8,
      font: fontBold,
      color: PRIMARY_GREEN,
    });

    // Watermark if requested
    if (isWatermarked) {
      page.drawText("CREATO4 LAB — OFFICIAL BLUEPRINT", {
        x: 60,
        y: 300,
        size: 26,
        font: fontBold,
        color: WATERMARK_COLOR,
        opacity: 0.08,
        rotate: degrees(42),
      });

      page.drawText(`LICENSED TO: ${customerName.toUpperCase()}`, {
        x: 100,
        y: 240,
        size: 18,
        font: fontBold,
        color: WATERMARK_COLOR,
        opacity: 0.06,
        rotate: degrees(42),
      });
    }

    return page;
  };

  // ── PAGE 1: Cover & Project Blueprint Summary ───────────────────────────
  const page1 = addStandardPage(true);
  const { width } = page1.getSize();

  let y = 760;

  // Title Box Banner
  page1.drawRectangle({
    x: 25,
    y: y - 85,
    width: width - 50,
    height: 85,
    color: PRIMARY_GREEN,
  });

  page1.drawText("ENGINEERING PROJECT BLUEPRINT", {
    x: 40,
    y: y - 25,
    size: 9,
    font: fontBold,
    color: GOLD,
  });

  // Main Title (truncate if too long)
  const displayTitle = title.length > 50 ? title.substring(0, 48) + "..." : title;
  page1.drawText(displayTitle, {
    x: 40,
    y: y - 50,
    size: 18,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page1.drawText(`Category: ${options.category.replace(/_/g, " ")} | Digital Reference Manual`, {
    x: 40,
    y: y - 72,
    size: 9,
    font: fontRegular,
    color: rgb(0.9, 0.9, 0.9),
  });

  y -= 110;

  // Overview / Description Section
  page1.drawText("PROJECT OVERVIEW & SPECIFICATIONS", {
    x: 25,
    y,
    size: 11,
    font: fontBold,
    color: PRIMARY_GREEN,
  });
  y -= 15;

  const descText = options.shortDescription || options.description.slice(0, 300);
  const descLines = wrapText(descText, 85);
  descLines.forEach((line) => {
    page1.drawText(line, {
      x: 25,
      y,
      size: 9.5,
      font: fontRegular,
      color: PRIMARY_GREEN,
    });
    y -= 13;
  });

  y -= 15;

  // Hardware & Software Specifications Side-by-Side Boxes
  const boxWidth = (width - 60) / 2;

  // Hardware Box
  page1.drawRectangle({
    x: 25,
    y: y - 130,
    width: boxWidth,
    height: 130,
    color: LIGHT_BG,
    borderColor: PRIMARY_GREEN,
    borderWidth: 0.5,
  });

  page1.drawText("HARDWARE REQUIREMENTS", {
    x: 35,
    y: y - 20,
    size: 9,
    font: fontBold,
    color: PRIMARY_GREEN,
  });

  let hwY = y - 36;
  (options.hardwareUsed || ["Standard Controller", "Sensors", "Power Supply"]).slice(0, 6).forEach((hw) => {
    page1.drawText(`• ${hw}`, {
      x: 35,
      y: hwY,
      size: 8.5,
      font: fontRegular,
      color: PRIMARY_GREEN,
    });
    hwY -= 14;
  });

  // Software Box
  page1.drawRectangle({
    x: 35 + boxWidth,
    y: y - 130,
    width: boxWidth,
    height: 130,
    color: LIGHT_BG,
    borderColor: PRIMARY_GREEN,
    borderWidth: 0.5,
  });

  page1.drawText("SOFTWARE STACK", {
    x: 45 + boxWidth,
    y: y - 20,
    size: 9,
    font: fontBold,
    color: PRIMARY_GREEN,
  });

  let swY = y - 36;
  (options.softwareUsed || ["C++ / Arduino IDE", "PlatformIO", "Libraries"]).slice(0, 6).forEach((sw) => {
    page1.drawText(`• ${sw}`, {
      x: 45 + boxWidth,
      y: swY,
      size: 8.5,
      font: fontRegular,
      color: PRIMARY_GREEN,
    });
    swY -= 14;
  });

  y -= 150;

  // Key Features Section
  if (options.features && options.features.length > 0) {
    page1.drawText("KEY FEATURES", {
      x: 25,
      y,
      size: 11,
      font: fontBold,
      color: PRIMARY_GREEN,
    });
    y -= 15;

    options.features.slice(0, 5).forEach((feat) => {
      page1.drawText(`✓  ${feat}`, {
        x: 25,
        y,
        size: 9,
        font: fontRegular,
        color: PRIMARY_GREEN,
      });
      y -= 14;
    });
    y -= 10;
  }

  // Deliverables Included
  if (options.whatsIncluded && options.whatsIncluded.length > 0) {
    page1.drawText("WHAT'S INCLUDED IN THIS PACKAGE", {
      x: 25,
      y,
      size: 11,
      font: fontBold,
      color: PRIMARY_GREEN,
    });
    y -= 15;

    options.whatsIncluded.forEach((inc) => {
      page1.drawText(`📦 ${inc}`, {
        x: 25,
        y,
        size: 9,
        font: fontRegular,
        color: PRIMARY_GREEN,
      });
      y -= 14;
    });
    y -= 10;
  }

  // Safety Warning if present
  if (options.safetyWarning) {
    page1.drawRectangle({
      x: 25,
      y: y - 45,
      width: width - 50,
      height: 45,
      color: rgb(1, 0.96, 0.92),
      borderColor: ACCENT_RED,
      borderWidth: 0.5,
    });

    page1.drawText("SAFETY & OPERATION WARNING", {
      x: 35,
      y: y - 16,
      size: 8.5,
      font: fontBold,
      color: ACCENT_RED,
    });

    const warnLines = wrapText(options.safetyWarning, 85);
    warnLines.slice(0, 2).forEach((line, idx) => {
      page1.drawText(line, {
        x: 35,
        y: y - 28 - idx * 11,
        size: 8,
        font: fontRegular,
        color: ACCENT_RED,
      });
    });
  }

  // ── PAGE 2: Detailed Guide & FAQs ──────────────────────────────────────────
  const page2 = addStandardPage(true);
  let y2 = 760;

  page2.drawText("SETUP GUIDE & VERIFICATION", {
    x: 25,
    y: y2,
    size: 14,
    font: fontBold,
    color: PRIMARY_GREEN,
  });
  y2 -= 25;

  const setupSteps = [
    "1. Unpack downloaded assets (Source Code, Schematics, BOM, Documentation).",
    "2. Verify hardware components against the Bill of Materials included in the package.",
    "3. Install required IDE drivers (CP2102/CH340/FTDI) and hardware core packages.",
    "4. Flash the firmware source code or output binary to the target board.",
    "5. Verify Serial Output monitor at configured baud rate (e.g., 115200 baud).",
  ];

  setupSteps.forEach((step) => {
    page2.drawText(step, {
      x: 25,
      y: y2,
      size: 9.5,
      font: fontRegular,
      color: PRIMARY_GREEN,
    });
    y2 -= 16;
  });

  y2 -= 20;

  // FAQs Section
  if (options.faqs && options.faqs.length > 0) {
    page2.drawText("FREQUENTLY ASKED QUESTIONS", {
      x: 25,
      y: y2,
      size: 12,
      font: fontBold,
      color: PRIMARY_GREEN,
    });
    y2 -= 20;

    options.faqs.slice(0, 3).forEach((faq) => {
      page2.drawText(`Q: ${faq.question}`, {
        x: 25,
        y: y2,
        size: 9,
        font: fontBold,
        color: PRIMARY_GREEN,
      });
      y2 -= 14;

      const ansLines = wrapText(`A: ${faq.answer}`, 85);
      ansLines.forEach((line) => {
        page2.drawText(line, {
          x: 25,
          y: y2,
          size: 8.5,
          font: fontRegular,
          color: TEXT_MUTED,
        });
        y2 -= 12;
      });
      y2 -= 10;
    });
  }

  // License Certificate Box at bottom of Page 2
  page2.drawRectangle({
    x: 25,
    y: 60,
    width: width - 50,
    height: 100,
    color: LIGHT_BG,
    borderColor: GOLD,
    borderWidth: 1,
  });

  page2.drawText("OFFICIAL LICENSE & PROOF OF PURCHASE", {
    x: 40,
    y: 142,
    size: 10,
    font: fontBold,
    color: PRIMARY_GREEN,
  });

  page2.drawText(`License ID: ${licenseKey}`, {
    x: 40,
    y: 124,
    size: 9,
    font: fontBold,
    color: PRIMARY_GREEN,
  });

  page2.drawText(`Licensed Owner: ${customerName}`, {
    x: 40,
    y: 108,
    size: 9,
    font: fontRegular,
    color: PRIMARY_GREEN,
  });

  page2.drawText(`Order Reference: ${orderId} | Date: ${purchaseDate}`, {
    x: 40,
    y: 92,
    size: 8.5,
    font: fontRegular,
    color: TEXT_MUTED,
  });

  page2.drawText("This digital blueprint is authorized for personal, academic, or team development under Creato4 Lab EULA.", {
    x: 40,
    y: 75,
    size: 7.5,
    font: fontOblique,
    color: TEXT_MUTED,
  });

  return await pdfDoc.save();
}

export async function createProfessionalPDF(options: ProfessionalPDFOptions): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const title = options.customProjectTitle || options.productTitle;
  const customerName = options.customerName || "Author";
  const teamName = options.teamName || "Engineering Team";
  const college = options.college || "Academic Institution";
  const licenseKey = options.licenseKey || "CRT4-PROF-000000";
  const orderId = options.orderId || "ORD-PROF";
  const purchaseDate = options.purchaseDate || new Date().toLocaleDateString();

  // Clean Professional Page Helper (NO DIAGONAL WATERMARK)
  const addProfPage = () => {
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    // Top gold accent
    page.drawRectangle({
      x: 0,
      y: height - 4,
      width,
      height: 4,
      color: GOLD,
    });

    // Professional Footer
    page.drawLine({
      start: { x: 30, y: 35 },
      end: { x: width - 30, y: 35 },
      thickness: 0.5,
      color: PRIMARY_GREEN,
    });

    page.drawText(`${title} | ${college}`, {
      x: 30,
      y: 22,
      size: 8,
      font: fontRegular,
      color: TEXT_MUTED,
    });

    page.drawText(`Verified License: ${licenseKey}`, {
      x: width - 180,
      y: 22,
      size: 8,
      font: fontBold,
      color: PRIMARY_GREEN,
    });

    return page;
  };

  // ── COVER PAGE (Professional Title Block) ──────────────────────────────────
  const coverPage = addProfPage();
  const { width, height } = coverPage.getSize();

  let y = height - 120;

  // Header Box
  coverPage.drawRectangle({
    x: 40,
    y: y - 180,
    width: width - 80,
    height: 180,
    color: PRIMARY_GREEN,
  });

  coverPage.drawText("TECHNICAL PROJECT DOCUMENTATION & REPORT", {
    x: 60,
    y: y - 35,
    size: 10,
    font: fontBold,
    color: GOLD,
  });

  const displayTitle = title.length > 55 ? title.substring(0, 52) + "..." : title;
  coverPage.drawText(displayTitle, {
    x: 60,
    y: y - 75,
    size: 20,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  coverPage.drawText(`Category: ${options.category.replace(/_/g, " ")} | Release Build`, {
    x: 60,
    y: y - 105,
    size: 10,
    font: fontRegular,
    color: rgb(0.9, 0.9, 0.9),
  });

  coverPage.drawText(`Institution / College: ${college}`, {
    x: 60,
    y: y - 135,
    size: 11,
    font: fontBold,
    color: GOLD,
  });

  coverPage.drawText(`Team / Authors: ${teamName} (${customerName})`, {
    x: 60,
    y: y - 155,
    size: 10,
    font: fontRegular,
    color: rgb(1, 1, 1),
  });

  y -= 220;

  // Professional Metadata Card
  coverPage.drawRectangle({
    x: 40,
    y: y - 80,
    width: width - 80,
    height: 80,
    color: LIGHT_BG,
    borderColor: PRIMARY_GREEN,
    borderWidth: 0.5,
  });

  coverPage.drawText("DOCUMENT CREATOR & LICENSE DETAILS", {
    x: 55,
    y: y - 20,
    size: 9,
    font: fontBold,
    color: PRIMARY_GREEN,
  });

  coverPage.drawText(`Prepared By: ${customerName}`, {
    x: 55,
    y: y - 38,
    size: 9,
    font: fontRegular,
    color: PRIMARY_GREEN,
  });

  coverPage.drawText(`Team / Group: ${teamName}`, {
    x: 260,
    y: y - 38,
    size: 9,
    font: fontRegular,
    color: PRIMARY_GREEN,
  });

  coverPage.drawText(`Institution: ${college}`, {
    x: 55,
    y: y - 56,
    size: 9,
    font: fontRegular,
    color: PRIMARY_GREEN,
  });

  coverPage.drawText(`License Ref: ${licenseKey} (Order ${orderId})`, {
    x: 260,
    y: y - 56,
    size: 9,
    font: fontBold,
    color: PRIMARY_GREEN,
  });

  y -= 110;

  // Abstract & Overview
  coverPage.drawText("EXECUTIVE ABSTRACT", {
    x: 40,
    y,
    size: 12,
    font: fontBold,
    color: PRIMARY_GREEN,
  });
  y -= 18;

  const descLines = wrapText(options.description, 80);
  descLines.slice(0, 10).forEach((line) => {
    coverPage.drawText(line, {
      x: 40,
      y,
      size: 9.5,
      font: fontRegular,
      color: PRIMARY_GREEN,
    });
    y -= 14;
  });

  y -= 15;

  // Hardware & Software Specifications
  if (options.hardwareUsed && options.hardwareUsed.length > 0) {
    coverPage.drawText("HARDWARE COMPONENTS", {
      x: 40,
      y,
      size: 11,
      font: fontBold,
      color: PRIMARY_GREEN,
    });
    y -= 16;

    options.hardwareUsed.forEach((hw) => {
      coverPage.drawText(`•  ${hw}`, {
        x: 45,
        y,
        size: 9,
        font: fontRegular,
        color: PRIMARY_GREEN,
      });
      y -= 13;
    });
  }

  // ── PAGE 2: Full Specifications & Architecture ─────────────────────────────
  const page2 = addProfPage();
  let y2 = height - 60;

  page2.drawText("SYSTEM ARCHITECTURE & TECHNICAL SPECIFICATIONS", {
    x: 40,
    y: y2,
    size: 14,
    font: fontBold,
    color: PRIMARY_GREEN,
  });
  y2 -= 25;

  if (options.features && options.features.length > 0) {
    page2.drawText("Key Features & Capabilities:", {
      x: 40,
      y: y2,
      size: 11,
      font: fontBold,
      color: PRIMARY_GREEN,
    });
    y2 -= 18;

    options.features.forEach((feat) => {
      page2.drawText(`[+]  ${feat}`, {
        x: 45,
        y: y2,
        size: 9.5,
        font: fontRegular,
        color: PRIMARY_GREEN,
      });
      y2 -= 15;
    });
    y2 -= 15;
  }

  if (options.whatsIncluded && options.whatsIncluded.length > 0) {
    page2.drawText("Bill of Materials & Deliverables:", {
      x: 40,
      y: y2,
      size: 11,
      font: fontBold,
      color: PRIMARY_GREEN,
    });
    y2 -= 18;

    options.whatsIncluded.forEach((inc) => {
      page2.drawText(`[✓]  ${inc}`, {
        x: 45,
        y: y2,
        size: 9.5,
        font: fontRegular,
        color: PRIMARY_GREEN,
      });
      y2 -= 15;
    });
    y2 -= 20;
  }

  // Institutional License Box
  page2.drawRectangle({
    x: 40,
    y: 65,
    width: width - 80,
    height: 90,
    color: LIGHT_BG,
    borderColor: GOLD,
    borderWidth: 1,
  });

  page2.drawText("VERIFIED PROFESSIONAL LICENSE CERTIFICATE", {
    x: 55,
    y: 135,
    size: 10,
    font: fontBold,
    color: PRIMARY_GREEN,
  });

  page2.drawText(`Project Title: ${title}`, {
    x: 55,
    y: 118,
    size: 9,
    font: fontBold,
    color: PRIMARY_GREEN,
  });

  page2.drawText(`Author/Team: ${customerName} | ${teamName}`, {
    x: 55,
    y: 102,
    size: 8.5,
    font: fontRegular,
    color: PRIMARY_GREEN,
  });

  page2.drawText(`College/Institution: ${college}`, {
    x: 55,
    y: 88,
    size: 8.5,
    font: fontRegular,
    color: PRIMARY_GREEN,
  });

  page2.drawText(`License Key: ${licenseKey} | Purchase Order: ${orderId}`, {
    x: 55,
    y: 74,
    size: 8,
    font: fontOblique,
    color: TEXT_MUTED,
  });

  return await pdfDoc.save();
}

// Simple text wrapper for PDF lines
function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}
