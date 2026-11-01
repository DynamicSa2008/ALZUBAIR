import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Expand, SplitSquareHorizontal, ArrowLeft, Clapperboard } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { useSettings } from "../../settings/SettingsProvider";
import { GALLERY_CATEGORIES, SAMPLE_ITEMS, mediaUrl, youtubeId, youtubeThumb, youtubeEmbed } from "../../data/gallery";
import Lightbox from "../Lightbox";
import "./WorksGallery.css";

const TEXT = {
  ar: {
    eyebrow: "معرض أعمالنا",
    title: (
      <>
        أعمال طبعناها <em>بأيدينا</em>
      </>
    ),
    lead: "نماذج حقيقية من مطبوعات عملائنا، وجولة داخل خط الطباعة لترى كيف تتحول فكرتك إلى منتج بين يديك.",
    all: "الكل",
    videoBadge: "شاهد كيف نطبع",
    play: "تشغيل الفيديو",
    beforeAfter: "قبل / بعد",
    orderLike: "اطلب مثل هذا العمل",
    cta: "عندك فكرة؟ نطبعها لك",
    ctaBtn: "اطلب عرض سعر",
  },
  en: {
    eyebrow: "Our work",
    title: (
      <>
        Work we printed <em>by hand</em>
      </>
    ),
    lead: "Real prints from our clients, and a tour of our press line — see how your idea becomes something you can hold.",
    all: "All",
    videoBadge: "See how we print",
    play: "Play video",
    beforeAfter: "Before / after",
    orderLike: "Order something like this",
    cta: "Got an idea? We'll print it",
    ctaBtn: "Get a quote",
  },
};

// Normalises a stored item into what the grid and lightbox need.
function toView(item, l, tx) {
  const ytId = item.kind === "youtube" ? youtubeId(item.src) : null;
  const cat = GALLERY_CATEGORIES[item.category];
  const title = l(item.title) || (cat ? l(cat) : "");
  return {
    ...item,
    title,
    youtubeId: ytId,
    url: ytId ? null : mediaUrl(item.src),
    thumb: ytId ? youtubeThumb(ytId) : mediaUrl(item.poster) || (item.kind === "image" ? mediaUrl(item.src) : ""),
    before: item.before ? mediaUrl(item.before) : null,
    action: { to: `/order?service=${cat?.service || "printing"}&details=${encodeURIComponent(title)}`, label: tx.orderLike },
  };
}

export default function WorksGallery() {
  const { pick, l } = useI18n();
  const tx = pick(TEXT);
  const { gallery } = useSettings().settings;
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);

  const items = useMemo(() => {
    const source = gallery.items.length ? gallery.items : SAMPLE_ITEMS;
    return source.map((it) => toView(it, l, tx));
  }, [gallery.items, l, tx]);

  const categories = useMemo(() => [...new Set(items.map((i) => i.category))].filter((c) => GALLERY_CATEGORIES[c]), [items]);
  const visible = filter === "all" ? items : items.filter((i) => i.category === filter);

  const lightboxItems = visible.map((v) => ({
    kind: v.kind,
    src: v.url,
    youtubeId: v.youtubeId,
    poster: v.thumb,
    before: v.before,
    alt: v.title,
    caption: v.title,
    action: v.action,
  }));

  return (
    <section id="works" className="section wg">
      <div className="container">
        <header className="section-head reveal">
          <span className="eyebrow">{tx.eyebrow}</span>
          <h2 className="section-title">{tx.title}</h2>
          <p className="section-lead">{tx.lead}</p>
        </header>

        <FeaturedVideo video={gallery.video} tx={tx} l={l} />

        {categories.length > 1 && (
          <div className="chips chips-scroll wg-filters reveal" role="group" aria-label={tx.eyebrow}>
            <button type="button" className="chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
              {tx.all}
              <span className="wg-count ltr">{items.length}</span>
            </button>
            {categories.map((c) => (
              <button key={c} type="button" className="chip" aria-pressed={filter === c} onClick={() => setFilter(c)}>
                {l(GALLERY_CATEGORIES[c])}
                <span className="wg-count ltr">{items.filter((i) => i.category === c).length}</span>
              </button>
            ))}
          </div>
        )}

        <ul className="wg-grid" key={filter}>
          {visible.map((v, i) => (
            <li key={v.id} className={`wg-tile wg-${v.size || "normal"}`} style={{ "--i": i }}>
              <button type="button" className="wg-open" onClick={() => setOpen(i)} aria-label={`${v.title}${v.kind !== "image" ? ` — ${tx.play}` : ""}`}>
                {v.kind === "video" && !v.thumb ? (
                  <video src={`${v.url}#t=0.5`} muted playsInline preload="metadata" tabIndex={-1} />
                ) : (
                  <img src={v.thumb} alt="" loading="lazy" decoding="async" />
                )}
                <span className="wg-shade" aria-hidden="true" />
                {v.kind !== "image" && (
                  <span className="wg-play" aria-hidden="true">
                    <Play size={22} strokeWidth={1.5} fill="currentColor" />
                  </span>
                )}
                {v.before && (
                  <span className="wg-flag" aria-hidden="true">
                    <SplitSquareHorizontal size={14} strokeWidth={1.5} />
                    {tx.beforeAfter}
                  </span>
                )}
                <span className="wg-meta">
                  <span className="wg-cat">{l(GALLERY_CATEGORIES[v.category] || {})}</span>
                  <strong>{v.title}</strong>
                </span>
                <span className="wg-zoom" aria-hidden="true">
                  <Expand size={16} strokeWidth={1.5} />
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="wg-cta reveal">
          <span>{tx.cta}</span>
          <Link to="/order?service=printing" className="btn">
            {tx.ctaBtn}
            <ArrowLeft size={18} strokeWidth={1.5} className="flip-ltr" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <Lightbox items={lightboxItems} index={open} onChange={setOpen} onClose={() => setOpen(null)} />
    </section>
  );
}

// Big "behind the press" player. YouTube loads only after a click (no third-party cookies before that).
function FeaturedVideo({ video, tx, l }) {
  const [playing, setPlaying] = useState(false);
  if (!video?.src) return null;
  const ytId = video.kind === "youtube" ? youtubeId(video.src) : null;
  const poster = mediaUrl(video.poster) || (ytId ? youtubeThumb(ytId) : "");
  const title = l(video.title) || tx.videoBadge;

  return (
    <div className="wg-feature reveal">
      <div className="wg-feature-frame">
        {playing && ytId ? (
          <iframe src={youtubeEmbed(ytId)} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
        ) : playing || (!ytId && !poster) ? (
          <video src={mediaUrl(video.src)} poster={poster || undefined} controls autoPlay={playing} playsInline preload="metadata" />
        ) : (
          <button type="button" className="wg-feature-poster" onClick={() => setPlaying(true)} aria-label={`${tx.play}: ${title}`}>
            {poster && <img src={poster} alt="" loading="lazy" />}
            <span className="wg-feature-play" aria-hidden="true">
              <Play size={30} strokeWidth={1.5} fill="currentColor" />
            </span>
          </button>
        )}
      </div>
      <div className="wg-feature-caption">
        <span className="wg-feature-badge">
          <Clapperboard size={16} strokeWidth={1.5} aria-hidden="true" />
          {tx.videoBadge}
        </span>
        <strong>{title}</strong>
      </div>
    </div>
  );
}
