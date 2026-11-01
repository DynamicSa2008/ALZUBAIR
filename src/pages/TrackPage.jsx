import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Ban,
  Check,
  ClipboardList,
  FileSearch,
  Hourglass,
  Inbox,
  LoaderCircle,
  MessageCircle,
  PackageCheck,
  Search,
  SearchX,
  Truck,
  Wrench,
} from "lucide-react";
import Seo from "../components/Seo";
import { useI18n } from "../i18n/I18nProvider";
import { COMMON, STATUS_FLOW } from "../i18n/common";
import { serviceById } from "../data/services";
import { get, subscribe } from "../lib/store";
import { whatsappLink } from "../lib/notify";
import "./TrackPage.css";

const TEXT = {
  ar: {
    seoTitle: "تتبع طلبك",
    seoDesc: "تابع حالة طلبك لدى شركة الزبير خطوة بخطوة باستخدام رقم الطلب.",
    eyebrow: "متابعة الطلبات",
    title: "تتبع طلبك",
    lead: "أدخل رقم الطلب الذي وصلك عند الإرسال (مثل ZB-7K2M9Q) لتعرف أين وصل طلبك.",
    label: "رقم الطلب",
    placeholder: "ZB-XXXXXX",
    search: "تتبع",
    searching: "جارٍ البحث…",
    empty: "اكتب رقم الطلب أولاً.",
    orderFor: "طلب",
    createdAt: "تاريخ الطلب",
    current: "الحالة الحالية",
    services: "الخدمات المطلوبة",
    progress: "مراحل الطلب",
    pending: "بانتظار هذه المرحلة",
    cancelledTitle: "تم إلغاء هذا الطلب",
    cancelledText: "إذا كان لديك استفسار عن الإلغاء، تواصل معنا وسنوضح لك التفاصيل.",
    contact: "تواصل معنا بخصوص هذا الطلب",
    waMsg: (code) => `مرحباً، أود الاستفسار عن طلبي رقم ${code}`,
    notFoundTitle: "لم نعثر على هذا الطلب",
    notFoundText: "تأكد من كتابة الرقم بشكل صحيح كما وصلك، أو تواصل معنا وسنساعدك فوراً.",
    askWa: "اسألنا على واتساب",
    newOrder: "اطلب خدمة جديدة",
    note: "ملاحظة",
    lastUpdate: "آخر تحديث",
  },
  en: {
    seoTitle: "Track your order",
    seoDesc: "Follow your Al Zubair order step by step using your order code.",
    eyebrow: "Order tracking",
    title: "Track your order",
    lead: "Enter the order code you received when submitting (e.g. ZB-7K2M9Q) to see where it stands.",
    label: "Order code",
    placeholder: "ZB-XXXXXX",
    search: "Track",
    searching: "Searching…",
    empty: "Enter your order code first.",
    orderFor: "Order",
    createdAt: "Placed on",
    current: "Current status",
    services: "Requested services",
    progress: "Order progress",
    pending: "Waiting for this stage",
    cancelledTitle: "This order was cancelled",
    cancelledText: "If you have any question about the cancellation, contact us and we'll explain.",
    contact: "Contact us about this order",
    waMsg: (code) => `Hello, I'd like to ask about my order ${code}`,
    notFoundTitle: "We couldn't find this order",
    notFoundText: "Check that the code is typed exactly as you received it, or contact us and we'll help right away.",
    askWa: "Ask us on WhatsApp",
    newOrder: "Request a new service",
    note: "Note",
    lastUpdate: "Last update",
  },
};

const STEP_ICONS = {
  received: Inbox,
  reviewing: FileSearch,
  in_progress: Wrench,
  ready: PackageCheck,
  delivered: Truck,
};

function lastEntry(history, status) {
  const hits = (history || []).filter((h) => h.status === status);
  return hits[hits.length - 1];
}

