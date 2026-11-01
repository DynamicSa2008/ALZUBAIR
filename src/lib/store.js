// Tiny async data layer. Today it persists to localStorage (the site is static on GitHub Pages);
// every function is async so swapping in a real backend (Supabase, Firebase, an API) only touches this file.

const KEYS = {
  orders: "alzubair.orders",
  kyc: "alzubair.kyc",
  feedback: "alzubair.feedback",
  messages: "alzubair.messages",
};

function read(collection) {
  try {
    return JSON.parse(localStorage.getItem(KEYS[collection]) || "[]");
  } catch {
    return [];
  }
}

function write(collection, rows) {
  try {
    localStorage.setItem(KEYS[collection], JSON.stringify(rows));
  } catch {
    /* storage full or blocked */
  }
  window.dispatchEvent(new CustomEvent("alzubair:store", { detail: collection }));
}

const PREFIX = { orders: "ZB", kyc: "KYC", feedback: "FB", messages: "MSG" };

function makeCode(collection) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `${PREFIX[collection]}-${s}`;
}

export async function list(collection) {
  return read(collection).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function get(collection, code) {
  const needle = String(code).trim().toUpperCase();
  return read(collection).find((r) => r.code === needle) || null;
}

// Every record gets: code, createdAt, status, history[{status, at, note}].
export async function create(collection, data, initialStatus = "received") {
  const now = new Date().toISOString();
  const record = {
    ...data,
    code: makeCode(collection),
    createdAt: now,
    status: initialStatus,
    history: [{ status: initialStatus, at: now }],
  };
  write(collection, [record, ...read(collection)]);
  return record;
}

export async function update(collection, code, patch, note) {
  const rows = read(collection);
  const i = rows.findIndex((r) => r.code === code);
  if (i === -1) return null;
  const prev = rows[i];
  const next = { ...prev, ...patch, updatedAt: new Date().toISOString() };
  if (patch.status && patch.status !== prev.status) {
    next.history = [...(prev.history || []), { status: patch.status, at: next.updatedAt, note }];
  }
  rows[i] = next;
  write(collection, rows);
  return next;
}

export async function remove(collection, code) {
  write(
    collection,
    read(collection).filter((r) => r.code !== code),
  );
}

// Subscribe to changes (same tab via custom event, other tabs via the storage event).
export function subscribe(callback) {
  const onCustom = (e) => callback(e.detail);
  const onStorage = (e) => {
    const hit = Object.entries(KEYS).find(([, k]) => k === e.key);
    if (hit) callback(hit[0]);
  };
  window.addEventListener("alzubair:store", onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("alzubair:store", onCustom);
    window.removeEventListener("storage", onStorage);
  };
}
