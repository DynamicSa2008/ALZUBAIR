import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Expand } from "lucide-react";
import { SERVICES } from "../../data/services";
import { useI18n } from "../../i18n/I18nProvider";
import Lightbox from "../Lightbox";
import "./Services.css";

const TEXT = {
  ar: {
    eyebrow: "خدماتنا",
    title: (
      <>
        حلول متكاملة <em>لعلامتك التجارية</em>
      </>
    ),
    lead: "نقدم حلولاً متكاملة في تسجيل العلامة التجارية وترجمتها باحترافية عالية، وسرعة تنفيذ، وإجراءات دقيقة تضمن لك الانطلاق بثقة في السوق المحلي والدولي.",
    order: "اطلب الخدمة",
    view: "عرض الصورة",
  },
  en: {
    eyebrow: "Our services",
    title: (
      <>
        Complete solutions <em>for your brand</em>
      </>
    ),
    lead: "End-to-end trademark registration and translation — professional, fast and precise, so you can launch with confidence locally and internationally.",
    order: "Request",
    view: "View image",
  },
};

export default function Services() {
  const { pick, l } = useI18n();
  const tx = pick(TEXT);
  const [lightbox, setLightbox] = useState(null);
  const gallery = SERVICES.map((s) => ({ src: s.image, alt: l(s.name), caption: l(s.name) }));

  return (
    <section id="services" className="section svc">
      <div className="container">
        <header className="section-head reveal">
          <span className="eyebrow">{tx.eyebrow}</span>
          <h2 className="section-title">{tx.title}</h2>
          <p className="section-lead">{tx.lead}</p>
        </header>

        <ul className="svc-grid">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <li key={s.id} className="svc-card reveal" style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
                <button type="button" className="svc-media" onClick={() => setLightbox(i)} aria-label={`${tx.view}: ${l(s.name)}`}>
                  <img src={s.image} alt={l(s.name)} loading="lazy" decoding="async" width="640" height="512" />
                  <span className="svc-zoom" aria-hidden="true">
                    <Expand size={18} strokeWidth={1.5} />
                  </span>
                </button>
                <div className="svc-body">
                  <span className="icon-bubble">
                    <Icon aria-hidden="true" />
                  </span>
                  <h3>{l(s.name)}</h3>
                  <p>{l(s.blurb)}</p>
                  <Link to={`/order?service=${s.id}`} className="svc-link">
                    {tx.order}
                    <ArrowLeft size={16} strokeWidth={1.5} className="flip-ltr" aria-hidden="true" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <Lightbox items={gallery} index={lightbox} onChange={setLightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
