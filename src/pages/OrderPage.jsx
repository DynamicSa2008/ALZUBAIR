import { cloneElement, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCheck,
  Copy,
  LoaderCircle,
  Mail,
  MessageCircle,
  PartyPopper,
  PhoneCall,
  Send,
  Search,
} from "lucide-react";
import Seo from "../components/Seo";
import { useI18n } from "../i18n/I18nProvider";
import { COMMON } from "../i18n/common";
import { SERVICES, serviceById } from "../data/services";
import { create } from "../lib/store";
import { notifyCompany } from "../lib/notify";
import { BUDGETS, CHANNELS, OPTION_LABELS } from "../components/dashboard/labels";
import "./OrderPage.css";

const TEXT = {
  ar: {
    seoTitle: "اطلب خدمة",
    seoDesc: "اطلب خدمة تسجيل أو ترجمة علامة تجارية، تصميم هوية، طباعة أو دعاية من شركة الزبير خلال دقائق.",
    eyebrow: "طلب جديد",
    title: "اطلب خدمتك في أربع خطوات",
    lead: "اختر الخدمة، أخبرنا عن مشروعك، واترك لنا وسيلة التواصل — وسيتواصل معك فريقنا لتأكيد التفاصيل والتسعير.",
    steps: ["الخدمات", "تفاصيل المشروع", "بيانات التواصل", "المراجعة"],
    stepOf: (a, b) => `الخطوة ${a} من ${b}`,
    pickTitle: "ما الخدمات التي تحتاجها؟",
    pickHint: "يمكنك اختيار أكثر من خدمة.",
    pickError: "اختر خدمة واحدة على الأقل.",
    selected: (n) => `${n} مختارة`,
    detailsTitle: "حدّثنا عن مشروعك",
    brand: "اسم العلامة التجارية / المشروع",
    brandHint: "كما تريد أن يظهر في التسجيل أو التصميم.",
    brandError: "اكتب اسم العلامة أو المشروع.",
    notes: "تفاصيل وملاحظات",
    notesHint: "أي معلومة تساعدنا: المقاسات، الكميات، الألوان، اللغة المطلوبة…",
    quantity: "الكمية (اختياري)",
    deadline: "الموعد المطلوب للتسليم",
    budget: "الميزانية التقريبية",
    contactTitle: "كيف نتواصل معك؟",
    name: "الاسم الكامل",
    nameError: "اكتب اسمك.",
    phone: "رقم الجوال",
    phoneHint: "بصيغة 05xxxxxxxx",
    phoneError: "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام.",
    email: "البريد الإلكتروني (اختياري)",
    emailError: "صيغة البريد الإلكتروني غير صحيحة.",
    city: "المدينة",
    channel: "وسيلة التواصل المفضلة",
    reviewTitle: "راجع طلبك قبل الإرسال",
    edit: "تعديل",
    services: "الخدمات",
    project: "المشروع",
    contact: "التواصل",
    submit: "إرسال الطلب",
    sending: "جارٍ الإرسال…",
    submitError: "تعذّر إرسال الطلب، حاول مرة أخرى.",
    successEyebrow: "تم استلام طلبك",
    successTitle: "شكراً لك! طلبك وصلنا",
    successLead: "احتفظ برقم الطلب لمتابعة حالته في أي وقت. سيتواصل معك فريقنا قريباً.",
    codeLabel: "رقم الطلب",
    track: "تتبع الطلب",
    sendWa: "أرسل الطلب عبر واتساب",
    sendWaHint: "لتسريع المعالجة، أرسل ملخص الطلب لفريقنا مباشرة على واتساب.",
    notified: "تم إشعار فريقنا بطلبك تلقائياً.",
    newOrder: "طلب جديد",
  },
  en: {
    seoTitle: "Request a service",
    seoDesc: "Request trademark registration or translation, brand identity, printing or advertising from Al Zubair in minutes.",
    eyebrow: "New request",
    title: "Request a service in four steps",
    lead: "Pick the services, tell us about your project and how to reach you — our team will get back to confirm details and pricing.",
    steps: ["Services", "Project details", "Contact", "Review"],
    stepOf: (a, b) => `Step ${a} of ${b}`,
    pickTitle: "Which services do you need?",
    pickHint: "You can pick more than one.",
    pickError: "Pick at least one service.",
    selected: (n) => `${n} selected`,
    detailsTitle: "Tell us about your project",
    brand: "Brand / project name",
    brandHint: "As you want it to appear in the filing or design.",
    brandError: "Enter the brand or project name.",
    notes: "Details & notes",
    notesHint: "Anything that helps: sizes, quantities, colours, target language…",
    quantity: "Quantity (optional)",
    deadline: "Desired deadline",
    budget: "Approximate budget",
    contactTitle: "How can we reach you?",
    name: "Full name",
    nameError: "Enter your name.",
    phone: "Mobile number",
    phoneHint: "Format 05xxxxxxxx",
    phoneError: "Mobile must start with 05 and be 10 digits.",
    email: "Email (optional)",
    emailError: "Email address looks invalid.",
    city: "City",
    channel: "Preferred channel",
    reviewTitle: "Review your request",
    edit: "Edit",
    services: "Services",
    project: "Project",
    contact: "Contact",
    submit: "Submit request",
    sending: "Sending…",
    submitError: "We couldn't submit your request. Please try again.",
    successEyebrow: "Request received",
    successTitle: "Thank you! We've got your request",
    successLead: "Keep your order code to check its status anytime. Our team will contact you shortly.",
    codeLabel: "Order code",
    track: "Track order",
    sendWa: "Send the order on WhatsApp",
    sendWaHint: "To speed things up, send the summary to our team directly on WhatsApp.",
    notified: "Our team has been notified automatically.",
    newOrder: "New request",
  },
};

