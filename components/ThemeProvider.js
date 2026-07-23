'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { themes, defaultThemeId, getThemeById } from '@/lib/themes';

const STORAGE_KEY = 'domain-sale-theme';

const ThemeContext = createContext({
  theme: getThemeById(defaultThemeId),
  setThemeId: () => {},
  themes,
});

function applyThemeVars(theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function ThemeProvider({ children }) {
  // Server + initial client render use the default theme to avoid hydration mismatch.
  const [themeId, setThemeIdState] = useState(defaultThemeId);
  const [hydrated, setHydrated] = useState(false);

  // On mount: read saved preference and apply it
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && themes.some((t) => t.id === saved)) {
        setThemeIdState(saved);
      }
    } catch {
      /* localStorage may be blocked */
    }
    setHydrated(true);
  }, []);

  // Apply vars whenever the active theme changes
  useEffect(() => {
    if (!hydrated) return;
    applyThemeVars(getThemeById(themeId));
    try {
      window.localStorage.setItem(STORAGE_KEY, themeId);
    } catch {
      /* ignore */
    }
  }, [themeId, hydrated]);

  const setThemeId = useCallback((id) => {
    if (themes.some((t) => t.id === id)) setThemeIdState(id);
  }, []);

  const theme = getThemeById(themeId);

  return (
    <ThemeContext.Provider value={{ theme, setThemeId, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
