import { BadgeCheck, ChevronRight, ClipboardList, Inbox, MessageSquareWarning, PackageCheck, Sparkles, Wrench } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { COMMON, STATUS_FLOW } from "../../i18n/common";
import { SERVICES } from "../../data/services";
import { isToday, orderServices, serviceNames } from "./helpers";
import { EmptyState, StatusBadge } from "./ui";

const TEXT = {
  ar: {
    title: "نظرة عامة",
    kpi: {
      total: "إجمالي الطلبات",
      today: "طلبات اليوم",
      progress: "قيد التنفيذ",
      delivered: "تم التسليم",
      complaints: "شكاوى مفتوحة",
      kyc: "توثيق بانتظار المراجعة",
    },
    perService: "الطلبات حسب الخدمة",
    perStatus: "توزيع الحالات",
    latest: "أحدث الطلبات",
    viewAll: "عرض كل الطلبات",
    emptyTitle: "لا توجد بيانات بعد",
    emptyText: "عندما تصل الطلبات ستظهر هنا المؤشرات والرسوم البيانية.",
    ordersUnit: (n) => `${n} طلب`,
  },
  en: {
    title: "Overview",
    kpi: {
      total: "Total orders",
      today: "New today",
      progress: "In progress",
      delivered: "Delivered",
      complaints: "Open complaints",
      kyc: "Pending KYC",
    },
    perService: "Orders per service",
    perStatus: "Status breakdown",
    latest: "Latest orders",
    viewAll: "View all orders",
    emptyTitle: "No data yet",
    emptyText: "Once orders arrive, the KPIs and charts will show up here.",
    ordersUnit: (n) => `${n} order${n === 1 ? "" : "s"}`,
  },
};

export default function Overview({ orders, feedback, kyc, onOpenOrder, onGo, children }) {
  const { pick, l, formatDate } = useI18n();
  const tx = pick(TEXT);
  const status = pick(COMMON).status;

  const kpis = [
    { key: "total", icon: ClipboardList, value: orders.length, go: "orders" },
    { key: "today", icon: Sparkles, value: orders.filter((o) => isToday(o.createdAt)).length, go: "orders" },
    { key: "progress", icon: Wrench, value: orders.filter((o) => o.status === "in_progress").length, go: "orders" },
    { key: "delivered", icon: PackageCheck, value: orders.filter((o) => o.status === "delivered").length, go: "orders" },
    {
      key: "complaints",
      icon: MessageSquareWarning,
      value: feedback.filter((f) => f.type === "complaint" && f.status !== "resolved").length,
      go: "feedback",
      warn: true,
    },
    {
      key: "kyc",
      icon: BadgeCheck,
      value: kyc.filter((k) => k.status !== "approved" && k.status !== "rejected").length,
      go: "kyc",
      warn: true,
    },
  ];

  const perService = SERVICES.map((s) => ({
    id: s.id,
    name: l(s.name),
    Icon: s.icon,
    count: orders.filter((o) => orderServices(o).includes(s.id)).length,
  })).sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...perService.map((s) => s.count));

  const statusCounts = [...STATUS_FLOW, "cancelled"].map((k) => ({
    key: k,
    count: orders.filter((o) => o.status === k).length,
  }));

  return (
    <div className="dsh-panel">
      <div className="dsh-panel-head">
        <h2>{tx.title}</h2>
      </div>

      <ul className="dsh-kpis">
        {kpis.map(({ key, icon: Icon, value, go, warn }) => (
          <li key={key}>
            <button type="button" className={`dsh-kpi${warn && value > 0 ? " is-warn" : ""}`} onClick={() => onGo(go)}>
              <span className="dsh-kpi-icon" aria-hidden="true">
                <Icon strokeWidth={1.5} />
              </span>
              <span className="dsh-kpi-value">{value}</span>
              <span className="dsh-kpi-label">{tx.kpi[key]}</span>
            </button>
          </li>
        ))}
      </ul>

      {orders.length === 0 ? (
        <EmptyState icon={Inbox} title={tx.emptyTitle} text={tx.emptyText}>
          {children}
        </EmptyState>
      ) : (
        <div className="dsh-overview-grid">
          <section className="dsh-card" aria-labelledby="dsh-chart-h">
            <h3 id="dsh-chart-h">{tx.perService}</h3>
            <ul className="dsh-bars">
              {perService.map(({ id, name, Icon, count }) => (
                <li key={id}>
                  <span className="dsh-bar-label">
                    <Icon strokeWidth={1.5} size={16} aria-hidden="true" />
                    {name}
                  </span>
                  <span className="dsh-bar-track" aria-hidden="true">
                    <span className="dsh-bar-fill" style={{ inlineSize: `${(count / max) * 100}%` }} />
                  </span>
                  <span className="dsh-bar-value" aria-label={tx.ordersUnit(count)}>
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="dsh-card" aria-labelledby="dsh-status-dist-h">
            <h3 id="dsh-status-dist-h">{tx.perStatus}</h3>
            <div className="dsh-stack" aria-hidden="true">
              {statusCounts
                .filter((s) => s.count)
                .map((s) => (
                  <span
                    key={s.key}
                    className={`dsh-stack-seg dsh-st-${s.key}`}
                    style={{ flexGrow: s.count }}
                    title={`${status[s.key]}: ${s.count}`}
                  />
                ))}
            </div>
            <ul className="dsh-legend">
              {statusCounts.map((s) => (
                <li key={s.key}>
                  <span className={`dsh-legend-dot dsh-st-${s.key}`} aria-hidden="true" />
                  {status[s.key]}
                  <strong>{s.count}</strong>
                </li>
              ))}
            </ul>
          </section>

          <section className="dsh-card dsh-span-2" aria-labelledby="dsh-latest-h">
            <div className="dsh-card-head">
              <h3 id="dsh-latest-h">{tx.latest}</h3>
              <button type="button" className="dsh-link" onClick={() => onGo("orders")}>
                {tx.viewAll}
                <ChevronRight strokeWidth={1.5} size={16} className="flip-rtl" aria-hidden="true" />
              </button>
            </div>
            <ul className="dsh-latest">
              {orders.slice(0, 5).map((o) => (
                <li key={o.code}>
                  <button type="button" onClick={() => onOpenOrder(o.code)}>
                    <span className="dsh-avatar" aria-hidden="true">
                      {(o.name || "?").trim().charAt(0)}
                    </span>
                    <span className="dsh-latest-main">
                      <strong>{o.name || "—"}</strong>
                      <span>{serviceNames(o, l)}</span>
                    </span>
                    <span className="dsh-latest-meta">
                      <StatusBadge status={o.status} label={status[o.status]} />
                      <span className="dsh-latest-date">
                        <span className="dsh-mono ltr">{o.code}</span> · {formatDate(o.createdAt)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
