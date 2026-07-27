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

// ─── Zero-Width Steganography Constants ────────────────────────────────────────
const ZW_ZERO = "\u200B"; // Zero-width space -> Represents '0'
const ZW_ONE = "\u200C";  // Zero-width non-joiner -> Represents '1'
const ZW_SEP = "\u200D";  // Zero-width joiner -> Separator/Delimiter

/**
 * Encodes a plain text payload (e.g. "C4L:dl_123:usr_456:lic_789") into invisible zero-width unicode chars
 */
export function encodeSteganography(payload: string): string {
  const binary = Array.from(Buffer.from(payload, "utf-8"))
    .map((byte) => byte.toString(2).padStart(8, "0"))
    .join("");

  const encodedBits = Array.from(binary)
    .map((bit) => (bit === "1" ? ZW_ONE : ZW_ZERO))
    .join("");

  return `${ZW_SEP}${encodedBits}${ZW_SEP}`;
}

/**
 * Decodes zero-width unicode chars embedded in a text or source code string
 */
export function decodeSteganography(text: string): string | null {
  const regex = new RegExp(`${ZW_SEP}([${ZW_ZERO}${ZW_ONE}]+)${ZW_SEP}`, "g");
  const match = regex.exec(text);
  if (!match || !match[1]) return null;

  try {
    const bits = match[1];
    let binaryStr = "";
    for (let i = 0; i < bits.length; i++) {
      if (bits[i] === ZW_ONE) binaryStr += "1";
      else if (bits[i] === ZW_ZERO) binaryStr += "0";
    }

    const bytes: number[] = [];
    for (let i = 0; i < binaryStr.length; i += 8) {
      const byteStr = binaryStr.substring(i, i + 8);
      if (byteStr.length === 8) {
        bytes.push(parseInt(byteStr, 2));
      }
    }

    const decoded = Buffer.from(bytes).toString("utf-8");
    return decoded.startsWith("C4L:") ? decoded : null;
  } catch (err) {
    return null;
  }
}

/**
 * Embeds zero-width steganographic token into source code lines (e.g. after setup() or loop())
 */
export function injectSteganographyIntoCode(code: string, meta: WatermarkMetadata): string {
  const payload = `C4L:${meta.downloadId}:${meta.userId}:${meta.licenseId}`;
  const zwPayload = encodeSteganography(payload);

  // If already steganographed, don't duplicate
  if (code.includes(ZW_SEP)) return code;

  // Insert invisible watermark right after setup(), loop(), or main line
  if (code.includes("void setup()")) {
    return code.replace("void setup()", `void setup()${zwPayload}`);
  }
  if (code.includes("void loop()")) {
    return code.replace("void loop()", `void loop()${zwPayload}`);
  }
  if (code.includes("int main(")) {
    return code.replace("int main(", `int main(${zwPayload}`);
  }

  // Fallback: append at end of first line
  const lines = code.split("\n");
  if (lines.length > 0) {
    lines[0] += zwPayload;
    return lines.join("\n");
  }

  return code + zwPayload;
}

/**
 * Generates the human-readable header comment block based on file extension
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
 * Unpacks the zip, injects watermark comments AND zero-width steganography into source code files,
 * adds a hidden .watermark.json file, and repacks.
 */
export async function watermarkZipBuffer(
  zipBuffer: Buffer,
  meta: WatermarkMetadata
): Promise<Buffer> {
  const zip = await JSZip.loadAsync(zipBuffer);
  const filePaths = Object.keys(zip.files);

  for (const filePath of filePaths) {
    const zipEntry = zip.files[filePath];
    if (zipEntry.dir) continue;

    const parts = filePath.split(".");
    const ext = parts.length > 1 ? parts.pop()! : "";

    const skipExts = ["png", "jpg", "jpeg", "gif", "ico", "bmp", "pdf", "zip", "tar", "gz", "7z", "bin", "elf", "hex", "exe", "so", "dll", "dylib", "pfx", "keystore"];
    if (skipExts.includes(ext.toLowerCase())) continue;

    try {
      let originalContent = await zipEntry.async("string");
      const header = getCommentHeader(ext, meta);

      // Inject steganographic zero-width watermark into source files (.ino, .c, .cpp, .h, etc.)
      const isSourceCode = ["ino", "c", "cpp", "h", "hpp", "py", "js", "ts"].includes(ext.toLowerCase());
      if (isSourceCode) {
        originalContent = injectSteganographyIntoCode(originalContent, meta);
      }

      if (!originalContent.includes("CREATO4 LAB — LICENSED INTELLECTUAL PROPERTY")) {
        zip.file(filePath, header + originalContent);
      } else {
        zip.file(filePath, originalContent);
      }
    } catch {
      // Ignore binary parsing errors
    }
  }

  // Embed hidden metadata file at root of ZIP
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

  return await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}

/**
 * Watermarks a standalone text/CAD file by prepending the watermark header and steganography.
 */
export function watermarkTextBuffer(
  contentBuffer: Buffer,
  fileExt: string,
  meta: WatermarkMetadata
): Buffer {
  let text = contentBuffer.toString("utf-8");
  const isSourceCode = ["ino", "c", "cpp", "h", "hpp", "py", "js", "ts"].includes(fileExt.toLowerCase());
  if (isSourceCode) {
    text = injectSteganographyIntoCode(text, meta);
  }

  const header = getCommentHeader(fileExt, meta);
  if (text.includes("CREATO4 LAB — LICENSED INTELLECTUAL PROPERTY")) {
    return Buffer.from(text, "utf-8");
  }
  return Buffer.from(header + text, "utf-8");
}
