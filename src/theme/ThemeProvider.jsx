import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { THEMES } from "./themes";
import { useSettings } from "../settings/SettingsProvider";

const STORAGE_KEY = "alzubair.theme";
const ThemeContext = createContext(null);

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v && THEMES[v] ? v : null;
  } catch {
    return null;
  }
}

export function ThemeProvider({ children }) {
  // The override only lives in this browser; settings.activeTheme is what every visitor gets.
  const { settings } = useSettings();
  const [override, setOverride] = useState(readStored);
  const themeKey = override || (THEMES[settings.activeTheme] ? settings.activeTheme : "classic");
  const theme = THEMES[themeKey];

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.dataset.theme = themeKey;
    root.dataset.decor = theme.decor;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme.vars["--brand"]);
  }, [themeKey, theme]);

  const value = useMemo(
    () => ({
      themeKey,
      theme,
      isOverride: Boolean(override),
      setTheme(key) {
        setOverride(key);
        try {
          if (key) localStorage.setItem(STORAGE_KEY, key);
          else localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* storage unavailable */
        }
      },
    }),
    [themeKey, theme, override],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
