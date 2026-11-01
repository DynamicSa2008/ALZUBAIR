import { useEffect, useRef, useState } from "react";
import {
  User,
  Store,
  Building2,
  IdCard,
  Phone,
  FileText,
  ClipboardCheck,
  Check,
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  Copy,
  MessageCircle,
  ShieldCheck,
  BadgeCheck,
  Lock,
  Info,
  CircleAlert,
  Loader2,
} from "lucide-react";
import Seo from "../components/Seo";
import { useI18n } from "../i18n/I18nProvider";
import { COMMON } from "../i18n/common";
import { create } from "../lib/store";
import { notifyCompany } from "../lib/notify";
import "./KycPage.css";

const CITIES = [
  { id: "riyadh", ar: "الرياض", en: "Riyadh" },
  { id: "jeddah", ar: "جدة", en: "Jeddah" },
  { id: "makkah", ar: "مكة المكرمة", en: "Makkah" },
  { id: "madinah", ar: "المدينة المنورة", en: "Madinah" },
  { id: "dammam", ar: "الدمام", en: "Dammam" },
  { id: "khobar", ar: "الخبر", en: "Al Khobar" },
  { id: "dhahran", ar: "الظهران", en: "Dhahran" },
  { id: "ahsa", ar: "الأحساء", en: "Al Ahsa" },
  { id: "jubail", ar: "الجبيل", en: "Jubail" },
  { id: "qatif", ar: "القطيف", en: "Qatif" },
  { id: "taif", ar: "الطائف", en: "Taif" },
  { id: "tabuk", ar: "تبوك", en: "Tabuk" },
  { id: "buraidah", ar: "بريدة", en: "Buraidah" },
  { id: "unaizah", ar: "عنيزة", en: "Unaizah" },
  { id: "hail", ar: "حائل", en: "Hail" },
  { id: "abha", ar: "أبها", en: "Abha" },
  { id: "khamis", ar: "خميس مشيط", en: "Khamis Mushait" },
  { id: "jazan", ar: "جازان", en: "Jazan" },
  { id: "najran", ar: "نجران", en: "Najran" },
  { id: "yanbu", ar: "ينبع", en: "Yanbu" },
  { id: "kharj", ar: "الخرج", en: "Al Kharj" },
  { id: "hafr", ar: "حفر الباطن", en: "Hafr Al Batin" },
  { id: "baha", ar: "الباحة", en: "Al Baha" },
  { id: "arar", ar: "عرعر", en: "Arar" },
  { id: "sakaka", ar: "سكاكا", en: "Sakaka" },
  { id: "other", ar: "مدينة أخرى", en: "Other city" },
];

const TYPES = [
  { id: "individual", icon: User },
  { id: "establishment", icon: Store },
  { id: "company", icon: Building2 },
];

const DOCS = [
  { id: "idCopy", entityOnly: false },
  { id: "crCopy", entityOnly: true },
  { id: "addressCert", entityOnly: false },
  { id: "authLetter", entityOnly: true, optional: true },
];

