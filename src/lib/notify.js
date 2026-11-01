import { INTEGRATIONS } from "../config/site";
import { getSettings, routeFor } from "../settings/core";

// wa.me link with a prefilled message — works with no API at all.
// `section` (orders | kyc | feedback | contact) picks the number configured for it in the dashboard.
export function whatsappLink(text, number, section) {
  number = number || routeFor(getSettings(), section).whatsapp;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

// Turns { label: value } into a readable multi-line message.
export function formatMessage(title, fields) {
  const lines = Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `• ${k}: ${v}`);
  return `${title}\n${lines.join("\n")}`;
}

async function sendWhatsAppApi(payload) {
  if (!INTEGRATIONS.whatsappApiUrl) return false;
  const res = await fetch(INTEGRATIONS.whatsappApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.ok;
}

async function sendEmail({ subject, message, replyTo, toEmail }) {
  const { serviceId, templateId, publicKey } = INTEGRATIONS.emailjs;
  if (!serviceId || !templateId || !publicKey) return false;
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: { subject, message, reply_to: replyTo || "", to_email: toEmail },
    }),
  });
  return res.ok;
}

export const integrationsReady = {
  whatsappApi: () => Boolean(INTEGRATIONS.whatsappApiUrl),
  email: () => Object.values(INTEGRATIONS.emailjs).every(Boolean),
};

/**
 * Notify the company about a new submission.
 * Tries the configured channels; returns which ones succeeded plus a wa.me fallback link
 * the UI can offer when nothing automatic is configured.
 */
export async function notifyCompany({ subject, fields, replyTo, section }) {
  const message = formatMessage(subject, fields);
  const route = routeFor(getSettings(), section);
  const sent = { whatsappApi: false, email: false };
  try {
    sent.whatsappApi = await sendWhatsAppApi({ to: route.whatsapp, message, subject });
  } catch {
    /* network / config issue — fall back */
  }
  try {
    sent.email = await sendEmail({ subject, message, replyTo, toEmail: route.email });
  } catch {
    /* network / config issue — fall back */
  }
  return { ...sent, fallbackLink: whatsappLink(message, route.whatsapp) };
}

// Message the customer (e.g. status change from the dashboard).
export async function notifyCustomer({ phone, message }) {
  const number = String(phone || "").replace(/\D/g, "").replace(/^0/, "966");
  let viaApi = false;
  try {
    viaApi = await sendWhatsAppApi({ to: number, message });
  } catch {
    /* fall back to link */
  }
  return { viaApi, link: number ? whatsappLink(message, number) : null };
}
