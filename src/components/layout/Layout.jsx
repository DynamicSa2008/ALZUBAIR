import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import FloatingActions from "./FloatingActions";
import BackgroundSoul from "./BackgroundSoul";
import { useI18n } from "../../i18n/I18nProvider";
import { useRevealAll } from "../../lib/useReveal";
import "./layout.css";

// On navigation: jump to the #hash target if there is one, otherwise to the top.
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // wait a frame so lazily rendered sections exist
      const id = decodeURIComponent(hash.slice(1));
      const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 60);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
}

export default function Layout() {
  const { isAr } = useI18n();
  useRevealAll();
  return (
    <>
      <a href="#main" className="skip-link">
        {isAr ? "تخطَّ إلى المحتوى" : "Skip to content"}
      </a>
      <ScrollManager />
      <BackgroundSoul />
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
