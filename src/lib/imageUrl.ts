/**
 * Normalizes any image or asset reference stored in the DB into a URL that can be
 * used directly in <img src> or <video src>.
 *
 * Handles all formats that may exist in the database:
 *   - Full https:// URL         → returned as-is
 *   - /uploads/... path         → routed through /api/images/... (fallback to R2 if not local)
 *   - R2 object key like        → routed through /api/images/<key>
 *     "images/timestamp-file.jpg"
 */
export function getImageUrl(imageRef: string | null | undefined): string {
  if (!imageRef) return "";

  // Already an absolute URL (https / http / data)
  if (/^https?:\/\//i.test(imageRef) || imageRef.startsWith("data:")) {
    return imageRef;
  }

  // If path starts with /uploads/, strip leading /uploads/ so it routes through /api/images/...
  let cleanKey = imageRef;
  if (cleanKey.startsWith("/uploads/")) {
    cleanKey = cleanKey.replace(/^\/uploads\//, "");
  } else if (cleanKey.startsWith("/")) {
    cleanKey = cleanKey.slice(1);
  }

  // R2-style object key (e.g. "images/1785...-photo.jpg")
  // Route through the API image/asset server which checks local disk + R2 bucket
  return `/api/images/${cleanKey}`;
}
