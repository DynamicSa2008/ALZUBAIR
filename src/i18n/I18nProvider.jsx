import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Each component keeps its own copy as `const TEXT = { ar: {...}, en: {...} }`
// and reads it with `pick(TEXT)`; strings shared across the site live in i18n/common.js.

const STORAGE_KEY = "alzubair.lang";
const I18nContext = createContext(null);

function initialLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ar" || stored === "en") return stored;
  } catch {
    /* storage unavailable */
  }
  return "ar";
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
  }, [lang, dir]);

  const value = useMemo(() => {
    const setLang = (next) => {
      setLangState(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* storage unavailable */
      }
    };
    return {
      lang,
      dir,
      isAr: lang === "ar",
      setLang,
      toggleLang: () => setLang(lang === "ar" ? "en" : "ar"),
      pick: (bundle) => bundle[lang] ?? bundle.ar,
      // For data objects shaped like { ar: "...", en: "..." }.
      l: (field) => (field && typeof field === "object" ? (field[lang] ?? field.ar) : field),
      formatDate: (iso, opts) =>
        new Date(iso).toLocaleString(lang === "ar" ? "ar-SA-u-nu-latn" : "en-GB", {
          dateStyle: "medium",
          ...opts,
        }),
    };
  }, [lang, dir]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
