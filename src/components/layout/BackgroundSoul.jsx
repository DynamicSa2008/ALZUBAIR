import { useEffect, useRef } from "react";
import { useTheme } from "../../theme/ThemeProvider";

// The site's quiet "soul": drifting brand-tinted light, a faint Al-Sadu weave and a soft
// spotlight that follows the pointer. Occasion themes add their own ornament on top.
export default function BackgroundSoul() {
  const { theme } = useTheme();
  const spotRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm || !spotRef.current) return;
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        spotRef.current?.style.setProperty("--x", `${e.clientX}px`);
        spotRef.current?.style.setProperty("--y", `${e.clientY}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="soul" aria-hidden="true">
      <div className="soul-blob soul-blob-1" />
      <div className="soul-blob soul-blob-2" />
      <div className="soul-blob soul-blob-3" />
      <svg className="soul-weave" width="100%" height="100%">
        <defs>
          <pattern id="sadu" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M0 32 L16 16 L32 32 L16 48 Z" />
            <path d="M32 32 L48 16 L64 32 L48 48 Z" />
            <path d="M24 0 L32 8 L40 0 M24 64 L32 56 L40 64" fill="none" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sadu)" />
      </svg>
      <div className="soul-spot" ref={spotRef} />
      {theme.decor === "ramadan" && <RamadanDecor />}
      {(theme.decor === "eid" || theme.decor === "national") && <Stars />}
    </div>
  );
}

function RamadanDecor() {
  return (
    <div className="soul-ramadan">
      {[0, 1, 2].map((i) => (
        <svg key={i} className="soul-lantern" style={{ "--i": i }} viewBox="0 0 40 90" fill="none" strokeWidth="1.5">
          <line x1="20" y1="0" x2="20" y2="22" />
          <path d="M12 22h16l4 10v26l-4 10H12l-4-10V32z" />
          <path d="M8 32h24M8 58h24M16 68l4 8 4-8" />
          <circle cx="20" cy="45" r="5" className="soul-flame" />
        </svg>
      ))}
      <svg className="soul-crescent" viewBox="0 0 60 60">
        <path d="M38 6a24 24 0 1 0 16 38A20 20 0 1 1 38 6Z" />
      </svg>
    </div>
  );
}

function Stars() {
  return (
    <div className="soul-stars">
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} style={{ "--i": i, "--x": `${(i * 37) % 100}%`, "--y": `${(i * 53) % 90}%` }} />
      ))}
    </div>
  );
}
