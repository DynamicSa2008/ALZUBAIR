// Publishes settings.json straight to the GitHub repo, so edits go live without a rebuild:
//  • gh-pages:/settings.json        → what visitors load right now
//  • main:/public/settings.json     → so the next `npm run deploy` keeps the same values
// The token is a fine-grained GitHub token (Contents: read & write on this repo only),
// typed by the admin and kept in their own browser. It is never part of the site build.

export const REPO = "DynamicSa2008/ALZUBAIR";
const TARGETS = [
  { branch: "gh-pages", path: "settings.json" },
  { branch: "main", path: "public/settings.json" },
];
const TOKEN_KEY = "alzubair.gh-token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}
export function saveToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

function bytesToBase64(bytes) {
  let bin = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  return btoa(bin);
}
const toBase64 = (text) => bytesToBase64(new TextEncoder().encode(text));

async function gh(token, url, init = {}) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${url}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  return res;
}

// Writes one file to every target branch. Returns [{branch, ok, status}].
async function putEverywhere(token, targets, content, message) {
  const results = [];
  for (const { branch, path } of targets) {
    let sha;
    const head = await gh(token, `${path}?ref=${branch}`);
    if (head.ok) sha = (await head.json()).sha;
    else if (head.status !== 404) {
      results.push({ branch, ok: false, status: head.status });
      continue;
    }
    const put = await gh(token, path, {
      method: "PUT",
      body: JSON.stringify({ message, content, branch, ...(sha ? { sha } : {}) }),
    });
    results.push({ branch, ok: put.ok, status: put.status });
  }
  return results;
}

export function publishSettings(token, settings, message = "Update site settings from dashboard") {
  return putEverywhere(token, TARGETS, toBase64(JSON.stringify(settings, null, 2) + "\n"), message);
}

export const MAX_UPLOAD_MB = 25;

/**
 * Uploads a gallery file (already compressed if it is an image) and returns its site path,
 * e.g. "gallery/1730000000-box.webp". Throws on failure.
 */
export async function uploadMedia(token, blob, originalName) {
  if (blob.size > MAX_UPLOAD_MB * 1024 * 1024) throw new Error("too-large");
  const ext = (blob.type.split("/")[1] || originalName.split(".").pop() || "bin").replace("jpeg", "jpg").replace("quicktime", "mov");
  const base = originalName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const name = `${Date.now()}-${base || "media"}.${ext}`;
  const content = bytesToBase64(new Uint8Array(await blob.arrayBuffer()));
  const results = await putEverywhere(
    token,
    [
      { branch: "gh-pages", path: `gallery/${name}` },
      { branch: "main", path: `public/gallery/${name}` },
    ],
    content,
    `Upload gallery media ${name}`,
  );
  if (!results[0].ok) throw new Error(`upload-${results[0].status}`);
  return `gallery/${name}`;
}

// Shrinks photos to the web: max 1800px, WebP. Videos pass through untouched.
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
