// Everything an admin can change from the dashboard → Site settings.
// The live copy is public/settings.json (fetched at runtime); these defaults are the fallback
// and the shape every settings file is merged onto.

export const DEFAULT_SETTINGS = {
  version: 1,
  contact: {
    phone: "+966549291853",
    whatsapp: "966549291853",
    email: "Info@trademarks-sa.com",
    address: {
      ar: "الرياض - حي الملز، شارع الستين - بجوار دوار الكويت",
      en: "Riyadh – Al Malaz, Al Sitteen St., next to Kuwait Roundabout",
    },
    mapUrl: "https://maps.google.com/?q=Riyadh+Al+Malaz+Al+Sitteen+Street",
    hours: { ar: "الأحد – الخميس، ٩ ص – ٦ م", en: "Sun – Thu, 9 AM – 6 PM" },
  },
  // Per-section destinations. Empty = use the main contact number/email.
  routing: {
    orders: { whatsapp: "", email: "" },
    kyc: { whatsapp: "", email: "" },
    feedback: { whatsapp: "", email: "" },
    contact: { whatsapp: "", email: "" },
  },
  social: { x: "", instagram: "", linkedin: "", snapchat: "", tiktok: "" },
  floating: { call: true, whatsapp: true },
  stats: [
    { value: 500, prefix: "+", suffix: "", label: { ar: "علامة مسجّلة", en: "Trademarks registered" } },
    { value: 1200, prefix: "+", suffix: "", label: { ar: "مشروع طباعة وتجليد", en: "Print & binding projects" } },
    { value: 300, prefix: "+", suffix: "", label: { ar: "ترجمة معتمدة", en: "Certified translations" } },
    { value: 98, prefix: "", suffix: "%", label: { ar: "رضا العملاء", en: "Client satisfaction" } },
  ],
  // Works gallery ("معرض أعمالنا"). Empty items → the section shows the bundled sample images.
  // src: a path inside the site (e.g. "gallery/box.webp", uploaded from the dashboard) or a full URL.
  gallery: {
    video: { kind: "", src: "", poster: "", title: { ar: "", en: "" } }, // kind: "youtube" | "file" | ""
    items: [],
  },
  activeTheme: "classic",
};

export const SECTION_KEYS = ["orders", "kyc", "feedback", "contact"];