const STEP_ICONS = [User, IdCard, Phone, FileText, ClipboardCheck];
const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPT = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const TEXT = {
  ar: {
    seoTitle: "توثيق العميل (KYC)",
    seoDesc:
      "وثّق بياناتك لدى شركة الزبير خلال دقائق لتسريع تسجيل علامتك التجارية لدى الهيئة السعودية للملكية الفكرية.",
    eyebrow: "توثيق العميل",
    title: "اعرف عميلك — وثّق بياناتك بخطوات بسيطة",
    lead: "نحتاج بعض البيانات الأساسية للتحقق من هوية مالك العلامة التجارية قبل رفع الطلب للجهات الرسمية. بياناتك محمية ولا تُستخدم إلا لغرض تقديم الخدمة.",
    steps: ["نوع العميل", "بيانات الهوية", "التواصل والعنوان", "المستندات", "المراجعة والإرسال"],
    stepOf: (a, b) => `الخطوة ${a} من ${b}`,
    types: {
      individual: { name: "فرد", desc: "مالك العلامة شخص طبيعي" },
      establishment: { name: "مؤسسة", desc: "مؤسسة فردية بسجل تجاري" },
      company: { name: "شركة", desc: "شركة مسجلة بسجل تجاري" },
    },
    typeQ: "من هو مالك العلامة التجارية؟",
    fullName: "الاسم الكامل (كما في الهوية)",
    nationalId: "رقم الهوية الوطنية أو الإقامة",
    nationalIdHint: "10 أرقام تبدأ بـ 1 للمواطن أو 2 للمقيم",
    entityName: "اسم المنشأة (كما في السجل التجاري)",
    cr: "رقم السجل التجاري",
    crHint: "10 أرقام",
    unified: "الرقم الموحد (700)",
    unifiedHint: "10 أرقام تبدأ بـ 7",
    vat: "الرقم الضريبي",
    vatHint: "15 رقماً يبدأ وينتهي بالرقم 3",
    authName: "اسم المفوّض بالتوقيع",
    authId: "رقم هوية المفوّض",
    mobile: "رقم الجوال",
    mobileHint: "مثال: 0512345678",
    email: "البريد الإلكتروني",
    city: "المدينة",
    cityPh: "اختر المدينة",
    shortAddr: "العنوان الوطني المختصر",
    shortAddrHint: "4 أحرف و4 أرقام، مثل RRRD2929",
    optional: "اختياري",
    docs: {
      idCopy: "صورة الهوية / الإقامة",
      crCopy: "صورة السجل التجاري",
      addressCert: "شهادة العنوان الوطني",
      authLetter: "خطاب التفويض",
    },
    docsIntro: "أرفق المستندات المتوفرة لديك الآن (PDF أو JPG أو PNG، بحد أقصى 5 ميجابايت للملف).",
    docsNote:
      "لا نحتفظ بمحتوى الملفات على الموقع، بل نسجّل اسم الملف وحجمه فقط. وإن احتجنا إلى أي مستند فسيتواصل معك فريقنا عبر واتساب لاستلامه.",
    choose: "اختر ملفاً",
    replace: "استبدال",
    remove: "إزالة الملف",
    review: "راجع بياناتك قبل الإرسال",
    edit: "تعديل",
    noFiles: "لم تُرفق مستندات",
    consent:
      "أوافق على قيام شركة الزبير بجمع بياناتي الشخصية ومعالجتها لغرض التحقق من الهوية وتقديم خدمات تسجيل العلامة التجارية، ومشاركتها مع الجهات الحكومية المختصة عند الحاجة فقط، وفقاً لنظام حماية البيانات الشخصية في المملكة العربية السعودية، مع حفظ حقي في الاطلاع عليها أو تصحيحها أو طلب إتلافها.",
    submit: "إرسال طلب التوثيق",
    submitting: "جارٍ الإرسال…",
    errors: {
      type: "اختر نوع العميل",
      name: "اكتب الاسم الكامل (ثلاثة أحرف على الأقل)",
      nationalId: "رقم الهوية يتكون من 10 أرقام ويبدأ بـ 1 أو 2",
      cr: "رقم السجل التجاري يتكون من 10 أرقام",
      unified: "الرقم الموحد يتكون من 10 أرقام ويبدأ بـ 7",
      vat: "الرقم الضريبي 15 رقماً يبدأ وينتهي بالرقم 3",
      mobile: "رقم الجوال يبدأ بـ 05 ويتكون من 10 أرقام",
      email: "اكتب بريداً إلكترونياً صحيحاً",
      city: "اختر المدينة",
      shortAddr: "الصيغة الصحيحة 4 أحرف إنجليزية و4 أرقام",
      fileType: "نوع الملف غير مدعوم، استخدم PDF أو JPG أو PNG",
      fileSize: "حجم الملف يتجاوز 5 ميجابايت",
      consent: "يلزم الموافقة على معالجة البيانات للمتابعة",
      submit: "تعذّر الإرسال، يرجى المحاولة مرة أخرى",
    },
    fixErrors: "يرجى تصحيح الحقول المميزة",
    successTitle: "تم استلام طلب التوثيق",
    successLead: "شكراً لك. سيراجع فريقنا بياناتك ويتواصل معك قريباً. احتفظ برقم المرجع للمتابعة.",
    ref: "رقم المرجع",
    sendWa: "أرسل التفاصيل على واتساب",
    waHint: "لضمان وصول طلبك إلينا بسرعة، أرسل التفاصيل عبر واتساب.",
    newReq: "توثيق عميل آخر",
    whyTitle: "لماذا نطلب التوثيق؟",
    whyLead:
      "تشترط الهيئة السعودية للملكية الفكرية (SAIP) بيانات موثّقة لمالك العلامة التجارية عند تقديم طلب التسجيل.",
    why: [
      "تسجيل العلامة باسم مالكها الصحيح يحفظ حقك النظامي فيها.",
      "اكتمال البيانات يقلّل ملاحظات الهيئة ويسرّع صدور الشهادة.",
      "نتعامل مع بياناتك بسرية تامة وفق نظام حماية البيانات الشخصية.",
    ],
    secure: "لا تُشارك بياناتك إلا مع الجهات الرسمية المختصة.",
    companySubject: "طلب توثيق عميل جديد (KYC)",
  },
  en: {
    seoTitle: "Know Your Customer (KYC)",
    seoDesc:
      "Verify your details with Al Zubair in minutes to speed up your trademark registration with the Saudi Authority for Intellectual Property.",
    eyebrow: "Know Your Customer",
    title: "Verify your details in a few simple steps",
    lead: "We need some basic information to confirm the trademark owner's identity before filing with the authorities. Your data is protected and used only to deliver the service.",
    steps: ["Customer type", "Identity", "Contact & address", "Documents", "Review & submit"],
    stepOf: (a, b) => `Step ${a} of ${b}`,
    types: {
      individual: { name: "Individual", desc: "The owner is a natural person" },
      establishment: { name: "Establishment", desc: "Sole proprietorship with a CR" },
      company: { name: "Company", desc: "Registered company with a CR" },
    },
    typeQ: "Who owns the trademark?",
    fullName: "Full name (as on ID)",
    nationalId: "National ID or Iqama number",
    nationalIdHint: "10 digits, starting with 1 (citizen) or 2 (resident)",
    entityName: "Entity name (as on the CR)",
    cr: "Commercial registration (CR) no.",
    crHint: "10 digits",
    unified: "Unified number (700)",
    unifiedHint: "10 digits starting with 7",
    vat: "VAT number",
    vatHint: "15 digits, starts and ends with 3",
    authName: "Authorized signatory name",
    authId: "Authorized signatory ID no.",
    mobile: "Mobile number",
    mobileHint: "e.g. 0512345678",
    email: "Email",
    city: "City",
    cityPh: "Select a city",
    shortAddr: "National address short code",
    shortAddrHint: "4 letters + 4 digits, e.g. RRRD2929",
    optional: "optional",
    docs: {
      idCopy: "ID / Iqama copy",
      crCopy: "Commercial registration copy",
      addressCert: "National address certificate",
      authLetter: "Authorization letter",
    },
    docsIntro: "Attach whatever documents you have now (PDF, JPG or PNG, up to 5 MB each).",
    docsNote:
      "We don't keep file contents on the website — only the file name and size. If we need any document, our team will request it from you on WhatsApp.",
    choose: "Choose file",
    replace: "Replace",
    remove: "Remove file",
    review: "Review your details before submitting",
    edit: "Edit",
    noFiles: "No documents attached",
    consent:
      "I consent to Al Zubair collecting and processing my personal data for identity verification and trademark registration services, and sharing it with the competent government authorities only when required, in accordance with the Saudi Personal Data Protection Law (PDPL), including my right to access, correct or request deletion of my data.",
    submit: "Submit verification",
    submitting: "Submitting…",
    errors: {
      type: "Please choose a customer type",
      name: "Enter the full name (at least 3 characters)",
      nationalId: "ID must be 10 digits starting with 1 or 2",
      cr: "CR number must be 10 digits",
      unified: "Unified number must be 10 digits starting with 7",
      vat: "VAT number is 15 digits starting and ending with 3",
      mobile: "Mobile must start with 05 and be 10 digits",
      email: "Enter a valid email address",
      city: "Please choose a city",
      shortAddr: "Format is 4 English letters + 4 digits",
      fileType: "Unsupported file type — use PDF, JPG or PNG",
      fileSize: "File is larger than 5 MB",
      consent: "Your consent is required to continue",
      submit: "Couldn't submit, please try again",
    },
    fixErrors: "Please fix the highlighted fields",
    successTitle: "Verification request received",
    successLead:
      "Thank you. Our team will review your details and contact you shortly. Keep your reference code for follow-up.",
    ref: "Reference code",
    sendWa: "Send details on WhatsApp",
    waHint: "To make sure your request reaches us quickly, send the details on WhatsApp.",
    newReq: "Verify another customer",
    whyTitle: "Why do we need KYC?",
    whyLead:
      "The Saudi Authority for Intellectual Property (SAIP) requires verified owner details when a trademark application is filed.",
    why: [
      "Registering the mark under its rightful owner protects your legal rights.",
      "Complete data means fewer SAIP remarks and a faster certificate.",
      "Your data is handled confidentially under the Personal Data Protection Law.",
    ],
    secure: "Your data is shared only with the competent official authorities.",
    companySubject: "New customer verification (KYC)",
  },
};

