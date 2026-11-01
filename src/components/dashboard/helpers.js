import { create, update } from "../../lib/store";
import { serviceById } from "../../data/services";
import { SITE } from "../../config/site";

export const PIN_KEY = "alzubair.dashboard.unlocked";

export function isToday(iso) {
  const d = new Date(iso);
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}

export function orderServices(order) {
  if (Array.isArray(order.services)) return order.services;
  return order.service ? [order.service] : [];
}

export function matches(record, query) {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  return Object.values(record).some((v) => typeof v === "string" && v.toLowerCase().includes(q));
}

export function trackUrl(code) {
  return `${SITE.url}/track?code=${encodeURIComponent(code)}`;
}

// ---------- CSV ----------
function csvCell(v) {
  const s = v === undefined || v === null ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function downloadCsv(filename, columns, rows) {
  const lines = [columns.map((c) => csvCell(c.label)).join(",")];
  rows.forEach((r) => lines.push(columns.map((c) => csvCell(c.value(r))).join(",")));
  // BOM so Excel opens Arabic text correctly.
  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function serviceNames(order, l) {
  return orderServices(order)
    .map((id) => (serviceById(id) ? l(serviceById(id).name) : id))
    .join(" + ");
}

// ---------- Demo data ----------
const DAY = 86400000;
const ago = (days, hours = 0) => new Date(Date.now() - days * DAY - hours * 3600000).toISOString();

// Writes a record, then backdates it and rewrites its history so the dashboard looks lived-in.
async function seed(collection, data, steps, notes = {}) {
  const startStatus = steps[0][0];
  const rec = await create(collection, data, startStatus);
  const history = steps.map(([status, at]) => ({ status, at, ...(notes[status] ? { note: notes[status] } : {}) }));
  const last = steps[steps.length - 1];
  if (last[0] !== startStatus) await update(collection, rec.code, { status: last[0] });
  await update(collection, rec.code, { createdAt: steps[0][1], history, updatedAt: last[1] });
}

export async function seedDemoData() {
  const orders = [
    {
      data: {
        services: ["tm-registration", "tm-translation"],
        brand: "قهوة سدرة",
        notes: "تسجيل العلامة بالعربي والإنجليزي مع ترجمة معتمدة للاسم.",
        budget: "5k-15k",
        name: "عبدالله القحطاني",
        phone: "0551234567",
        email: "abdullah@example.com",
        city: "الرياض",
        channel: "whatsapp",
      },
      steps: [["received", ago(12)], ["reviewing", ago(11)], ["in_progress", ago(9)], ["ready", ago(2)], ["delivered", ago(1)]],
      notes: { in_progress: "تم رفع الطلب للهيئة السعودية للملكية الفكرية" },
    },
    {
      data: {
        services: ["identity"],
        brand: "Lumen Clinic",
        notes: "Full identity: logo, palette and stationery.",
        budget: "5k-15k",
        deadline: ago(-14).slice(0, 10),
        name: "Sara Al-Harbi",
        phone: "0569876543",
        email: "sara@example.com",
        city: "Jeddah",
        channel: "email",
      },
      steps: [["received", ago(6)], ["reviewing", ago(5)], ["in_progress", ago(4)]],
      notes: { in_progress: "First logo concepts in progress" },
    },
    {
      data: {
        services: ["printing"],
        brand: "مطاعم ركن الشام",
        notes: "كروت شخصية × 500، مطبوعات مكتبية، ومنيو A4.",
        quantity: "500",
        budget: "1k-5k",
        name: "محمد الشامي",
        phone: "0533456789",
        city: "الدمام",
        channel: "call",
      },
      steps: [["received", ago(3)], ["reviewing", ago(2, 5)], ["in_progress", ago(1)], ["ready", ago(0, 3)]],
      notes: { ready: "جاهز للاستلام من الفرع" },
    },
    {
      data: {
        services: ["engineering-print", "binding"],
        brand: "مكتب الأفق الهندسي",
        notes: "مخططات A0 × 40 لوحة + تجليد نسختين.",
        quantity: "40",
        budget: "lt1k",
        name: "م. خالد العتيبي",
        phone: "0544567890",
        city: "الرياض",
        channel: "whatsapp",
      },
      steps: [["received", ago(0, 2)]],
    },
    {
      data: {
        services: ["doc-translation"],
        brand: "Gulf Trade Co.",
        notes: "Commercial register + articles of association, Arabic → English.",
        budget: "lt1k",
        name: "Omar Haddad",
        phone: "0501122334",
        email: "omar@example.com",
        city: "Riyadh",
        channel: "email",
      },
      steps: [["received", ago(1, 4)], ["reviewing", ago(0, 20)]],
    },
    {
      data: {
        services: ["advertising", "printing"],
        brand: "متجر نخلة",
        notes: "حملة افتتاح: رول أب × 2، بروشور، وهدايا بشعار المتجر.",
        budget: "gt15k",
        name: "نورة السبيعي",
        phone: "0587654321",
        email: "noura@example.com",
        city: "الخبر",
        channel: "whatsapp",
      },
      steps: [["received", ago(0, 5)]],
    },
    {
      data: {
        services: ["tm-registration"],
        brand: "زاد البيت",
        notes: "تسجيل علامة لمنتجات غذائية — الفئة 30.",
        budget: "1k-5k",
        name: "فهد الدوسري",
        phone: "0598765432",
        city: "الرياض",
        channel: "call",
      },
      steps: [["received", ago(8)], ["reviewing", ago(7)], ["cancelled", ago(6)]],
      notes: { cancelled: "ألغي بطلب العميل" },
    },
    {
      data: {
        services: ["identity", "printing"],
        brand: "Bloom Florist",
        notes: "Logo refresh + packaging stickers.",
        quantity: "1000",
        budget: "1k-5k",
        name: "Lama Alotaibi",
        phone: "0556677889",
        email: "lama@example.com",
        city: "Riyadh",
        channel: "whatsapp",
      },
      steps: [["received", ago(4)], ["reviewing", ago(3)], ["in_progress", ago(2)]],
    },
  ];

  const feedback = [
    {
      data: {
        type: "complaint",
        rating: 2,
        name: "سلطان المطيري",
        phone: "0512345678",
        orderCode: "",
        message: "تأخر تسليم المطبوعات يومين عن الموعد المتفق عليه.",
      },
      steps: [["received", ago(2)]],
    },
    {
      data: {
        type: "suggestion",
        rating: 4,
        name: "Reem",
        email: "reem@example.com",
        message: "It would be great to have online payment for printing orders.",
      },
      steps: [["received", ago(5)], ["in_progress", ago(4)]],
    },
    {
      data: {
        type: "praise",
        rating: 5,
        name: "أبو عبدالرحمن",
        phone: "0533221144",
        message: "خدمة ممتازة وسرعة في تسجيل العلامة، شكراً لكم.",
      },
      steps: [["received", ago(9)], ["resolved", ago(8)]],
    },
  ];

  const kyc = [
    {
      data: {
        name: "شركة سدرة للتجارة",
        contactName: "عبدالله القحطاني",
        phone: "0551234567",
        email: "abdullah@example.com",
        crNumber: "1010123456",
        city: "الرياض",
      },
      steps: [["reviewing", ago(1)]],
    },
    {
      data: {
        name: "Lumen Medical Co.",
        contactName: "Sara Al-Harbi",
        phone: "0569876543",
        email: "sara@example.com",
        crNumber: "4030654321",
        city: "Jeddah",
      },
      steps: [["reviewing", ago(6)], ["approved", ago(5)]],
    },
    {
      data: {
        name: "مؤسسة ركن الشام",
        contactName: "محمد الشامي",
        phone: "0533456789",
        crNumber: "2050987654",
        city: "الدمام",
      },
      steps: [["reviewing", ago(0, 6)]],
    },
  ];

  for (const o of orders) await seed("orders", o.data, o.steps, o.notes);
  for (const f of feedback) await seed("feedback", f.data, f.steps);
  for (const k of kyc) await seed("kyc", k.data, k.steps);
}
