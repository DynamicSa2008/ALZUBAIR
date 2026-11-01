import { DEFAULT_SETTINGS } from "./defaults";

// Mirror of the active settings for non-React code (lib/notify.js). Kept in sync by SettingsProvider.
let current = DEFAULT_SETTINGS;
export const getSettings = () => current;
export const setCurrent = (s) => {
  current = s;
};

// Deep merge so an older settings.json missing new keys still works.
export function mergeSettings(base, patch) {
  if (!patch || typeof patch !== "object") return base;
  if (Array.isArray(base)) return Array.isArray(patch) ? patch : base;
  const out = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    out[k] = base[k] && typeof base[k] === "object" && !Array.isArray(base[k]) ? mergeSettings(base[k], v) : v;
  }
  return out;
}

// Helpers shared by components.
export function formatPhone(phone) {
  const d = String(phone || "").replace(/\D/g, "");
  const m = d.match(/^966(\d{2})(\d{3})(\d{4})$/);
  return m ? `+966 ${m[1]} ${m[2]} ${m[3]}` : phone;
}

export function routeFor(settings, section) {
  const r = (section && settings.routing?.[section]) || {};
  return {
    whatsapp: r.whatsapp || settings.contact.whatsapp,
    email: r.email || settings.contact.email,
  };
}
