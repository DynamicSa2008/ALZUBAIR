import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { useI18n } from "../i18n/I18nProvider";

const TEXT = {
  ar: { title: "الصفحة غير موجودة", lead: "يبدو أن الرابط غير صحيح أو أن الصفحة نُقلت.", home: "العودة للرئيسية" },
  en: { title: "Page not found", lead: "The link may be wrong or the page has moved.", home: "Back to home" },
};

export default function NotFound() {
  const { pick } = useI18n();
  const tx = pick(TEXT);
  return (
    <section className="page-hero container" style={{ textAlign: "center", minHeight: "60vh" }}>
      <Seo title={tx.title} description={tx.lead} noindex />
      <p className="ltr" style={{ fontSize: "5rem", fontWeight: 700, textAlign: "center", color: "var(--brand)", margin: 0 }}>
        404
      </p>
      <h1 className="section-title">{tx.title}</h1>
      <p className="section-lead">{tx.lead}</p>
      <Link to="/" className="btn">
        {tx.home}
      </Link>
    </section>
  );
}