const EMPTY = {
  type: "",
  fullName: "",
  nationalId: "",
  entityName: "",
  cr: "",
  unified: "",
  vat: "",
  authName: "",
  authId: "",
  mobile: "",
  email: "",
  city: "",
  shortAddr: "",
};

// Accept Arabic-Indic digits too, keep only 0-9.
const digits = (v) => v.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/\D/g, "");

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function validate(step, form, consent, E) {
  const e = {};
  const isEntity = form.type && form.type !== "individual";
  if (step === 0 && !form.type) e.type = E.type;
  if (step === 1) {
    if (!isEntity) {
      if (form.fullName.trim().length < 3) e.fullName = E.name;
      if (!/^[12]\d{9}$/.test(form.nationalId)) e.nationalId = E.nationalId;
    } else {
      if (form.entityName.trim().length < 3) e.entityName = E.name;
      if (!/^\d{10}$/.test(form.cr)) e.cr = E.cr;
      if (!/^7\d{9}$/.test(form.unified)) e.unified = E.unified;
      if (form.vat && !/^3\d{13}3$/.test(form.vat)) e.vat = E.vat;
      if (form.authName.trim().length < 3) e.authName = E.name;
      if (!/^[12]\d{9}$/.test(form.authId)) e.authId = E.nationalId;
    }
  }
  if (step === 2) {
    if (!/^05\d{8}$/.test(form.mobile)) e.mobile = E.mobile;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) e.email = E.email;
    if (!form.city) e.city = E.city;
    if (form.shortAddr && !/^[A-Z]{4}\d{4}$/.test(form.shortAddr)) e.shortAddr = E.shortAddr;
  }
  if (step === 4 && !consent) e.consent = E.consent;
  return e;
}

