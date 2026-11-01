import { useMemo, useState } from "react";
import { BadgeCheck, MessagesSquare, Search, SearchX, Star } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { serviceById } from "../../data/services";
import { EXTRA_STATUS, FEEDBACK_STATUSES, KYC_STATUSES } from "./labels";
import { matches, trackUrl } from "./helpers";
import { EmptyState, KeyVals, StatusBadge } from "./ui";
import RecordDrawer from "./RecordDrawer";

const TEXT = {
  ar: {
    kyc: {
      title: "توثيق العملاء (KYC)",
      emptyTitle: "لا توجد طلبات توثيق",
      emptyText: "ستظهر هنا نماذج التوثيق المرسلة من صفحة «توثيق العميل».",
      details: "طلب توثيق",
      msg: (r, s) => `مرحباً ${r.contactName || r.name || ""}،\nحالة توثيق حسابكم (${r.code}) لدى شركة الزبير: ${s}.`,
    },
    feedback: {
      title: "الملاحظات والشكاوى",
      emptyTitle: "لا توجد ملاحظات بعد",
      emptyText: "ستظهر هنا الملاحظات والشكاوى المرسلة من صفحة «الملاحظات والشكاوى».",
      details: "ملاحظة",
      msg: (r, s) => `مرحباً ${r.name || ""}،\nبخصوص ملاحظتكم رقم ${r.code} لدى شركة الزبير: ${s}. شكراً لتواصلكم.`,
    },
    search: "بحث…",
    allStatuses: "كل الحالات",
    allTypes: "كل الأنواع",
    count: (n, t) => `${n} من ${t}`,
    code: "الرقم",
    name: "الاسم",
    phone: "الجوال",
    type: "النوع",
    rating: "التقييم",
    status: "الحالة",
    date: "التاريخ",
    noMatch: "لا توجد نتائج مطابقة",
    info: "البيانات",
    types: { complaint: "شكوى", suggestion: "اقتراح", praise: "شكر", inquiry: "استفسار", other: "أخرى" },
    yes: "نعم",
    no: "لا",
    file: "ملف مرفق",
    fields: {
      name: "الاسم",
      contactName: "اسم المسؤول",
      company: "المنشأة",
      companyName: "المنشأة",
      phone: "الجوال",
      email: "البريد",
      city: "المدينة",
      type: "النوع",
      rating: "التقييم",
      message: "الرسالة",
      subject: "الموضوع",
      orderCode: "رقم الطلب",
      service: "الخدمة",
      services: "الخدمات",
      crNumber: "رقم السجل التجاري",
      cr: "رقم السجل التجاري",
      vatNumber: "الرقم الضريبي",
      idType: "نوع الهوية",
      idNumber: "رقم الهوية",
      nationalId: "رقم الهوية",
      nationality: "الجنسية",
      address: "العنوان",
      entityType: "نوع الكيان",
      notes: "ملاحظات",
      createdAt: "تاريخ الإرسال",
      lang: "اللغة",
      consent: "الموافقة",
    },
  },
  en: {
    kyc: {
      title: "Customer verification (KYC)",
      emptyTitle: "No KYC submissions",
      emptyText: "Verification forms sent from the KYC page appear here.",
      details: "KYC submission",
      msg: (r, s) => `Hello ${r.contactName || r.name || ""},\nYour Al Zubair verification (${r.code}) status: ${s}.`,
    },
    feedback: {
      title: "Feedback & complaints",
      emptyTitle: "No feedback yet",
      emptyText: "Feedback and complaints sent from the Feedback page appear here.",
      details: "Feedback",
      msg: (r, s) => `Hello ${r.name || ""},\nRegarding your feedback ${r.code} to Al Zubair: ${s}. Thank you for reaching out.`,
    },
    search: "Search…",
    allStatuses: "All statuses",
    allTypes: "All types",
    count: (n, t) => `${n} of ${t}`,
    code: "Code",
    name: "Name",
    phone: "Mobile",
    type: "Type",
    rating: "Rating",
    status: "Status",
    date: "Date",
    noMatch: "No matching records",
    info: "Details",
    types: { complaint: "Complaint", suggestion: "Suggestion", praise: "Praise", inquiry: "Inquiry", other: "Other" },
    yes: "Yes",
    no: "No",
    file: "Attached file",
    fields: {
      name: "Name",
      contactName: "Contact person",
      company: "Company",
      companyName: "Company",
      phone: "Mobile",
      email: "Email",
      city: "City",
      type: "Type",
      rating: "Rating",
      message: "Message",
      subject: "Subject",
      orderCode: "Order code",
      service: "Service",
      services: "Services",
      crNumber: "Commercial register no.",
      cr: "Commercial register no.",
      vatNumber: "VAT number",
      idType: "ID type",
      idNumber: "ID number",
      nationalId: "National ID",
      nationality: "Nationality",
      address: "Address",
      entityType: "Entity type",
      notes: "Notes",
      createdAt: "Submitted",
      lang: "Language",
      consent: "Consent",
    },
  },
};