// The message sent to the company is always in Arabic (staff language).
const AR = { ...TEXT.ar, ...OPTION_LABELS.ar };
const CHANNEL_ICONS = { whatsapp: MessageCircle, email: Mail, call: PhoneCall };

const PHONE_RE = /^05\d{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isoToday() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function initialForm(params) {
  const pre = params.get("service");
  return {
    services: pre && serviceById(pre) ? [pre] : [],
    brand: "",
    notes: (params.get("details") || "").slice(0, 2000),
    quantity: "",
    deadline: "",
    budget: "",
    name: "",
    phone: "",
    email: "",
    city: "",
    channel: "whatsapp",
  };
}

function validate(step, f, tx) {
  const e = {};
  if (step === 0 && f.services.length === 0) e.services = tx.pickError;
  if (step === 1 && !f.brand.trim()) e.brand = tx.brandError;
  if (step === 2) {
    if (!f.name.trim()) e.name = tx.nameError;
    if (!PHONE_RE.test(f.phone.trim())) e.phone = tx.phoneError;
    if (f.email.trim() && !EMAIL_RE.test(f.email.trim())) e.email = tx.emailError;
  }
  return e;
}

export default function OrderPage() {
  const { pick, l, isAr, formatDate } = useI18n();
  const tx = { ...pick(TEXT), ...pick(OPTION_LABELS) };
  const common = pick(COMMON);
  const [params] = useSearchParams();
  const [form, setForm] = useState(() => initialForm(params));
  // With a preselected service we start on the details step.
  const [step, setStep] = useState(() => (form.services.length ? 1 : 0));
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState(null);
  const [today] = useState(isoToday);
  const headRef = useRef(null);

  const setValue = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((er) => (er[key] ? { ...er, [key]: undefined } : er));
  };
  const bind = (key) => (e) => setValue(key, e.target.value);

  const toggleService = (id) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(id) ? f.services.filter((s) => s !== id) : [...f.services, id],
    }));
    setErrors((er) => ({ ...er, services: undefined }));
  };

  const focusHead = () => requestAnimationFrame(() => headRef.current?.focus());

  const goTo = (n) => {
    setStep(n);
    setSubmitError("");
    focusHead();
  };

  const next = () => {
    const e = validate(step, form, tx);
    setErrors(e);
    const keys = Object.keys(e);
    if (keys.length) {
      document.querySelector(`[data-field="${keys[0]}"]`)?.focus();
      return;
    }
    goTo(step + 1);
  };

  const submit = async () => {
    for (let s = 0; s < 3; s++) {
      const e = validate(s, form, tx);
      if (Object.keys(e).length) {
        setErrors(e);
        goTo(s);
        return;
      }
    }
    setSending(true);
    setSubmitError("");
    try {
      const data = {
        ...form,
        brand: form.brand.trim(),
        notes: form.notes.trim(),
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        city: form.city.trim(),
        lang: isAr ? "ar" : "en",
      };
      const record = await create("orders", data, "received");
      const res = await notifyCompany({
        section: "orders",
        subject: `طلب خدمة جديد ${record.code}`,
        replyTo: data.email,
        fields: {
          "رقم الطلب": record.code,
          [AR.services]: data.services.map((id) => serviceById(id)?.name.ar || id).join("، "),
          [AR.brand]: data.brand,
          [AR.notes]: data.notes,
          [AR.quantity]: data.quantity,
          [AR.deadline]: data.deadline,
          [AR.budget]: data.budget ? AR.budgets[data.budget] : "",
          [AR.name]: data.name,
          [AR.phone]: data.phone,
          [AR.email]: data.email,
          [AR.city]: data.city,
          [AR.channel]: AR.channels[data.channel],
        },
      });
      setResult({ record, res });
      focusHead();
    } catch {
      setSubmitError(tx.submitError);
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setForm(initialForm(new URLSearchParams()));
    setErrors({});
    setResult(null);
    goTo(0);
  };

  return (
    <>
      <Seo title={tx.seoTitle} description={tx.seoDesc} path="/order" />
      <section className="page-hero ord-hero">
        <div className="container">
          <span className="eyebrow">{tx.eyebrow}</span>
          <h1 className="section-title">{tx.title}</h1>
          <p className="section-lead">{tx.lead}</p>
        </div>
      </section>

      <section className="ord-wrap">
        <div className="container">
          {result ? (
            <Success result={result} tx={tx} common={common} onReset={reset} headRef={headRef} />
          ) : (
            <div className="ord-shell card">
              <Stepper steps={tx.steps} current={step} onJump={(i) => i < step && goTo(i)} />

              <div className="ord-body">
                <p className="ord-stepof" aria-live="polite">
                  {tx.stepOf(step + 1, tx.steps.length)}
                </p>

                {step === 0 && (
                  <div role="group" aria-labelledby="ord-pick-title">
                    <h2 ref={headRef} tabIndex={-1} id="ord-pick-title" className="ord-step-title">
                      {tx.pickTitle}
                    </h2>
                    <p className="ord-hint">
                      {tx.pickHint}
                      {form.services.length > 0 && (
                        <span className="badge ord-count">{tx.selected(form.services.length)}</span>
                      )}
                    </p>
                    <div className="ord-services">
                      {SERVICES.map((s, i) => {
                        const Icon = s.icon;
                        const on = form.services.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            className="ord-svc"
                            aria-pressed={on}
                            data-field={i === 0 ? "services" : undefined}
                            onClick={() => toggleService(s.id)}
                          >
                            <span className="icon-bubble">
                              <Icon strokeWidth={1.5} aria-hidden="true" />
                            </span>
                            <span className="ord-svc-text">
                              <strong>{l(s.name)}</strong>
                              <span>{l(s.blurb)}</span>
                            </span>
                            <span className="ord-svc-check" aria-hidden="true">
                              <Check strokeWidth={1.5} />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.services && (
                      <p className="ord-error" role="alert">
                        {errors.services}
                      </p>
                    )}
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h2 ref={headRef} tabIndex={-1} className="ord-step-title">
                      {tx.detailsTitle}
                    </h2>
                    <Field id="ord-brand" label={tx.brand} hint={tx.brandHint} error={errors.brand}>
                      <input
                        data-field="brand"
                        className="input"
                        value={form.brand}
                        onChange={bind("brand")}
                        maxLength={120}
                        autoComplete="organization"
                        required
                      />
                    </Field>
                    <Field id="ord-notes" label={tx.notes} hint={tx.notesHint}>
                      <textarea
                        className="textarea"
                        value={form.notes}
                        onChange={bind("notes")}
                        maxLength={2000}
                        rows={5}
                      />
                    </Field>
                    <div className="ord-row">
                      <Field id="ord-qty" label={tx.quantity}>
                        <input
                          className="input"
                          type="number"
                          min="1"
                          inputMode="numeric"
                          value={form.quantity}
                          onChange={bind("quantity")}
                        />
                      </Field>
                      <Field id="ord-deadline" label={tx.deadline}>
                        <input
                          className="input"
                          type="date"
                          min={today}
                          value={form.deadline}
                          onChange={bind("deadline")}
                        />
                      </Field>
                    </div>
                    <div className="field">
                      <span className="ord-label" id="ord-budget-label">
                        {tx.budget}
                      </span>
                      <div className="chips" role="group" aria-labelledby="ord-budget-label">
                        {BUDGETS.map((b) => (
                          <button
                            key={b}
                            type="button"
                            className="chip"
                            aria-pressed={form.budget === b}
                            onClick={() => setValue("budget", form.budget === b ? "" : b)}
                          >
                            {tx.budgets[b]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 ref={headRef} tabIndex={-1} className="ord-step-title">
                      {tx.contactTitle}
                    </h2>
                    <div className="ord-row">
                      <Field id="ord-name" label={tx.name} error={errors.name}>
                        <input
                          data-field="name"
                          className="input"
                          value={form.name}
                          onChange={bind("name")}
                          autoComplete="name"
                          maxLength={80}
                          required
                        />
                      </Field>
                      <Field id="ord-phone" label={tx.phone} hint={tx.phoneHint} error={errors.phone}>
                        <input
                          data-field="phone"
                          className="input"
                          type="tel"
                          inputMode="numeric"
                          placeholder="05xxxxxxxx"
                          value={form.phone}
                          onChange={(e) => setValue("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                          autoComplete="tel"
                          required
                        />
                      </Field>
                    </div>
                    <div className="ord-row">
                      <Field id="ord-email" label={tx.email} error={errors.email}>
                        <input
                          data-field="email"
                          className="input"
                          type="email"
                          value={form.email}
                          onChange={bind("email")}
                          autoComplete="email"
                        />
                      </Field>
                      <Field id="ord-city" label={tx.city}>
                        <input
                          className="input"
                          value={form.city}
                          onChange={bind("city")}
                          autoComplete="address-level2"
                          maxLength={60}
                        />
                      </Field>
                    </div>
                    <div className="field">
                      <span className="ord-label" id="ord-channel-label">
                        {tx.channel}
                      </span>
                      <div className="chips" role="radiogroup" aria-labelledby="ord-channel-label">
                        {CHANNELS.map((c) => {
                          const Icon = CHANNEL_ICONS[c];
                          return (
                            <button
                              key={c}
                              type="button"
                              role="radio"
                              className="chip"
                              aria-checked={form.channel === c}
                              onClick={() => setValue("channel", c)}
                            >
                              <Icon strokeWidth={1.5} aria-hidden="true" />
                              {tx.channels[c]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 ref={headRef} tabIndex={-1} className="ord-step-title">
                      {tx.reviewTitle}
                    </h2>
                    <div className="ord-review">
                      <ReviewBlock title={tx.services} onEdit={() => goTo(0)} editLabel={tx.edit}>
                        <ul className="ord-review-svcs">
                          {form.services.map((id) => {
                            const s = serviceById(id);
                            const Icon = s.icon;
                            return (
                              <li key={id}>
                                <Icon strokeWidth={1.5} aria-hidden="true" />
                                {l(s.name)}
                              </li>
                            );
                          })}
                        </ul>
                      </ReviewBlock>
                      <ReviewBlock title={tx.project} onEdit={() => goTo(1)} editLabel={tx.edit}>
                        <dl className="ord-dl">
                          <Row k={tx.brand} v={form.brand} />
                          <Row k={tx.notes} v={form.notes} pre />
                          <Row k={tx.quantity} v={form.quantity} />
                          <Row k={tx.deadline} v={form.deadline && formatDate(form.deadline)} />
                          <Row k={tx.budget} v={form.budget && tx.budgets[form.budget]} />
                        </dl>
                      </ReviewBlock>
                      <ReviewBlock title={tx.contact} onEdit={() => goTo(2)} editLabel={tx.edit}>
                        <dl className="ord-dl">
                          <Row k={tx.name} v={form.name} />
                          <Row k={tx.phone} v={form.phone} ltr />
                          <Row k={tx.email} v={form.email} ltr />
                          <Row k={tx.city} v={form.city} />
                          <Row k={tx.channel} v={tx.channels[form.channel]} />
                        </dl>
                      </ReviewBlock>
                    </div>
                    {submitError && (
                      <div className="alert ord-alert-error" role="alert">
                        {submitError}
                      </div>
                    )}
                  </div>
                )}

                <div className="ord-nav">
                  {step > 0 ? (
                    <button type="button" className="btn btn-ghost" onClick={() => goTo(step - 1)}>
                      <ArrowLeft strokeWidth={1.5} size={18} className="flip-rtl" aria-hidden="true" />
                      {common.actions.back}
                    </button>
                  ) : (
                    <span />
                  )}
                  {step < 3 ? (
                    <button type="button" className="btn" onClick={next}>
                      {common.actions.next}
                      <ArrowRight strokeWidth={1.5} size={18} className="flip-rtl" aria-hidden="true" />
                    </button>
                  ) : (
                    <button type="button" className="btn" onClick={submit} disabled={sending} aria-busy={sending}>
                      {sending ? (
                        <LoaderCircle strokeWidth={1.5} size={18} className="ord-spin" aria-hidden="true" />
                      ) : (
                        <Send strokeWidth={1.5} size={18} className="flip-rtl" aria-hidden="true" />
                      )}
                      {sending ? tx.sending : tx.submit}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Field({ id, label, hint, error, children }) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {cloneElement(children, {
        id,
        "aria-invalid": error ? "true" : undefined,
        "aria-describedby": describedBy,
      })}
      {hint && !error && (
        <span className="hint" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {error && (
        <span className="error" id={`${id}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

function Stepper({ steps, current, onJump }) {
  return (
    <ol className="ord-stepper">
      {steps.map((label, i) => {
        const state = i < current ? "done" : i === current ? "current" : "todo";
        return (
          <li key={label} className={`ord-step is-${state}`} aria-current={i === current ? "step" : undefined}>
            <button type="button" onClick={() => onJump(i)} disabled={i >= current} className="ord-step-btn">
              <span className="ord-step-dot" aria-hidden="true">
                {state === "done" ? <Check strokeWidth={1.5} size={16} /> : i + 1}
              </span>
              <span className="ord-step-label">{label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function ReviewBlock({ title, onEdit, editLabel, children }) {
  return (
    <div className="ord-review-block">
      <div className="ord-review-head">
        <h3>{title}</h3>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onEdit} aria-label={`${editLabel}: ${title}`}>
          {editLabel}
        </button>
      </div>
      {children}
    </div>
  );
}

function Row({ k, v, ltr, pre }) {
  return (
    <div className="ord-dl-row">
      <dt>{k}</dt>
      <dd className={pre ? "ord-pre" : undefined}>{ltr && v ? <span className="ltr">{v}</span> : v || "—"}</dd>
    </div>
  );
}

function Success({ result, tx, common, onReset, headRef }) {
  const { record, res } = result;
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(record.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };
  const automatic = res.whatsappApi || res.email;
  return (
    <div className="ord-success card">
      <span className="ord-success-icon" aria-hidden="true">
        <PartyPopper strokeWidth={1.5} />
      </span>
      <span className="eyebrow">{tx.successEyebrow}</span>
      <h2 ref={headRef} tabIndex={-1} className="ord-success-title">
        {tx.successTitle}
      </h2>
      <p className="section-lead">{tx.successLead}</p>

      <div className="ord-code-box">
        <span className="ord-code-label">{tx.codeLabel}</span>
        <strong className="ord-code ltr">{record.code}</strong>
        <button type="button" className="btn btn-ghost btn-sm" onClick={copy}>
          {copied ? (
            <CheckCheck strokeWidth={1.5} size={16} aria-hidden="true" />
          ) : (
            <Copy strokeWidth={1.5} size={16} aria-hidden="true" />
          )}
          {copied ? common.actions.copied : common.actions.copy}
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? common.actions.copied : ""}
        </span>
      </div>

      {automatic ? (
        <p className="alert ord-ok">
          <CheckCheck strokeWidth={1.5} size={20} aria-hidden="true" />
          {tx.notified}
        </p>
      ) : (
        <p className="ord-hint ord-center">{tx.sendWaHint}</p>
      )}

      <div className="ord-success-actions">
        {!automatic && (
          <a className="btn" href={res.fallbackLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle strokeWidth={1.5} size={18} aria-hidden="true" />
            {tx.sendWa}
          </a>
        )}
        <Link className={automatic ? "btn" : "btn btn-ghost"} to={`/track?code=${encodeURIComponent(record.code)}`}>
          <Search strokeWidth={1.5} size={18} aria-hidden="true" />
          {tx.track}
        </Link>
        <button type="button" className="btn btn-ghost" onClick={onReset}>
          {tx.newOrder}
        </button>
      </div>
    </div>
  );
}
