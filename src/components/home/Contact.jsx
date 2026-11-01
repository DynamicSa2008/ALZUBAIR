import { useMemo, useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2, Loader2, MessageCircleQuestion, Check } from "lucide-react";
import { SERVICES } from "../../data/services";
import { useSettings } from "../../settings/SettingsProvider";
import { formatPhone, routeFor } from "../../settings/core";
import { useI18n } from "../../i18n/I18nProvider";
import { COMMON } from "../../i18n/common";
import { create } from "../../lib/store";
import { notifyCompany } from "../../lib/notify";
import { WhatsAppIcon } from "../icons";
import "./Contact.css";

const TEXT = {
  ar: {
    eyebrow: "تواصل معنا",
    title: (
      <>
        خلّنا نبدأ <em>علامتك</em> سوا
      </>
    ),
    lead: "اختر الموضوع واكتب لنا، وبنرجع لك خلال ساعات العمل.",
    topic: "عن ماذا تود التحدث؟",
    general: "استفسار عام",
    name: "الاسم الكامل",
    phone: "رقم الجوال",
    email: "البريد الإلكتروني (اختياري)",
    message: "رسالتك",
    messagePh: "اكتب تفاصيل طلبك أو سؤالك…",
    channel: "كيف تفضّل أن نتواصل معك؟",
    channels: { whatsapp: "واتساب", call: "اتصال", email: "بريد" },
    submit: "إرسال الرسالة",
    sending: "جارٍ الإرسال…",
    done: "وصلتنا رسالتك!",
    doneLead: "رقم المرجع الخاص بك:",
    doneWa: "أكمل المحادثة على واتساب",
    again: "إرسال رسالة أخرى",
    progress: "اكتمال النموذج",
    errors: {
      name: "اكتب اسمك (حرفين على الأقل)",
      phone: "رقم جوال سعودي صحيح يبدأ بـ 05",
      email: "بريد إلكتروني غير صحيح",
      message: "اكتب رسالة من 10 أحرف على الأقل",
    },
    info: { call: "اتصل بنا", wa: "راسلنا واتساب", mail: "البريد الإلكتروني", visit: "زورونا" },
  },
  en: {
    eyebrow: "Contact",
    title: (
      <>
        Let's start <em>your brand</em> together
      </>
    ),
    lead: "Pick a topic and write to us — we reply within working hours.",
    topic: "What would you like to talk about?",
    general: "General inquiry",
    name: "Full name",
    phone: "Mobile number",
    email: "Email (optional)",
    message: "Your message",
    messagePh: "Tell us about your request or question…",
    channel: "How should we reach you?",
    channels: { whatsapp: "WhatsApp", call: "Call", email: "Email" },
    submit: "Send message",
    sending: "Sending…",
    done: "Message received!",
    doneLead: "Your reference:",
    doneWa: "Continue on WhatsApp",
    again: "Send another message",
    progress: "Form completion",
    errors: {
      name: "Enter your name (2+ characters)",
      phone: "A valid Saudi mobile starting with 05",
      email: "Invalid email address",
      message: "Write at least 10 characters",
    },
    info: { call: "Call us", wa: "WhatsApp us", mail: "Email", visit: "Visit us" },
  },
};

const EMPTY = { topic: "general", name: "", phone: "", email: "", message: "", channel: "whatsapp" };
const MAX = 800;

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = true;
  if (!/^05\d{8}$/.test(v.phone.replace(/\s/g, ""))) e.phone = true;
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = true;
  if (v.message.trim().length < 10) e.message = true;
  return e;
}

