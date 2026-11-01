import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function StatusBadge({ status, label }) {
  return <span className={`dsh-st dsh-st-${status}`}>{label || status}</span>;
}

export function EmptyState({ icon: Icon, title, text, children }) {
  return (
    <div className="dsh-empty">
      {Icon && (
        <span className="dsh-empty-icon" aria-hidden="true">
          <Icon strokeWidth={1.5} />
        </span>
      )}
      <strong>{title}</strong>
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

// Side drawer: Esc closes, focus is trapped inside and restored on close.
export function Drawer({ title, subtitle, closeLabel, onClose, children, footer }) {
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const prev = document.activeElement;
    panelRef.current?.querySelector("[data-autofocus]")?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeRef.current();
      } else if (e.key === "Tab" && panelRef.current) {
        const nodes = [...panelRef.current.querySelectorAll(FOCUSABLE)];
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (prev && typeof prev.focus === "function") prev.focus();
    };
  }, []);

  return createPortal(
    <div className="dsh-drawer-root">
      <div className="dsh-drawer-backdrop" onClick={() => closeRef.current()} aria-hidden="true" />
      <aside
        ref={panelRef}
        className="dsh-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dsh-drawer-title"
      >
        <header className="dsh-drawer-head">
          <div>
            <h2 id="dsh-drawer-title">{title}</h2>
            {subtitle && <div className="dsh-drawer-sub">{subtitle}</div>}
          </div>
          <button
            type="button"
            className="dsh-icon-btn"
            onClick={() => closeRef.current()}
            aria-label={closeLabel}
            data-autofocus
          >
            <X strokeWidth={1.5} size={20} />
          </button>
        </header>
        <div className="dsh-drawer-body">{children}</div>
        {footer && <footer className="dsh-drawer-foot">{footer}</footer>}
      </aside>
    </div>,
    document.body,
  );
}

export function KeyVals({ rows }) {
  const visible = rows.filter((r) => r.value !== undefined && r.value !== null && r.value !== "");
  return (
    <dl className="dsh-kv">
      {visible.map((r, i) => (
        <div key={`${r.label}-${i}`} className="dsh-kv-row">
          <dt>{r.label}</dt>
          <dd>{r.ltr ? <span className="ltr">{r.value}</span> : r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Timeline({ history, labelFor, formatDate }) {
  return (
    <ol className="dsh-history">
      {[...(history || [])].reverse().map((h, i) => (
        <li key={`${h.at}-${i}`}>
          <span className={`dsh-history-dot dsh-st-${h.status}`} aria-hidden="true" />
          <div>
            <strong>{labelFor(h.status)}</strong>
            <time dateTime={h.at}>{formatDate(h.at, { timeStyle: "short" })}</time>
            {h.note && <p>{h.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
