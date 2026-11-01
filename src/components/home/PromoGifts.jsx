import { useId, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  Car,
  Check,
  Coffee,
  Crown,
  Flag,
  GalleryVerticalEnd,
  Gift,
  IdCard,
  LayoutGrid,
  Mail,
  Megaphone,
  Moon,
  Newspaper,
  NotebookPen,
  PenLine,
  Plus,
  Shirt,
  ShoppingBag,
  ShoppingBasket,
  Signpost,
  Sparkles,
  Star,
  Usb,
  X,
} from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import "./PromoGifts.css";

const TEXT = {
  ar: {
    eyebrow: "الدعاية والهدايا",
    titleA: "مطبوعات الدعاية والإعلان ",
    titleEm: "والهدايا الدعائية",
    lead: "كل ما يحمل اسم علامتك خارج مكتبك: من الرول أب في المعارض إلى هدايا كبار الضيوف — اختر ما تحتاجه وأضفه لطلب عرض السعر.",
    filter: "تصفية حسب الفئة",
    add: "أضف لعرض السعر",
    added: "تمت الإضافة",
    basket: "سلة عرض السعر",
    items: (n) => (n === 1 ? "منتج واحد" : n === 2 ? "منتجان" : `${n} منتجات`),
    request: "اطلب عرض السعر",
    clear: "إفراغ السلة",
    note: "عرض سعر خلال ساعات — بدون أسعار ثابتة",
    detailsHead: "طلب عرض سعر — مطبوعات دعائية وهدايا",
    sep: "، ",
  },
  en: {
    eyebrow: "Advertising & gifts",
    titleA: "Advertising prints & ",
    titleEm: "promotional gifts",
    lead: "Everything that carries your brand beyond the office — from exhibition roll-ups to VIP gifts. Pick what you need and add it to your quote.",
    filter: "Filter by category",
    add: "Add to quote",
    added: "Added",
    basket: "Quote basket",
    items: (n) => (n === 1 ? "1 item" : `${n} items`),
    request: "Request a quote",
    clear: "Clear basket",
    note: "Quote within hours — no fixed prices",
    detailsHead: "Quote request — advertising prints & gifts",
    sep: ", ",
  },
};

const CATS = [
  { id: "all", icon: LayoutGrid, name: { ar: "الكل", en: "All" } },
  { id: "adv", icon: Megaphone, name: { ar: "مطبوعات إعلانية", en: "Advertising prints" } },
  { id: "gift", icon: Gift, name: { ar: "هدايا دعائية", en: "Promotional gifts" } },
  { id: "corp", icon: Sparkles, name: { ar: "الشركات والفعاليات", en: "Corporate & events" } },
];

