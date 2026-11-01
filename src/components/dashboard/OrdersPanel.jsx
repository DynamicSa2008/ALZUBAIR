import { useMemo, useState } from "react";
import { Download, Inbox, Search, SearchX } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { COMMON, STATUS_FLOW } from "../../i18n/common";
import { SERVICES, serviceById } from "../../data/services";
import { OPTION_LABELS } from "./labels";
import { downloadCsv, matches, orderServices, serviceNames, trackUrl } from "./helpers";
import { EmptyState, KeyVals, StatusBadge } from "./ui";
import RecordDrawer from "./RecordDrawer";

const ORDER_STATUSES = [...STATUS_FLOW, "cancelled"];

const TEXT = {
  ar: {
    title: "الطلبات",
    search: "بحث بالرقم، الاسم، الجوال أو العلامة",
    allStatuses: "كل الحالات",
    allServices: "كل الخدمات",
    export: "تصدير CSV",
    count: (n, t) => `${n} من ${t} طلب`,
    code: "الرقم",
    customer: "العميل",
    services: "الخدمات",
    status: "الحالة",
    date: "التاريخ",
    emptyTitle: "لا توجد طلبات بعد",
    emptyText: "ستظهر الطلبات هنا فور إرسالها من صفحة «اطلب خدمة».",
    noMatch: "لا توجد نتائج مطابقة",
    noMatchText: "جرّب تغيير كلمات البحث أو المرشحات.",
    details: "تفاصيل الطلب",
    brand: "العلامة / المشروع",
    notes: "الملاحظات",
    quantity: "الكمية",
    deadline: "الموعد المطلوب",
    budget: "الميزانية",
    name: "الاسم",
    phone: "الجوال",
    email: "البريد",
    city: "المدينة",
    channel: "وسيلة التواصل",
    createdAt: "تاريخ الطلب",
    contact: "بيانات العميل",
    msg: (o, s, url) =>
      `مرحباً ${o.name || ""}،\nتحديث على طلبك رقم ${o.code} لدى شركة الزبير: ${s}.\nلمتابعة الطلب: ${url}`,
    csv: {
      code: "رقم الطلب",
      createdAt: "التاريخ",
      status: "الحالة",
    },
  },
  en: {
    title: "Orders",
    search: "Search by code, name, mobile or brand",
    allStatuses: "All statuses",
    allServices: "All services",
    export: "Export CSV",
    count: (n, t) => `${n} of ${t} orders`,
    code: "Code",
    customer: "Customer",
    services: "Services",
    status: "Status",
    date: "Date",
    emptyTitle: "No orders yet",
    emptyText: "Orders appear here as soon as they're submitted from “Request a service”.",
    noMatch: "No matching orders",
    noMatchText: "Try different keywords or filters.",
    details: "Order details",
    brand: "Brand / project",
    notes: "Notes",
    quantity: "Quantity",
    deadline: "Desired deadline",
    budget: "Budget",
    name: "Name",
    phone: "Mobile",
    email: "Email",
    city: "City",
    channel: "Preferred channel",
    createdAt: "Placed on",
    contact: "Customer",
    msg: (o, s, url) => `Hello ${o.name || ""},\nUpdate on your Al Zubair order ${o.code}: ${s}.\nTrack it here: ${url}`,
    csv: {
      code: "Order code",
      createdAt: "Date",
      status: "Status",
    },
  },
};

