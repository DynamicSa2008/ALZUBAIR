import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Globe, PackageSearch, ArrowLeft, Sparkles } from "lucide-react";
import logo from "../../assets/images/Alzubairlogo.png";
import { useI18n } from "../../i18n/I18nProvider";
import { useTheme } from "../../theme/ThemeProvider";
import { COMMON } from "../../i18n/common";

const SECTION_LINKS = [
  { key: "services", hash: "services" },
  { key: "works", hash: "works" },
  { key: "about", hash: "about" },
  { key: "partners", hash: "partners" },
  { key: "contact", hash: "contact" },
];

const PAGE_LINKS = [
  { key: "kyc", to: "/kyc" },
  { key: "feedback", to: "/feedback" },
];

export default function Header() {
  const { pick, toggleLang, l } = useI18n();
  const { theme } = useTheme();
  const tx = pick(COMMON);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [spied, setActive] = useState("");
  const active = isHome ? spied : "";
  const progressRef = useRef(null);

  // Solid on scroll, hide while scrolling down, reveal on scroll up, reading-progress line.
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        setHidden(y > 400 && y > last + 4);
        if (y < last - 4) setHidden(false);
        last = y;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy for home sections.
  useEffect(() => {
    if (!isHome) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    const t = setTimeout(() => {
      SECTION_LINKS.forEach(({ hash }) => {
        const el = document.getElementById(hash);
        if (el) io.observe(el);
      });
    }, 200);
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {theme.ribbon && (
        <div className="hdr-ribbon" role="note">
          <Sparkles size={14} strokeWidth={1.5} aria-hidden="true" />
          <span>{l(theme.ribbon)}</span>
        </div>
      )}
      <header
        className={`hdr ${scrolled || !isHome ? "is-solid" : ""} ${hidden && !open ? "is-hidden" : ""} ${theme.ribbon ? "has-ribbon" : ""}`}
      >
        <div className="hdr-shell">
          <Link to="/" className="hdr-logo" aria-label={tx.brandFull}>
            <img src={logo} alt={tx.brandFull} width="491" height="215" />
          </Link>

          <nav className="hdr-nav" aria-label={tx.nav.home}>
            <ul>
              {SECTION_LINKS.map(({ key, hash }) => (
                <li key={key}>
                  <Link
                    to={{ pathname: "/", hash }}
                    className={active === hash ? "is-active" : ""}
                    aria-current={active === hash ? "true" : undefined}
                  >
                    {tx.nav[key]}
                  </Link>
                </li>
              ))}
              {PAGE_LINKS.map(({ key, to }) => (
                <li key={key}>
                  <NavLink to={to} className={({ isActive }) => (isActive ? "is-active" : "")}>
                    {tx.nav[key]}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hdr-actions">
            <button type="button" className="hdr-lang" onClick={toggleLang} lang={tx.langSwitch === "English" ? "en" : "ar"}>
              <Globe size={16} strokeWidth={1.5} aria-hidden="true" />
              <span>{tx.langSwitch}</span>
            </button>
            <Link to="/track" className="hdr-track" title={tx.nav.track}>
              <PackageSearch size={18} strokeWidth={1.5} aria-hidden="true" />
              <span>{tx.nav.track}</span>
            </Link>
            <Link to="/order" className="btn btn-light btn-sm hdr-cta">
              {tx.nav.order}
              <ArrowLeft size={16} strokeWidth={1.5} className="flip-ltr" aria-hidden="true" />
            </Link>
            <button
              type="button"
              className="hdr-burger"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? tx.actions.close : "Menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
        <span className="hdr-progress" ref={progressRef} aria-hidden="true" />
      </header>

      <div id="mobile-menu" className={`hdr-sheet ${open ? "is-open" : ""}`} aria-hidden={!open} inert={!open}>
        <nav>
          <ul>
            {SECTION_LINKS.map(({ key, hash }, i) => (
              <li key={key} style={{ "--i": i }}>
                <Link to={{ pathname: "/", hash }} onClick={() => setOpen(false)}>
                  {tx.nav[key]}
                </Link>
              </li>
            ))}
            {[...PAGE_LINKS, { key: "track", to: "/track" }].map(({ key, to }, i) => (
              <li key={key} style={{ "--i": i + SECTION_LINKS.length }}>
                <Link to={to} onClick={() => setOpen(false)}>
                  {tx.nav[key]}
                </Link>
              </li>
            ))}
          </ul>
          <div className="hdr-sheet-foot">
            <Link to="/order" className="btn btn-light" onClick={() => setOpen(false)}>
              {tx.nav.order}
            </Link>
            <button type="button" className="btn btn-ghost hdr-sheet-lang" onClick={toggleLang}>
              <Globe size={16} strokeWidth={1.5} aria-hidden="true" />
              {tx.langSwitch}
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
