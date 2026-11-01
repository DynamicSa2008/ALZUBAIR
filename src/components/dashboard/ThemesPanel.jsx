import { Check, Eye, Info, RotateCcw } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { useTheme } from "../../theme/ThemeProvider";
import { THEMES } from "../../theme/themes";
import { useSettings } from "../../settings/SettingsProvider";
import PublishBar from "./PublishBar";

const TEXT = {
  ar: {
    title: "هوية الموقع والمناسبات",
    lead: "اختر ثيم مناسبة لمعاينته فوراً على الموقع. المعاينة تظهر في متصفحك فقط.",
    live: "المنشور للزوار",
    previewing: "معاينة حالية",
    apply: "معاينة",
    applied: "مُطبّق",
    reset: "العودة للثيم المنشور",
    publishTitle: "نشر الثيم لجميع الزوار",
    publishText: (name) => `اختر الثيم بالأعلى ثم اضغط «نشر للزوار» لاعتماد «${name}» لكل زوار الموقع.`,
    current: "المنشور حالياً:",
  },
  en: {
    title: "Site identity & occasions",
    lead: "Pick an occasion theme to preview it instantly across the site. The preview only applies in your browser.",
    live: "Live for visitors",
    previewing: "Previewing",
    apply: "Preview",
    applied: "Applied",
    reset: "Back to the published theme",
    publishTitle: "Publish the theme for all visitors",
    publishText: (name) => `Pick a theme above, then press “Publish to visitors” to make “${name}” live for everyone.`,
    current: "Currently published:",
  },
};

const SWATCHES = ["--brand", "--brand-strong", "--brand-soft", "--accent", "--ink", "--bg"];

export default function ThemesPanel() {
  const { pick, l } = useI18n();
  const tx = pick(TEXT);
  const { themeKey, isOverride, setTheme } = useTheme();
  const { published: pub } = useSettings();
  const published = THEMES[pub.activeTheme] ? pub.activeTheme : "classic";

  return (
    <div className="dsh-panel">
      <div className="dsh-panel-head">
        <div>
          <h2>{tx.title}</h2>
          <p className="dsh-lead">{tx.lead}</p>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setTheme(null)} disabled={!isOverride}>
          <RotateCcw strokeWidth={1.5} size={16} aria-hidden="true" />
          {tx.reset}
        </button>
      </div>

      <ul className="dsh-themes">
        {Object.entries(THEMES).map(([key, t]) => {
          const active = key === themeKey;
          return (
            <li key={key}>
              <button
                type="button"
                className={`dsh-theme${active ? " is-active" : ""}`}
                aria-pressed={active}
                onClick={() => setTheme(key === published ? null : key)}
                style={{ "--t-brand": t.vars["--brand"], "--t-bg": t.vars["--bg"], "--t-soft": t.vars["--brand-soft"] }}
              >
                <span className="dsh-theme-hero" aria-hidden="true">
                  <span className="dsh-theme-bar" />
                  <span className="dsh-theme-line" />
                  <span className="dsh-theme-line is-short" />
                  <span className="dsh-theme-btn" />
                </span>
                <span className="dsh-swatches" aria-hidden="true">
                  {SWATCHES.map((v) => (
                    <span key={v} style={{ background: t.vars[v] }} title={`${v} ${t.vars[v]}`} />
                  ))}
                </span>
                <span className="dsh-theme-name">
                  <strong>{l(t.name)}</strong>
                  <span className="dsh-mono ltr">{key}</span>
                </span>
                <span className="dsh-theme-tags">
                  {key === published && <span className="badge">{tx.live}</span>}
                  {active && isOverride && <span className="badge dsh-badge-soft">{tx.previewing}</span>}
                </span>
                <span className="dsh-theme-action">
                  {active ? (
                    <>
                      <Check strokeWidth={1.5} size={16} aria-hidden="true" /> {tx.applied}
                    </>
                  ) : (
                    <>
                      <Eye strokeWidth={1.5} size={16} aria-hidden="true" /> {tx.apply}
                    </>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <section className="dsh-card dsh-publish" aria-labelledby="dsh-publish-h">
        <h3 id="dsh-publish-h">
          <Info strokeWidth={1.5} size={18} aria-hidden="true" />
          {tx.publishTitle}
        </h3>
        <p>{tx.publishText(l(THEMES[themeKey].name))}</p>
        <p className="dsh-muted">
          {tx.current} <strong>{l(THEMES[published].name)}</strong>
        </p>
        <PublishBar value={{ ...pub, activeTheme: themeKey }} disabled={themeKey === published} onPublished={() => setTheme(null)} />
      </section>
    </div>
  );
}
