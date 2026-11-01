import { useState } from "react";
import { CheckCheck, CircleCheck, CircleX, Copy, KeyRound, Mail, MessageCircle, TriangleAlert } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { COMMON } from "../../i18n/common";
import { integrationsReady } from "../../lib/notify";
import { INTEGRATIONS } from "../../config/site";

const TEXT = {
  ar: {
    title: "التكاملات",
    lead: "اربط الموقع بواتساب API والبريد لإرسال الإشعارات تلقائياً. بدونها يعمل كل شيء أيضاً: يفتح الموقع واتساب برسالة جاهزة يرسلها العميل بنفسه.",
    connected: "مفعّل",
    notConnected: "غير مفعّل",
    wa: {
      name: "واتساب API",
      text: "نقطة نهاية خاصة بك (Cloud Function / خادم صغير) تستقبل الرسالة وترسلها عبر WhatsApp Cloud API — يبقى رمز الوصول على الخادم.",
      vars: ["VITE_WHATSAPP_API_URL"],
    },
    email: {
      name: "البريد عبر EmailJS",
      text: "أنشئ حساباً في emailjs.com، أضف خدمة بريد وقالباً يستخدم المتغيرات subject وmessage وreply_to وto_email.",
      vars: ["VITE_EMAILJS_SERVICE_ID", "VITE_EMAILJS_TEMPLATE_ID", "VITE_EMAILJS_PUBLIC_KEY"],
    },
    pin: {
      name: "رمز لوحة التحكم",
      text: "غيّر الرمز الافتراضي عبر VITE_DASHBOARD_PIN. هذا قفل للتسهيل على موقع ثابت وليس حماية أمنية حقيقية.",
      vars: ["VITE_DASHBOARD_PIN"],
      default: "ما زلت تستخدم الرمز الافتراضي — غيّره قبل النشر.",
      custom: "تم تعيين رمز مخصص.",
    },
    fallbackTitle: "كيف يعمل الموقع بدون تكاملات؟",
    fallbackText:
      "عند إرسال أي نموذج، يُحفظ الطلب ويظهر للعميل زر «أرسل عبر واتساب» يفتح محادثة مع رقم الشركة برسالة مكتوبة مسبقاً. وفي لوحة التحكم، زر «إشعار العميل» يفتح واتساب برسالة جاهزة لرقم العميل.",
    setupTitle: "طريقة الإعداد",
    setup: [
      "انسخ الملف ‎.env.example‎ في جذر المشروع إلى ‎.env.local‎.",
      "املأ القيم المطلوبة (يمكن ترك أي تكامل فارغاً).",
      "أعد البناء والنشر: npm run deploy — متغيرات Vite تُدمج وقت البناء.",
    ],
    copyEnv: "نسخ القالب",
  },
  en: {
    title: "Integrations",
    lead: "Connect WhatsApp API and email to send notifications automatically. Everything works without them too: the site opens WhatsApp with a prefilled message the customer sends themselves.",
    connected: "Connected",
    notConnected: "Not connected",
    wa: {
      name: "WhatsApp API",
      text: "Your own endpoint (cloud function / tiny server) that receives the message and sends it through the WhatsApp Cloud API — the access token stays server-side.",
      vars: ["VITE_WHATSAPP_API_URL"],
    },
    email: {
      name: "Email via EmailJS",
      text: "Create an emailjs.com account, add an email service and a template using the subject, message, reply_to and to_email variables.",
      vars: ["VITE_EMAILJS_SERVICE_ID", "VITE_EMAILJS_TEMPLATE_ID", "VITE_EMAILJS_PUBLIC_KEY"],
    },
    pin: {
      name: "Dashboard PIN",
      text: "Change the default PIN with VITE_DASHBOARD_PIN. This is a convenience lock for a static site, not real security.",
      vars: ["VITE_DASHBOARD_PIN"],
      default: "You're still using the default PIN — change it before going live.",
      custom: "A custom PIN is set.",
    },
    fallbackTitle: "How does the site work without integrations?",
    fallbackText:
      "When a form is submitted, the request is saved and the customer gets a “Send on WhatsApp” button that opens a chat with the company number and a prefilled message. In the dashboard, “Notify customer” opens WhatsApp with a ready message to the customer's number.",
    setupTitle: "Setup",
    setup: [
      "Copy .env.example at the project root to .env.local.",
      "Fill in the values you need (any integration can stay empty).",
      "Rebuild and redeploy: npm run deploy — Vite inlines env vars at build time.",
    ],
    copyEnv: "Copy template",
  },
};

const ENV_TEMPLATE = `VITE_WHATSAPP_API_URL=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
VITE_DASHBOARD_PIN=`;

export default function IntegrationsPanel() {
  const { pick } = useI18n();
  const tx = pick(TEXT);
  const common = pick(COMMON);
  const [copied, setCopied] = useState(false);
  const defaultPin = !import.meta.env.VITE_DASHBOARD_PIN;

  const cards = [
    { key: "wa", icon: MessageCircle, ok: integrationsReady.whatsappApi() },
    { key: "email", icon: Mail, ok: integrationsReady.email() },
    { key: "pin", icon: KeyRound, ok: !defaultPin && Boolean(INTEGRATIONS.dashboardPin) },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ENV_TEMPLATE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="dsh-panel">
      <div className="dsh-panel-head">
        <div>
          <h2>{tx.title}</h2>
          <p className="dsh-lead">{tx.lead}</p>
        </div>
      </div>

      <ul className="dsh-integrations">
        {cards.map(({ key, icon: Icon, ok }) => {
          const c = tx[key];
          return (
            <li key={key} className="dsh-card dsh-integration">
              <div className="dsh-integration-head">
                <span className="icon-bubble" aria-hidden="true">
                  <Icon strokeWidth={1.5} />
                </span>
                <strong>{c.name}</strong>
                <span className={`dsh-conn ${ok ? "is-ok" : "is-off"}`}>
                  {ok ? (
                    <CircleCheck strokeWidth={1.5} size={16} aria-hidden="true" />
                  ) : (
                    <CircleX strokeWidth={1.5} size={16} aria-hidden="true" />
                  )}
                  {ok ? tx.connected : tx.notConnected}
                </span>
              </div>
              <p>{c.text}</p>
              {key === "pin" && (
                <p className={defaultPin ? "dsh-warn" : "dsh-muted"}>
                  {defaultPin && <TriangleAlert strokeWidth={1.5} size={16} aria-hidden="true" />}
                  {defaultPin ? c.default : c.custom}
                </p>
              )}
              <ul className="dsh-env-list">
                {c.vars.map((v) => (
                  <li key={v}>
                    <code className="ltr">{v}</code>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>

      <div className="dsh-overview-grid">
        <section className="dsh-card" aria-labelledby="dsh-fallback-h">
          <h3 id="dsh-fallback-h">{tx.fallbackTitle}</h3>
          <p className="dsh-muted">{tx.fallbackText}</p>
        </section>
        <section className="dsh-card" aria-labelledby="dsh-setup-h">
          <h3 id="dsh-setup-h">{tx.setupTitle}</h3>
          <ol className="dsh-steps">
            {tx.setup.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <div className="dsh-code dsh-code-block">
            <pre className="ltr">{ENV_TEMPLATE}</pre>
            <button type="button" className="btn btn-ghost btn-sm" onClick={copy}>
              {copied ? (
                <CheckCheck strokeWidth={1.5} size={16} aria-hidden="true" />
              ) : (
                <Copy strokeWidth={1.5} size={16} aria-hidden="true" />
              )}
              {copied ? common.actions.copied : tx.copyEnv}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
