import { useI18n } from "../../i18n/I18nProvider";
import "./Partners.css";

// Every slogan*.jpeg in the images folder is a partner logo — drop a new file in to add one.
const LOGOS = Object.entries(import.meta.glob("../../assets/images/slogan*.jpeg", { eager: true, import: "default" }))
  .sort(([a], [b]) => Number(a.match(/(\d+)\./)[1]) - Number(b.match(/(\d+)\./)[1]))
  .map(([, src]) => src);

const TEXT = {
  ar: {
    eyebrow: "شركاء النجاح",
    title: (
      <>
        نفخر بثقة <em>شركائنا</em>
      </>
    ),
    lead: "عملاء وشركاء استراتيجيون اختارونا لإدارة ملفات تسجيل علاماتهم التجارية وبناء هوياتهم.",
    stat: "علامة وثقت بنا",
    alt: "شعار شريك نجاح",
  },
  en: {
    eyebrow: "Success partners",
    title: (
      <>
        Proud of our <em>partners'</em> trust
      </>
    ),
    lead: "Clients and strategic partners who chose us to manage their trademark files and build their identities.",
    stat: "brands trust us",
    alt: "Partner logo",
  },
};

function Row({ logos, reverse, alt }) {
  // The list is rendered twice so the loop is seamless.
  return (
    <div className={`ptn-row ${reverse ? "is-reverse" : ""}`} dir="ltr">
      <ul className="ptn-track">
        {[...logos, ...logos].map((src, i) => (
          <li key={i} className="ptn-logo" aria-hidden={i >= logos.length}>
            <img src={src} alt={i < logos.length ? `${alt} ${i + 1}` : ""} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Partners() {
  const { pick } = useI18n();
  const tx = pick(TEXT);
  const half = Math.ceil(LOGOS.length / 2);
  return (
    <section id="partners" className="section ptn">
      <div className="container ptn-head reveal">
        <header className="section-head start">
          <span className="eyebrow">{tx.eyebrow}</span>
          <h2 className="section-title">{tx.title}</h2>
          <p className="section-lead">{tx.lead}</p>
        </header>
        <div className="ptn-stat">
          <strong className="ltr">+{LOGOS.length}</strong>
          <span>{tx.stat}</span>
        </div>
      </div>
      <div className="ptn-marquee reveal">
        <Row logos={LOGOS.slice(0, half)} alt={tx.alt} />
        <Row logos={LOGOS.slice(half)} reverse alt={tx.alt} />
      </div>
    </section>
  );
}
