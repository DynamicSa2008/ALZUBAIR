import { Phone } from "lucide-react";
import { useSettings } from "../../settings/SettingsProvider";
import { formatPhone } from "../../settings/core";
import { useI18n } from "../../i18n/I18nProvider";
import { COMMON } from "../../i18n/common";
import { WhatsAppIcon } from "../icons";

export default function FloatingActions() {
  const { pick } = useI18n();
  const c = pick(COMMON);
  const { settings } = useSettings();
  const { contact, floating } = settings;
  if (!floating.call && !floating.whatsapp) return null;
  return (
    <div className="fab-group">
      {floating.call && (
      <a href={`tel:${contact.phone}`} className="fab fab-call" aria-label={`${c.actions.call} ${formatPhone(contact.phone)}`}>
        <Phone size={22} strokeWidth={1.5} aria-hidden="true" />
        <span className="fab-label">{c.actions.call}</span>
      </a>
      )}
      {floating.whatsapp && (
      <a
        href={`https://wa.me/${contact.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fab fab-wa"
        aria-label={c.actions.whatsapp}
      >
        <WhatsAppIcon size={24} />
        <span className="fab-label">{c.actions.whatsapp}</span>
      </a>
      )}
    </div>
  );
}
