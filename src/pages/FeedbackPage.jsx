import { useRef, useState } from "react";
import {
  Lightbulb,
  MessageSquareWarning,
  Heart,
  CircleHelp,
  Angry,
  Frown,
  Meh,
  Smile,
  Laugh,
  MessageCircle,
  PhoneCall,
  Mail,
  EyeOff,
  Send,
  Check,
  Copy,
  Clock,
  Search,
  Ticket,
  CircleAlert,
  Loader2,
  MessagesSquare,
} from "lucide-react";
import Seo from "../components/Seo";
import { useI18n } from "../i18n/I18nProvider";
import { COMMON } from "../i18n/common";
import { SERVICES } from "../data/services";
import { create, get } from "../lib/store";
import { notifyCompany } from "../lib/notify";
import "./FeedbackPage.css";

const TYPES = [
  { id: "suggestion", icon: Lightbulb, anon: true },
  { id: "complaint", icon: MessageSquareWarning, anon: false },
  { id: "praise", icon: Heart, anon: true },
  { id: "inquiry", icon: CircleHelp, anon: false },
];
const FACES = [Angry, Frown, Meh, Smile, Laugh];
const CHANNELS = [
  { id: "whatsapp", icon: MessageCircle },
  { id: "call", icon: PhoneCall },
  { id: "email", icon: Mail },
];
const MAX_MSG = 1000;

