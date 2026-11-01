import { useEffect, useState } from "react";
import { BadgeCheck, ClipboardList, Database, LayoutDashboard, LoaderCircle, LogOut, MessagesSquare, Palette, Plug, SlidersHorizontal, Images } from "lucide-react";
import Seo from "../components/Seo";
import { useI18n } from "../i18n/I18nProvider";
import { list, subscribe } from "../lib/store";
import { hasApi, getAdminToken, logout } from "../lib/api";
import { PIN_KEY, seedDemoData } from "../components/dashboard/helpers";
import PinGate from "../components/dashboard/PinGate";
import Overview from "../components/dashboard/Overview";
import OrdersPanel from "../components/dashboard/OrdersPanel";
import RecordsPanel from "../components/dashboard/RecordsPanel";
import ThemesPanel from "../components/dashboard/ThemesPanel";
import SettingsPanel from "../components/dashboard/SettingsPanel";
import GalleryPanel from "../components/dashboard/GalleryPanel";
import IntegrationsPanel from "../components/dashboard/IntegrationsPanel";
import "./DashboardPage.css";

const TEXT = {
  ar: {
    seoTitle: "لوحة التحكم",
    seoDesc: "لوحة إدارة الطلبات والتوثيق والملاحظات لشركة الزبير.",
    eyebrow: "الإدارة",
    title: "لوحة التحكم",
    lead: "تابع الطلبات، عدّل أرقام وبيانات الموقع، وأدر هويته من مكان واحد.",
    nav: {
      overview: "نظرة عامة",
      orders: "الطلبات",
      kyc: "التوثيق",
      feedback: "الملاحظات",
      settings: "إعدادات الموقع",
      gallery: "معرض الأعمال",
      themes: "هوية الموقع",
      integrations: "التكاملات",
    },
    navLabel: "أقسام لوحة التحكم",
    lock: "قفل",
    demo: "تحميل بيانات تجريبية",
    demoHint: "أضف طلبات وملاحظات وتوثيقات تجريبية لاستعراض اللوحة.",
    loading: "جارٍ التحميل…",
  },
  en: {
    seoTitle: "Dashboard",
    seoDesc: "Al Zubair admin dashboard for orders, KYC and feedback.",
    eyebrow: "Admin",
    title: "Dashboard",
    lead: "Track orders, update their status and manage the site identity in one place.",
    nav: {
      overview: "Overview",
      orders: "Orders",
      kyc: "KYC",
      feedback: "Feedback",
      settings: "Site settings",
      gallery: "Works gallery",
      themes: "Site identity",
      integrations: "Integrations",
    },
    navLabel: "Dashboard sections",
    lock: "Lock",
    demo: "Load demo data",
    demoHint: "Add sample orders, feedback and KYC records to show off the dashboard.",
    loading: "Loading…",
  },
};

const SECTIONS = [
  { key: "overview", icon: LayoutDashboard },
  { key: "orders", icon: ClipboardList, count: "orders" },
  { key: "kyc", icon: BadgeCheck, count: "kyc" },
  { key: "feedback", icon: MessagesSquare, count: "feedback" },
  { key: "settings", icon: SlidersHorizontal },
  { key: "gallery", icon: Images },
  { key: "themes", icon: Palette },
  { key: "integrations", icon: Plug },
];

function readUnlocked() {
  try {
    return sessionStorage.getItem(PIN_KEY) === "1" && (!hasApi || Boolean(getAdminToken()));
  } catch {
    return false;
  }
}

// Loads all collections and keeps them fresh via store.subscribe().
function useCollections(enabled) {
  const [data, setData] = useState({ orders: [], kyc: [], feedback: [], loaded: false });
  useEffect(() => {
    if (!enabled) return undefined;
    let alive = true;
    const load = () =>
      Promise.all([list("orders"), list("kyc"), list("feedback")]).then(([orders, kyc, feedback]) => {
        if (alive) setData({ orders, kyc, feedback, loaded: true });
      });
    load();
    const unsub = subscribe(() => load());
    return () => {
      alive = false;
      unsub();
    };
  }, [enabled]);
  return data;
}

