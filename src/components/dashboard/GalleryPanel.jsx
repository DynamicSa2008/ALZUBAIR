import { useRef, useState } from "react";
import {
  ImagePlus,
  MonitorPlay,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  Undo2,
  LoaderCircle,
  Film,
  Image as ImageIcon,
  Info,
  SplitSquareHorizontal,
  Clapperboard,
  X,
} from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { useSettings } from "../../settings/SettingsProvider";
import { getToken, uploadMedia, prepareImage, MAX_UPLOAD_MB } from "../../settings/publish";
import { GALLERY_CATEGORIES, mediaUrl, youtubeId, youtubeThumb } from "../../data/gallery";
import PublishBar from "./PublishBar";
import "./GalleryPanel.css";

const TEXT = {
  ar: {
    title: "معرض الأعمال والفيديو",
    lead: "ارفع صور أعمالك وفيديوهات الطباعة، رتّبها وصنّفها، ثم انشرها للزوار.",
    sample: "لا توجد أعمال مضافة بعد — الموقع يعرض الصور الافتراضية حتى تضيف أعمالك.",
    needToken: "لرفع الملفات أدخل مفتاح GitHub في أسفل الصفحة أولاً.",
    videoTitle: "فيديو عملية الطباعة (أعلى المعرض)",
    kinds: { "": "بدون فيديو", youtube: "رابط يوتيوب", file: "رفع ملف فيديو" },
    ytUrl: "رابط الفيديو على يوتيوب",
    uploadVideo: "رفع فيديو",
    uploadPoster: "رفع صورة الغلاف (اختياري)",
    videoTitleAr: "عنوان الفيديو (عربي)",
    videoTitleEn: "عنوان الفيديو (إنجليزي)",
    items: "الأعمال",
    addFiles: "رفع صور أو فيديوهات",
    dropHint: `اسحب الملفات هنا أو اضغط للاختيار — الصور تُضغط تلقائياً، والفيديو حتى ${MAX_UPLOAD_MB}MB (للأطول استخدم يوتيوب).`,
    addYt: "إضافة فيديو يوتيوب",
    add: "إضافة",
    titleAr: "العنوان (عربي)",
    titleEn: "العنوان (إنجليزي)",
    category: "التصنيف",
    size: "حجم البطاقة",
    sizes: { normal: "عادي", tall: "طويل", wide: "عريض" },
    before: "صورة «قبل» (اختياري)",
    removeBefore: "إزالة صورة قبل",
    up: "أعلى",
    down: "أسفل",
    remove: "حذف",
    uploading: "جارٍ الرفع…",
    uploadFail: "تعذّر رفع الملف",
    tooLarge: `الملف أكبر من ${MAX_UPLOAD_MB}MB — ارفعه على يوتيوب وأضف الرابط.`,
    badYt: "رابط يوتيوب غير صحيح",
    preview: "معاينة على الموقع",
    discard: "تجاهل التعديلات",
    kindLabel: { image: "صورة", video: "فيديو", youtube: "يوتيوب" },
  },
  en: {
    title: "Works gallery & video",
    lead: "Upload photos of your work and print videos, sort and categorise them, then publish.",
    sample: "No work added yet — the site shows the sample images until you add yours.",
    needToken: "To upload files, enter the GitHub token at the bottom of the page first.",
    videoTitle: "Print process video (top of the gallery)",
    kinds: { "": "No video", youtube: "YouTube link", file: "Upload a video file" },
    ytUrl: "YouTube video link",
    uploadVideo: "Upload video",
    uploadPoster: "Upload cover image (optional)",
    videoTitleAr: "Video title (Arabic)",
    videoTitleEn: "Video title (English)",
    items: "Works",
    addFiles: "Upload photos or videos",
    dropHint: `Drop files here or click to choose — photos are compressed automatically, videos up to ${MAX_UPLOAD_MB}MB (use YouTube for longer ones).`,
    addYt: "Add a YouTube video",
    add: "Add",
    titleAr: "Title (Arabic)",
    titleEn: "Title (English)",
    category: "Category",
    size: "Card size",
    sizes: { normal: "Normal", tall: "Tall", wide: "Wide" },
    before: "“Before” image (optional)",
    removeBefore: "Remove before image",
    up: "Up",
    down: "Down",
    remove: "Delete",
    uploading: "Uploading…",
    uploadFail: "Upload failed",
    tooLarge: `File is over ${MAX_UPLOAD_MB}MB — upload it to YouTube and add the link.`,
    badYt: "Invalid YouTube link",
    preview: "Preview on site",
    discard: "Discard changes",
    kindLabel: { image: "Photo", video: "Video", youtube: "YouTube" },
  },
};

