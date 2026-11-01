// Client for the PHP API in public/api/. Production builds talk to `<site>/api/`;
// `npm run dev` has no PHP, so it falls back to browser storage unless VITE_API_URL points at a server.

export const API_BASE = import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? `${import.meta.env.BASE_URL}api/` : "");
export const hasApi = Boolean(API_BASE);

const TOKEN_KEY = "alzubair.admin.token";

export function getAdminToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

function setAdminToken(token) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

export class ApiError extends Error {
  constructor(status, code) {
    super(code);
    this.status = status;
  }
}

export async function call(action, { method = "GET", query, body, form } = {}) {
  const url = new URL(API_BASE, window.location.href);
  url.searchParams.set("action", action);
  Object.entries(query || {}).forEach(([k, v]) => url.searchParams.set(k, v));
  const headers = {};
  const token = getAdminToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(url, {
    method: form || body ? "POST" : method,
    headers,
    body: form || (body ? JSON.stringify(body) : undefined),
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    // An expired admin session sends the dashboard back to its login screen.
    if (res.status === 401 && token && action !== "login") {
      setAdminToken("");
      window.dispatchEvent(new Event("alzubair:logout"));
    }
    throw new ApiError(res.status, json.error || "request-failed");
  }
  return json;
}

export async function login(password) {
  const { token } = await call("login", { body: { password } });
  setAdminToken(token);
  return token;
}

export async function logout() {
  try {
    await call("logout", { body: {} });
  } catch {
    /* already gone */
  }
  setAdminToken("");
}
