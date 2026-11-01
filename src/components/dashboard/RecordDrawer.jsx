import { useState } from "react";
import { CheckCheck, LoaderCircle, MessageCircle, Save, Trash2 } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { update, remove } from "../../lib/store";
import { notifyCustomer } from "../../lib/notify";
import { Drawer, StatusBadge, Timeline } from "./ui";

const TEXT = {
  ar: {
    close: "إغلاق",
    status: "تغيير الحالة",
    newStatus: "الحالة الجديدة",
    note: "ملاحظة (تظهر للعميل في التتبع)",
    notePh: "مثال: تم رفع الطلب للهيئة",
    save: "حفظ الحالة",
    saved: "تم حفظ الحالة",
    history: "سجل الحالة",
    notify: "إشعار العميل عبر واتساب",
    notifySent: "تم إرسال الإشعار عبر واتساب API",
    noPhone: "لا يوجد رقم جوال لهذا السجل",
    remove: "حذف",
    confirmDelete: (c) => `حذف السجل ${c} نهائياً؟ لا يمكن التراجع.`,
  },
  en: {
    close: "Close",
    status: "Change status",
    newStatus: "New status",
    note: "Note (visible to the customer when tracking)",
    notePh: "e.g. Filed with SAIP",
    save: "Save status",
    saved: "Status saved",
    history: "Status history",
    notify: "Notify customer on WhatsApp",
    notifySent: "Notification sent via WhatsApp API",
    noPhone: "No mobile number on this record",
    remove: "Delete",
    confirmDelete: (c) => `Permanently delete ${c}? This can't be undone.`,
  },
};

/**
 * Shared drawer for orders / KYC / feedback.
 * `statusLabel(key)` → label; `buildMessage(record)` → WhatsApp text for the customer.
 */
export default function RecordDrawer({ collection, record, statuses, statusLabel, title, children, buildMessage, onClose }) {
  const { pick, formatDate } = useI18n();
  const tx = pick(TEXT);
  const [status, setStatus] = useState(record.status);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState("");

  const options = statuses.includes(record.status) ? statuses : [record.status, ...statuses];

  const save = async () => {
    setBusy(true);
    await update(collection, record.code, { status }, note.trim() || undefined);
    setBusy(false);
    setNote("");
    setFlash(tx.saved);
  };

  const notify = async () => {
    setBusy(true);
    const res = await notifyCustomer({ phone: record.phone, message: buildMessage(record) });
    setBusy(false);
    if (res.viaApi) setFlash(tx.notifySent);
    else if (res.link) window.open(res.link, "_blank", "noopener,noreferrer");
  };

  const del = async () => {
    if (!window.confirm(tx.confirmDelete(record.code))) return;
    await remove(collection, record.code);
    onClose();
  };

  return (
    <Drawer
      title={title}
      subtitle={
        <>
          <span className="ltr dsh-mono">{record.code}</span>
          <StatusBadge status={record.status} label={statusLabel(record.status)} />
        </>
      }
      closeLabel={tx.close}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            className="btn btn-sm"
            onClick={notify}
            disabled={busy || !record.phone}
            title={record.phone ? undefined : tx.noPhone}
          >
            <MessageCircle strokeWidth={1.5} size={16} aria-hidden="true" />
            {tx.notify}
          </button>
          <button type="button" className="btn btn-ghost btn-sm dsh-danger" onClick={del}>
            <Trash2 strokeWidth={1.5} size={16} aria-hidden="true" />
            {tx.remove}
          </button>
        </>
      }
    >
      {children}

      <section className="dsh-drawer-section dsh-status-box" aria-labelledby="dsh-status-h">
        <h3 id="dsh-status-h">{tx.status}</h3>
        <div className="field">
          <label htmlFor="dsh-status-select">{tx.newStatus}</label>
          <select
            id="dsh-status-select"
            className="select"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setFlash("");
            }}
          >
            {options.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="dsh-status-note">{tx.note}</label>
          <textarea
            id="dsh-status-note"
            className="textarea dsh-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={tx.notePh}
            rows={2}
            maxLength={300}
          />
        </div>
        <div className="dsh-status-actions">
          <button type="button" className="btn btn-sm" onClick={save} disabled={busy || status === record.status}>
            {busy ? (
              <LoaderCircle strokeWidth={1.5} size={16} className="dsh-spin" aria-hidden="true" />
            ) : (
              <Save strokeWidth={1.5} size={16} aria-hidden="true" />
            )}
            {tx.save}
          </button>
          <span className="dsh-flash" role="status" aria-live="polite">
            {flash && (
              <>
                <CheckCheck strokeWidth={1.5} size={16} aria-hidden="true" /> {flash}
              </>
            )}
          </span>
        </div>
      </section>

      <section className="dsh-drawer-section">
        <h3>{tx.history}</h3>
        <Timeline history={record.history} labelFor={statusLabel} formatDate={formatDate} />
      </section>
    </Drawer>
  );
}
