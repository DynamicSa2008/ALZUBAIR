import { useEffect } from "react";
import { SITE } from "../config/site";
import { useI18n } from "../i18n/I18nProvider";

// index.html ships static defaults for crawlers that don't run JS; this updates the same tags
// per page/language instead of appending duplicates.
function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

export default function Seo({ title, description, path = "/", noindex = false }) {
  const { lang } = useI18n();

  useEffect(() => {
    const brand = lang === "ar" ? "شركة الزبير" : "Al Zubair";
    const fullTitle = title ? `${title} | ${brand}` : brand;
    const url = SITE.url + (path === "/" ? "/" : `${path}/`);
    document.title = fullTitle;
    setMeta("name", "description", description);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:locale", lang === "ar" ? "ar_SA" : "en_US");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    setCanonical(url);
  }, [title, description, path, noindex, lang]);

  return null;
}
