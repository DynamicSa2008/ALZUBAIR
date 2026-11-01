import { Users, Award, BadgePercent, Layers } from "lucide-react";
import f1 from "../../assets/images/Feature1.jpg";
import f2 from "../../assets/images/Feature2.jpg";
import f4 from "../../assets/images/Feature4.jpg";
import fPrint from "../../assets/images/svc-identity.webp";
import { useI18n } from "../../i18n/I18nProvider";
import "./Features.css";

const TEXT = {
  ar: {
    eyebrow: "ما يميزنا",
    title: (
      <>
        ما الذي يميز <em>شركة الزبير</em>؟
      </>
    ),
    items: [
      ["فريق عمل احترافي", "خبراء قانونيون ومترجمون ومصممون يعملون بتناغم كامل."],
      ["الخبرة المتخصصة", "سنوات من الخبرة في تسجيل العلامة التجارية وترجمتها."],
      ["أسعار تنافسية مدروسة", "نوازن بين الجودة العالية والتكلفة المناسبة."],
      ["خدمات متكاملة", "من تسجيل العلامة التجارية إلى بناء الهوية والتصميم والطباعة."],
    ],
  },
  en: {
    eyebrow: "What sets us apart",
    title: (
      <>
        What makes <em>Al Zubair</em> different?
      </>
    ),
    items: [
      ["A professional team", "Legal experts, translators and designers working in harmony."],
      ["Specialised experience", "Years of experience in trademark registration and translation."],
      ["Considered pricing", "We balance high quality with fair cost."],
      ["Integrated services", "From registration to identity, design and printing."],
    ],
  },
};

const IMAGES = [f4, f2, f1, fPrint];
const ICONS = [Users, Award, BadgePercent, Layers];

export default function Features() {
  const { pick } = useI18n();
  const tx = pick(TEXT);
  return (
    <section className="section feat">
      <div className="container">
        <header className="section-head reveal">
          <span className="eyebrow">{tx.eyebrow}</span>
          <h2 className="section-title">{tx.title}</h2>
        </header>
        <ul className="feat-grid">
          {tx.items.map(([title, desc], i) => {
            const Icon = ICONS[i];
            return (
              <li key={title} className="feat-card reveal" style={{ transitionDelay: `${i * 90}ms` }}>
                <img src={IMAGES[i]} alt="" loading="lazy" decoding="async" width="1024" height="1024" />
                <div className="feat-caption">
                  <span className="feat-ico">
                    <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
