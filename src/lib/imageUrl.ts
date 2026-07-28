/**
 * Normalizes any image reference stored in the DB into a URL that can be
 * used directly in <img src>.
 *
 * Handles all formats that may exist in the database:
 *   - Full https:// URL         → returned as-is
 *   - /uploads/... path         → returned as-is (static file)
 *   - R2 object key like        → routed through /api/images/<key>
 *     "images/timestamp-file.jpg"
 */
export function getImageUrl(imageRef: string | null | undefined): string {
  if (!imageRef) return "/placeholder.jpg";

  // Already an absolute URL (https / http / data)
  if (/^https?:\/\//i.test(imageRef) || imageRef.startsWith("data:")) {
    return imageRef;
  }

  // Already a root-relative path (starts with /)
  if (imageRef.startsWith("/")) {
    return imageRef;
  }

  // R2-style object key (e.g. "images/1785...-photo.jpg")
  // Route through the API image server
  return `/api/images/${imageRef}`;
}