const META = new Set(["code", "status", "history", "updatedAt"]);
const LTR_FIELDS = new Set(["phone", "email", "orderCode", "crNumber", "cr", "vatNumber", "idNumber", "nationalId"]);

function Stars({ value }) {
  const n = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <span className="dsh-stars" aria-label={`${n}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} strokeWidth={1.5} size={14} className={i <= n ? "is-on" : undefined} aria-hidden="true" />
      ))}
    </span>
  );
}

export default function RecordsPanel({ kind, records, openCode, setOpenCode, children }) {
  const { pick, l, formatDate } = useI18n();
  const tx = pick(TEXT);
  const k = tx[kind];
  const statusText = pick(EXTRA_STATUS);
  const statuses = kind === "kyc" ? KYC_STATUSES : FEEDBACK_STATUSES;
  const label = (s) => statusText[s] || s;
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const types = useMemo(() => [...new Set(records.map((r) => r.type).filter(Boolean))], [records]);
  const filtered = records.filter((r) => (!status || r.status === status) && (!type || r.type === type) && matches(r, q));
  const open = records.find((r) => r.code === openCode);

  const display = (key, v) => {
    if (v === undefined || v === null || v === "") return null;
    if (key === "createdAt") return formatDate(v, { timeStyle: "short" });
    if (key === "rating") return <Stars value={v} />;
    if (key === "type") return tx.types[v] || v;
    if (key === "service") return serviceById(v) ? l(serviceById(v).name) : v;
    if (key === "services" && Array.isArray(v)) return v.map((id) => (serviceById(id) ? l(serviceById(id).name) : id)).join("، ");
    if (key === "orderCode")
      return (
        <a href={trackUrl(v)} target="_blank" rel="noopener noreferrer">
          {v}
        </a>
      );
    if (key === "phone") return <a href={`tel:${v}`}>{v}</a>;
    if (key === "email") return <a href={`mailto:${v}`}>{v}</a>;
    if (typeof v === "boolean") return v ? tx.yes : tx.no;
    if (typeof v === "string" && v.startsWith("data:image/"))
      return <img src={v} alt="" className="dsh-attachment" />;
    if (typeof v === "string" && v.startsWith("data:")) return tx.file;
    if (Array.isArray(v)) return v.map((x) => (typeof x === "object" ? x?.name || tx.file : x)).join("، ");
    if (typeof v === "object") return v.name || l(v) || JSON.stringify(v);
    return String(v);
  };

  const rowsFor = (r) =>
    Object.keys(r)
      .filter((key) => !META.has(key))
      .map((key) => ({ label: tx.fields[key] || key, value: display(key, r[key]), ltr: LTR_FIELDS.has(key) }));

  const primary = (r) => r.name || r.company || r.companyName || r.contactName || "—";
  const secondary = (r) => (kind === "kyc" ? r.contactName || r.email : r.message);

  return (
    <div className="dsh-panel">
      <div className="dsh-panel-head">
        <h2>{k.title}</h2>
      </div>

      {records.length === 0 ? (
        <EmptyState icon={kind === "kyc" ? BadgeCheck : MessagesSquare} title={k.emptyTitle} text={k.emptyText}>
          {children}
        </EmptyState>
      ) : (
        <>
          <div className="dsh-toolbar">
            <label className="dsh-search">
              <Search strokeWidth={1.5} size={18} aria-hidden="true" />
              <span className="sr-only">{tx.search}</span>
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx.search} />
            </label>
            <select className="select dsh-filter" value={status} onChange={(e) => setStatus(e.target.value)} aria-label={tx.status}>
              <option value="">{tx.allStatuses}</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {label(s)}
                </option>
              ))}
            </select>
            {kind === "feedback" && types.length > 0 && (
              <select className="select dsh-filter" value={type} onChange={(e) => setType(e.target.value)} aria-label={tx.type}>
                <option value="">{tx.allTypes}</option>
                {types.map((t) => (
                  <option key={t} value={t}>
                    {tx.types[t] || t}
                  </option>
                ))}
              </select>
            )}
          </div>
          <p className="dsh-count" aria-live="polite">
            {tx.count(filtered.length, records.length)}
          </p>

          {filtered.length === 0 ? (
            <EmptyState icon={SearchX} title={tx.noMatch} />
          ) : (
            <div className="dsh-table-wrap">
              <table className="dsh-table">
                <thead>
                  <tr>
                    <th scope="col">{tx.code}</th>
                    <th scope="col">{tx.name}</th>
                    {kind === "feedback" ? (
                      <>
                        <th scope="col">{tx.type}</th>
                        <th scope="col">{tx.rating}</th>
                      </>
                    ) : (
                      <th scope="col">{tx.phone}</th>
                    )}
                    <th scope="col">{tx.status}</th>
                    <th scope="col">{tx.date}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.code}
                      tabIndex={0}
                      className={r.code === openCode ? "is-active" : undefined}
                      onClick={() => setOpenCode(r.code)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setOpenCode(r.code);
                        }
                      }}
                    >
                      <td data-label={tx.code}>
                        <span className="dsh-mono ltr">{r.code}</span>
                      </td>
                      <td data-label={tx.name}>
                        <span className="dsh-cell-main">{primary(r)}</span>
                        {secondary(r) && <span className="dsh-cell-sub dsh-clamp">{secondary(r)}</span>}
                      </td>
                      {kind === "feedback" ? (
                        <>
                          <td data-label={tx.type}>
                            {r.type ? <span className={`dsh-type dsh-type-${r.type}`}>{tx.types[r.type] || r.type}</span> : "—"}
                          </td>
                          <td data-label={tx.rating}>{r.rating ? <Stars value={r.rating} /> : "—"}</td>
                        </>
                      ) : (
                        <td data-label={tx.phone}>
                          <span className="ltr">{r.phone || "—"}</span>
                        </td>
                      )}
                      <td data-label={tx.status}>
                        <StatusBadge status={r.status} label={label(r.status)} />
                      </td>
                      <td data-label={tx.date}>{formatDate(r.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {open && (
        <RecordDrawer
          key={open.code}
          collection={kind}
          record={open}
          statuses={statuses}
          statusLabel={label}
          title={primary(open) !== "—" ? primary(open) : k.details}
          buildMessage={(r) => k.msg(r, label(r.status))}
          onClose={() => setOpenCode(null)}
        >
          <section className="dsh-drawer-section">
            <h3>{tx.info}</h3>
            <KeyVals rows={rowsFor(open)} />
          </section>
        </RecordDrawer>
      )}
    </div>
  );
}
