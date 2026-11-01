// Option keys + labels shared by the order wizard, tracking page and dashboard.

export const BUDGETS = ["lt1k", "1k-5k", "5k-15k", "gt15k", "unsure"];
export const CHANNELS = ["whatsapp", "email", "call"];

export const OPTION_LABELS = {
  ar: {
    budgets: {
      lt1k: "أقل من ١٬٠٠٠ ر.س",
      "1k-5k": "١٬٠٠٠ – ٥٬٠٠٠ ر.س",
      "5k-15k": "٥٬٠٠٠ – ١٥٬٠٠٠ ر.س",
      gt15k: "أكثر من ١٥٬٠٠٠ ر.س",
      unsure: "غير محدد",
    },
    channels: { whatsapp: "واتساب", email: "البريد الإلكتروني", call: "اتصال هاتفي" },
  },
  en: {
    budgets: {
      lt1k: "Under SAR 1,000",
      "1k-5k": "SAR 1,000 – 5,000",
      "5k-15k": "SAR 5,000 – 15,000",
      gt15k: "Over SAR 15,000",
      unsure: "Not sure yet",
    },
    channels: { whatsapp: "WhatsApp", email: "Email", call: "Phone call" },
  },
};

// Statuses per collection. Orders use COMMON.status labels; KYC & feedback have their own.
export const KYC_STATUSES = ["reviewing", "approved", "rejected"];
export const FEEDBACK_STATUSES = ["received", "in_progress", "resolved"];

export const EXTRA_STATUS = {
  ar: {
    reviewing: "قيد المراجعة",
    approved: "معتمد",
    rejected: "مرفوض",
    received: "تم الاستلام",
    in_progress: "قيد المعالجة",
    resolved: "تم الحل",
    pending: "بانتظار المراجعة",
  },
  en: {
    reviewing: "Under review",
    approved: "Approved",
    rejected: "Rejected",
    received: "Received",
    in_progress: "In progress",
    resolved: "Resolved",
    pending: "Pending",
  },
};
