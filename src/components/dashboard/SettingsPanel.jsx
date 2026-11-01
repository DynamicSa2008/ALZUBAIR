import { useMemo, useState } from "react";
import { Phone, Route, Share2, Hash, MousePointerClick, Eye, Undo2, RotateCcw, Plus, Trash2 } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { useSettings } from "../../settings/SettingsProvider";
import { DEFAULT_SETTINGS, SECTION_KEYS } from "../../settings/defaults";
import { formatPhone } from "../../settings/core";
import { SocialIcon, SOCIAL_NAMES } from "../icons";
import PublishBar from "./PublishBar";
import "./SettingsPanel.css";

const TEXT = {
  ar: {
    title: "إعدادات الموقع",
    lead: "عدّل الأرقام والواتساب والإيميلات لكل أقسام الموقع. «معاينة» تطبّق التعديل على متصفحك فقط، و«نشر» يعتمده لكل الزوار.",
    tabs: { contact: "بيانات التواصل", routing: "توجيه الأقسام", social: "السوشيال ميديا", stats: "الأرقام والإحصائيات", floating: "الأزرار العائمة" },
    phone: "رقم الاتصال",
    whatsapp: "رقم الواتساب",
    email: "البريد الإلكتروني",
    addressAr: "العنوان (عربي)",
    addressEn: "العنوان (إنجليزي)",
    map: "رابط الخريطة",
    hoursAr: "ساعات العمل (عربي)",
    hoursEn: "ساعات العمل (إنجليزي)",
    phoneHint: "مثال: 0549291853 أو 966549291853+",
    routingLead: "لكل قسم واتساب وإيميل خاص تصله عليه الطلبات. اتركه فارغاً لاستخدام الرقم والإيميل الرئيسيين.",
    sections: { orders: "طلبات الخدمات والتتبع", kyc: "توثيق العملاء (KYC)", feedback: "الملاحظات والشكاوى", contact: "نموذج تواصل معنا" },
    usesMain: "يستخدم الرئيسي:",
    socialLead: "الروابط المملوءة فقط تظهر في الفوتر.",
    statsLead: "الأرقام التي تظهر في قسم «علامتك.. بهوية سعودية».",
    value: "الرقم",
    prefix: "قبله",
    suffix: "بعده",
    labelAr: "الوصف (عربي)",
    labelEn: "الوصف (إنجليزي)",
    addStat: "إضافة رقم",
    floatingLead: "أزرار الاتصال والواتساب الثابتة أسفل الشاشة.",
    showCall: "إظهار زر الاتصال",
    showWa: "إظهار زر الواتساب",
    preview: "معاينة على الموقع",
    discard: "تجاهل التعديلات",
    defaults: "استرجاع القيم الافتراضية",
    unsaved: "تعديلات غير منشورة",
    previewing: "معاينة مفعّلة في متصفحك",
    upToDate: "مطابق للمنشور",
    errors: { phone: "رقم سعودي غير صحيح", email: "بريد غير صحيح", url: "رابط يبدأ بـ https://" },
    fixErrors: "صحّح الحقول المعلّمة قبل النشر.",
  },
  en: {
    title: "Site settings",
    lead: "Edit numbers, WhatsApp and emails for every section of the site. “Preview” applies changes in your browser only; “Publish” makes them live for everyone.",
    tabs: { contact: "Contact details", routing: "Section routing", social: "Social media", stats: "Numbers & stats", floating: "Floating buttons" },
    phone: "Phone number",
    whatsapp: "WhatsApp number",
    email: "Email",
    addressAr: "Address (Arabic)",
    addressEn: "Address (English)",
    map: "Map link",
    hoursAr: "Working hours (Arabic)",
    hoursEn: "Working hours (English)",
    phoneHint: "e.g. 0549291853 or +966549291853",
    routingLead: "Each section can deliver to its own WhatsApp and email. Leave empty to use the main ones.",
    sections: { orders: "Service orders & tracking", kyc: "Customer KYC", feedback: "Feedback & complaints", contact: "Contact form" },
    usesMain: "Uses main:",
    socialLead: "Only filled links appear in the footer.",
    statsLead: "Figures shown in the “Your brand, Saudi identity” section.",
    value: "Value",
    prefix: "Prefix",
    suffix: "Suffix",
    labelAr: "Label (Arabic)",
    labelEn: "Label (English)",
    addStat: "Add figure",
    floatingLead: "Fixed call and WhatsApp buttons at the bottom of the screen.",
    showCall: "Show call button",
    showWa: "Show WhatsApp button",
    preview: "Preview on site",
    discard: "Discard changes",
    defaults: "Restore defaults",
    unsaved: "Unpublished changes",
    previewing: "Preview active in your browser",
    upToDate: "Matches the published site",
    errors: { phone: "Invalid Saudi number", email: "Invalid email", url: "Link must start with https://" },
    fixErrors: "Fix the highlighted fields before publishing.",
  },
};

const TAB_ICONS = { contact: Phone, routing: Route, social: Share2, stats: Hash, floating: MousePointerClick };

