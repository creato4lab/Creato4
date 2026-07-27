import JSZip from "jszip";

export interface WatermarkMetadata {
  downloadId: string;
  licenseId: string;
  licenseKey: string;
  licenseType: string;
  userId: string;
  userName?: string | null;
  userEmail?: string | null;
  productId: string;
  productTitle: string;
  purchasedAt?: string;
  downloadedAt: string;
}

/**
 * Generates the header comment block based on file extension
 */
function getCommentHeader(fileExt: string, meta: WatermarkMetadata): string {
  const border = "═".repeat(60);
  const divider = "─".repeat(60);

  const textLines = [
    border,
    " CREATO4 LAB — LICENSED INTELLECTUAL PROPERTY",
    border,
    ` Product       : ${meta.productTitle}`,
    ` License ID    : ${meta.licenseId}`,
    ` License Key   : ${meta.licenseKey}`,
    ` License Type  : ${meta.licenseType}`,
    ` Customer ID   : ${meta.userId}`,
    ` Customer      : ${meta.userName || "N/A"} (${meta.userEmail || "N/A"})`,
    ` Download Ref  : ${meta.downloadId}`,
    ` Timestamp     : ${meta.downloadedAt}`,
    divider,
    " © 2026 Creato4 Lab. All Rights Reserved.",
    " Unauthorized distribution or commercial reuse without a valid",
    " license is strictly prohibited and legally actionable.",
    " This file is digitally watermarked and forensically tracked.",
    border,
  ];

  const ext = fileExt.toLowerCase();

  // Multi-line C-style /* ... */
  if (["c", "cpp", "h", "hpp", "ino", "js", "ts", "jsx", "tsx", "css", "java", "cs", "go", "rs", "kt", "swift", "scala"].includes(ext)) {
    return `/*\n${textLines.map((l) => ` * ${l}`).join("\n")}\n */\n\n`;
  }

  // Hash-style #
  if (["py", "sh", "bash", "zsh", "pl", "rb", "yaml", "yml", "r", "cmake", "dockerfile", "makefile"].includes(ext) || ext === "makefile") {
    return `${textLines.map((l) => `# ${l}`).join("\n")}\n\n`;
  }

  // HTML/XML-style <!-- ... -->
  if (["html", "htm", "xml", "svg"].includes(ext)) {
    return `<!--\n${textLines.map((l) => `  ${l}`).join("\n")}\n-->\n\n`;
  }

  // Semicolon-style ; (Assembly, Lisp, INI)
  if (["asm", "s", "ini", "clj"].includes(ext)) {
    return `${textLines.map((l) => `; ${l}`).join("\n")}\n\n`;
  }

  // Double-dash-style -- (VHDL, Lua, SQL)
  if (["vhd", "vhdl", "lua", "sql"].includes(ext)) {
    return `${textLines.map((l) => `-- ${l}`).join("\n")}\n\n`;
  }

  // Default fallback block
  return `/*\n${textLines.map((l) => ` * ${l}`).join("\n")}\n */\n\n`;
}

/**
 * Watermarks a ZIP file in-memory.
 * Unpacks the zip, injects watermark comments into source code files,
 * adds a hidden .watermark.json file, and repacks.
 */
export async function watermarkZipBuffer(
  zipBuffer: Buffer,
  meta: WatermarkMetadata
): Promise<Buffer> {
  const zip = await JSZip.loadAsync(zipBuffer);

  // 1. Process files inside ZIP
  const filePaths = Object.keys(zip.files);

  for (const filePath of filePaths) {
    const zipEntry = zip.files[filePath];
    if (zipEntry.dir) continue;

    const parts = filePath.split(".");
    const ext = parts.length > 1 ? parts.pop()! : "";

    // Skip binary assets, images, archives inside zip
    const skipExts = ["png", "jpg", "jpeg", "gif", "ico", "bmp", "pdf", "zip", "tar", "gz", "7z", "bin", "elf", "hex", "exe", "so", "dll", "dylib", "pfx", "keystore"];
    if (skipExts.includes(ext.toLowerCase())) continue;

    try {
      const originalContent = await zipEntry.async("string");
      const header = getCommentHeader(ext, meta);

      // Prevent double header injection if downloaded multiple times
      if (!originalContent.includes("CREATO4 LAB — LICENSED INTELLECTUAL PROPERTY")) {
        zip.file(filePath, header + originalContent);
      }
    } catch {
      // If async("string") fails (binary file without standard text extension), leave as is
    }
  }

  // 2. Embed hidden metadata file at root of ZIP
  const watermarkJson = JSON.stringify(
    {
      _watermark: "CREATO4_LAB_FORENSIC_FINGERPRINT",
      version: "1.0",
      copyright: "© 2026 Creato4 Lab. All Rights Reserved.",
      licenseId: meta.licenseId,
      licenseKey: meta.licenseKey,
      licenseType: meta.licenseType,
      customerId: meta.userId,
      customerEmail: meta.userEmail,
      productTitle: meta.productTitle,
      downloadId: meta.downloadId,
      downloadedAt: meta.downloadedAt,
      checksum: Buffer.from(`${meta.licenseId}:${meta.userId}:${meta.downloadId}`).toString("base64"),
    },
    null,
    2
  );

  zip.file(".watermark.json", watermarkJson);
  zip.file("LICENSE_WATERMARK.txt", `${getCommentHeader("txt", meta)}\nThis digital product is uniquely registered to ${meta.userEmail || meta.userId}.\nAuthorized use only under Creato4 Lab Terms & EULA.\n`);

  // Repack into Node Buffer
  const outputUint8Array = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  return outputUint8Array;
}

/**
 * Watermarks a standalone text/CAD file by prepending the watermark header.
 */
export function watermarkTextBuffer(
  contentBuffer: Buffer,
  fileExt: string,
  meta: WatermarkMetadata
): Buffer {
  const originalText = contentBuffer.toString("utf-8");
  const header = getCommentHeader(fileExt, meta);
  if (originalText.includes("CREATO4 LAB — LICENSED INTELLECTUAL PROPERTY")) {
    return contentBuffer;
  }
  return Buffer.from(header + originalText, "utf-8");
}
