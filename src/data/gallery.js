import { SITE } from "../config/site";
import imgPrinting from "../assets/images/svc-printing.webp";
import imgEngineering from "../assets/images/svc-engineering-print.webp";
import imgBinding from "../assets/images/svc-binding.webp";
import imgAdvertising from "../assets/images/svc-advertising.webp";
import imgIdentity from "../assets/images/svc-identity.webp";
import f1 from "../assets/images/Feature1.jpg";
import f2 from "../assets/images/Feature2.jpg";

// Gallery categories. `service` is what the "order something like this" button preselects.
export const GALLERY_CATEGORIES = {
  cards: { ar: "كروت ومطبوعات مكتبية", en: "Cards & stationery", service: "printing" },
  packaging: { ar: "تغليف وعلب", en: "Packaging & boxes", service: "binding" },
  advertising: { ar: "دعاية ولوحات", en: "Advertising & signage", service: "advertising" },
  gifts: { ar: "هدايا دعائية", en: "Promotional gifts", service: "advertising" },
  engineering: { ar: "مخططات هندسية", en: "Engineering plans", service: "engineering-print" },
  binding: { ar: "تجليد وتقارير", en: "Binding & reports", service: "binding" },
  identity: { ar: "هويات بصرية", en: "Brand identities", service: "identity" },
  process: { ar: "كواليس الطباعة", en: "Behind the press", service: "printing" },
};

// Shown until the admin adds real work from the dashboard.
export const SAMPLE_ITEMS = [
  { id: "s1", kind: "image", src: imgPrinting, category: "process", title: { ar: "خط الطباعة الرقمية", en: "Digital print line" }, size: "tall" },
  { id: "s2", kind: "image", src: imgIdentity, category: "identity", title: { ar: "هوية بصرية متكاملة", en: "Complete visual identity" } },
  { id: "s3", kind: "image", src: imgAdvertising, category: "advertising", title: { ar: "حملة مطبوعات دعائية", en: "Promotional print campaign" } },
  { id: "s4", kind: "image", src: imgEngineering, category: "engineering", title: { ar: "مخططات بمقاسات كبيرة", en: "Large-format plans" }, size: "wide" },
  { id: "s5", kind: "image", src: imgBinding, category: "binding", title: { ar: "تجليد فاخر للتقارير", en: "Premium report binding" } },
  { id: "s6", kind: "image", src: f2, category: "cards", title: { ar: "مطبوعات مكتبية", en: "Office stationery" } },
  { id: "s7", kind: "image", src: f1, category: "packaging", title: { ar: "تغليف بهوية العلامة", en: "Branded packaging" } },
];

// Paths uploaded from the dashboard live on the published site; in local dev read them from there too.
export function mediaUrl(src) {
  if (!src) return "";
  if (/^(https?:|data:|blob:)/.test(src) || src.startsWith("/")) return src;
  return (import.meta.env.DEV ? `${SITE.url}/` : import.meta.env.BASE_URL) + src;
}

export function youtubeId(url) {
  const m = String(url || "").match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return m ? m[1] : null;
}

export const youtubeThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const youtubeEmbed = (id) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
