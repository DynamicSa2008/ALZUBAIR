import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import "./Faq.css";

const TEXT = {
  ar: {
    eyebrow: "الأسئلة الشائعة",
    title: (
      <>
        كل ما تحتاج <em>معرفته</em>
      </>
    ),
    items: [
      ["ما أهمية تسجيل العلامة التجارية؟", "يمنحك تسجيل العلامة التجارية حماية قانونية، وتميزًا سوقيًا، وقيمة استثمارية طويلة الأمد."],
      ["هل تقدم شركة الزبير خدمة تسجيل العلامة التجارية؟", "نعم، نتولى ملفك كاملاً أمام الهيئة السعودية للملكية الفكرية من الفحص المبدئي حتى صدور الشهادة."],
      ["ما هي خدمة ترجمة العلامة التجارية؟", "هي نقل اسم العلامة أو شعارها أو محتواها من لغة إلى أخرى بطريقة دقيقة ومعتمدة، وهي مطلوبة من الهيئة السعودية للملكية الفكرية عند تسجيل أي علامة تحتوي على نصوص أو كلمات غير عربية."],
      ["هل تشمل خدماتكم التصميم والطباعة؟", "نعم، نصمم الهوية البصرية كاملة ونطبع كل ما تحتاجه علامتك من كروت ومطبوعات وتغليف ومواد دعائية وهدايا."],
      ["كيف أتابع حالة طلبي؟", "بعد إرسال طلبك تحصل على رقم مرجعي، ويمكنك متابعة حالته في أي وقت من صفحة «تتبع طلبك» أو عبر واتساب."],
      ["ما المستندات المطلوبة لتسجيل العلامة؟", "عادةً: صورة الهوية أو السجل التجاري، العنوان الوطني، وشعار العلامة. يمكنك رفع بياناتك مسبقًا من صفحة «توثيق العميل»."],
    ],
  },
  en: {
    eyebrow: "FAQ",
    title: (
      <>
        Everything you <em>need to know</em>
      </>
    ),
    items: [
      ["Why register a trademark?", "Registration gives you legal protection, market distinction and long-term investment value."],
      ["Does Al Zubair handle trademark registration?", "Yes — we manage your whole file with SAIP, from the initial search until the certificate is issued."],
      ["What is trademark translation?", "Accurately and officially rendering your mark's name, logo or wording into another language. SAIP requires it for any mark containing non-Arabic text."],
      ["Do you also design and print?", "Yes — full visual identity design plus every print your brand needs: cards, stationery, packaging, promo material and gifts."],
      ["How do I track my request?", "After submitting you get a reference code; follow its status anytime on the “Track order” page or via WhatsApp."],
      ["Which documents are needed?", "Usually: ID or commercial registration, national address and the logo. You can submit your details in advance on the KYC page."],
    ],
  },
};

export default function Faq() {
  const { pick } = useI18n();
  const tx = pick(TEXT);
  const [open, setOpen] = useState(0);
  const base = useId();

  return (
    <section className="section faq">
      <div className="container faq-wrap">
        <header className="section-head start reveal">
          <span className="eyebrow">{tx.eyebrow}</span>
          <h2 className="section-title">{tx.title}</h2>
        </header>
        <div className="faq-list reveal">
          {tx.items.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q} className={`faq-item ${isOpen ? "is-open" : ""}`}>
                <h3>
                  <button
                    type="button"
                    id={`${base}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${base}-a${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span>{q}</span>
                    <span className="faq-icon" aria-hidden="true">
                      <Plus size={18} strokeWidth={1.5} />
                    </span>
                  </button>
                </h3>
                <div id={`${base}-a${i}`} role="region" aria-labelledby={`${base}-q${i}`} className="faq-answer">
                  <div>
                    <p>{a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: tx.items.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />
    </section>
  );
}