export default function Contact() {
  const { pick, l } = useI18n();
  const tx = pick(TEXT);
  const c = pick(COMMON);
  const { settings } = useSettings();
  const { contact } = settings;
  const route = routeFor(settings, "contact");
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [state, setState] = useState("idle"); // idle | sending | done
  const [result, setResult] = useState(null);

  const errors = useMemo(() => validate(values), [values]);
  const required = ["name", "phone", "message"];
  const completion = Math.round((required.filter((k) => !errors[k] && values[k]).length / required.length) * 100);

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));
  const showErr = (k) => touched[k] && errors[k];

  async function onSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true, message: true });
    if (Object.keys(errors).length) return;
    setState("sending");
    const topicName = values.topic === "general" ? tx.general : l(SERVICES.find((s) => s.id === values.topic)?.name);
    const record = await create("messages", { ...values, topicName });
    const res = await notifyCompany({
        section: "contact",
      subject: `رسالة جديدة من الموقع ${record.code}`,
      replyTo: values.email,
      fields: {
        الموضوع: topicName,
        الاسم: values.name,
        الجوال: values.phone,
        البريد: values.email,
        "قناة التواصل": TEXT.ar.channels[values.channel],
        الرسالة: values.message,
      },
    });
    setResult({ code: record.code, link: res.whatsappApi || res.email ? null : res.fallbackLink });
    setState("done");
  }

  function reset() {
    setValues(EMPTY);
    setTouched({});
    setState("idle");
    setResult(null);
  }

  const topics = [{ id: "general", icon: MessageCircleQuestion, name: tx.general }, ...SERVICES.map((s) => ({ id: s.id, icon: s.icon, name: l(s.name) }))];

  return (
    <section id="contact" className="section cnt">
      <div className="container cnt-shell reveal">
        <aside className="cnt-aside">
          <span className="eyebrow cnt-eyebrow">{tx.eyebrow}</span>
          <h2 className="section-title">{tx.title}</h2>
          <p>{tx.lead}</p>
          <ul className="cnt-info">
            <li>
              <a href={`tel:${contact.phone}`}>
                <span className="cnt-info-ico">
                  <Phone size={18} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span>
                  <small>{tx.info.call}</small>
                  <span className="ltr">{formatPhone(contact.phone)}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${route.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <span className="cnt-info-ico">
                  <WhatsAppIcon size={18} />
                </span>
                <span>
                  <small>{tx.info.wa}</small>
                  {c.actions.whatsapp}
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${route.email}`}>
                <span className="cnt-info-ico">
                  <Mail size={18} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span>
                  <small>{tx.info.mail}</small>
                  <span className="ltr">{route.email}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer">
                <span className="cnt-info-ico">
                  <MapPin size={18} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span>
                  <small>{tx.info.visit}</small>
                  {l(contact.address)}
                </span>
              </a>
            </li>
          </ul>
        </aside>

        <div className="cnt-panel">
          {state === "done" ? (
            <div className="cnt-done" role="status" aria-live="polite">
              <span className="cnt-done-ico">
                <CheckCircle2 size={44} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3>{tx.done}</h3>
              <p>
                {tx.doneLead} <strong className="ltr">{result.code}</strong>
              </p>
              <div className="cnt-done-actions">
                {result.link && (
                  <a href={result.link} target="_blank" rel="noopener noreferrer" className="btn cnt-wa">
                    <WhatsAppIcon size={18} />
                    {tx.doneWa}
                  </a>
                )}
                <button type="button" className="btn btn-ghost" onClick={reset}>
                  {tx.again}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div className="cnt-progress" aria-label={tx.progress}>
                <span style={{ width: `${completion}%` }} />
              </div>

              <fieldset className="cnt-fieldset">
                <legend>{tx.topic}</legend>
                <div className="chips cnt-topics">
                  {topics.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        type="button"
                        key={t.id}
                        className="chip"
                        aria-pressed={values.topic === t.id}
                        onClick={() => setValues((v) => ({ ...v, topic: t.id }))}
                      >
                        <Icon aria-hidden="true" />
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="cnt-row">
                <Field id="c-name" label={tx.name} ok={values.name && !errors.name} error={showErr("name") && tx.errors.name}>
                  <input id="c-name" className="input" value={values.name} onChange={set("name")} onBlur={blur("name")} autoComplete="name" aria-invalid={!!showErr("name")} />
                </Field>
                <Field id="c-phone" label={tx.phone} ok={values.phone && !errors.phone} error={showErr("phone") && tx.errors.phone}>
                  <input
                    id="c-phone"
                    type="tel"
                    inputMode="numeric"
                    className="input"
                    placeholder="05XXXXXXXX"
                    maxLength={10}
                    value={values.phone}
                    onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value.replace(/[^\d]/g, "") }))}
                    onBlur={blur("phone")}
                    autoComplete="tel"
                    aria-invalid={!!showErr("phone")}
                  />
                </Field>
              </div>
              <Field id="c-email" label={tx.email} ok={values.email && !errors.email} error={showErr("email") && tx.errors.email}>
                <input id="c-email" type="email" className="input" value={values.email} onChange={set("email")} onBlur={blur("email")} autoComplete="email" aria-invalid={!!showErr("email")} />
              </Field>
              <Field
                id="c-msg"
                label={tx.message}
                ok={values.message && !errors.message}
                error={showErr("message") && tx.errors.message}
                extra={
                  <span className={`cnt-count ltr ${values.message.length > MAX * 0.9 ? "is-warn" : ""}`}>
                    {values.message.length}/{MAX}
                  </span>
                }
              >
                <textarea
                  id="c-msg"
                  className="textarea"
                  rows={5}
                  maxLength={MAX}
                  placeholder={tx.messagePh}
                  value={values.message}
                  onChange={set("message")}
                  onBlur={blur("message")}
                  aria-invalid={!!showErr("message")}
                />
              </Field>

              <fieldset className="cnt-fieldset">
                <legend>{tx.channel}</legend>
                <div className="chips">
                  {Object.entries(tx.channels).map(([k, label]) => (
                    <button type="button" key={k} className="chip" aria-pressed={values.channel === k} onClick={() => setValues((v) => ({ ...v, channel: k }))}>
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <button type="submit" className="btn cnt-submit" disabled={state === "sending"}>
                {state === "sending" ? (
                  <>
                    <Loader2 size={18} strokeWidth={1.5} className="cnt-spin" aria-hidden="true" />
                    {tx.sending}
                  </>
                ) : (
                  <>
                    {tx.submit}
                    <Send size={18} strokeWidth={1.5} className="flip-ltr-send" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ id, label, ok, error, extra, children }) {
  return (
    <div className={`field cnt-field ${ok ? "is-ok" : ""}`}>
      <label htmlFor={id}>
        {label}
        {ok && <Check size={14} strokeWidth={2} className="cnt-ok" aria-hidden="true" />}
        {extra}
      </label>
      {children}
      <span className="error" aria-live="polite">
        {error || ""}
      </span>
    </div>
  );
}
