// Build-time config. Contact details, numbers and per-section routing are NOT here any more —
// they live in public/settings.json and are edited from the dashboard (src/settings/).

export const SITE = {
  url: "https://dynamicsa2008.github.io/ALZUBAIR",
};

export const INTEGRATIONS = {
  // Optional: your own endpoint that forwards to WhatsApp Cloud API (keeps the token server-side).
  whatsappApiUrl: import.meta.env.VITE_WHATSAPP_API_URL || "",
  // Optional: EmailJS (https://www.emailjs.com) — works from a static site.
  // The template should send to {{to_email}} so per-section emails from the dashboard apply.
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
  },
  // Dashboard PIN. This is a convenience lock for a static site, not real security.
  dashboardPin: import.meta.env.VITE_DASHBOARD_PIN || "2030",
};
