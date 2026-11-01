import { useState } from "react";
import { CloudUpload, Download, LoaderCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { useSettings } from "../../settings/SettingsProvider";
import { publishSettings, downloadJson, canPublish } from "../../settings/publish";

const TEXT = {
  ar: {
    publish: "نشر للزوار",
    publishing: "جارٍ النشر…",
    download: "تنزيل نسخة احتياطية",
    ok: "تم النشر ✓ التعديلات ظاهرة الآن لكل الزوار.",
    fail: "تعذّر النشر. تأكد من الاتصال وأعد المحاولة.",
    devOnly: "النشر يعمل على السيرفر فقط. هنا (وضع التطوير) يمكنك المعاينة فقط.",
  },
  en: {
    publish: "Publish to visitors",
    publishing: "Publishing…",
    download: "Download backup",
    ok: "Published ✓ Visitors see the changes now.",
    fail: "Publishing failed. Check your connection and try again.",
    devOnly: "Publishing works on the server only. Here (development) you can only preview.",
  },
};

// Publishes `value` (a full settings object) for every visitor.
export default function PublishBar({ value, disabled, onPublished }) {
  const { pick } = useI18n();
  const tx = pick(TEXT);
  const { markPublished } = useSettings();
  const [state, setState] = useState({ kind: "idle" });

  async function onPublish() {
    setState({ kind: "busy" });
    try {
      await publishSettings(value);
      markPublished(value);
      onPublished?.();
      setState({ kind: "ok", text: tx.ok });
    } catch {
      setState({ kind: "error", text: tx.fail });
    }
  }

  return (
    <div className="dsh-pub">
      {!canPublish && (
        <p className="dsh-muted dsh-pub-saved">
          <Info size={14} strokeWidth={1.5} aria-hidden="true" /> {tx.devOnly}
        </p>
      )}
      <div className="dsh-pub-actions">
        <button type="button" className="btn" onClick={onPublish} disabled={!canPublish || disabled || state.kind === "busy"}>
          {state.kind === "busy" ? (
            <LoaderCircle size={18} strokeWidth={1.5} className="dsh-spin" aria-hidden="true" />
          ) : (
            <CloudUpload size={18} strokeWidth={1.5} aria-hidden="true" />
          )}
          {state.kind === "busy" ? tx.publishing : tx.publish}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => downloadJson(value)}>
          <Download size={18} strokeWidth={1.5} aria-hidden="true" />
          {tx.download}
        </button>
      </div>
      <p className={`dsh-pub-msg is-${state.kind}`} role="status" aria-live="polite">
        {state.kind === "ok" && <CheckCircle2 size={16} strokeWidth={1.5} aria-hidden="true" />}
        {state.kind === "error" && <AlertTriangle size={16} strokeWidth={1.5} aria-hidden="true" />}
        {state.text || ""}
      </p>
    </div>
  );
}
