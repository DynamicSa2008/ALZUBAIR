// Occasion themes. Each one overrides the CSS custom properties defined in styles/base.css.
// `decor` picks the ornament layer drawn by <BackgroundSoul /> and the header ribbon.

export const THEMES = {
  classic: {
    name: { ar: "الهوية الأساسية", en: "Classic identity" },
    decor: "sadu",
    vars: {
      "--brand": "#c52330",
      "--brand-strong": "#9e1b26",
      "--brand-soft": "#fdecee",
      "--accent": "#c9a24a",
      "--ink": "#1b1b1f",
      "--bg": "#fbf8f6",
    },
  },
  nationalDay: {
    name: { ar: "اليوم الوطني", en: "Saudi National Day" },
    decor: "national",
    ribbon: { ar: "كل عام والوطن بخير — اليوم الوطني السعودي", en: "Happy Saudi National Day" },
    vars: {
      "--brand": "#0a6b3c",
      "--brand-strong": "#064d2b",
      "--brand-soft": "#e6f4ec",
      "--accent": "#c9a24a",
      "--ink": "#13221a",
      "--bg": "#f7faf8",
    },
  },
  foundingDay: {
    name: { ar: "يوم التأسيس", en: "Founding Day" },
    decor: "founding",
    ribbon: { ar: "يوم بدينا — ذكرى يوم التأسيس", en: "Founding Day — the day we began" },
    vars: {
      "--brand": "#7b4a26",
      "--brand-strong": "#5a341a",
      "--brand-soft": "#f6ece2",
      "--accent": "#b8893f",
      "--ink": "#2a1d14",
      "--bg": "#fbf6f0",
    },
  },
  ramadan: {
    name: { ar: "رمضان", en: "Ramadan" },
    decor: "ramadan",
    ribbon: { ar: "رمضان كريم — تقبّل الله منا ومنكم", en: "Ramadan Kareem" },
    vars: {
      "--brand": "#1f3a63",
      "--brand-strong": "#142744",
      "--brand-soft": "#e9eef6",
      "--accent": "#d4a537",
      "--ink": "#141a26",
      "--bg": "#f7f8fb",
    },
  },
  eid: {
    name: { ar: "العيد", en: "Eid" },
    decor: "eid",
    ribbon: { ar: "عيدكم مبارك — كل عام وأنتم بخير", en: "Eid Mubarak" },
    vars: {
      "--brand": "#0f6e6a",
      "--brand-strong": "#0a4f4c",
      "--brand-soft": "#e6f3f2",
      "--accent": "#d9a441",
      "--ink": "#122120",
      "--bg": "#f7fbfa",
    },
  },
};

export const THEME_KEYS = Object.keys(THEMES);