// "0549291853" / "+966 54 929 1853" / "966549291853" → "966549291853"
function toIntl(raw) {
  const d = String(raw || "").replace(/\D/g, "");
  if (/^05\d{8}$/.test(d)) return "966" + d.slice(1);
  if (/^5\d{8}$/.test(d)) return "966" + d;
  if (/^9665\d{8}$/.test(d)) return d;
  if (/^9661\d{7,8}$/.test(d) || /^9208\d{6}$/.test(d)) return d; // landline / unified 920 numbers
  return null;
}
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isUrl = (v) => /^https:\/\/\S+$/.test(v);

function validate(f) {
  const e = {};
  if (!toIntl(f.contact.phone)) e["contact.phone"] = "phone";
  if (!toIntl(f.contact.whatsapp)) e["contact.whatsapp"] = "phone";
  if (!isEmail(f.contact.email)) e["contact.email"] = "email";
  if (f.contact.mapUrl && !isUrl(f.contact.mapUrl)) e["contact.mapUrl"] = "url";
  for (const k of SECTION_KEYS) {
    const r = f.routing[k];
    if (r.whatsapp && !toIntl(r.whatsapp)) e[`routing.${k}.whatsapp`] = "phone";
    if (r.email && !isEmail(r.email)) e[`routing.${k}.email`] = "email";
  }
  for (const [k, v] of Object.entries(f.social)) if (v && !isUrl(v)) e[`social.${k}`] = "url";
  return e;
}

// Store numbers in one canonical shape so links (tel:, wa.me) always work.
function normalize(f) {
  const out = structuredClone(f);
  out.contact.phone = "+" + (toIntl(f.contact.phone) || f.contact.phone.replace(/\D/g, ""));
  out.contact.whatsapp = toIntl(f.contact.whatsapp) || f.contact.whatsapp;
  for (const k of SECTION_KEYS) {
    if (out.routing[k].whatsapp) out.routing[k].whatsapp = toIntl(out.routing[k].whatsapp) || out.routing[k].whatsapp;
  }
  out.stats = out.stats.map((s) => ({ ...s, value: Number(s.value) || 0 }));
  return out;
}

const getPath = (obj, path) => path.split(".").reduce((o, k) => o?.[k], obj);
function setPath(obj, path, value) {
  const next = structuredClone(obj);
  const keys = path.split(".");
  let o = next;
  keys.slice(0, -1).forEach((k) => (o = o[k]));
  o[keys.at(-1)] = value;
  return next;
}

