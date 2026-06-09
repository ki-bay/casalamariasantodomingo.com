// Minimal Google Drive client for Cloudflare Workers. Only what the
// drive-blog-sync pipeline needs: list image files in a folder, and
// download a file's bytes.

export const DRIVE_READ_SCOPE = "https://www.googleapis.com/auth/drive.readonly";

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
}

/**
 * List image files in a Drive folder. Excludes folders and non-image MIME
 * types. Returns up to `limit` newest-first.
 */
export async function listDriveFolderImages(
  accessToken: string,
  folderId: string,
  limit = 50,
): Promise<DriveFile[]> {
  // Query syntax: in folder, not trashed, mimeType startsWith image/
  const q = `'${folderId}' in parents and trashed = false and mimeType contains 'image/'`;
  const url = new URL("https://www.googleapis.com/drive/v3/files");
  url.searchParams.set("q", q);
  url.searchParams.set("fields", "files(id,name,mimeType,size,modifiedTime)");
  url.searchParams.set("orderBy", "modifiedTime desc");
  url.searchParams.set("pageSize", String(limit));
  // supportsAllDrives + includeItemsFromAllDrives is harmless for personal
  // Drives and necessary for shared/Team drives.
  url.searchParams.set("supportsAllDrives", "true");
  url.searchParams.set("includeItemsFromAllDrives", "true");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Drive list failed (HTTP ${res.status}): ${body.slice(0, 400)}`);
  }

  const json = (await res.json()) as { files?: DriveFile[] };
  return json.files ?? [];
}

/**
 * Download a Drive file's bytes. Returns an ArrayBuffer + the content-type
 * the server reported (preferred over the file's declared mimeType).
 */
export async function downloadDriveFile(
  accessToken: string,
  fileId: string,
): Promise<{ bytes: ArrayBuffer; contentType: string }> {
  const url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media&supportsAllDrives=true`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Drive download failed (HTTP ${res.status}): ${body.slice(0, 400)}`);
  }
  const bytes = await res.arrayBuffer();
  const contentType = res.headers.get("Content-Type") ?? "application/octet-stream";
  return { bytes, contentType };
}

/**
 * Filename → SEO slug. Strips extension, lowercases, collapses non-alnum
 * to hyphens. The Drive filename IS the keyword set, so we want to keep
 * it semantically intact.
 *   "Cómo llegar a la zona colonial en bicicleta.jpg"
 *     → "como-llegar-a-la-zona-colonial-en-bicicleta"
 */
export function filenameToSlug(filename: string): string {
  const noExt = filename.replace(/\.[a-z0-9]+$/i, "");
  // Normalize accents (NFD) and strip combining marks
  const flattened = noExt.normalize("NFD").replace(/[̀-ͯ]/g, "");
  return flattened
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Inverse intent: filename → human-readable keyword phrase for the LLM.
 *   "como-llegar-a-la-zona-colonial-en-bicicleta.jpg"
 *     → "como llegar a la zona colonial en bicicleta"
 */
export function filenameToKeywords(filename: string): string {
  const noExt = filename.replace(/\.[a-z0-9]+$/i, "");
  return noExt
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