export default function DashboardPage() {
  const { pick } = useI18n();
  const tx = pick(TEXT);
  const [unlocked, setUnlocked] = useState(readUnlocked);
  const [section, setSection] = useState("overview");
  const [openCode, setOpenCode] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const data = useCollections(unlocked);

  const unlock = () => {
    try {
      sessionStorage.setItem(PIN_KEY, "1");
    } catch {
      /* storage unavailable */
    }
    setUnlocked(true);
  };

  const lock = () => {
    if (hasApi) logout();
    try {
      sessionStorage.removeItem(PIN_KEY);
    } catch {
      /* storage unavailable */
    }
    setUnlocked(false);
  };

  // Server session expired (12h) → back to the login screen.
  useEffect(() => {
    const onExpired = () => {
      try {
        sessionStorage.removeItem(PIN_KEY);
      } catch {
        /* storage unavailable */
      }
      setUnlocked(false);
    };
    window.addEventListener("alzubair:logout", onExpired);
    return () => window.removeEventListener("alzubair:logout", onExpired);
  }, []);

  const go = (key) => {
    setSection(key);
    setOpenCode(null);
  };

  const openOrder = (code) => {
    setSection("orders");
    setOpenCode(code);
  };

  const isEmpty = data.loaded && !data.orders.length && !data.kyc.length && !data.feedback.length;

  const seed = async () => {
    setSeeding(true);
    try {
      await seedDemoData();
    } finally {
      setSeeding(false);
    }
  };

  const demoButton = isEmpty ? (
    <div className="dsh-demo">
      <p className="dsh-muted">{tx.demoHint}</p>
      <button type="button" className="btn btn-sm" onClick={seed} disabled={seeding}>
        {seeding ? (
          <LoaderCircle strokeWidth={1.5} size={16} className="dsh-spin" aria-hidden="true" />
        ) : (
          <Database strokeWidth={1.5} size={16} aria-hidden="true" />
        )}
        {tx.demo}
      </button>
    </div>
  ) : null;

  const seo = <Seo title={tx.seoTitle} description={tx.seoDesc} path="/dashboard" noindex />;

  if (!unlocked) {
    return (
      <>
        {seo}
        <PinGate onUnlock={unlock} />
      </>
    );
  }

  let panel;
  if (!data.loaded) {
    panel = (
      <p className="dsh-loading" role="status">
        <LoaderCircle strokeWidth={1.5} size={20} className="dsh-spin" aria-hidden="true" /> {tx.loading}
      </p>
    );
  } else if (section === "orders") {
    panel = (
      <OrdersPanel orders={data.orders} openCode={openCode} setOpenCode={setOpenCode}>
        {demoButton}
      </OrdersPanel>
    );
  } else if (section === "kyc" || section === "feedback") {
    panel = (
      <RecordsPanel key={section} kind={section} records={data[section]} openCode={openCode} setOpenCode={setOpenCode}>
        {demoButton}
      </RecordsPanel>
    );
  } else if (section === "settings") {
    panel = <SettingsPanel />;
  } else if (section === "gallery") {
    panel = <GalleryPanel />;
  } else if (section === "themes") {
    panel = <ThemesPanel />;
  } else if (section === "integrations") {
    panel = <IntegrationsPanel />;
  } else {
    panel = (
      <Overview orders={data.orders} feedback={data.feedback} kyc={data.kyc} onOpenOrder={openOrder} onGo={go}>
        {demoButton}
      </Overview>
    );
  }

  return (
    <>
      {seo}
      <div className="dsh-app">
        <header className="dsh-top">
          <div>
            <span className="eyebrow">{tx.eyebrow}</span>
            <h1>{tx.title}</h1>
            <p className="dsh-muted">{tx.lead}</p>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={lock}>
            <LogOut strokeWidth={1.5} size={16} className="flip-rtl" aria-hidden="true" />
            {tx.lock}
          </button>
        </header>

        <div className="dsh-layout">
          <nav className="dsh-side" aria-label={tx.navLabel}>
            <ul>
              {SECTIONS.map(({ key, icon: Icon, count }) => (
                <li key={key}>
                  <button
                    type="button"
                    className="dsh-nav-btn"
                    aria-current={section === key ? "page" : undefined}
                    onClick={() => go(key)}
                  >
                    <Icon strokeWidth={1.5} size={20} aria-hidden="true" />
                    <span>{tx.nav[key]}</span>
                    {count && data[count].length > 0 && <span className="dsh-nav-count">{data[count].length}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="dsh-main">{panel}</div>
        </div>
      </div>
    </>
  );
}