// `wide` items span two columns on larger screens for a masonry rhythm.
const ITEMS = [
  {
    id: "rollup",
    cat: "adv",
    icon: GalleryVerticalEnd,
    wide: true,
    name: { ar: "رول أب", en: "Roll-up stands" },
    desc: { ar: "ستاند متنقل للمعارض والفعاليات يُركّب في ثوانٍ.", en: "Portable exhibition stand that sets up in seconds." },
    tech: { ar: "طباعة عالية الدقة", en: "Hi-res print" },
  },
  {
    id: "banners",
    cat: "adv",
    icon: Flag,
    name: { ar: "بنرات ولوحات قماشية", en: "Banners & flex" },
    desc: { ar: "بنرات داخلية وخارجية مقاومة للشمس بأي مقاس.", en: "Indoor and sun-resistant outdoor banners in any size." },
    tech: { ar: "فلكس / قماش", en: "Flex / fabric" },
  },
  {
    id: "flyers",
    cat: "adv",
    icon: Newspaper,
    name: { ar: "فلايرات وبروشورات", en: "Flyers & brochures" },
    desc: { ar: "مطبوعات توزيع بألوان ثابتة وورق فاخر.", en: "Hand-outs with consistent colour on quality stock." },
    tech: { ar: "أوفست / ديجيتال", en: "Offset / digital" },
  },
  {
    id: "signage",
    cat: "adv",
    icon: Signpost,
    name: { ar: "لوحات إرشادية ولافتات", en: "Signage & wayfinding" },
    desc: { ar: "لافتات المحلات واللوحات الإرشادية الداخلية.", en: "Shop-front signs and indoor wayfinding panels." },
    tech: { ar: "أكريليك / فوم", en: "Acrylic / foam" },
  },
  {
    id: "vehicle",
    cat: "adv",
    icon: Car,
    wide: true,
    name: { ar: "تغليف وإعلانات المركبات", en: "Vehicle branding" },
    desc: { ar: "ستيكرات وتغليف كامل لمركبات التوصيل والأساطيل.", en: "Decals and full wraps for delivery vans and fleets." },
    tech: { ar: "فينيل مقاوم", en: "Durable vinyl" },
  },
  {
    id: "mugs",
    cat: "gift",
    icon: Coffee,
    name: { ar: "أكواب مطبوعة", en: "Printed mugs" },
    desc: { ar: "أكواب سيراميك وحرارية بشعارك ولونك.", en: "Ceramic and travel mugs in your logo and colour." },
    tech: { ar: "طباعة حرارية", en: "Sublimation" },
  },
  {
    id: "pens",
    cat: "gift",
    icon: PenLine,
    name: { ar: "أقلام", en: "Pens" },
    desc: { ar: "أقلام معدنية وبلاستيكية بحفر أو طباعة الشعار.", en: "Metal and plastic pens, engraved or printed." },
    tech: { ar: "حفر ليزر", en: "Laser engraving" },
  },
  {
    id: "notebooks",
    cat: "gift",
    icon: NotebookPen,
    name: { ar: "دفاتر وأجندات", en: "Notebooks & planners" },
    desc: { ar: "أجندات سنوية ودفاتر بغلاف جلد أو كرافت.", en: "Annual planners and notebooks in leather or kraft." },
    tech: { ar: "بصمة / إمبوس", en: "Foil / emboss" },
  },
  {
    id: "totes",
    cat: "gift",
    icon: ShoppingBag,
    name: { ar: "حقائب قماشية", en: "Tote bags" },
    desc: { ar: "حقائب صديقة للبيئة للمعارض والمتاجر.", en: "Eco-friendly bags for events and retail." },
    tech: { ar: "سلك سكرين", en: "Screen print" },
  },
  {
    id: "usb",
    cat: "gift",
    icon: Usb,
    name: { ar: "فلاشات USB", en: "USB drives" },
    desc: { ar: "فلاشات بشعارك لملفات العروض والكتالوجات.", en: "Branded drives for decks and catalogues." },
    tech: { ar: "طباعة UV", en: "UV print" },
  },
  {
    id: "powerbank",
    cat: "gift",
    icon: BatteryCharging,
    name: { ar: "باور بانك", en: "Power banks" },
    desc: { ar: "شواحن متنقلة عملية تبقى مع عميلك يومياً.", en: "Handy chargers that stay with your client every day." },
    tech: { ar: "حفر ليزر", en: "Laser engraving" },
  },
  {
    id: "apparel",
    cat: "gift",
    icon: Shirt,
    name: { ar: "تيشيرتات وكابات", en: "T-shirts & caps" },
    desc: { ar: "ملابس فرق العمل والفعاليات بالطباعة أو التطريز.", en: "Team and event apparel, printed or embroidered." },
    tech: { ar: "تطريز / DTF", en: "Embroidery / DTF" },
  },
  {
    id: "giftbox",
    cat: "gift",
    icon: Gift,
    wide: true,
    name: { ar: "صناديق هدايا", en: "Gift boxes" },
    desc: { ar: "صناديق فاخرة مجهّزة بمحتوى مختار وبطاقة إهداء.", en: "Premium boxes with curated contents and a gift card." },
    tech: { ar: "تغليف فاخر", en: "Premium packaging" },
  },
  {
    id: "badges",
    cat: "corp",
    icon: BadgeCheck,
    name: { ar: "بطاقات تعريفية وبادجات", en: "Name badges" },
    desc: { ar: "بطاقات موظفين وزوار ومشاركين في الفعاليات.", en: "Staff, visitor and event attendee badges." },
    tech: { ar: "PVC / ورق مقوى", en: "PVC / card" },
  },
  {
    id: "lanyards",
    cat: "corp",
    icon: IdCard,
    name: { ar: "علاقات البطاقات", en: "Lanyards" },
    desc: { ar: "شرائط مطبوعة بألوان هويتك مع حامل البطاقة.", en: "Printed straps in your brand colours with card holders." },
    tech: { ar: "طباعة حرارية", en: "Sublimation" },
  },
  {
    id: "invites",
    cat: "corp",
    icon: Mail,
    name: { ar: "بطاقات دعوة", en: "Invitation cards" },
    desc: { ar: "دعوات الحفلات والافتتاحات بتشطيبات راقية.", en: "Launch and gala invitations with fine finishes." },
    tech: { ar: "بصمة ذهبية", en: "Gold foil" },
  },
  {
    id: "vip",
    cat: "corp",
    icon: Crown,
    wide: true,
    name: { ar: "أطقم هدايا كبار الشخصيات", en: "VIP gift sets" },
    desc: { ar: "أطقم جلدية ومعدنية مخصّصة لكبار الضيوف والشركاء.", en: "Leather and metal sets tailored for VIP guests and partners." },
    tech: { ar: "تغليف مخصّص", en: "Custom packaging" },
  },
  {
    id: "ramadan",
    cat: "corp",
    icon: Moon,
    name: { ar: "هدايا رمضان والعيد", en: "Ramadan & Eid gifts" },
    desc: { ar: "صناديق موسمية للعملاء والموظفين بلمسة علامتك.", en: "Seasonal boxes for clients and staff with your touch." },
    tech: { ar: "إصدار موسمي", en: "Seasonal edition" },
  },
  {
    id: "nationalday",
    cat: "corp",
    icon: Star,
    name: { ar: "هدايا اليوم الوطني", en: "National Day gift sets" },
    desc: { ar: "هدايا ومطبوعات احتفالية بروح وطنية تحمل اسمك.", en: "Celebratory gifts and prints in a national spirit." },
    tech: { ar: "إصدار موسمي", en: "Seasonal edition" },
  },
];

