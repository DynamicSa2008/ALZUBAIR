import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowUpRight, PackageSearch, ShieldCheck, MessageSquareHeart, ArrowUp } from "lucide-react";
import logo from "../../assets/images/Alzubairlogo.png";
import { useI18n } from "../../i18n/I18nProvider";
import { COMMON } from "../../i18n/common";
import { useSettings } from "../../settings/SettingsProvider";
import { formatPhone } from "../../settings/core";
import { SERVICES } from "../../data/services";
import { WhatsAppIcon, SocialIcon, SOCIAL_NAMES } from "../icons";

const TEXT = {
  ar: {
    ctaTitle: "جاهز تنطلق بعلامتك؟",
    ctaLead: "من الفكرة حتى الشهادة والمطبوعات، فريق الزبير معك خطوة بخطوة.",
    about:
      "شركة سعودية متخصصة في تسجيل وترجمة العلامات التجارية وبناء الهويات والطباعة والدعاية والإعلان.",
    services: "خدماتنا",
    quick: "روابط سريعة",
    contact: "تواصل معنا",
    madeIn: "صُنع بشغف في الرياض",
    toTop: "العودة للأعلى",
  },
  en: {
    ctaTitle: "Ready to launch your brand?",
    ctaLead: "From the idea to the certificate and the prints — Al Zubair is with you every step.",
    about:
      "A Saudi company specialised in trademark registration and translation, brand identity, printing and advertising.",
    services: "Services",
    quick: "Quick links",
    contact: "Contact",
    madeIn: "Made with care in Riyadh",
    toTop: "Back to top",
  },
};

export default function Footer() {
  const { pick, l } = useI18n();
  const tx = pick(TEXT);
  const c = pick(COMMON);
  const { settings } = useSettings();
  const { contact } = settings;
  const socials = Object.entries(settings.social).filter(([name, url]) => url && SOCIAL_NAMES.includes(name));

  return (
    <footer className="ftr">
      <div className="container">
        <div className="ftr-cta reveal">
          <div>
            <h2>{tx.ctaTitle}</h2>
            <p>{tx.ctaLead}</p>
          </div>
          <div className="ftr-cta-actions">
            <Link to="/order" className="btn btn-light">
              {c.nav.order}
            </Link>
            <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn ftr-wa">
              <WhatsAppIcon size={18} />
              {c.actions.whatsapp}
            </a>
          </div>
        </div>

        <div className="ftr-grid">
          <div className="ftr-brand">
            <img src={logo} alt={c.brandFull} width="491" height="215" loading="lazy" />
            <p>{tx.about}</p>
            {socials.length > 0 && (
              <ul className="ftr-social">
                {socials.map(([name, url]) => (
                  <li key={name}>
                    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={name}>
                      <SocialIcon name={name} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3>{tx.services}</h3>
            <ul className="ftr-links">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link to={`/order?service=${s.id}`}>{l(s.name)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>{tx.quick}</h3>
            <ul className="ftr-links">
              <li>
                <Link to={{ pathname: "/", hash: "about" }}>{c.nav.about}</Link>
              </li>
              <li>
                <Link to={{ pathname: "/", hash: "works" }}>{c.nav.works}</Link>
              </li>
              <li>
                <Link to="/track">
                  <PackageSearch size={16} strokeWidth={1.5} aria-hidden="true" />
                  {c.nav.track}
                </Link>
              </li>
              <li>
                <Link to="/kyc">
                  <ShieldCheck size={16} strokeWidth={1.5} aria-hidden="true" />
                  {c.nav.kyc}
                </Link>
              </li>
              <li>
                <Link to="/feedback">
                  <MessageSquareHeart size={16} strokeWidth={1.5} aria-hidden="true" />
                  {c.nav.feedback}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3>{tx.contact}</h3>
            <ul className="ftr-contact">
              <li>
                <span className="ftr-ico">
                  <Phone size={16} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <a href={`tel:${contact.phone}`} className="ltr">
                  {formatPhone(contact.phone)}
                </a>
              </li>
              <li>
                <span className="ftr-ico">
                  <WhatsAppIcon size={16} />
                </span>
                <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  {c.actions.whatsapp}
                </a>
              </li>
              <li>
                <span className="ftr-ico">
                  <Mail size={16} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <a href={`mailto:${contact.email}`} className="ltr">
                  {contact.email}
                </a>
              </li>
              <li>
                <span className="ftr-ico">
                  <MapPin size={16} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer">
                  {l(contact.address)}
                  <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" className="ftr-ext" />
                </a>
              </li>
            </ul>
            <p className="ftr-hours">{l(contact.hours)}</p>
          </div>
        </div>

        <div className="ftr-bottom">
          <span>
            © {new Date().getFullYear()} {c.rights}
          </span>
          <span className="ftr-made">{tx.madeIn}</span>
          <button type="button" className="ftr-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <ArrowUp size={16} strokeWidth={1.5} aria-hidden="true" />
            {tx.toTop}
          </button>
        </div>
      </div>
    </footer>
  );
}