export default function OrdersPanel({ orders, openCode, setOpenCode, children }) {
  const { pick, l, formatDate } = useI18n();
  const tx = pick(TEXT);
  const statusLabels = pick(COMMON).status;
  const opt = pick(OPTION_LABELS);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [service, setService] = useState("");

  const filtered = useMemo(
    () =>
      orders.filter(
        (o) =>
          (!status || o.status === status) &&
          (!service || orderServices(o).includes(service)) &&
          matches(o, q),
      ),
    [orders, q, status, service],
  );

  const open = orders.find((o) => o.code === openCode);
  const label = (s) => statusLabels[s] || s;

  const exportCsv = () => {
    const cols = [
      { label: tx.csv.code, value: (o) => o.code },
      { label: tx.csv.createdAt, value: (o) => o.createdAt },
      { label: tx.csv.status, value: (o) => label(o.status) },
      { label: tx.services, value: (o) => serviceNames(o, l) },
      { label: tx.brand, value: (o) => o.brand },
      { label: tx.name, value: (o) => o.name },
      { label: tx.phone, value: (o) => o.phone },
      { label: tx.email, value: (o) => o.email },
      { label: tx.city, value: (o) => o.city },
      { label: tx.channel, value: (o) => opt.channels[o.channel] || o.channel },
      { label: tx.budget, value: (o) => opt.budgets[o.budget] || o.budget },
      { label: tx.deadline, value: (o) => o.deadline },
      { label: tx.quantity, value: (o) => o.quantity },
      { label: tx.notes, value: (o) => o.notes },
    ];
    downloadCsv(`alzubair-orders-${new Date().toISOString().slice(0, 10)}.csv`, cols, filtered);
  };

  return (
    <div className="dsh-panel">
      <div className="dsh-panel-head">
        <h2>{tx.title}</h2>
        <button type="button" className="btn btn-ghost btn-sm" onClick={exportCsv} disabled={!filtered.length}>
          <Download strokeWidth={1.5} size={16} aria-hidden="true" />
          {tx.export}
        </button>
      </div>

      {orders.length === 0 ? (
        <EmptyState icon={Inbox} title={tx.emptyTitle} text={tx.emptyText}>
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
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {label(s)}
                </option>
              ))}
            </select>
            <select className="select dsh-filter" value={service} onChange={(e) => setService(e.target.value)} aria-label={tx.services}>
              <option value="">{tx.allServices}</option>
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {l(s.name)}
                </option>
              ))}
            </select>
          </div>
          <p className="dsh-count" aria-live="polite">
            {tx.count(filtered.length, orders.length)}
          </p>

          {filtered.length === 0 ? (
            <EmptyState icon={SearchX} title={tx.noMatch} text={tx.noMatchText} />
          ) : (
            <div className="dsh-table-wrap">
              <table className="dsh-table">
                <thead>
                  <tr>
                    <th scope="col">{tx.code}</th>
                    <th scope="col">{tx.customer}</th>
                    <th scope="col">{tx.services}</th>
                    <th scope="col">{tx.status}</th>
                    <th scope="col">{tx.date}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => {
                    const ids = orderServices(o);
                    const first = serviceById(ids[0]);
                    return (
                      <tr
                        key={o.code}
                        tabIndex={0}
                        className={o.code === openCode ? "is-active" : undefined}
                        onClick={() => setOpenCode(o.code)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setOpenCode(o.code);
                          }
                        }}
                      >
                        <td data-label={tx.code}>
                          <span className="dsh-mono ltr">{o.code}</span>
                        </td>
                        <td data-label={tx.customer}>
                          <span className="dsh-cell-main">{o.name || "—"}</span>
                          <span className="dsh-cell-sub">{o.brand}</span>
                        </td>
                        <td data-label={tx.services}>
                          {first ? l(first.name) : "—"}
                          {ids.length > 1 && <span className="dsh-more">+{ids.length - 1}</span>}
                        </td>
                        <td data-label={tx.status}>
                          <StatusBadge status={o.status} label={label(o.status)} />
                        </td>
                        <td data-label={tx.date}>{formatDate(o.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {open && (
        <RecordDrawer
          key={open.code}
          collection="orders"
          record={open}
          statuses={ORDER_STATUSES}
          statusLabel={label}
          title={open.brand || tx.details}
          buildMessage={(o) => tx.msg(o, label(o.status), trackUrl(o.code))}
          onClose={() => setOpenCode(null)}
        >
          <section className="dsh-drawer-section">
            <h3>{tx.services}</h3>
            <ul className="dsh-svc-list">
              {orderServices(open).map((id) => {
                const s = serviceById(id);
                const Icon = s?.icon;
                return (
                  <li key={id}>
                    {Icon && <Icon strokeWidth={1.5} size={16} aria-hidden="true" />}
                    {s ? l(s.name) : id}
                  </li>
                );
              })}
            </ul>
            <KeyVals
              rows={[
                { label: tx.createdAt, value: formatDate(open.createdAt, { timeStyle: "short" }) },
                { label: tx.brand, value: open.brand },
                { label: tx.notes, value: open.notes },
                { label: tx.quantity, value: open.quantity },
                { label: tx.deadline, value: open.deadline && formatDate(open.deadline) },
                { label: tx.budget, value: opt.budgets[open.budget] || open.budget },
              ]}
            />
          </section>
          <section className="dsh-drawer-section">
            <h3>{tx.contact}</h3>
            <KeyVals
              rows={[
                { label: tx.name, value: open.name },
                {
                  label: tx.phone,
                  value: open.phone && <a href={`tel:${open.phone}`}>{open.phone}</a>,
                  ltr: true,
                },
                {
                  label: tx.email,
                  value: open.email && <a href={`mailto:${open.email}`}>{open.email}</a>,
                  ltr: true,
                },
                { label: tx.city, value: open.city },
                { label: tx.channel, value: opt.channels[open.channel] || open.channel },
              ]}
            />
          </section>
        </RecordDrawer>
      )}
    </div>
  );
}