export default function PromoGifts() {
  const { pick, l } = useI18n();
  const tx = pick(TEXT);
  const baseId = useId();
  const [cat, setCat] = useState("all");
  const [basket, setBasket] = useState([]);

  const visible = cat === "all" ? ITEMS : ITEMS.filter((i) => i.cat === cat);
  const picked = ITEMS.filter((i) => basket.includes(i.id));
  const details = [tx.detailsHead, ...picked.map((i) => `- ${l(i.name)}`)].join("\n");
  const orderHref = `/order?service=advertising&details=${encodeURIComponent(details)}`;

  const toggle = (id) =>
    setBasket((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  return (
    <section id="promo" className="section pg" aria-labelledby={`${baseId}-title`}>
      <div className="container">
        <header className="section-head reveal">
          <span className="eyebrow">
            <Gift size={16} strokeWidth={1.5} aria-hidden="true" />
            {tx.eyebrow}
          </span>
          <h2 className="section-title" id={`${baseId}-title`}>
            {tx.titleA}
            <em>{tx.titleEm}</em>
          </h2>
          <p className="section-lead">{tx.lead}</p>
        </header>

        <div className="chips chips-scroll pg-filters" role="group" aria-label={tx.filter}>
          {CATS.map((c) => {
            const Icon = c.icon;
            const count = c.id === "all" ? ITEMS.length : ITEMS.filter((i) => i.cat === c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                className="chip"
                aria-pressed={cat === c.id}
                onClick={() => setCat(c.id)}
              >
                <Icon strokeWidth={1.5} aria-hidden="true" />
                {l(c.name)}
                <span className="pg-count">{count}</span>
              </button>
            );
          })}
        </div>

        <ul className="pg-grid" key={cat}>
          {visible.map((item, i) => {
            const Icon = item.icon;
            const on = basket.includes(item.id);
            return (
              <li
                key={item.id}
                className={`pg-card pg-cat-${item.cat}${item.wide ? " pg-wide" : ""}`}
                data-on={on}
                style={{ "--i": i }}
              >
                <div className="pg-tile" aria-hidden="true">
                  <span className="pg-tile-ring" />
                  <span className="pg-tile-print">
                    <Icon strokeWidth={1.5} />
                  </span>
                  <span className="pg-tech">{l(item.tech)}</span>
                </div>
                <div className="pg-body">
                  <h3 className="pg-name">{l(item.name)}</h3>
                  <p className="pg-desc">{l(item.desc)}</p>
                  <button
                    type="button"
                    className="pg-add"
                    aria-pressed={on}
                    onClick={() => toggle(item.id)}
                  >
                    {on ? (
                      <Check size={16} strokeWidth={1.5} aria-hidden="true" />
                    ) : (
                      <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
                    )}
                    {on ? tx.added : tx.add}
                    <span className="sr-only"> — {l(item.name)}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="pg-basket-slot" aria-live="polite">
          {picked.length > 0 && (
            <div className="pg-basket" role="region" aria-label={tx.basket}>
              <span className="pg-basket-icon" aria-hidden="true">
                <ShoppingBasket size={20} strokeWidth={1.5} />
                <span className="pg-basket-badge" key={picked.length}>
                  {picked.length}
                </span>
              </span>
              <span className="pg-basket-text">
                <strong>
                  {tx.basket} · {tx.items(picked.length)}
                </strong>
                <small>{picked.map((i) => l(i.name)).join(tx.sep)}</small>
              </span>
              <button
                type="button"
                className="pg-basket-clear"
                aria-label={tx.clear}
                title={tx.clear}
                onClick={() => setBasket([])}
              >
                <X size={16} strokeWidth={1.5} aria-hidden="true" />
              </button>
              <Link to={orderHref} className="btn btn-sm pg-basket-cta">
                {tx.request}
                <ArrowRight size={16} strokeWidth={1.5} className="flip-rtl" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
        <p className="pg-note">{tx.note}</p>
      </div>
    </section>
  );
}