export default function KycPage() {
  const { pick, lang, isAr } = useI18n();
  const tx = pick(TEXT);
  const common = pick(COMMON);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [files, setFiles] = useState({});
  const [fileErrors, setFileErrors] = useState({});
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const headingRef = useRef(null);
  const cardRef = useRef(null);
  const firstRender = useRef(true);

  const isEntity = Boolean(form.type) && form.type !== "individual";
  const total = tx.steps.length;
  const visibleDocs = DOCS.filter((d) => isEntity || !d.entityOnly);

  // Move focus to the new step heading (and bring the card into view) on every step change.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step, result]);

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const focusFirstError = (errs) => {
    const key = Object.keys(errs)[0];
    requestAnimationFrame(() => {
      cardRef.current?.querySelector(`[data-field="${key}"]`)?.focus();
    });
  };

  const next = () => {
    const errs = validate(step, form, consent, tx.errors);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);
    setStep((s) => Math.min(s + 1, total - 1));
  };

  const goTo = (i) => {
    setErrors({});
    setSubmitError("");
    setStep(i);
  };

  const onFile = (id, e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const okType = ALLOWED_TYPES.includes(file.type) || /\.(pdf|jpe?g|png)$/i.test(file.name || "");
    let err = "";
    if (!okType) err = tx.errors.fileType;
    else if (file.size > MAX_SIZE) err = tx.errors.fileSize;
    setFileErrors((fe) => ({ ...fe, [id]: err }));
    if (err) return;
    // Only metadata is kept — never the file contents.
    setFiles((fs) => ({ ...fs, [id]: { name: file.name, size: file.size, type: file.type } }));
  };

  const removeFile = (id) => {
    setFiles((fs) => {
      const nextFiles = { ...fs };
      delete nextFiles[id];
      return nextFiles;
    });
  };

  const cityName = (id, language = lang) => {
    const c = CITIES.find((x) => x.id === id);
    return c ? c[language] || c.ar : "";
  };

  const attachedDocs = visibleDocs.filter((d) => files[d.id]);

  const reviewRows = () => {
    const rows = [[tx.steps[0], tx.types[form.type]?.name]];
    if (isEntity) {
      rows.push(
        [tx.entityName, form.entityName],
        [tx.cr, form.cr, true],
        [tx.unified, form.unified, true],
        [tx.vat, form.vat, true],
        [tx.authName, form.authName],
        [tx.authId, form.authId, true],
      );
    } else {
      rows.push([tx.fullName, form.fullName], [tx.nationalId, form.nationalId, true]);
    }
    rows.push(
      [tx.mobile, form.mobile, true],
      [tx.email, form.email, true],
      [tx.city, cityName(form.city)],
      [tx.shortAddr, form.shortAddr, true],
    );
    return rows.filter(([, v]) => v);
  };

  const submit = async () => {
    const errs = validate(4, form, consent, tx.errors);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);
    setBusy(true);
    setSubmitError("");
    try {
      const documents = attachedDocs.map((d) => ({ kind: d.id, ...files[d.id] }));
      const identity = isEntity
        ? {
            entityName: form.entityName.trim(),
            cr: form.cr,
            unified: form.unified,
            vat: form.vat || "",
            authName: form.authName.trim(),
            authId: form.authId,
          }
        : { fullName: form.fullName.trim(), nationalId: form.nationalId };
      const data = {
        customerType: form.type,
        ...identity,
        name: identity.fullName || identity.entityName,
        mobile: form.mobile,
        email: form.email.trim(),
        city: form.city,
        shortAddr: form.shortAddr,
        documents,
        consent: { pdpl: true, at: new Date().toISOString() },
        lang,
      };
      const record = await create("kyc", data, "reviewing");

      // Company-facing message is always in Arabic.
      const A = TEXT.ar;
      const fields = {
        "رقم المرجع": record.code,
        [A.steps[0]]: A.types[form.type].name,
        ...(isEntity
          ? {
              [A.entityName]: identity.entityName,
              [A.cr]: identity.cr,
              [A.unified]: identity.unified,
              [A.vat]: identity.vat,
              [A.authName]: identity.authName,
              [A.authId]: identity.authId,
            }
          : { [A.fullName]: identity.fullName, [A.nationalId]: identity.nationalId }),
        [A.mobile]: data.mobile,
        [A.email]: data.email,
        [A.city]: cityName(form.city, "ar"),
        [A.shortAddr]: data.shortAddr,
        [A.steps[3]]: documents.length
          ? documents.map((d) => `${A.docs[d.kind]} (${d.name})`).join("، ")
          : A.noFiles,
      };
      const res = await notifyCompany({
        section: "kyc",
        subject: `${A.companySubject} — ${record.code}`,
        fields,
        replyTo: data.email,
      });
      setResult({ code: record.code, res });
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
    setFiles({});
    setFileErrors({});
    setConsent(false);
    setErrors({});
    setSubmitError("");
    setResult(null);
    setStep(0);
  };

  const renderInput = (key, label, opts = {}) => {
    const { hint, optional, ltr, numeric, maxLength, type = "text", upper, autoComplete = "off" } = opts;
    const id = `kyc-${key}`;
    const err = errors[key];
    return (
      <div className="field">
        <label htmlFor={id}>
          {label}
          {optional && <span className="kyc-optional"> ({tx.optional})</span>}
        </label>
        <input
          id={id}
          data-field={key}
          className={`input${ltr ? " ltr" : ""}`}
          type={type}
          dir={ltr ? "ltr" : undefined}
          inputMode={numeric || type === "tel" ? "numeric" : undefined}
          maxLength={maxLength}
          autoComplete={autoComplete}
          value={form[key]}
          aria-invalid={err ? "true" : "false"}
          aria-describedby={`${hint ? `${id}-hint ` : ""}${id}-err`}
          onChange={(e) => {
            let v = e.target.value;
            if (numeric || type === "tel") v = digits(v);
            if (upper) v = v.toUpperCase().replace(/[^A-Z0-9]/g, "");
            set(key, v);
          }}
        />
        {hint && (
          <span className="hint" id={`${id}-hint`}>
            {hint}
          </span>
        )}
        <span className="error" id={`${id}-err`} aria-live="polite">
          {err}
        </span>
      </div>
    );
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const progress = (step / (total - 1)) * 100;

  return (
    <>
      <Seo title={tx.seoTitle} description={tx.seoDesc} path="/kyc" />

      <section className="page-hero kyc-hero">
        <div className="container">
          <span className="eyebrow">
            <ShieldCheck size={16} strokeWidth={1.5} aria-hidden="true" />
            {tx.eyebrow}
          </span>
          <h1 className="section-title">{tx.title}</h1>
          <p className="section-lead kyc-lead">{tx.lead}</p>
        </div>
      </section>

      <section className="kyc-section">
        <div className="container kyc-layout">
          <div className="card kyc-card" ref={cardRef}>
            {result ? (
              <div className="kyc-success" aria-live="polite">
                <div className="kyc-success-icon">
                  <BadgeCheck size={24} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h2 ref={headingRef} tabIndex={-1}>
                  {tx.successTitle}
                </h2>
                <p className="kyc-muted">{tx.successLead}</p>
                <div className="kyc-ref">
                  <span className="kyc-ref-label">{tx.ref}</span>
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
                <span className="badge">{common.status.reviewing}</span>
                {!result.res.whatsappApi && !result.res.email && (
                  <div className="kyc-wa">
                    <p className="kyc-muted">{tx.waHint}</p>
                    <a className="btn" href={result.res.fallbackLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" />
                      {tx.sendWa}
                    </a>
                  </div>
                )}
                <button type="button" className="btn btn-ghost" onClick={reset}>
                  {tx.newReq}
                </button>
              </div>
            ) : (
              <>
                <ol className="kyc-steps">
                  {tx.steps.map((label, i) => {
                    const Icon = STEP_ICONS[i];
                    const state = i < step ? "done" : i === step ? "current" : "todo";
                    return (
                      <li key={label} className={`kyc-step is-${state}`}>
                        <button
                          type="button"
                          className="kyc-step-btn"
                          disabled={i >= step}
                          onClick={() => goTo(i)}
                          aria-current={i === step ? "step" : undefined}
                        >
                          <span className="kyc-step-dot">
                            {state === "done" ? (
                              <Check size={16} strokeWidth={1.5} aria-hidden="true" />
                            ) : (
                              <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                            )}
                          </span>
                          <span className="kyc-step-label">{label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
                <div
                  className="kyc-progress"
                  role="progressbar"
                  aria-valuemin={1}
                  aria-valuemax={total}
                  aria-valuenow={step + 1}
                  aria-valuetext={tx.stepOf(step + 1, total)}
                  aria-label={tx.stepOf(step + 1, total)}
                >
                  <span style={{ inlineSize: `${progress}%` }} />
                </div>

                <div className="kyc-step-head">
                  <span className="kyc-step-count">{tx.stepOf(step + 1, total)}</span>
                  <h2 ref={headingRef} tabIndex={-1}>
                    {step === 0 ? tx.typeQ : step === 4 ? tx.review : tx.steps[step]}
                  </h2>
                </div>

                <form
                  className="kyc-body"
                  key={step}
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (step < total - 1) next();
                    else submit();
                  }}
                >
                  {step === 0 && (
                    <>
                      <div className="kyc-types" role="radiogroup" aria-label={tx.typeQ}>
                        {TYPES.map((t, idx) => {
                          const { id, icon: Icon } = t;
                          const on = form.type === id;
                          return (
                            <button
                              key={id}
                              type="button"
                              role="radio"
                              aria-checked={on}
                              data-field={idx === 0 ? "type" : undefined}
                              className={`kyc-type${on ? " is-on" : ""}`}
                              onClick={() => set("type", id)}
                            >
                              <span className="icon-bubble">
                                <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                              </span>
                              <span className="kyc-type-text">
                                <strong>{tx.types[id].name}</strong>
                                <small>{tx.types[id].desc}</small>
                              </span>
                              <span className="kyc-type-check" aria-hidden="true">
                                <Check size={16} strokeWidth={1.5} />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="kyc-error" aria-live="polite">
                        {errors.type}
                      </p>
                    </>
                  )}

                  {step === 1 &&
                    (isEntity ? (
                      <div className="kyc-grid">
                        <div className="kyc-span">
                          {renderInput("entityName", tx.entityName, { autoComplete: "organization" })}
                        </div>
                        {renderInput("cr", tx.cr, { hint: tx.crHint, ltr: true, numeric: true, maxLength: 10 })}
                        {renderInput("unified", tx.unified, {
                          hint: tx.unifiedHint,
                          ltr: true,
                          numeric: true,
                          maxLength: 10,
                        })}
                        <div className="kyc-span">
                          {renderInput("vat", tx.vat, {
                            hint: tx.vatHint,
                            ltr: true,
                            numeric: true,
                            maxLength: 15,
                            optional: true,
                          })}
                        </div>
                        {renderInput("authName", tx.authName, { autoComplete: "name" })}
                        {renderInput("authId", tx.authId, {
                          hint: tx.nationalIdHint,
                          ltr: true,
                          numeric: true,
                          maxLength: 10,
                        })}
                      </div>
                    ) : (
                      <div className="kyc-grid">
                        <div className="kyc-span">
                          {renderInput("fullName", tx.fullName, { autoComplete: "name" })}
                        </div>
                        <div className="kyc-span">
                          {renderInput("nationalId", tx.nationalId, {
                            hint: tx.nationalIdHint,
                            ltr: true,
                            numeric: true,
                            maxLength: 10,
                          })}
                        </div>
                      </div>
                    ))}

                  {step === 2 && (
                    <div className="kyc-grid">
                      {renderInput("mobile", tx.mobile, {
                        hint: tx.mobileHint,
                        type: "tel",
                        ltr: true,
                        maxLength: 10,
                        autoComplete: "tel-national",
                      })}
                      {renderInput("email", tx.email, { type: "email", ltr: true, autoComplete: "email" })}
                      <div className="field">
                        <label htmlFor="kyc-city">{tx.city}</label>
                        <select
                          id="kyc-city"
                          data-field="city"
                          className="select"
                          value={form.city}
                          aria-invalid={errors.city ? "true" : "false"}
                          aria-describedby="kyc-city-err"
                          onChange={(e) => set("city", e.target.value)}
                        >
                          <option value="">{tx.cityPh}</option>
                          {CITIES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c[lang] || c.ar}
                            </option>
                          ))}
                        </select>
                        <span className="error" id="kyc-city-err" aria-live="polite">
                          {errors.city}
                        </span>
                      </div>
                      {renderInput("shortAddr", tx.shortAddr, {
                        hint: tx.shortAddrHint,
                        ltr: true,
                        maxLength: 8,
                        optional: true,
                        upper: true,
                      })}
                    </div>
                  )}

                  {step === 3 && (
                    <>
                      <p className="kyc-muted">{tx.docsIntro}</p>
                      <ul className="kyc-docs">
                        {visibleDocs.map((d) => {
                          const f = files[d.id];
                          const inputId = `kyc-file-${d.id}`;
                          return (
                            <li key={d.id} className={`kyc-doc${f ? " has-file" : ""}`}>
                              <span className="icon-bubble">
                                {f ? (
                                  <Check size={20} strokeWidth={1.5} aria-hidden="true" />
                                ) : (
                                  <FileText size={20} strokeWidth={1.5} aria-hidden="true" />
                                )}
                              </span>
                              <div className="kyc-doc-info">
                                <strong>
                                  {tx.docs[d.id]}
                                  {d.optional && <span className="kyc-optional"> ({tx.optional})</span>}
                                </strong>
                                {f ? (
                                  <span className="kyc-doc-meta">
                                    <span className="kyc-doc-name ltr" dir="ltr">
                                      {f.name}
                                    </span>
                                    <span className="ltr" dir="ltr">
                                      {formatSize(f.size)}
                                    </span>
                                  </span>
                                ) : (
                                  <span className="kyc-doc-meta ltr" dir="ltr">
                                    PDF · JPG · PNG — 5 MB
                                  </span>
                                )}
                                <span className="kyc-error" aria-live="polite">
                                  {fileErrors[d.id]}
                                </span>
                              </div>
                              <div className="kyc-doc-actions">
                                <input
                                  id={inputId}
                                  type="file"
                                  accept={ACCEPT}
                                  className="kyc-file-input"
                                  aria-label={tx.docs[d.id]}
                                  onChange={(e) => onFile(d.id, e)}
                                />
                                <label htmlFor={inputId} className="btn btn-ghost btn-sm kyc-file-btn">
                                  <Upload size={16} strokeWidth={1.5} aria-hidden="true" />
                                  {f ? tx.replace : tx.choose}
                                </label>
                                {f && (
                                  <button
                                    type="button"
                                    className="kyc-remove"
                                    onClick={() => removeFile(d.id)}
                                    aria-label={`${tx.remove}: ${tx.docs[d.id]}`}
                                    title={tx.remove}
                                  >
                                    <X size={16} strokeWidth={1.5} aria-hidden="true" />
                                  </button>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="alert kyc-note">
                        <MessageCircle size={20} strokeWidth={1.5} aria-hidden="true" />
                        <span>{tx.docsNote}</span>
                      </div>
                    </>
                  )}

                  {step === 4 && (
                    <>
                      <dl className="kyc-review">
                        {reviewRows().map(([k, v, ltr]) => (
                          <div key={k} className="kyc-review-row">
                            <dt>{k}</dt>
                            <dd>{ltr ? <bdi dir="ltr">{v}</bdi> : v}</dd>
                          </div>
                        ))}
                        <div className="kyc-review-row">
                          <dt>{tx.steps[3]}</dt>
                          <dd>
                            {attachedDocs.length
                              ? attachedDocs.map((d) => tx.docs[d.id]).join(isAr ? "، " : ", ")
                              : tx.noFiles}
                          </dd>
                        </div>
                      </dl>
                      <div className="kyc-review-edit">
                        {[1, 2, 3].map((i) => (
                          <button key={i} type="button" className="chip" onClick={() => goTo(i)}>
                            {tx.edit}: {tx.steps[i]}
                          </button>
                        ))}
                      </div>

                      <label className={`kyc-consent${errors.consent ? " is-invalid" : ""}`}>
                        <input
                          type="checkbox"
                          data-field="consent"
                          checked={consent}
                          aria-invalid={errors.consent ? "true" : "false"}
                          aria-describedby="kyc-consent-err"
                          onChange={(e) => {
                            setConsent(e.target.checked);
                            if (e.target.checked) setErrors((er) => ({ ...er, consent: undefined }));
                          }}
                        />
                        <span className="kyc-consent-box" aria-hidden="true">
                          <Check size={14} strokeWidth={1.5} />
                        </span>
                        <span className="kyc-consent-text">{tx.consent}</span>
                      </label>
                      <p className="kyc-error" id="kyc-consent-err" aria-live="polite">
                        {errors.consent}
                      </p>
                    </>
                  )}

                  <div aria-live="polite" className="kyc-live">
                    {hasErrors && (
                      <p className="kyc-error kyc-error-summary">
                        <CircleAlert size={16} strokeWidth={1.5} aria-hidden="true" />
                        {tx.fixErrors}
                      </p>
                    )}
                    {submitError && (
                      <p className="kyc-error kyc-error-summary">
                        <CircleAlert size={16} strokeWidth={1.5} aria-hidden="true" />
                        {submitError}
                      </p>
                    )}
                  </div>

                  <div className="kyc-nav">
                    {step > 0 ? (
                      <button type="button" className="btn btn-ghost" onClick={() => goTo(step - 1)}>
                        <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" className="flip-rtl" />
                        {common.actions.back}
                      </button>
                    ) : (
                      <span />
                    )}
                    {step < total - 1 ? (
                      <button type="button" className="btn" onClick={next}>
                        {common.actions.next}
                        <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" className="flip-rtl" />
                      </button>
                    ) : (
                      <button type="button" className="btn" onClick={submit} disabled={busy}>
                        {busy ? (
                          <Loader2 size={18} strokeWidth={1.5} aria-hidden="true" className="kyc-spin" />
                        ) : (
                          <ShieldCheck size={18} strokeWidth={1.5} aria-hidden="true" />
                        )}
                        {busy ? tx.submitting : tx.submit}
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>

          <aside className="kyc-aside" aria-labelledby="kyc-why">
            <div className="card kyc-why">
              <span className="icon-bubble">
                <Info size={22} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h2 id="kyc-why">{tx.whyTitle}</h2>
              <p className="kyc-muted">{tx.whyLead}</p>
              <ul className="kyc-why-list">
                {tx.why.map((w) => (
                  <li key={w}>
                    <span className="kyc-why-dot" aria-hidden="true">
                      <Check size={14} strokeWidth={1.5} />
                    </span>
                    {w}
                  </li>
                ))}
              </ul>
              <p className="kyc-secure">
                <Lock size={16} strokeWidth={1.5} aria-hidden="true" />
                {tx.secure}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