export default function TrackPage() {
  const { pick } = useI18n();
  const tx = pick(TEXT);
  const [params, setParams] = useSearchParams();
  const queryCode = (params.get("code") || "").trim().toUpperCase();
  const [input, setInput] = useState(queryCode);
  const [phase, setPhase] = useState(queryCode ? "loading" : "idle"); // idle | loading | found | notfound
  const [order, setOrder] = useState(null);
  const [nonce, setNonce] = useState(0);
  const [inputError, setInputError] = useState("");

  // Lookup is async so a real backend can replace the local store without touching this page.
  useEffect(() => {
    if (!queryCode) return undefined;
    let alive = true;
    const load = () =>
      get("orders", queryCode)
        .then((rec) => {
          if (!alive) return;
          setOrder(rec);
          setPhase(rec ? "found" : "notfound");
        })
        .catch(() => alive && setPhase("notfound"));
    load();
    const unsub = subscribe((collection) => collection === "orders" && load());
    return () => {
      alive = false;
      unsub();
    };
  }, [queryCode, nonce]);

  const onSubmit = (e) => {
    e.preventDefault();
    const code = input.trim().toUpperCase();
    if (!code) {
      setInputError(tx.empty);
      return;
    }
    setInputError("");
    setInput(code);
    setPhase("loading");
    setParams({ code }, { replace: true });
    setNonce((n) => n + 1);
  };

  return (
    <>
      <Seo title={tx.seoTitle} description={tx.seoDesc} path="/track" />
      <section className="page-hero trk-hero">
        <div className="container">
          <span className="eyebrow">{tx.eyebrow}</span>
          <h1 className="section-title">{tx.title}</h1>
          <p className="section-lead">{tx.lead}</p>

          <form className="trk-form" onSubmit={onSubmit} role="search" noValidate>
            <label htmlFor="trk-code" className="sr-only">
              {tx.label}
            </label>
            <span className="trk-form-icon" aria-hidden="true">
              <Search strokeWidth={1.5} size={20} />
            </span>
            <input
              id="trk-code"
              className="trk-input ltr"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tx.placeholder}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              aria-invalid={inputError ? "true" : undefined}
              aria-describedby={inputError ? "trk-code-error" : undefined}
            />
            <button type="submit" className="btn" disabled={phase === "loading"}>
              {phase === "loading" ? (
                <LoaderCircle strokeWidth={1.5} size={18} className="trk-spin" aria-hidden="true" />
              ) : null}
              {phase === "loading" ? tx.searching : tx.search}
            </button>
          </form>
          {inputError && (
            <p id="trk-code-error" className="trk-input-error" role="alert">
              {inputError}
            </p>
          )}
        </div>
      </section>

      <section className="trk-wrap" aria-live="polite" aria-busy={phase === "loading"}>
        <div className="container">
          {phase === "loading" && <Skeleton />}
          {phase === "found" && order && <OrderView order={order} tx={tx} />}
          {phase === "notfound" && <NotFound code={queryCode} tx={tx} />}
        </div>
      </section>
    </>
  );
}