const newId = () => Math.random().toString(36).slice(2, 10);

export default function GalleryPanel() {
  const { pick, l } = useI18n();
  const tx = pick(TEXT);
  const { settings, published, setDraft, hasDraft } = useSettings();
  const [gal, setGal] = useState(() => structuredClone(settings.gallery));
  const [busy, setBusy] = useState([]); // [{ id, name, error? }]
  const [ytInput, setYtInput] = useState("");
  const [ytError, setYtError] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const [, refreshToken] = useState(0);
  const token = getToken();
  const dirty = JSON.stringify(gal) !== JSON.stringify(published.gallery);

  const patchVideo = (patch) => setGal((g) => ({ ...g, video: { ...g.video, ...patch } }));
  const patchItem = (id, patch) => setGal((g) => ({ ...g, items: g.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }));
  const move = (i, d) =>
    setGal((g) => {
      const items = [...g.items];
      [items[i], items[i + d]] = [items[i + d], items[i]];
      return { ...g, items };
    });

  // Uploads one file and returns its site path (or null), tracking progress in `busy`.
  async function upload(file) {
    const job = { id: newId(), name: file.name };
    setBusy((b) => [...b, job]);
    try {
      const blob = await prepareImage(file);
      const path = await uploadMedia(getToken(), blob, file.name);
      setBusy((b) => b.filter((j) => j.id !== job.id));
      return path;
    } catch (e) {
      setBusy((b) => b.map((j) => (j.id === job.id ? { ...j, error: e.message === "too-large" ? tx.tooLarge : tx.uploadFail } : j)));
      return null;
    }
  }

  async function addFiles(files) {
    if (!getToken()) return;
    for (const file of files) {
      const kind = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : null;
      if (!kind) continue;
      const src = await upload(file);
      if (src) {
        setGal((g) => ({
          ...g,
          items: [...g.items, { id: newId(), kind, src, category: kind === "video" ? "process" : "cards", size: "normal", title: { ar: "", en: "" } }],
        }));
      }
    }
  }

  function addYoutube() {
    if (!youtubeId(ytInput)) {
      setYtError(true);
      return;
    }
    setGal((g) => ({
      ...g,
      items: [...g.items, { id: newId(), kind: "youtube", src: ytInput.trim(), category: "process", size: "wide", title: { ar: "", en: "" } }],
    }));
    setYtInput("");
    setYtError(false);
  }

  const pickFile = (accept, onFile) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = async () => input.files[0] && onFile(await upload(input.files[0]));
    input.click();
  };

  const thumbOf = (it) =>
    it.kind === "youtube" ? youtubeThumb(youtubeId(it.src)) : it.kind === "image" ? mediaUrl(it.src) : mediaUrl(it.poster);

  return (
    <div className="dsh-panel dsh-gal">
      <div className="dsh-panel-head">
        <div>
          <h2>{tx.title}</h2>
          <p className="dsh-lead">{tx.lead}</p>
        </div>
      </div>

      {!token && (
        <p className="alert dsh-gal-alert">
          <Info size={18} strokeWidth={1.5} aria-hidden="true" />
          {tx.needToken}
        </p>
      )}

      {/* Featured process video */}
      <section className="dsh-card dsh-gal-block">
        <h3>
          <Clapperboard size={18} strokeWidth={1.5} aria-hidden="true" />
          {tx.videoTitle}
        </h3>
        <div className="chips">
          {Object.entries(tx.kinds).map(([k, label]) => (
            <button key={k} type="button" className="chip" aria-pressed={gal.video.kind === k} onClick={() => patchVideo({ kind: k, src: k === gal.video.kind ? gal.video.src : "" })}>
              {label}
            </button>
          ))}
        </div>
        {gal.video.kind === "youtube" && (
          <div className="field dsh-gal-mt">
            <label htmlFor="gal-yt-main">{tx.ytUrl}</label>
            <input id="gal-yt-main" className="input ltr" placeholder="https://youtu.be/…" value={gal.video.src} onChange={(e) => patchVideo({ src: e.target.value.trim() })} aria-invalid={Boolean(gal.video.src) && !youtubeId(gal.video.src)} />
            {gal.video.src && !youtubeId(gal.video.src) && <span className="error">{tx.badYt}</span>}
          </div>
        )}
        {gal.video.kind === "file" && (
          <div className="dsh-gal-row dsh-gal-mt">
            <button type="button" className="btn btn-ghost btn-sm" disabled={!token} onClick={() => pickFile("video/*", (p) => p && patchVideo({ src: p }))}>
              <Film size={16} strokeWidth={1.5} aria-hidden="true" />
              {tx.uploadVideo}
            </button>
            {gal.video.src && <code className="ltr dsh-gal-path">{gal.video.src}</code>}
          </div>
        )}
        {gal.video.kind && (
          <>
            <div className="dsh-gal-row dsh-gal-mt">
              <button type="button" className="btn btn-ghost btn-sm" disabled={!token} onClick={() => pickFile("image/*", (p) => p && patchVideo({ poster: p }))}>
                <ImageIcon size={16} strokeWidth={1.5} aria-hidden="true" />
                {tx.uploadPoster}
              </button>
              {(gal.video.poster || youtubeId(gal.video.src)) && (
                <img className="dsh-gal-poster" src={mediaUrl(gal.video.poster) || youtubeThumb(youtubeId(gal.video.src))} alt="" />
              )}
            </div>
            <div className="dsh-gal-grid2 dsh-gal-mt">
              <div className="field">
                <label htmlFor="gal-vt-ar">{tx.videoTitleAr}</label>
                <input id="gal-vt-ar" className="input" value={gal.video.title.ar} onChange={(e) => patchVideo({ title: { ...gal.video.title, ar: e.target.value } })} />
              </div>
              <div className="field">
                <label htmlFor="gal-vt-en">{tx.videoTitleEn}</label>
                <input id="gal-vt-en" className="input ltr" value={gal.video.title.en} onChange={(e) => patchVideo({ title: { ...gal.video.title, en: e.target.value } })} />
              </div>
            </div>
          </>
        )}
      </section>

      {/* Add works */}
      <section className="dsh-card dsh-gal-block">
        <h3>
          <ImagePlus size={18} strokeWidth={1.5} aria-hidden="true" />
          {tx.items}
        </h3>
        <button
          type="button"
          className={`dsh-gal-drop${dragOver ? " is-over" : ""}`}
          disabled={!token}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles([...e.dataTransfer.files]);
          }}
        >
          <ImagePlus size={28} strokeWidth={1.5} aria-hidden="true" />
          <strong>{tx.addFiles}</strong>
          <span>{tx.dropHint}</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          multiple
          hidden
          onChange={(e) => {
            addFiles([...e.target.files]);
            e.target.value = "";
          }}
        />
        <div className="field dsh-gal-mt">
          <label htmlFor="gal-yt-add">
            <MonitorPlay size={16} strokeWidth={1.5} aria-hidden="true" /> {tx.addYt}
          </label>
          <div className="dsh-gal-row">
            <input
              id="gal-yt-add"
              className="input ltr"
              placeholder="https://youtu.be/…"
              value={ytInput}
              onChange={(e) => {
                setYtInput(e.target.value);
                setYtError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && addYoutube()}
              aria-invalid={ytError}
            />
            <button type="button" className="btn btn-sm" onClick={addYoutube} disabled={!ytInput}>
              {tx.add}
            </button>
          </div>
          {ytError && <span className="error">{tx.badYt}</span>}
        </div>

        {busy.length > 0 && (
          <ul className="dsh-gal-busy" aria-live="polite">
            {busy.map((j) => (
              <li key={j.id} className={j.error ? "is-error" : ""}>
                {j.error ? <X size={14} strokeWidth={1.5} aria-hidden="true" /> : <LoaderCircle size={14} strokeWidth={1.5} className="dsh-spin" aria-hidden="true" />}
                <span className="ltr">{j.name}</span> — {j.error || tx.uploading}
                {j.error && (
                  <button type="button" className="dsh-link" onClick={() => setBusy((b) => b.filter((x) => x.id !== j.id))}>
                    ✕
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {gal.items.length === 0 ? (
          <p className="dsh-muted dsh-gal-mt">{tx.sample}</p>
        ) : (
          <ol className="dsh-gal-list">
            {gal.items.map((it, i) => (
              <li key={it.id} className="dsh-gal-item">
                <div className="dsh-gal-thumb">
                  {thumbOf(it) ? <img src={thumbOf(it)} alt="" /> : <video src={`${mediaUrl(it.src)}#t=0.5`} muted preload="metadata" />}
                  <span className="dsh-gal-kind">{tx.kindLabel[it.kind]}</span>
                </div>
                <div className="dsh-gal-fields">
                  <div className="field">
                    <label htmlFor={`gi-ar-${it.id}`}>{tx.titleAr}</label>
                    <input id={`gi-ar-${it.id}`} className="input" value={it.title.ar} onChange={(e) => patchItem(it.id, { title: { ...it.title, ar: e.target.value } })} />
                  </div>
                  <div className="field">
                    <label htmlFor={`gi-en-${it.id}`}>{tx.titleEn}</label>
                    <input id={`gi-en-${it.id}`} className="input ltr" value={it.title.en} onChange={(e) => patchItem(it.id, { title: { ...it.title, en: e.target.value } })} />
                  </div>
                  <div className="field">
                    <label htmlFor={`gi-cat-${it.id}`}>{tx.category}</label>
                    <select id={`gi-cat-${it.id}`} className="select" value={it.category} onChange={(e) => patchItem(it.id, { category: e.target.value })}>
                      {Object.entries(GALLERY_CATEGORIES).map(([k, c]) => (
                        <option key={k} value={k}>
                          {l(c)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor={`gi-size-${it.id}`}>{tx.size}</label>
                    <select id={`gi-size-${it.id}`} className="select" value={it.size || "normal"} onChange={(e) => patchItem(it.id, { size: e.target.value })}>
                      {Object.entries(tx.sizes).map(([k, label]) => (
                        <option key={k} value={k}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {it.kind === "image" && (
                    <div className="dsh-gal-row">
                      {it.before ? (
                        <>
                          <img className="dsh-gal-before" src={mediaUrl(it.before)} alt="" />
                          <button type="button" className="dsh-link" onClick={() => patchItem(it.id, { before: "" })}>
                            {tx.removeBefore}
                          </button>
                        </>
                      ) : (
                        <button type="button" className="btn btn-ghost btn-sm" disabled={!token} onClick={() => pickFile("image/*", (p) => p && patchItem(it.id, { before: p }))}>
                          <SplitSquareHorizontal size={16} strokeWidth={1.5} aria-hidden="true" />
                          {tx.before}
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="dsh-gal-tools">
                  <button type="button" className="dsh-icon-btn" aria-label={tx.up} disabled={i === 0} onClick={() => move(i, -1)}>
                    <ArrowUp size={16} strokeWidth={1.5} />
                  </button>
                  <button type="button" className="dsh-icon-btn" aria-label={tx.down} disabled={i === gal.items.length - 1} onClick={() => move(i, 1)}>
                    <ArrowDown size={16} strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    className="dsh-icon-btn dsh-danger"
                    aria-label={tx.remove}
                    onClick={() => setGal((g) => ({ ...g, items: g.items.filter((x) => x.id !== it.id) }))}
                  >
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="dsh-card dsh-set-actions">
        <div className="dsh-set-actions-row">
          <button type="button" className="btn btn-ghost" disabled={busy.some((j) => !j.error)} onClick={() => setDraft({ ...settings, gallery: gal })}>
            <Eye size={18} strokeWidth={1.5} aria-hidden="true" />
            {tx.preview}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={!dirty && !hasDraft}
            onClick={() => {
              setDraft(null);
              setGal(structuredClone(published.gallery));
            }}
          >
            <Undo2 size={18} strokeWidth={1.5} aria-hidden="true" />
            {tx.discard}
          </button>
        </div>
        <PublishBar value={{ ...settings, gallery: gal }} disabled={!dirty || busy.some((j) => !j.error)} onTokenChange={() => refreshToken((n) => n + 1)} />
      </section>
    </div>
  );
}
