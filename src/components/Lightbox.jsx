import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { youtubeEmbed } from "../data/gallery";
import "./Lightbox.css";

// items: [{ src, alt, caption, kind?: "image" | "video" | "youtube", youtubeId?, poster?, before?, action?: { to, label } }].
// Arrow keys follow reading direction.
export default function Lightbox({ items, index, onChange, onClose }) {
  const { isAr } = useI18n();
  const closeRef = useRef(null);
  const open = index !== null && index !== undefined;
  const item = open ? items[index] : null;

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      const fwd = isAr ? "ArrowLeft" : "ArrowRight";
      const back = isAr ? "ArrowRight" : "ArrowLeft";
      if (e.key === fwd) onChange((index + 1) % items.length);
      if (e.key === back) onChange((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prevFocus?.focus?.();
    };
  }, [open, index, items.length, isAr, onChange, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="lb" role="dialog" aria-modal="true" aria-label={item.alt} onClick={onClose}>
      <figure className="lb-figure" onClick={(e) => e.stopPropagation()}>
        <Media key={item.src || item.youtubeId} item={item} />
        {(item.caption || item.action) && (
          <figcaption>
            {item.caption && <span>{item.caption}</span>}
            {item.action && (
              <Link to={item.action.to} className="btn btn-light btn-sm" onClick={onClose}>
                {item.action.label}
                <ArrowLeft size={16} strokeWidth={1.5} className="flip-ltr" aria-hidden="true" />
              </Link>
            )}
          </figcaption>
        )}
      </figure>
      <button ref={closeRef} type="button" className="lb-btn lb-close" onClick={onClose} aria-label={isAr ? "إغلاق" : "Close"}>
        <X size={22} strokeWidth={1.5} />
      </button>
      {items.length > 1 && (
        <>
          <button
            type="button"
            className="lb-btn lb-prev"
            onClick={(e) => {
              e.stopPropagation();
              onChange((index - 1 + items.length) % items.length);
            }}
            aria-label={isAr ? "السابق" : "Previous"}
          >
            {isAr ? <ChevronRight size={24} strokeWidth={1.5} /> : <ChevronLeft size={24} strokeWidth={1.5} />}
          </button>
          <button
            type="button"
            className="lb-btn lb-next"
            onClick={(e) => {
              e.stopPropagation();
              onChange((index + 1) % items.length);
            }}
            aria-label={isAr ? "التالي" : "Next"}
          >
            {isAr ? <ChevronLeft size={24} strokeWidth={1.5} /> : <ChevronRight size={24} strokeWidth={1.5} />}
          </button>
          <span className="lb-count ltr">
            {index + 1} / {items.length}
          </span>
        </>
      )}
    </div>,
    document.body,
  );
}

function Media({ item }) {
  if (item.kind === "youtube") {
    return (
      <div className="lb-video">
        <iframe
          src={youtubeEmbed(item.youtubeId)}
          title={item.alt}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }
  if (item.kind === "video") {
    return <video className="lb-media" src={item.src} poster={item.poster || undefined} controls autoPlay playsInline />;
  }
  if (item.before) return <BeforeAfter before={item.before} after={item.src} alt={item.alt} />;
  return <img className="lb-media" src={item.src} alt={item.alt} />;
}

// Drag / arrow-key comparison slider. `pos` is the share of the "after" image revealed.
function BeforeAfter({ before, after, alt }) {
  const { isAr } = useI18n();
  const [pos, setPos] = useState(50);
  return (
    <div className="lb-ba" style={{ "--pos": `${pos}%` }}>
      <img src={before} alt={`${alt} — ${isAr ? "قبل" : "before"}`} />
      <img className="lb-ba-after" src={after} alt={`${alt} — ${isAr ? "بعد" : "after"}`} />
      <span className="lb-ba-line" aria-hidden="true" />
      <span className="lb-ba-tag lb-ba-tag-before">{isAr ? "قبل" : "Before"}</span>
      <span className="lb-ba-tag lb-ba-tag-after">{isAr ? "بعد" : "After"}</span>
      <input
        type="range"
        min="0"
        max="100"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={isAr ? "مقارنة قبل وبعد" : "Before / after comparison"}
      />
    </div>
  );
}
