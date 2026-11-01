import { useState } from "react";
import { Lock, Unlock, LoaderCircle } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { INTEGRATIONS } from "../../config/site";
import { hasApi, login } from "../../lib/api";

const TEXT = {
  ar: {
    eyebrow: "منطقة الإدارة",
    title: "لوحة التحكم",
    lead: "أدخل كلمة المرور للمتابعة.",
    label: "كلمة المرور",
    submit: "دخول",
    wrong: "كلمة المرور غير صحيحة، حاول مرة أخرى.",
    limited: "محاولات كثيرة — حاول بعد ١٥ دقيقة.",
    offline: "تعذّر الاتصال بالخادم. تأكد من إعداد ملف api/config.php.",
  },
  en: {
    eyebrow: "Admin area",
    title: "Dashboard",
    lead: "Enter the password to continue.",
    label: "Password",
    submit: "Unlock",
    wrong: "Wrong password, please try again.",
    limited: "Too many attempts — try again in 15 minutes.",
    offline: "Couldn't reach the server. Check api/config.php.",
  },
};

export default function PinGate({ onUnlock }) {
  const { pick } = useI18n();
  const tx = pick(TEXT);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(null); // null | "wrong" | "limited" | "offline"
  const [shake, setShake] = useState(0);
  const [busy, setBusy] = useState(false);

  const reject = (kind) => {
    setError(kind);
    setShake((n) => n + 1);
    setPin("");
  };

  // With the PHP API the password is checked on the server; in local development
  // (no API) it falls back to VITE_DASHBOARD_PIN.
  const submit = async (e) => {
    e.preventDefault();
    if (!hasApi) {
      if (pin === String(INTEGRATIONS.dashboardPin)) onUnlock();
      else reject("wrong");
      return;
    }
    setBusy(true);
    try {
      await login(pin);
      onUnlock();
    } catch (err) {
      reject(err.status === 401 ? "wrong" : err.status === 429 ? "limited" : "offline");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="dsh-lock">
      <form key={shake} className={`dsh-lock-card card${shake ? " is-shake" : ""}`} onSubmit={submit} noValidate>
        <span className="dsh-lock-icon" aria-hidden="true">
          <Lock strokeWidth={1.5} />
        </span>
        <span className="eyebrow">{tx.eyebrow}</span>
        <h1>{tx.title}</h1>
        <p className="dsh-muted">{tx.lead}</p>
        <label htmlFor="dsh-pin" className="sr-only">
          {tx.label}
        </label>
        <input
          id="dsh-pin"
          className="input dsh-pin ltr"
          type="password"
          autoComplete="off"
          autoFocus
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setError(null);
          }}
          placeholder="••••"
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? "dsh-pin-error" : undefined}
        />
        {error && (
          <p id="dsh-pin-error" className="dsh-pin-error" role="alert">
            {tx[error]}
          </p>
        )}
        <button type="submit" className="btn dsh-lock-btn" disabled={!pin || busy}>
          {busy ? (
            <LoaderCircle strokeWidth={1.5} size={18} className="dsh-spin" aria-hidden="true" />
          ) : (
            <Unlock strokeWidth={1.5} size={18} aria-hidden="true" />
          )}
          {tx.submit}
        </button>
      </form>
    </section>
  );
}