const TEXT = {
  ar: {
    seoTitle: "الملاحظات والشكاوى",
    seoDesc:
      "شاركنا اقتراحك أو شكواك أو شكرك لفريق شركة الزبير، وتابع حالة تذكرتك برقمها في أي وقت.",
    eyebrow: "صوتك يهمنا",
    title: "الملاحظات والشكاوى",
    lead: "رأيك يساعدنا على تحسين خدماتنا. شاركنا اقتراحك أو شكواك أو استفسارك، وسيتابعه فريق مختص حتى إغلاقه.",
    typeLabel: "نوع الملاحظة",
    types: {
      suggestion: { name: "اقتراح", desc: "فكرة لتطوير خدماتنا" },
      complaint: { name: "شكوى", desc: "مشكلة واجهتك معنا" },
      praise: { name: "شكر وإشادة", desc: "تجربة أسعدتك" },
      inquiry: { name: "استفسار", desc: "سؤال تحتاج إجابته" },
    },
    orderRef: "رقم الطلب المرتبط",
    orderRefHint: "مثل ZB-7K3P9Q — يساعدنا على الوصول لطلبك بسرعة",
    service: "الخدمة المعنية",
    servicePh: "اختر الخدمة (اختياري)",
    rating: "مدى رضاك عن تجربتك",
    ratingHint: "استخدم الأسهم لتغيير التقييم",
    faces: ["غير راضٍ إطلاقاً", "غير راضٍ", "محايد", "راضٍ", "راضٍ جداً"],
    subject: "عنوان الملاحظة",
    message: "التفاصيل",
    messagePh: "اكتب ملاحظتك بالتفصيل…",
    chars: (n, max) => `${n} / ${max}`,
    nearLimit: (n) => `متبقٍ ${n} حرفاً`,
    anon: "إرسال دون ذكر الاسم",
    anonHint: "متاح للاقتراحات والإشادة فقط، ولن نتمكن من الرد عليك.",
    anonBlocked: "الشكاوى والاستفسارات تتطلب بيانات تواصل لنتمكن من الرد عليك.",
    name: "الاسم",
    mobile: "رقم الجوال",
    mobileHint: "مثال: 0512345678",
    email: "البريد الإلكتروني",
    channel: "وسيلة الرد المفضلة",
    channels: { whatsapp: "واتساب", call: "اتصال هاتفي", email: "البريد الإلكتروني" },
    optional: "اختياري",
    submit: "إرسال الملاحظة",
    submitting: "جارٍ الإرسال…",
    errors: {
      type: "اختر نوع الملاحظة",
      orderRef: "صيغة رقم الطلب ZB- متبوعاً بستة أحرف أو أرقام",
      subject: "اكتب عنواناً مختصراً (3 أحرف على الأقل)",
      message: "اكتب التفاصيل (10 أحرف على الأقل)",
      name: "اكتب اسمك",
      mobile: "رقم الجوال يبدأ بـ 05 ويتكون من 10 أرقام",
      email: "اكتب بريداً إلكترونياً صحيحاً",
      emailNeeded: "البريد الإلكتروني مطلوب عند اختيار الرد عبر البريد",
      submit: "تعذّر الإرسال، يرجى المحاولة مرة أخرى",
    },
    fixErrors: "يرجى تصحيح الحقول المميزة",
    successTitle: "شكراً لك، استلمنا ملاحظتك",
    ticket: "رقم التذكرة",
    eta: {
      complaint: "سيتواصل معك فريق خدمة العملاء خلال 48 ساعة كحد أقصى.",
      inquiry: "سنرد على استفسارك خلال يوم عمل واحد.",
      suggestion: "سيطّلع فريقنا على اقتراحك ويرد عليك خلال 3 أيام عمل.",
      praise: "شكراً لكلماتك الطيبة، سننقلها للفريق.",
      anon: "أُرسلت ملاحظتك دون اسم، لذا لن نتمكن من الرد عليها مباشرة.",
    },
    keepCode: "احتفظ برقم التذكرة لمتابعة حالتها من صندوق التتبع أدناه.",
    sendWa: "أرسل التفاصيل على واتساب",
    waHint: "لضمان وصول ملاحظتك بسرعة، أرسل التفاصيل عبر واتساب.",
    another: "إرسال ملاحظة أخرى",
    trackTitle: "تتبّع تذكرتك",
    trackLead: "أدخل رقم التذكرة لمعرفة حالتها وآخر التحديثات.",
    trackLabel: "رقم التذكرة",
    trackBtn: "بحث",
    trackInvalid: "صيغة رقم التذكرة FB- متبوعاً بستة أحرف أو أرقام",
    trackNone: "لم نعثر على تذكرة بهذا الرقم.",
    trackStatus: "الحالة الحالية",
    history: "سجل التحديثات",
    companySubject: "ملاحظة جديدة من الموقع",
    anonymous: "مجهول الهوية",
    statusExtra: { resolved: "تمت المعالجة", closed: "مغلقة" },
  },
  en: {
    seoTitle: "Feedback & complaints",
    seoDesc:
      "Share a suggestion, complaint or compliment with the Al Zubair team, and track your ticket anytime with its code.",
    eyebrow: "Your voice matters",
    title: "Feedback & complaints",
    lead: "Your feedback helps us improve. Share a suggestion, complaint or question and a dedicated team will follow it through to resolution.",
    typeLabel: "Feedback type",
    types: {
      suggestion: { name: "Suggestion", desc: "An idea to improve our service" },
      complaint: { name: "Complaint", desc: "A problem you faced with us" },
      praise: { name: "Praise", desc: "An experience you enjoyed" },
      inquiry: { name: "Inquiry", desc: "A question you need answered" },
    },
    orderRef: "Related order number",
    orderRefHint: "e.g. ZB-7K3P9Q — helps us find your order quickly",
    service: "Related service",
    servicePh: "Choose a service (optional)",
    rating: "How satisfied are you?",
    ratingHint: "Use the arrow keys to change the rating",
    faces: ["Very dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very satisfied"],
    subject: "Subject",
    message: "Details",
    messagePh: "Tell us about it in detail…",
    chars: (n, max) => `${n} / ${max}`,
    nearLimit: (n) => `${n} characters left`,
    anon: "Send anonymously",
    anonHint: "Available for suggestions and praise only — we won't be able to reply.",
    anonBlocked: "Complaints and inquiries need contact details so we can reply.",
    name: "Name",
    mobile: "Mobile number",
    mobileHint: "e.g. 0512345678",
    email: "Email",
    channel: "Preferred reply channel",
    channels: { whatsapp: "WhatsApp", call: "Phone call", email: "Email" },
    optional: "optional",
    submit: "Send feedback",
    submitting: "Sending…",
    errors: {
      type: "Choose a feedback type",
      orderRef: "Order number format is ZB- followed by 6 letters or digits",
      subject: "Add a short subject (at least 3 characters)",
      message: "Add some details (at least 10 characters)",
      name: "Enter your name",
      mobile: "Mobile must start with 05 and be 10 digits",
      email: "Enter a valid email address",
      emailNeeded: "Email is required when replying by email",
      submit: "Couldn't send, please try again",
    },
    fixErrors: "Please fix the highlighted fields",
    successTitle: "Thank you — we've received your feedback",
    ticket: "Ticket code",
    eta: {
      complaint: "Our customer care team will contact you within 48 hours at most.",
      inquiry: "We'll answer your inquiry within one business day.",
      suggestion: "Our team will review your suggestion and reply within 3 business days.",
      praise: "Thank you for your kind words — we'll share them with the team.",
      anon: "Your feedback was sent anonymously, so we can't reply to it directly.",
    },
    keepCode: "Keep your ticket code to check its status in the tracking box below.",
    sendWa: "Send details on WhatsApp",
    waHint: "To make sure your feedback reaches us quickly, send the details on WhatsApp.",
    another: "Send another",
    trackTitle: "Track your ticket",
    trackLead: "Enter your ticket code to see its status and latest updates.",
    trackLabel: "Ticket code",
    trackBtn: "Search",
    trackInvalid: "Ticket format is FB- followed by 6 letters or digits",
    trackNone: "We couldn't find a ticket with this code.",
    trackStatus: "Current status",
    history: "Update history",
    companySubject: "New website feedback",
    anonymous: "Anonymous",
    statusExtra: { resolved: "Resolved", closed: "Closed" },
  },
};