export default function SettingsPanel() {
  const { pick } = useI18n();
  const tx = pick(TEXT);
  const { settings, published, hasDraft, setDraft } = useSettings();
  const [form, setForm] = useState(() => structuredClone(settings));
  const [tab, setTab] = useState("contact");

  const errors = useMemo(() => validate(form), [form]);
  const hasErrors = Object.keys(errors).length > 0;
  const normalized = useMemo(() => (hasErrors ? null : normalize(form)), [form, hasErrors]);
  const dirty = JSON.stringify(normalized ?? form) !== JSON.stringify(published);

  const bind = (path, { dir } = {}) => ({
    id: `set-${path}`,
    value: getPath(form, path) ?? "",
    onChange: (e) => setForm((f) => setPath(f, path, e.target.value)),
    "aria-invalid": Boolean(errors[path]),
    className: `input${dir === "ltr" ? " ltr" : ""}`,
  });

  // Plain render helper (called as a function so inputs keep focus while typing).
  const field = ({ path, label, hint, dir, placeholder, type = "text" }) => (
    <div className="field">
      <label htmlFor={`set-${path}`}>{label}</label>
      <input type={type} placeholder={placeholder} {...bind(path, { dir })} />
      {errors[path] ? <span className="error">{tx.errors[errors[path]]}</span> : hint && <span className="hint">{hint}</span>}
    </div>
  );

  return (
    <div className="dsh-panel dsh-set">
      <div className="dsh-panel-head">
        <div>
          <h2>{tx.title}</h2>
          <p className="dsh-lead">{tx.lead}</p>
        </div>
        <span className={`dsh-set-state ${dirty ? "is-dirty" : ""}`}>
          <span aria-hidden="true" />
          {hasDraft ? tx.previewing : dirty ? tx.unsaved : tx.upToDate}
        </span>
      </div>

      <div className="chips chips-scroll dsh-set-tabs" role="tablist">
        {Object.entries(tx.tabs).map(([key, label]) => {
          const Icon = TAB_ICONS[key];
          return (
            <button key={key} type="button" role="tab" aria-selected={tab === key} className={`chip${tab === key ? " active" : ""}`} onClick={() => setTab(key)}>
              <Icon aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>

      <section className="dsh-card dsh-set-body" role="tabpanel">
        {tab === "contact" && (
          <div className="dsh-set-grid">
            {field({ path: "contact.phone", label: tx.phone, hint: tx.phoneHint, dir: "ltr", type: "tel" })}
            {field({ path: "contact.whatsapp", label: tx.whatsapp, hint: tx.phoneHint, dir: "ltr", type: "tel" })}
            {field({ path: "contact.email", label: tx.email, dir: "ltr", type: "email" })}
            {field({ path: "contact.mapUrl", label: tx.map, dir: "ltr", placeholder: "https://maps.google.com/…" })}
            {field({ path: "contact.address.ar", label: tx.addressAr })}
            {field({ path: "contact.address.en", label: tx.addressEn, dir: "ltr" })}
            {field({ path: "contact.hours.ar", label: tx.hoursAr })}
            {field({ path: "contact.hours.en", label: tx.hoursEn, dir: "ltr" })}
          </div>
        )}

        {tab === "routing" && (
          <>
            <p className="dsh-muted">{tx.routingLead}</p>
            <div className="dsh-set-routes">
              {SECTION_KEYS.map((k) => (
                <div key={k} className="dsh-set-route">
                  <h3>{tx.sections[k]}</h3>
                  <div className="dsh-set-grid">
                    {field({
                      path: `routing.${k}.whatsapp`,
                      label: tx.whatsapp,
                      dir: "ltr",
                      type: "tel",
                      placeholder: formatPhone(toIntl(form.contact.whatsapp) || form.contact.whatsapp),
                    })}
                    {field({ path: `routing.${k}.email`, label: tx.email, dir: "ltr", type: "email", placeholder: form.contact.email })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "social" && (
          <>
            <p className="dsh-muted">{tx.socialLead}</p>
            <div className="dsh-set-grid">
              {SOCIAL_NAMES.map((name) => (
                <div key={name} className="dsh-set-social">
                  <span className="icon-bubble" aria-hidden="true">
                    <SocialIcon name={name} />
                  </span>
                  {field({ path: `social.${name}`, label: name, dir: "ltr", placeholder: `https://${name === "x" ? "x" : name}.com/…` })}
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "stats" && (
          <>
            <p className="dsh-muted">{tx.statsLead}</p>
            <div className="dsh-set-stats">
              {form.stats.map((s, i) => (
                <div key={i} className="dsh-set-stat">
                  <div className="dsh-set-stat-preview ltr" aria-hidden="true">
                    {s.prefix}
                    {Number(s.value || 0).toLocaleString("en")}
                    {s.suffix}
                  </div>
                  <div className="dsh-set-stat-fields">
                    {field({ path: `stats.${i}.value`, label: tx.value, dir: "ltr", type: "number" })}
                    {field({ path: `stats.${i}.prefix`, label: tx.prefix, dir: "ltr" })}
                    {field({ path: `stats.${i}.suffix`, label: tx.suffix, dir: "ltr" })}
                    {field({ path: `stats.${i}.label.ar`, label: tx.labelAr })}
                    {field({ path: `stats.${i}.label.en`, label: tx.labelEn, dir: "ltr" })}
                  </div>
                  <button
                    type="button"
                    className="dsh-icon-btn dsh-danger"
                    aria-label="Remove"
                    disabled={form.stats.length <= 1}
                    onClick={() => setForm((f) => ({ ...f, stats: f.stats.filter((_, j) => j !== i) }))}
                  >
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
            {form.stats.length < 6 && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() =>
                  setForm((f) => ({ ...f, stats: [...f.stats, { value: 0, prefix: "+", suffix: "", label: { ar: "", en: "" } }] }))
                }
              >
                <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
                {tx.addStat}
              </button>
            )}
          </>
        )}

        {tab === "floating" && (
          <>
            <p className="dsh-muted">{tx.floatingLead}</p>
            {[
              ["call", tx.showCall],
              ["whatsapp", tx.showWa],
            ].map(([k, label]) => (
              <label key={k} className="dsh-set-switch">
                <input
                  type="checkbox"
                  checked={form.floating[k]}
                  onChange={(e) => setForm((f) => setPath(f, `floating.${k}`, e.target.checked))}
                />
                <span className="dsh-set-switch-ui" aria-hidden="true" />
                {label}
              </label>
            ))}
          </>
        )}
      </section>

      <section className="dsh-card dsh-set-actions">
        <div className="dsh-set-actions-row">
          <button type="button" className="btn btn-ghost" disabled={hasErrors} onClick={() => setDraft(normalized)}>
            <Eye size={18} strokeWidth={1.5} aria-hidden="true" />
            {tx.preview}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={!dirty && !hasDraft}
            onClick={() => {
              setDraft(null);
              setForm(structuredClone(published));
            }}
          >
            <Undo2 size={18} strokeWidth={1.5} aria-hidden="true" />
            {tx.discard}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setForm(structuredClone({ ...DEFAULT_SETTINGS, activeTheme: form.activeTheme }))}>
            <RotateCcw size={18} strokeWidth={1.5} aria-hidden="true" />
            {tx.defaults}
          </button>
        </div>
        {hasErrors && <p className="error">{tx.fixErrors}</p>}
        <PublishBar value={normalized ?? form} disabled={hasErrors || (!dirty && !hasDraft)} />
      </section>
    </div>
  );
}
