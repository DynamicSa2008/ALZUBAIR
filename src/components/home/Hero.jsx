import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Languages, PenTool, Printer, BadgeCheck, Clock3, Sparkles } from "lucide-react";
import heroImg from "../../assets/images/about.webp";
import { useI18n } from "../../i18n/I18nProvider";
import "./Hero.css";

const TEXT = {
  ar: {
    eyebrow: "شريكك المعتمد للعلامات التجارية في المملكة",
    titleA: "نحمي علامتك..",
    titleB: "و",
    words: ["نسجّلها", "نترجمها", "نصمّمها", "نطبعها"],
    lead: "في شركة الزبير نعمل وفق رؤية استراتيجية واضحة لنكون الشريك المعتمد لكل من يسعى إلى حماية علامته التجارية وتعزيز قيمتها السوقية.",
    primary: "اطلب خدمتك الآن",
    secondary: "استكشف خدماتنا",
    trust: ["إجراءات معتمدة لدى الهيئة السعودية للملكية الفكرية", "متابعة لحظية لطلبك", "تنفيذ سريع ودقيق"],
    chips: ["تسجيل", "ترجمة معتمدة", "هوية بصرية", "طباعة"],
    badge: "متابعة الطلب أونلاين",
  },
  en: {
    eyebrow: "Your trusted trademark partner in Saudi Arabia",
    titleA: "We protect your brand —",
    titleB: "and ",
    words: ["register it", "translate it", "design it", "print it"],
    lead: "Al Zubair works with a clear strategic vision: to be the trusted partner for everyone who wants to protect their trademark and grow its market value.",
    primary: "Request a service",
    secondary: "Explore services",
    trust: ["SAIP-compliant procedures", "Live order tracking", "Fast, precise delivery"],
    chips: ["Registration", "Certified translation", "Identity", "Printing"],
    badge: "Track your order online",
  },
};

const CHIP_ICONS = [ShieldCheck, Languages, PenTool, Printer];
const TRUST_ICONS = [BadgeCheck, Clock3, Sparkles];

export default function Hero() {
  const { pick } = useI18n();
  const tx = pick(TEXT);
  const [word, setWord] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setWord((w) => (w + 1) % tx.words.length), 2400);
    return () => clearInterval(id);
  }, [tx.words.length]);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true">
        <span className="hero-ring hero-ring-1" />
        <span className="hero-ring hero-ring-2" />
        <span className="hero-sadu" />
      </div>

      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="hero-eyebrow">
            <span className="hero-dot" />
            {tx.eyebrow}
          </span>
          <h1 id="hero-title" className="hero-title">
            <span>{tx.titleA}</span>
            <span className="hero-rotator">
              {tx.titleB}
              <span className="hero-words" aria-live="polite">
                {tx.words.map((w, i) => (
                  <span key={w} className={i === word ? "is-current" : ""} aria-hidden={i !== word}>
                    {w}
                  </span>
                ))}
              </span>
            </span>
          </h1>
          <p className="hero-lead">{tx.lead}</p>
          <div className="hero-cta">
            <Link to="/order" className="btn btn-light">
              {tx.primary}
              <ArrowLeft size={18} strokeWidth={1.5} className="flip-ltr" aria-hidden="true" />
            </Link>
            <Link to={{ pathname: "/", hash: "services" }} className="btn hero-ghost">
              {tx.secondary}
            </Link>
          </div>
          <ul className="hero-trust">
            {tx.trust.map((t, i) => {
              const Icon = TRUST_ICONS[i];
              return (
                <li key={t}>
                  <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                  {t}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-frame">
            <img src={heroImg} alt="" width="640" height="480" fetchPriority="high" />
            <span className="hero-frame-shine" />
          </div>
          {tx.chips.map((c, i) => {
            const Icon = CHIP_ICONS[i];
            return (
              <span key={c} className={`hero-chip hero-chip-${i + 1}`}>
                <span className="hero-chip-ico">
                  <Icon size={16} strokeWidth={1.5} />
                </span>
                {c}
              </span>
            );
          })}
          <div className="hero-track-card">
            <span className="hero-track-code ltr">ZB-7K2Q9M</span>
            <span className="hero-track-label">{tx.badge}</span>
            <span className="hero-track-bar">
              <span />
            </span>
          </div>
        </div>
      </div>

    </section>
  );
}
