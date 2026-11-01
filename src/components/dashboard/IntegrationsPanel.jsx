import { useEffect, useState } from "react";
import { CircleCheck, CircleX, Database, Mail, KeyRound, MessageCircle, LoaderCircle } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { call, hasApi } from "../../lib/api";
import { integrationsReady } from "../../lib/notify";

const TEXT = {
  ar: {
    title: "الربط والتكاملات",
    lead: "حالة الخادم وقاعدة البيانات والإيميل. الإعدادات السرية محفوظة في ملف api/config.php على السيرفر.",
    connected: "يعمل",
    notConnected: "غير مفعّل",
    checking: "جارٍ الفحص…",
    db: { name: "قاعدة البيانات (MySQL)", text: "الطلبات والتوثيق والشكاوى تُحفظ على سيرفرك وتظهر هنا من أي جهاز." },
    email: { name: "الإيميل من السيرفر", text: "كل طلب جديد يصل على إيميل القسم المحدد في «إعدادات الموقع» ← «توجيه الأقسام»." },
    password: { name: "كلمة مرور اللوحة", text: "تُغيَّر من ملف api/config.php ‏(admin_password). الجلسة تنتهي تلقائياً بعد ١٢ ساعة، وتُحظر المحاولات الخاطئة المتكررة." },
    wa: { name: "WhatsApp Cloud API (اختياري)", text: "بدونه يفتح الموقع واتساب برسالة جاهزة للعميل — وهذا يعمل دائماً." },
    devTitle: "وضع التطوير",
    devText: "أنت تشغّل الموقع محلياً بدون PHP، لذلك تُحفظ البيانات في هذا المتصفح فقط. على السيرفر يعمل كل شيء من قاعدة البيانات.",
    setupTitle: "إعداد السيرفر (مرة واحدة)",
    setup: [
      "cPanel ← MySQL Databases: أنشئ قاعدة بيانات ومستخدماً واربطهما بكل الصلاحيات.",
      "انسخ api/config.sample.php إلى api/config.php واملأ بيانات القاعدة وكلمة مرور اللوحة والإيميل.",
      "افتح ‎/api/?action=health‎ — يجب أن ترى ok: true.",
      "سجّل الدخول هنا بكلمة المرور الجديدة.",
    ],
  },
  en: {
    title: "Connections",
    lead: "Server, database and email status. Secrets live in api/config.php on the server.",
    connected: "Working",
    notConnected: "Off",
    checking: "Checking…",
    db: { name: "Database (MySQL)", text: "Orders, KYC and feedback are stored on your server and show up here from any device." },
    email: { name: "Server email", text: "Every new request is emailed to the section's address set in Site settings → Section routing." },
    password: { name: "Dashboard password", text: "Change it in api/config.php (admin_password). Sessions expire after 12 hours; repeated wrong attempts are blocked." },
    wa: { name: "WhatsApp Cloud API (optional)", text: "Without it the site opens WhatsApp with a ready message — that always works." },
    devTitle: "Development mode",
    devText: "You're running the site locally without PHP, so data is kept in this browser only. On the server everything uses the database.",
    setupTitle: "Server setup (once)",
    setup: [
      "cPanel → MySQL Databases: create a database and a user, and grant the user all privileges.",
      "Copy api/config.sample.php to api/config.php and fill in the database, dashboard password and email.",
      "Open /api/?action=health — you should see ok: true.",
      "Sign in here with the new password.",
    ],
  },
};

export default function IntegrationsPanel() {
  const { pick } = useI18n();
  const tx = pick(TEXT);
  const [health, setHealth] = useState(hasApi ? null : { ok: false });

  useEffect(() => {
    if (!hasApi) return;
    call("health")
      .then(setHealth)
      .catch(() => setHealth({ ok: false }));
  }, []);

  const checking = health === null;
  const cards = [
    { key: "db", icon: Database, ok: Boolean(health?.ok) },
    { key: "email", icon: Mail, ok: Boolean(health?.ok && health.mail) },
    { key: "password", icon: KeyRound, ok: hasApi && Boolean(health?.ok) },
    { key: "wa", icon: MessageCircle, ok: integrationsReady.whatsappApi(), static: true },
  ];

  return (
    <div className="dsh-panel">
      <div className="dsh-panel-head">
        <div>
          <h2>{tx.title}</h2>
          <p className="dsh-lead">{tx.lead}</p>
        </div>
      </div>

      <ul className="dsh-integrations">
        {cards.map(({ key, icon: Icon, ok, static: isStatic }) => {
          const c = tx[key];
          const pending = checking && !isStatic;
          return (
            <li key={key} className="dsh-card dsh-integration">
              <div className="dsh-integration-head">
                <span className="icon-bubble" aria-hidden="true">
                  <Icon strokeWidth={1.5} />
                </span>
                <strong>{c.name}</strong>
                <span className={`dsh-conn ${ok ? "is-ok" : "is-off"}`}>
                  {pending ? (
                    <LoaderCircle strokeWidth={1.5} size={16} className="dsh-spin" aria-hidden="true" />
                  ) : ok ? (
                    <CircleCheck strokeWidth={1.5} size={16} aria-hidden="true" />
                  ) : (
                    <CircleX strokeWidth={1.5} size={16} aria-hidden="true" />
                  )}
                  {pending ? tx.checking : ok ? tx.connected : tx.notConnected}
                </span>
              </div>
              <p>{c.text}</p>
            </li>
          );
        })}
      </ul>

      <div className="dsh-overview-grid">
        {!hasApi && (
          <section className="dsh-card" aria-labelledby="dsh-dev-h">
            <h3 id="dsh-dev-h">{tx.devTitle}</h3>
            <p className="dsh-muted">{tx.devText}</p>
          </section>
        )}
        <section className="dsh-card" aria-labelledby="dsh-setup-h">
          <h3 id="dsh-setup-h">{tx.setupTitle}</h3>
          <ol className="dsh-steps">
            {tx.setup.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          {health?.php && (
            <p className="dsh-muted ltr">
              PHP {health.php}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
