// Publishing site settings and uploading gallery media through the PHP API (admin session required).
// Without the API (local development) publishing is unavailable; "Preview" still works.

import { call, hasApi } from "../lib/api";

export const canPublish = hasApi;
export const MAX_UPLOAD_MB = 50;

export async function publishSettings(settings) {
  await call("save-settings", { body: { settings } });
}

/** Uploads one file (compress images first with prepareImage) and returns its site path, e.g. "uploads/…webp". */
export async function uploadMedia(blob, originalName) {
  if (blob.size > MAX_UPLOAD_MB * 1024 * 1024) throw new Error("too-large");
  const form = new FormData();
  const ext = blob.type === "image/webp" ? ".webp" : "";
  form.append("file", blob, ext ? originalName.replace(/\.[^.]+$/, "") + ext : originalName);
  try {
    const { path } = await call("upload", { form });
    return path;
  } catch (e) {
    throw new Error(e.status === 413 ? "too-large" : e.message);
  }
}

// Shrinks photos for the web: max 1800px, WebP. Videos pass through untouched.
export async function prepareImage(file, max = 1800) {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((r) => canvas.toBlob(r, "image/webp", 0.85));
  return blob && blob.size < file.size ? blob : file;
}

export function downloadJson(settings) {
  const blob = new Blob([JSON.stringify(settings, null, 2) + "\n"], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "settings.json";
  a.click();
  URL.revokeObjectURL(a.href);
}
