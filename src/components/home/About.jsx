import { Scale, Languages, Palette, Workflow, Handshake } from "lucide-react";
import teamImg from "../../assets/images/Feature3.jpg";
import { useI18n } from "../../i18n/I18nProvider";
import "./About.css";

const TEXT = {
  ar: {
    eyebrow: "من نحن؟",
    title: (
      <>
        مؤسسة متخصصة في <em>حماية العلامات</em> وبناء الهويات
      </>
    ),
    lead: "شركة الزبير مؤسسة متخصصة في تسجيل العلامة التجارية وترجمة العلامة التجارية وتصميم وبناء الهويات التجارية.",
    relyOn: "نعتمد على",
    items: [
      "فريق قانوني متخصص في إجراءات تسجيل العلامة التجارية",
      "مترجمين معتمدين بخبرة واسعة في ترجمة العلامة التجارية",
      "مصممين محترفين لبناء الهوية التجارية",
      "نظام إداري احترافي يضمن سرعة التنفيذ ودقة الإجراءات",
      "نهدف لأن نكون شريك نجاح استراتيجي لعملائنا، عبر تقديم خدمات سريعة، دقيقة، وبأسعار تنافسية مدروسة.",
    ],
    imgAlt: "فريق عمل شركة الزبير",
    badge: "فريق سعودي متكامل",
  },
  en: {
    eyebrow: "About us",
    title: (
      <>
        Specialists in <em>protecting brands</em> and building identities
      </>
    ),
    lead: "Al Zubair is specialised in trademark registration, trademark translation and brand identity design.",
    relyOn: "What we rely on",
    items: [
      "A legal team specialised in trademark registration procedures",
      "Certified translators with deep experience in trademark translation",
      "Professional designers who build brand identities",
      "A professional management system for fast, precise execution",
      "Our aim: to be a strategic success partner — fast, precise service at carefully considered prices.",
    ],
    imgAlt: "The Al Zubair team",
    badge: "A complete Saudi team",
  },
};

const ICONS = [Scale, Languages, Palette, Workflow, Handshake];

export default function About() {
  const { pick } = useI18n();
  const tx = pick(TEXT);
  return (
    <section id="about" className="section about">
      <div className="container split">
        <div className="about-copy">
          <header className="section-head start reveal">
            <span className="eyebrow">{tx.eyebrow}</span>
            <h2 className="section-title">{tx.title}</h2>
            <p className="section-lead">{tx.lead}</p>
          </header>
          <h3 className="about-rely reveal">{tx.relyOn}</h3>
          <ol className="about-list">
            {tx.items.map((item, i) => {
              const Icon = ICONS[i];
              return (
                <li key={i} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                  <span className="icon-bubble">
                    <Icon aria-hidden="true" />
                  </span>
                  <span>{item}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <figure className="about-media reveal">
          <div className="about-img">
            <img src={teamImg} alt={tx.imgAlt} loading="lazy" decoding="async" width="1024" height="1024" />
          </div>
          <span className="about-pattern" aria-hidden="true" />
          <figcaption className="about-badge">
            <span className="about-badge-z" aria-hidden="true">
              Z
            </span>
            {tx.badge}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
