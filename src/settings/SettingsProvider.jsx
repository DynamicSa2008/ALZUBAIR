import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_SETTINGS } from "./defaults";
import { mergeSettings, setCurrent } from "./core";

// Load order: defaults → published public/settings.json → (admin only) local draft preview.

const DRAFT_KEY = "alzubair.settings.draft";

function readDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function fetchPublished() {
  try {
    // GitHub Pages caches for ~10 min; the query string makes freshly published edits show up.
    const res = await fetch(`${import.meta.env.BASE_URL}settings.json?v=${Date.now()}`, { cache: "no-store" });
    if (res.ok) return mergeSettings(DEFAULT_SETTINGS, await res.json());
  } catch {
    /* keep defaults */
  }
  return null;
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [published, setPublished] = useState(DEFAULT_SETTINGS);
  const [draft, setDraftState] = useState(readDraft);
  const [loaded, setLoaded] = useState(false);

  const reload = () =>
    fetchPublished().then((next) => {
      if (next) setPublished(next);
      setLoaded(true);
    });

  useEffect(() => {
    let alive = true;
    fetchPublished().then((next) => {
      if (!alive) return;
      if (next) setPublished(next);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const settings = useMemo(() => (draft ? mergeSettings(published, draft) : published), [published, draft]);
  setCurrent(settings);

  const value = useMemo(
    () => ({
      settings,
      published,
      loaded,
      hasDraft: Boolean(draft),
      reload,
      setDraft(next) {
        setDraftState(next);
        try {
          if (next) localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
          else localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* storage unavailable */
        }
      },
      markPublished(next) {
        setPublished(next);
        setDraftState(null);
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* storage unavailable */
        }
      },
    }),
    [settings, published, loaded, draft],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
