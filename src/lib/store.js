// Async data layer. On the server it talks to the PHP API (MySQL); in local development
// (no PHP) it falls back to localStorage so every page still works.

import { call, hasApi } from "./api";

const notifyChange = (collection) => window.dispatchEvent(new CustomEvent("alzubair:store", { detail: collection }));

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
  notifyChange(collection);
}

const PREFIX = { orders: "ZB", kyc: "KYC", feedback: "FB", messages: "MSG" };

function makeCode(collection) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `${PREFIX[collection]}-${s}`;
}

async function localList(collection) {
  return read(collection).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function localGet(collection, code) {
  const needle = String(code).trim().toUpperCase();
  return read(collection).find((r) => r.code === needle) || null;
}

// Every record gets: code, createdAt, status, history[{status, at, note}].
async function localCreate(collection, data, initialStatus = "received") {
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

async function localUpdate(collection, code, patch, note) {
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

async function localRemove(collection, code) {
  write(
    collection,
    read(collection).filter((r) => r.code !== code),
  );
}

// ---------- Public API (same signatures in both modes) ----------

export async function list(collection) {
  return hasApi ? call("list", { query: { collection } }) : localList(collection);
}

// Public lookup by code (tracking). Through the API, non-admins only get status fields.
export async function get(collection, code) {
  if (!hasApi) return localGet(collection, code);
  try {
    return await call("track", { query: { collection, code: String(code).trim().toUpperCase() } });
  } catch (e) {
    if (e.status === 404) return null;
    throw e;
  }
}

export async function create(collection, data, initialStatus = "received") {
  if (!hasApi) return localCreate(collection, data, initialStatus);
  const record = await call("create", { body: { collection, data, status: initialStatus } });
  notifyChange(collection);
  return record;
}

export async function update(collection, code, patch, note) {
  if (!hasApi) return localUpdate(collection, code, patch, note);
  const record = await call("update", { body: { collection, code, patch, note } });
  notifyChange(collection);
  return record;
}

export async function remove(collection, code) {
  if (!hasApi) return localRemove(collection, code);
  await call("delete", { body: { code } });
  notifyChange(collection);
}

// Subscribe to changes: this tab's own writes (custom event), other tabs (storage event),
// and — with the API — a light poll so the dashboard sees new orders from customers.
export function subscribe(callback) {
  const poll = hasApi
    ? setInterval(() => document.visibilityState === "visible" && callback("poll"), 30000)
    : null;
  const onCustom = (e) => callback(e.detail);
  const onStorage = (e) => {
    const hit = Object.entries(KEYS).find(([, k]) => k === e.key);
    if (hit) callback(hit[0]);
  };
  window.addEventListener("alzubair:store", onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    if (poll) clearInterval(poll);
    window.removeEventListener("alzubair:store", onCustom);
    window.removeEventListener("storage", onStorage);
  };
}
