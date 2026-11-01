import {
  ShieldCheck,
  Languages,
  Printer,
  PenTool,
  DraftingCompass,
  BookOpen,
  Megaphone,
  FileCheck2,
} from "lucide-react";
import imgRegistration from "../assets/images/svc-tm-registration.webp";
import imgTmTranslation from "../assets/images/svc-tm-translation.webp";
import imgPrinting from "../assets/images/svc-printing.webp";
import imgIdentity from "../assets/images/svc-identity.webp";
import imgEngineering from "../assets/images/svc-engineering-print.webp";
import imgBinding from "../assets/images/svc-binding.webp";
import imgAdvertising from "../assets/images/svc-advertising.webp";
import imgDocTranslation from "../assets/images/svc-doc-translation.webp";

// Single source of truth for the company services — used by the services grid,
// the order form, the dashboard filters and the footer.
export const SERVICES = [
  {
    id: "tm-registration",
    icon: ShieldCheck,
    image: imgRegistration,
    name: { ar: "تسجيل العلامة التجارية", en: "Trademark registration" },
    blurb: {
      ar: "نتولى ملفك كاملاً أمام الهيئة السعودية للملكية الفكرية حتى صدور الشهادة.",
      en: "We handle your file end-to-end with SAIP until the certificate is issued.",
    },
  },
  {
    id: "tm-translation",
    icon: Languages,
    image: imgTmTranslation,
    name: { ar: "ترجمة العلامة التجارية المعتمدة", en: "Certified trademark translation" },
    blurb: {
      ar: "ترجمة معتمدة لاسم وشعار علامتك بما يوافق متطلبات التسجيل.",
      en: "Certified translation of your mark's name and logo, compliant with registration rules.",
    },
  },
  {
    id: "printing",
    icon: Printer,
    image: imgPrinting,
    name: { ar: "الطباعة الاحترافية للعلامة التجارية", en: "Professional brand printing" },
    blurb: {
      ar: "كروت، مطبوعات مكتبية، تغليف وبنرات بجودة ألوان ثابتة.",
      en: "Cards, stationery, packaging and banners with consistent colour quality.",
    },
  },
  {
    id: "identity",
    icon: PenTool,
    image: imgIdentity,
    name: { ar: "تصميم الهوية وبناء العلامة", en: "Brand identity design" },
    blurb: {
      ar: "شعار، ألوان، خطوط ودليل هوية متكامل يعكس شخصية مشروعك.",
      en: "Logo, colours, type and a full brand guide that fits your business.",
    },
  },
  {
    id: "engineering-print",
    icon: DraftingCompass,
    image: imgEngineering,
    name: { ar: "طباعة المخططات الهندسية", en: "Engineering plan printing" },
    blurb: {
      ar: "طباعة مخططات بمقاسات كبيرة بدقة عالية وتسليم سريع.",
      en: "Large-format plans printed precisely with fast turnaround.",
    },
  },
  {
    id: "binding",
    icon: BookOpen,
    image: imgBinding,
    name: { ar: "التجليد والتغليف الاحترافي", en: "Binding & packaging" },
    blurb: {
      ar: "تجليد فاخر للتقارير والكتيبات وتغليف يليق بمنتجك.",
      en: "Premium binding for reports and booklets, packaging that suits your product.",
    },
  },
  {
    id: "advertising",
    icon: Megaphone,
    image: imgAdvertising,
    name: { ar: "الدعاية والإعلان المتكاملة", en: "Advertising & promotion" },
    blurb: {
      ar: "حملات ومطبوعات دعائية وهدايا تحمل هويتك.",
      en: "Campaigns, promotional prints and branded gifts.",
    },
  },
  {
    id: "doc-translation",
    icon: FileCheck2,
    image: imgDocTranslation,
    name: { ar: "ترجمة الوثائق التجارية المعتمدة", en: "Certified business document translation" },
    blurb: {
      ar: "سجلات تجارية، عقود وشهادات بترجمة معتمدة لدى الجهات الرسمية.",
      en: "Commercial registers, contracts and certificates translated for official use.",
    },
  },
];

export const serviceById = (id) => SERVICES.find((s) => s.id === id);
