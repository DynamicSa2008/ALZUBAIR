import { Shield, Sparkles, TrendingUp, Megaphone, HeartHandshake, ShieldCheck, Landmark, Globe2, Gem } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import "./WhyRegister.css";

const TEXT = {
  ar: {
    eyebrow: "لماذا التسجيل؟",
    title: (
      <>
        تسجيل العلامة التجارية <em>خطوة استراتيجية</em> لنجاح أعمالك
      </>
    ),
    lead: "يمثل تسجيل العلامة التجارية الأساس القانوني لبناء أعمالك بثقة واستقرار.",
    items: [
      ["الحماية القانونية الكاملة", "عند التسجيل لدى الهيئة السعودية للملكية الفكرية تحصل على حق الاستخدام الحصري ومنع أي طرف آخر من استغلالها."],
      ["التميز السوقي", "هوية فريدة لا يمكن تقليدها قانونياً."],
      ["تعزيز القيمة المضافة", "رفع القيمة التسويقية لمنتجاتك وخدماتك."],
      ["تسويق أكثر فاعلية", "روّج لعلامتك بثقة دون الخوف من النزاعات القانونية."],
      ["كسب ثقة العملاء", "العلامة المسجلة تعزز مصداقيتك أمام العملاء والمستثمرين."],
      ["حماية المستهلك", "منع التقليد وحماية سمعة علامتك."],
      ["أصل تجاري", "تتحول العلامة المسجلة إلى أصل يمكن تقييمه مالياً."],
      ["التوسع والنمو", "يسهل التوسع محلياً ودولياً."],
      ["جذب المستثمرين", "العلامة المسجلة عنصر قوة في أي ملف استثماري."],
    ],
  },
  en: {
    eyebrow: "Why register?",
    title: (
      <>
        Registering your trademark is <em>a strategic move</em>
      </>
    ),
    lead: "Trademark registration is the legal foundation for building your business with confidence.",
    items: [
      ["Full legal protection", "Registering with SAIP grants exclusive rights and stops others from exploiting your mark."],
      ["Market distinction", "A unique identity that can't legally be copied."],
      ["Added value", "Raises the market value of your products and services."],
      ["Smarter marketing", "Promote your brand confidently, free of legal disputes."],
      ["Customer trust", "A registered mark builds credibility with customers and investors."],
      ["Consumer protection", "Prevents counterfeiting and protects your reputation."],
      ["A business asset", "Your registered mark becomes an asset with financial value."],
      ["Expansion & growth", "Makes expanding locally and internationally easier."],
      ["Attract investors", "A strong point in any investment file."],
    ],
  },
};

const ICONS = [Shield, Sparkles, TrendingUp, Megaphone, HeartHandshake, ShieldCheck, Landmark, Globe2, Gem];

export default function WhyRegister() {
  const { pick } = useI18n();
  const tx = pick(TEXT);
  return (
    <section className="section why">
      <div className="container">
        <header className="section-head reveal">
          <span className="eyebrow">{tx.eyebrow}</span>
          <h2 className="section-title">{tx.title}</h2>
          <p className="section-lead">{tx.lead}</p>
        </header>
        <ul className="why-grid">
          {tx.items.map(([title, desc], i) => {
            const Icon = ICONS[i];
            return (
              <li key={title} className={`why-card reveal ${i === 0 ? "why-card-lead" : ""}`} style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                <span className="why-num ltr" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="icon-bubble">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
