// Build-time config. Contact details, numbers and per-section routing are NOT here any more —
// they live in public/settings.json and are edited from the dashboard (src/settings/).

export const SITE = {
  // Public address of the site, no trailing slash (canonical links, share previews, sitemap).
  url: (import.meta.env.VITE_SITE_URL || "https://trademarks-sa.com").replace(/\/$/, ""),
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
  // Local development only: the dashboard password when there is no PHP API.
  // On the server the password lives in api/config.php.
  dashboardPin: import.meta.env.VITE_DASHBOARD_PIN || "2030",
};