function OrderView({ order, tx }) {
  const { pick, l, formatDate } = useI18n();
  const status = pick(COMMON).status;
  const cancelled = order.status === "cancelled";
  // When cancelled, show how far the order got before cancellation.
  const reachedIndex = cancelled
    ? Math.max(
        0,
        ...(order.history || []).map((h) => STATUS_FLOW.indexOf(h.status)).filter((i) => i >= 0),
      )
    : STATUS_FLOW.indexOf(order.status);
  const lastUpdate = (order.history || []).slice(-1)[0]?.at || order.updatedAt || order.createdAt;
  const services = order.services || (order.service ? [order.service] : []);

  return (
    <article className="trk-card card">
      <header className="trk-head">
        <div>
          <span className="trk-head-kicker">
            <ClipboardList strokeWidth={1.5} size={16} aria-hidden="true" /> {tx.orderFor}
          </span>
          <h2 className="trk-code">
            <span className="ltr">{order.code}</span>
          </h2>
          {order.brand && <p className="trk-brand">{order.brand}</p>}
        </div>
        <dl className="trk-meta">
          <div>
            <dt>{tx.current}</dt>
            <dd>
              <span className={`trk-status trk-status-${order.status}`}>{status[order.status] || order.status}</span>
            </dd>
          </div>
          <div>
            <dt>{tx.createdAt}</dt>
            <dd>{formatDate(order.createdAt)}</dd>
          </div>
          <div>
            <dt>{tx.lastUpdate}</dt>
            <dd>{formatDate(lastUpdate, { timeStyle: "short" })}</dd>
          </div>
        </dl>
      </header>

      {cancelled && (
        <div className="trk-cancelled" role="status">
          <Ban strokeWidth={1.5} size={22} aria-hidden="true" />
          <div>
            <strong>{tx.cancelledTitle}</strong>
            <p>{tx.cancelledText}</p>
            {lastEntry(order.history, "cancelled")?.note && (
              <p className="trk-note">
                {tx.note}: {lastEntry(order.history, "cancelled").note}
              </p>
            )}
          </div>
        </div>
      )}

      <h3 className="trk-sub">{tx.progress}</h3>
      <ol className={`trk-timeline${cancelled ? " is-cancelled" : ""}`}>
        {STATUS_FLOW.map((key, i) => {
          const entry = lastEntry(order.history, key);
          const state = i < reachedIndex ? "done" : i === reachedIndex ? (cancelled ? "done" : "current") : "todo";
          const finished = key === "delivered" && state === "current";
          const Icon = state === "done" || finished ? Check : STEP_ICONS[key] || Hourglass;
          return (
            <li
              key={key}
              className={`trk-step is-${finished ? "done" : state}`}
              aria-current={state === "current" ? "step" : undefined}
            >
              <span className="trk-dot" aria-hidden="true">
                <Icon strokeWidth={1.5} />
              </span>
              <div className="trk-step-body">
                <strong>{status[key]}</strong>
                {entry ? (
                  <time dateTime={entry.at}>{formatDate(entry.at, { timeStyle: "short" })}</time>
                ) : (
                  <span className="trk-muted">{state === "todo" ? tx.pending : ""}</span>
                )}
                {entry?.note && <p className="trk-note">{entry.note}</p>}
              </div>
            </li>
          );
        })}
      </ol>

      {services.length > 0 && (
        <>
          <h3 className="trk-sub">{tx.services}</h3>
          <ul className="trk-services">
            {services.map((id) => {
              const s = serviceById(id);
              if (!s) return null;
              const Icon = s.icon;
              return (
                <li key={id}>
                  <span className="icon-bubble">
                    <Icon strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  {l(s.name)}
                </li>
              );
            })}
          </ul>
        </>
      )}

      <footer className="trk-foot">
        <a className="btn" href={whatsappLink(tx.waMsg(order.code), null, "orders")} target="_blank" rel="noopener noreferrer">
          <MessageCircle strokeWidth={1.5} size={18} aria-hidden="true" />
          {tx.contact}
        </a>
      </footer>
    </article>
  );
}

function NotFound({ code, tx }) {
  return (
    <div className="trk-empty card">
      <span className="trk-empty-icon" aria-hidden="true">
        <SearchX strokeWidth={1.5} />
      </span>
      <h2>{tx.notFoundTitle}</h2>
      {code && <p className="trk-empty-code ltr">{code}</p>}
      <p className="trk-muted">{tx.notFoundText}</p>
      <div className="trk-empty-actions">
        <a
          className="btn"
          href={whatsappLink(tx.waMsg(code || ""), null, "orders")}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle strokeWidth={1.5} size={18} aria-hidden="true" />
          {tx.askWa}
        </a>
        <Link className="btn btn-ghost" to="/order">
          {tx.newOrder}
        </Link>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="trk-card card trk-skeleton" aria-hidden="true">
      <span className="trk-sk trk-sk-title" />
      <span className="trk-sk trk-sk-line" />
      <div className="trk-sk-row">
        {STATUS_FLOW.map((k) => (
          <span key={k} className="trk-sk trk-sk-dot" />
        ))}
      </div>
    </div>
  );
}
