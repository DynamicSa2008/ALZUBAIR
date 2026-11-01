import { useState } from "react";
import { CloudUpload, Download, KeyRound, LoaderCircle, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { useSettings } from "../../settings/SettingsProvider";
import { publishSettings, getToken, saveToken, downloadJson, REPO } from "../../settings/publish";

const TEXT = {
  ar: {
    publish: "نشر للزوار",
    publishing: "جارٍ النشر…",
    download: "تنزيل settings.json",
    tokenLabel: "مفتاح GitHub للنشر",
    tokenHint: "يُحفظ على هذا الجهاز فقط. أنشئه مرة واحدة: Fine-grained token ← المستودع ALZUBAIR فقط ← صلاحية Contents: Read and write.",
    tokenCreate: "إنشاء مفتاح",
    tokenSave: "حفظ المفتاح",
    tokenForget: "نسيان المفتاح",
    tokenSaved: "المفتاح محفوظ على هذا الجهاز",
    ok: "تم النشر ✓ ستظهر التعديلات لكل الزوار خلال دقيقة تقريباً.",
    partial: "تم النشر جزئياً. الفروع:",
    fail: "تعذّر النشر. تأكد من صلاحية المفتاح (Contents: Read and write على المستودع).",
    noToken: "أدخل مفتاح GitHub أولاً.",
  },
  en: {
    publish: "Publish to visitors",
    publishing: "Publishing…",
    download: "Download settings.json",
    tokenLabel: "GitHub publish token",
    tokenHint: "Stored on this device only. Create it once: Fine-grained token → only the ALZUBAIR repo → Contents: Read and write.",
    tokenCreate: "Create a token",
    tokenSave: "Save token",
    tokenForget: "Forget token",
    tokenSaved: "Token saved on this device",
    ok: "Published ✓ Visitors will see the changes in about a minute.",
    partial: "Partially published. Branches:",
    fail: "Publishing failed. Check the token permission (Contents: Read and write on the repo).",
    noToken: "Enter a GitHub token first.",
  },
};

// Publishes `value` (a full settings object) for every visitor.
export default function PublishBar({ value, disabled, onPublished, onTokenChange }) {
  const { pick } = useI18n();
  const tx = pick(TEXT);
  const { markPublished } = useSettings();
  const [token, setToken] = useState(getToken);
  const [stored, setStored] = useState(() => Boolean(getToken()));
  const [state, setState] = useState({ kind: "idle" });

  async function onPublish() {
    if (!token) {
      setState({ kind: "error", text: tx.noToken });
      return;
    }
    setState({ kind: "busy" });
    try {
      const results = await publishSettings(token, value);
      const okAll = results.every((r) => r.ok);
      if (okAll) {
        markPublished(value);
        onPublished?.();
        setState({ kind: "ok", text: tx.ok });
      } else if (results.some((r) => r.ok)) {
        markPublished(value);
        setState({ kind: "error", text: `${tx.partial} ${results.map((r) => `${r.branch}: ${r.ok ? "✓" : r.status}`).join(" · ")}` });
      } else {
        setState({ kind: "error", text: `${tx.fail} (${results.map((r) => r.status).join("/")})` });
      }
    } catch {
      setState({ kind: "error", text: tx.fail });
    }
  }

  return (
    <div className="dsh-pub">
      {!stored ? (
        <div className="field dsh-pub-token">
          <label htmlFor="gh-token">
            <KeyRound size={16} strokeWidth={1.5} aria-hidden="true" /> {tx.tokenLabel}
          </label>
          <div className="dsh-pub-row">
            <input
              id="gh-token"
              type="password"
              className="input ltr"
              autoComplete="off"
              placeholder="github_pat_…"
              value={token}
              onChange={(e) => setToken(e.target.value.trim())}
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={!token}
              onClick={() => {
                saveToken(token);
                setStored(true);
                onTokenChange?.();
              }}
            >
              {tx.tokenSave}
            </button>
          </div>
          <span className="hint">
            {tx.tokenHint}{" "}
            <a href={`https://github.com/settings/personal-access-tokens/new`} target="_blank" rel="noopener noreferrer">
              {tx.tokenCreate} <ExternalLink size={12} strokeWidth={1.5} aria-hidden="true" />
            </a>{" "}
            <span className="ltr">({REPO})</span>
          </span>
        </div>
      ) : (
        <p className="dsh-muted dsh-pub-saved">
          <KeyRound size={14} strokeWidth={1.5} aria-hidden="true" /> {tx.tokenSaved} ·{" "}
          <button
            type="button"
            className="dsh-link"
            onClick={() => {
              saveToken("");
              setToken("");
              setStored(false);
              onTokenChange?.();
            }}
          >
            {tx.tokenForget}
          </button>
        </p>
      )}

      <div className="dsh-pub-actions">
        <button type="button" className="btn" onClick={onPublish} disabled={disabled || state.kind === "busy"}>
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