const EMPTY = {
  type: "",
  orderRef: "",
  service: "",
  rating: 0,
  subject: "",
  message: "",
  anonymous: false,
  name: "",
  mobile: "",
  email: "",
  channel: "whatsapp",
};

const digits = (v) => v.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/\D/g, "");
const normCode = (v) => v.toUpperCase().replace(/[^A-Z0-9-]/g, "");

function validate(f, E) {
  const e = {};
  if (!f.type) e.type = E.type;
  if (f.orderRef && !/^ZB-[A-Z0-9]{6}$/.test(f.orderRef)) e.orderRef = E.orderRef;
  if (f.subject.trim().length < 3) e.subject = E.subject;
  if (f.message.trim().length < 10) e.message = E.message;
  if (!f.anonymous) {
    if (f.name.trim().length < 2) e.name = E.name;
    if (!/^05\d{8}$/.test(f.mobile)) e.mobile = E.mobile;
    const email = f.email.trim();
    if (f.channel === "email" && !email) e.email = E.emailNeeded;
    else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = E.email;
  }
  return e;
}

function Rating({ value, onChange, labels, label, hint }) {
  const refs = useRef([]);
  const focusIndex = value ? value - 1 : 0;

  const onKeyDown = (e, i) => {
    const rtl = document.documentElement.dir === "rtl";
    let nextI = null;
    if (e.key === "ArrowUp" || e.key === (rtl ? "ArrowLeft" : "ArrowRight")) nextI = Math.min(i + 1, 4);
    if (e.key === "ArrowDown" || e.key === (rtl ? "ArrowRight" : "ArrowLeft")) nextI = Math.max(i - 1, 0);
    if (e.key === "Home") nextI = 0;
    if (e.key === "End") nextI = 4;
    if (nextI === null) return;
    e.preventDefault();
    onChange(nextI + 1);
    refs.current[nextI]?.focus();
  };

  return (
    <div className="field">
      <span className="fb-label" id="fb-rating-label">
        {label}
      </span>
      <div className="fb-rating" role="radiogroup" aria-labelledby="fb-rating-label" aria-describedby="fb-rating-hint">
        {FACES.map((Face, i) => {
          const on = value === i + 1;
          return (
            <button
              key={labels[i]}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={`${i + 1} — ${labels[i]}`}
              tabIndex={i === focusIndex ? 0 : -1}
              className={`fb-face fb-face-${i + 1}${on ? " is-on" : ""}${value && i < value ? " is-filled" : ""}`}
              onClick={() => onChange(on ? 0 : i + 1)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <Face size={24} strokeWidth={1.5} aria-hidden="true" />
              <span className="fb-face-num ltr">{i + 1}</span>
            </button>
          );
        })}
      </div>
      <span className="hint fb-rating-caption" id="fb-rating-hint" aria-live="polite">
        {value ? labels[value - 1] : hint}
      </span>
    </div>
  );
}

function TrackTicket({ tx, statusLabel }) {
  const { formatDate } = useI18n();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [ticket, setTicket] = useState(null);
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);

  const search = async () => {
    const c = code.trim();
    if (!/^FB-[A-Z0-9]{6}$/.test(c)) {
      setError(tx.trackInvalid);
      setTicket(null);
      setSearched(false);
      return;
    }
    setError("");
    setBusy(true);
    try {
      setTicket(await get("feedback", c));
    } finally {
      setSearched(true);
      setBusy(false);
    }
  };

  return (
    <section className="card fb-track" aria-labelledby="fb-track-title">
      <div className="fb-track-head">
        <span className="icon-bubble">
          <Ticket size={22} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <div>
          <h2 id="fb-track-title">{tx.trackTitle}</h2>
          <p>{tx.trackLead}</p>
        </div>
      </div>
      <form
        className="fb-track-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
        <label htmlFor="fb-track-code" className="sr-only">
          {tx.trackLabel}
        </label>
        <input
          id="fb-track-code"
          className="input ltr"
          dir="ltr"
          placeholder="FB-XXXXXX"
          maxLength={9}
          autoComplete="off"
          spellCheck={false}
          value={code}
          aria-invalid={error ? "true" : "false"}
          aria-describedby="fb-track-err"
          onChange={(e) => {
            setCode(normCode(e.target.value));
            if (error) setError("");
          }}
        />
        <button type="submit" className="btn" disabled={busy}>
          <Search size={18} strokeWidth={1.5} aria-hidden="true" />
          {tx.trackBtn}
        </button>
      </form>
      <div aria-live="polite">
        {error && (
          <p className="fb-error" id="fb-track-err">
            {error}
          </p>
        )}
        {searched && !ticket && !error && <p className="fb-track-none">{tx.trackNone}</p>}
        {ticket && (
          <div className="fb-track-result">
            <div className="fb-track-status">
              <span>{tx.trackStatus}</span>
              <span className={`badge fb-status-${ticket.status}`}>{statusLabel(ticket.status)}</span>
            </div>
            <h3>{tx.history}</h3>
            <ol className="fb-timeline">
              {[...(ticket.history || [])].reverse().map((h, i) => (
                <li key={`${h.at}-${i}`} className={i === 0 ? "is-latest" : undefined}>
                  <span className="fb-timeline-dot" aria-hidden="true" />
                  <div>
                    <strong>{statusLabel(h.status)}</strong>
                    <time dateTime={h.at}>{formatDate(h.at, { timeStyle: "short" })}</time>
                    {h.note && <p>{h.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

export default function FeedbackPage() {
  const { pick, l, lang } = useI18n();
  const tx = pick(TEXT);
  const common = pick(COMMON);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const formRef = useRef(null);
  const successRef = useRef(null);

  const typeDef = TYPES.find((t) => t.id === form.type);
  const anonAllowed = Boolean(typeDef?.anon);
  const statusLabel = (s) => common.status[s] || tx.statusExtra[s] || s;

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const chooseType = (id) => {
    const def = TYPES.find((t) => t.id === id);
    setForm((f) => ({ ...f, type: id, anonymous: def.anon ? f.anonymous : false }));
    if (errors.type) setErrors((er) => ({ ...er, type: undefined }));
  };

  const toggleAnon = () => {
    if (!anonAllowed) return;
    setForm((f) =>
      f.anonymous
        ? { ...f, anonymous: false }
        : { ...f, anonymous: true, name: "", mobile: "", email: "" },
    );
    setErrors((er) => ({ ...er, name: undefined, mobile: undefined, email: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(form, tx.errors);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const key = Object.keys(errs)[0];
      requestAnimationFrame(() => formRef.current?.querySelector(`[data-field="${key}"]`)?.focus());
      return;
    }
    setBusy(true);
    setSubmitError("");
    try {
      const data = {
        type: form.type,
        orderRef: form.orderRef,
        service: form.service,
        rating: form.rating || null,
        subject: form.subject.trim(),
        message: form.message.trim(),
        anonymous: form.anonymous,
        name: form.anonymous ? "" : form.name.trim(),
        mobile: form.anonymous ? "" : form.mobile,
        email: form.anonymous ? "" : form.email.trim(),
        channel: form.anonymous ? "" : form.channel,
        lang,
      };
      const record = await create("feedback", data, "received");

      // Company-facing message is always in Arabic.
      const A = TEXT.ar;
      const svc = SERVICES.find((s) => s.id === data.service);
      const res = await notifyCompany({
        section: "feedback",
        subject: `${A.companySubject} — ${A.types[data.type].name} — ${record.code}`,
        fields: {
          "رقم التذكرة": record.code,
          [A.typeLabel]: A.types[data.type].name,
          [A.orderRef]: data.orderRef,
          [A.service]: svc?.name.ar,
          [A.rating]: data.rating ? `${data.rating}/5 — ${A.faces[data.rating - 1]}` : "",
          [A.subject]: data.subject,
          [A.message]: data.message,
          [A.name]: data.anonymous ? A.anonymous : data.name,
          [A.mobile]: data.mobile,
          [A.email]: data.email,
          [A.channel]: data.channel ? A.channels[data.channel] : "",
        },
        replyTo: data.email || undefined,
      });
      setResult({ code: record.code, type: data.type, anonymous: data.anonymous, res });
      requestAnimationFrame(() => {
        successRef.current?.focus({ preventScroll: true });
        successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    } catch {
      setSubmitError(tx.errors.submit);
    } finally {
      setBusy(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setResult(null);
    setSubmitError("");
  };

  const err = (key) =>
    errors[key] ? (
      <span className="error" id={`fb-${key}-err`}>
        {errors[key]}
      </span>
    ) : null;

  const aria = (key, hint) => ({
    "aria-invalid": errors[key] ? "true" : "false",
    "aria-describedby": [hint && `fb-${key}-hint`, errors[key] && `fb-${key}-err`].filter(Boolean).join(" ") || undefined,
    "data-field": key,
  });

  const msgLen = form.message.length;
  const remaining = MAX_MSG - msgLen;
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <>
      <Seo title={tx.seoTitle} description={tx.seoDesc} path="/feedback" />

      <section className="page-hero fb-hero">
        <div className="container">
          <span className="eyebrow">
            <MessagesSquare size={16} strokeWidth={1.5} aria-hidden="true" />
            {tx.eyebrow}
          </span>
          <h1 className="section-title">{tx.title}</h1>
          <p className="section-lead fb-lead">{tx.lead}</p>
        </div>
      </section>

      <section className="fb-section">
        <div className="container fb-wrap">
          {result ? (
            <div className="card fb-card fb-success" aria-live="polite">
              <div className="fb-success-icon">
                <Check size={30} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h2 ref={successRef} tabIndex={-1}>
                {tx.successTitle}
              </h2>
              <div className="fb-ref">
                <span className="fb-ref-label">{tx.ticket}</span>
                <strong className="ltr" dir="ltr">
                  {result.code}
                </strong>
                <button type="button" className="btn btn-ghost btn-sm" onClick={copyCode}>
                  {copied ? (
                    <Check size={16} strokeWidth={1.5} aria-hidden="true" />
                  ) : (
                    <Copy size={16} strokeWidth={1.5} aria-hidden="true" />
                  )}
                  <span aria-live="polite">{copied ? common.actions.copied : common.actions.copy}</span>
                </button>
              </div>
              <p className={`fb-eta${result.type === "complaint" ? " is-urgent" : ""}`}>
                <Clock size={18} strokeWidth={1.5} aria-hidden="true" />
                {result.anonymous ? tx.eta.anon : tx.eta[result.type]}
              </p>
              <p className="fb-muted">{tx.keepCode}</p>
              {!result.res.whatsappApi && !result.res.email && (
                <div className="fb-wa">
                  <p className="fb-muted">{tx.waHint}</p>
                  <a className="btn" href={result.res.fallbackLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" />
                    {tx.sendWa}
                  </a>
                </div>
              )}
              <button type="button" className="btn btn-ghost" onClick={reset}>
                {tx.another}
              </button>
            </div>
          ) : (
            <form className="card fb-card" ref={formRef} noValidate onSubmit={submit}>
              {/* Type */}
              <fieldset className="fb-fieldset">
                <legend className="fb-label">{tx.typeLabel}</legend>
                <div className="fb-types" role="radiogroup" aria-label={tx.typeLabel}>
                  {TYPES.map((t, i) => {
                    const Icon = t.icon;
                    const on = form.type === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        data-field={i === 0 ? "type" : undefined}
                        className={`fb-type fb-type-${t.id}${on ? " is-on" : ""}`}
                        onClick={() => chooseType(t.id)}
                      >
                        <span className="fb-type-icon">
                          <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
                        </span>
                        <strong>{tx.types[t.id].name}</strong>
                        <small>{tx.types[t.id].desc}</small>
                        <span className="fb-type-check" aria-hidden="true">
                          <Check size={14} strokeWidth={1.5} />
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.type && <p className="fb-error">{errors.type}</p>}
              </fieldset>

              <div className="fb-grid">
                <div className="field">
                  <label htmlFor="fb-orderRef">
                    {tx.orderRef} <span className="fb-optional">({tx.optional})</span>
                  </label>
                  <input
                    id="fb-orderRef"
                    className="input ltr"
                    dir="ltr"
                    placeholder="ZB-XXXXXX"
                    maxLength={9}
                    autoComplete="off"
                    spellCheck={false}
                    value={form.orderRef}
                    onChange={(e) => set("orderRef", normCode(e.target.value))}
                    {...aria("orderRef", true)}
                  />
                  <span className="hint" id="fb-orderRef-hint">
                    {tx.orderRefHint}
                  </span>
                  {err("orderRef")}
                </div>
                <div className="field">
                  <label htmlFor="fb-service">
                    {tx.service} <span className="fb-optional">({tx.optional})</span>
                  </label>
                  <select
                    id="fb-service"
                    className="select"
                    value={form.service}
                    onChange={(e) => set("service", e.target.value)}
                  >
                    <option value="">{tx.servicePh}</option>
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {l(s.name)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Rating
                value={form.rating}
                onChange={(v) => set("rating", v)}
                labels={tx.faces}
                label={
                  <>
                    {tx.rating} <span className="fb-optional">({tx.optional})</span>
                  </>
                }
                hint={tx.ratingHint}
              />

              <div className="field">
                <label htmlFor="fb-subject">{tx.subject}</label>
                <input
                  id="fb-subject"
                  className="input"
                  maxLength={120}
                  value={form.subject}
                  onChange={(e) => set("subject", e.target.value)}
                  {...aria("subject")}
                />
                {err("subject")}
              </div>

              <div className="field">
                <label htmlFor="fb-message">{tx.message}</label>
                <textarea
                  id="fb-message"
                  className="textarea fb-textarea"
                  maxLength={MAX_MSG}
                  rows={6}
                  placeholder={tx.messagePh}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value.slice(0, MAX_MSG))}
                  {...aria("message", true)}
                />
                <div className="fb-counter-row">
                  {err("message") || <span />}
                  <span
                    id="fb-message-hint"
                    className={`fb-counter ltr${remaining <= 100 ? " is-near" : ""}${remaining === 0 ? " is-max" : ""}`}
                    dir="ltr"
                  >
                    {tx.chars(msgLen, MAX_MSG)}
                  </span>
                </div>
                <span className="sr-only" aria-live="polite">
                  {remaining <= 100 && remaining % 25 === 0 ? tx.nearLimit(remaining) : ""}
                </span>
              </div>

              {/* Anonymous toggle */}
              <div className={`fb-anon${anonAllowed ? "" : " is-disabled"}${form.anonymous ? " is-on" : ""}`}>
                <span className="fb-anon-icon" aria-hidden="true">
                  <EyeOff size={20} strokeWidth={1.5} />
                </span>
                <div className="fb-anon-text">
                  <span id="fb-anon-label" className="fb-anon-title">
                    {tx.anon}
                  </span>
                  <span id="fb-anon-hint" className="fb-anon-hint">
                    {form.type && !anonAllowed ? tx.anonBlocked : tx.anonHint}
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  className="fb-switch"
                  aria-checked={form.anonymous}
                  aria-labelledby="fb-anon-label"
                  aria-describedby="fb-anon-hint"
                  disabled={!anonAllowed}
                  onClick={toggleAnon}
                >
                  <span className="fb-switch-thumb" />
                </button>
              </div>

              {!form.anonymous && (
                <div className="fb-contact">
                  <div className="fb-grid">
                    <div className="field">
                      <label htmlFor="fb-name">{tx.name}</label>
                      <input
                        id="fb-name"
                        className="input"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        {...aria("name")}
                      />
                      {err("name")}
                    </div>
                    <div className="field">
                      <label htmlFor="fb-mobile">{tx.mobile}</label>
                      <input
                        id="fb-mobile"
                        className="input ltr"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        maxLength={10}
                        placeholder="05XXXXXXXX"
                        value={form.mobile}
                        onChange={(e) => set("mobile", digits(e.target.value))}
                        {...aria("mobile", true)}
                      />
                      <span className="hint" id="fb-mobile-hint">
                        {tx.mobileHint}
                      </span>
                      {err("mobile")}
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="fb-email">
                      {tx.email}
                      {form.channel !== "email" && <span className="fb-optional"> ({tx.optional})</span>}
                    </label>
                    <input
                      id="fb-email"
                      className="input ltr"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      {...aria("email")}
                    />
                    {err("email")}
                  </div>
                  <div className="field">
                    <span className="fb-label" id="fb-channel-label">
                      {tx.channel}
                    </span>
                    <div className="chips" role="group" aria-labelledby="fb-channel-label">
                      {CHANNELS.map((c) => {
                        const Icon = c.icon;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            className="chip"
                            aria-pressed={form.channel === c.id}
                            onClick={() => set("channel", c.id)}
                          >
                            <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                            {tx.channels[c.id]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div aria-live="polite">
                {hasErrors && (
                  <p className="fb-error fb-error-summary">
                    <CircleAlert size={16} strokeWidth={1.5} aria-hidden="true" />
                    {tx.fixErrors}
                  </p>
                )}
                {submitError && (
                  <p className="fb-error fb-error-summary">
                    <CircleAlert size={16} strokeWidth={1.5} aria-hidden="true" />
                    {submitError}
                  </p>
                )}
              </div>

              <div className="fb-actions">
                <button type="submit" className="btn fb-submit" disabled={busy}>
                  {busy ? (
                    <Loader2 size={18} strokeWidth={1.5} aria-hidden="true" className="fb-spin" />
                  ) : (
                    <Send size={18} strokeWidth={1.5} aria-hidden="true" className="flip-rtl" />
                  )}
                  {busy ? tx.submitting : tx.submit}
                </button>
              </div>
            </form>
          )}

          <TrackTicket tx={tx} statusLabel={statusLabel} />
        </div>
      </section>
    </>
  );
}
