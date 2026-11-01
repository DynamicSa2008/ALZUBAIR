import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, Rocket, Sparkles } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { SERVICES } from "../../data/services";
import { useSettings } from "../../settings/SettingsProvider";
import "./SaudiIdentity.css";

const TEXT = {
  ar: {
    eyebrow: "بروح سعودية",
    titleA: "علامتك.. ",
    titleEm: "بهوية سعودية",
    lead: "من الفكرة إلى رفوف السوق، نرافق مشروعك في كل محطة: نصمّم هويته، نسجّله لدى الهيئة السعودية للملكية الفكرية، نترجمه ترجمة معتمدة، ثم نطبعه ليصل إلى عملائك بثقة.",
    journey: "رحلة العلامة",
    stages: [
      { title: "فكرة", desc: "نستمع لقصتك ونحوّل فكرتك إلى اسم ورسالة واضحة." },
      { title: "هوية", desc: "شعار وألوان وخطوط تعكس أصالتك وتنافس بثقة." },
      {
        title: "تسجيل لدى الهيئة السعودية للملكية الفكرية",
        desc: "نحمي علامتك رسمياً ونتابع ملفك حتى صدور الشهادة.",
      },
      { title: "ترجمة معتمدة", desc: "ترجمة دقيقة لاسم علامتك وشعارها وفق متطلبات التسجيل." },
      { title: "طباعة وانطلاق للسوق", desc: "مطبوعات وتغليف ولوحات تُطلق علامتك أمام عملائك." },
    ],
    visionTitle: "طموح يواكب رؤية 2030",
    vision:
      "نؤمن بأن كل علامة سعودية ناشئة إضافةٌ لاقتصاد وطني متنوّع ومزدهر. لذلك نواكب طموحات رؤية المملكة 2030 في دعم ريادة الأعمال والمحتوى المحلي، ونقدّم لروّاد الأعمال رحلة متكاملة تحت سقف واحد.",
    start: "ابدأ رحلة علامتك",
    design: "صمّم هويتك",
    statsLabel: "أرقامنا",
  },
  en: {
    eyebrow: "Saudi at heart",
    titleA: "Your brand, ",
    titleEm: "with a Saudi identity",
    lead: "From idea to shelf, we walk with your business at every stop: we design its identity, register it with the Saudi Authority for Intellectual Property, translate it with certified accuracy, then print it so it reaches your customers with confidence.",
    journey: "The brand journey",
    stages: [
      { title: "Idea", desc: "We listen to your story and shape it into a clear name and message." },
      { title: "Identity", desc: "Logo, colours and type that carry your roots and compete with confidence." },
      {
        title: "Registration with SAIP",
        desc: "We protect your mark officially and follow the file until the certificate is issued.",
      },
      { title: "Certified translation", desc: "Accurate translation of your mark's name and logo to registration standards." },
      { title: "Print & go to market", desc: "Prints, packaging and signage that launch your brand to customers." },
    ],
    visionTitle: "Ambition in step with Vision 2030",
    vision:
      "Every new Saudi brand adds to a diverse, thriving national economy. That is why we keep pace with the ambitions of the Kingdom's Vision 2030 to support entrepreneurship and local content — offering founders an end-to-end journey under one roof.",
    start: "Start your brand journey",
    design: "Design your identity",
    statsLabel: "Our numbers",
  },
};

const svcIcon = (id) => SERVICES.find((s) => s.id === id)?.icon ?? Sparkles;
const STAGE_ICONS = [
  Lightbulb,
  svcIcon("identity"),
  svcIcon("tm-registration"),
  svcIcon("tm-translation"),
  Rocket,
];

// Journey path: nodes sit at the centres of a 5-column grid (10%, 30% … 90%).
const NODES = [
  [100, 40],
  [300, 100],
  [500, 40],
  [700, 100],
  [900, 40],
];
const JOURNEY_D =
  "M0 70 C 40 70, 55 40, 100 40 C 200 40, 200 100, 300 100 S 400 40, 500 40 S 600 100, 700 100 S 800 40, 900 40 C 945 40, 960 70, 1000 70";

/* Najdi skyline: mud-brick walls with triangular crenellations and vents, plus palms. */
function building(x0, x1, top, tooth = 14, door = false) {
  let d = `M${x0} 160 V${top}`;
  for (let x = x0; x + tooth <= x1 + 0.1; x += tooth) {
    d += ` L${x + tooth / 2} ${top - tooth * 0.8} L${x + tooth} ${top}`;
  }
  d += ` V160 M${x0} ${top + 9} H${x1}`;
  for (let x = x0 + 14; x + 12 <= x1 - 10; x += 26) d += ` M${x} ${top + 32} l6 -9 l6 9 Z`;
  if (door) {
    const m = (x0 + x1) / 2;
    d += ` M${m - 11} 160 V128 l11 -11 l11 11 V160`;
  }
  return d;
}
function palm(x) {
  return [
    `M${x} 160 Q${x + 7} 112 ${x + 2} 72`,
    `M${x + 2} 72 Q${x - 26} 58 ${x - 44} 84`,
    `M${x + 2} 72 Q${x - 22} 46 ${x - 40} 42`,
    `M${x + 2} 72 Q${x + 4} 48 ${x + 14} 34`,
    `M${x + 2} 72 Q${x + 30} 46 ${x + 48} 46`,
    `M${x + 2} 72 Q${x + 32} 62 ${x + 46} 90`,
  ].join(" ");
}
const SKYLINE = [
  "M0 160 H1200",
  building(30, 254, 78, 14, true),
  building(270, 340, 34, 14),
  building(356, 594, 92, 14, true),
  palm(640),
  building(700, 896, 62, 14, true),
  building(910, 980, 24, 14),
  palm(1030),
  building(1080, 1192, 96, 14),
];

