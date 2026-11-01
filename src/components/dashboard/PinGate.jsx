import { useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { INTEGRATIONS } from "../../config/site";

const TEXT = {
  ar: {
    eyebrow: "منطقة الإدارة",
    title: "لوحة التحكم",
    lead: "أدخل رمز الدخول للمتابعة.",
    label: "رمز الدخول",
    submit: "دخول",
    wrong: "الرمز غير صحيح، حاول مرة أخرى.",
  },
  en: {
    eyebrow: "Admin area",
    title: "Dashboard",
    lead: "Enter the access PIN to continue.",
    label: "Access PIN",
    submit: "Unlock",
    wrong: "Wrong PIN, please try again.",
  },
};

export default function PinGate({ onUnlock }) {
  const { pick } = useI18n();
  const tx = pick(TEXT);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(0);

  const submit = (e) => {
    e.preventDefault();
    if (pin === String(INTEGRATIONS.dashboardPin)) {
      onUnlock();
    } else {
      setError(true);
      setShake((n) => n + 1);
      setPin("");
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
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setError(false);
          }}
          placeholder="••••"
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? "dsh-pin-error" : undefined}
        />
        {error && (
          <p id="dsh-pin-error" className="dsh-pin-error" role="alert">
            {tx.wrong}
          </p>
        )}
        <button type="submit" className="btn dsh-lock-btn" disabled={!pin}>
          <Unlock strokeWidth={1.5} size={18} aria-hidden="true" />
          {tx.submit}
        </button>
      </form>
    </section>
  );
}