function SaduBand({ id, className = "" }) {
  return (
    <svg className={`sa-band ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" className="sa-s0" />
          <rect y="0" width="40" height="3" className="sa-s1" />
          <rect y="37" width="40" height="3" className="sa-s1" />
          <polygon points="0,3 10,13 20,3" className="sa-s3" />
          <polygon points="20,3 30,13 40,3" className="sa-s2" />
          <polygon points="0,37 10,27 20,37" className="sa-s2" />
          <polygon points="20,37 30,27 40,37" className="sa-s3" />
          <polygon points="20,11 29,20 20,29 11,20" className="sa-s1" />
          <polygon points="20,15.5 24.5,20 20,24.5 15.5,20" className="sa-s0" />
          <polygon points="0,16 4,20 0,24" className="sa-s2" />
          <polygon points="40,16 36,20 40,24" className="sa-s2" />
        </pattern>
      </defs>
      <rect width="100%" height="40" fill={`url(#${id})`} />
    </svg>
  );
}

function prefersReduced() {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export default function SaudiIdentity() {
  const { pick, lang, l } = useI18n();
  const stats = useSettings().settings.stats;
  const tx = pick(TEXT);
  const raw = useId();
  const uid = raw.replace(/[^a-zA-Z0-9_-]/g, "");
  const ref = useRef(null);
  const [reduced] = useState(prefersReduced);
  const [inView, setInView] = useState(() => typeof IntersectionObserver === "undefined");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Count-up once the section is visible.
  useEffect(() => {
    if (!inView || reduced) return;
    let raf = 0;
    let start = 0;
    const DURATION = 1800;
    const tick = (t) => {
      if (!start) start = t;
      const k = Math.min(1, (t - start) / DURATION);
      setProgress(k);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced]);

  const shown = reduced ? 1 : progress;
  const eased = 1 - Math.pow(1 - shown, 3);
  const nf = new Intl.NumberFormat(lang === "ar" ? "ar-SA-u-nu-latn" : "en-GB");

  return (
    <section
      id="saudi"
      ref={ref}
      className="section sa"
      data-on={inView || reduced}
      aria-labelledby={`${uid}-title`}
    >
      <SaduBand id={`${uid}-sadu-a`} className="sa-band-top" />
      <svg className="sa-lattice" aria-hidden="true" focusable="false">
        <defs>
          <pattern id={`${uid}-lat`} width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M28 4 L52 28 L28 52 L4 28 Z M28 18 L38 28 L28 38 L18 28 Z" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${uid}-lat)`} />
      </svg>

      <div className="container sa-inner">
        <header className="section-head">
          <span className="eyebrow">
            <Sparkles size={16} strokeWidth={1.5} aria-hidden="true" />
            {tx.eyebrow}
          </span>
          <h2 className="section-title" id={`${uid}-title`}>
            {tx.titleA}
            <em>{tx.titleEm}</em>
          </h2>
          <p className="section-lead">{tx.lead}</p>
        </header>

        <div className="sa-journey">
          <svg className="sa-path" viewBox="0 0 1000 140" aria-hidden="true" focusable="false">
            <path d={JOURNEY_D} className="sa-path-ghost" />
            <path d={JOURNEY_D} className="sa-path-line" pathLength="1" />
            {NODES.map(([x, y], i) => (
              <g key={i} className="sa-node" style={{ "--i": i, transformOrigin: `${x}px ${y}px` }}>
                <rect x={x - 13} y={y - 13} width="26" height="26" rx="4" transform={`rotate(45 ${x} ${y})`} />
                <rect
                  x={x - 5}
                  y={y - 5}
                  width="10"
                  height="10"
                  rx="1.5"
                  className="sa-node-core"
                  transform={`rotate(45 ${x} ${y})`}
                />
              </g>
            ))}
          </svg>

          <ol className="sa-stages" aria-label={tx.journey}>
            {tx.stages.map((s, i) => {
              const Icon = STAGE_ICONS[i];
              return (
                <li key={i} className="sa-stage" style={{ "--i": i }}>
                  <span className="sa-stage-dot" aria-hidden="true" />
                  <div className="sa-stage-top">
                    <span className="sa-stage-num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="sa-stage-icon" aria-hidden="true">
                      <Icon size={22} strokeWidth={1.5} />
                    </span>
                  </div>
                  <h3 className="sa-stage-title">{s.title}</h3>
                  <p className="sa-stage-desc">{s.desc}</p>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="split sa-bottom">
          <div className="sa-vision">
            <h3 className="sa-vision-title">{tx.visionTitle}</h3>
            <p>{tx.vision}</p>
            <div className="sa-actions">
              <Link to="/order?service=tm-registration" className="btn btn-light">
                {tx.start}
                <ArrowRight size={18} strokeWidth={1.5} className="flip-rtl" aria-hidden="true" />
              </Link>
              <Link to="/order?service=identity" className="btn btn-ghost sa-ghost">
                {tx.design}
              </Link>
            </div>
          </div>

          {/* Figures are edited from the dashboard → Site settings → Numbers */}
          <dl className="sa-stats" aria-label={tx.statsLabel}>
            {stats.map((s, i) => (
              <div key={i} className="sa-stat" style={{ "--i": i }}>
                <dt>{l(s.label)}</dt>
                <dd>
                  <span dir="ltr">
                    {s.prefix}
                    {nf.format(Math.round(s.value * eased))}
                    {s.suffix}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <svg className="sa-skyline" viewBox="0 0 1200 160" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
        {SKYLINE.map((d, i) => (
          <path key={i} d={d} pathLength="1" style={{ "--i": i }} />
        ))}
      </svg>
      <SaduBand id={`${uid}-sadu-b`} className="sa-band-bottom" />
    </section>
  );
}
