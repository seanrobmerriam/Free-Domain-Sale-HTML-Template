'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { themes, defaultThemeId, getThemeById } from '@/lib/themes';
import { layouts, defaultLayoutId, getLayoutById } from '@/lib/layouts';

const STORAGE_KEY = 'domain-sale-ui';

const UIContext = createContext({
  theme: getThemeById(defaultThemeId),
  setThemeId: () => {},
  themes,
  layout: getLayoutById(defaultLayoutId),
  setLayoutId: () => {},
  layouts,
});

function applyThemeVars(theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function ThemeProvider({ children }) {
  // Server + initial client render use defaults to avoid hydration mismatch.
  const [themeId, setThemeIdState] = useState(defaultThemeId);
  const [layoutId, setLayoutIdState] = useState(defaultLayoutId);
  const [hydrated, setHydrated] = useState(false);

  // On mount: read saved preferences and apply them
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && typeof saved === 'object') {
          if (saved.theme && themes.some((t) => t.id === saved.theme)) {
            setThemeIdState(saved.theme);
          }
          if (saved.layout && layouts.some((l) => l.id === saved.layout)) {
            setLayoutIdState(saved.layout);
          }
        }
      }
    } catch {
      /* localStorage may be blocked */
    }
    setHydrated(true);
  }, []);

  // Apply theme vars + persist whenever either preference changes
  useEffect(() => {
    if (!hydrated) return;
    applyThemeVars(getThemeById(themeId));
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ theme: themeId, layout: layoutId })
      );
    } catch {
      /* ignore */
    }
  }, [themeId, layoutId, hydrated]);

  const setThemeId = useCallback((id) => {
    if (themes.some((t) => t.id === id)) setThemeIdState(id);
  }, []);

  const setLayoutId = useCallback((id) => {
    if (layouts.some((l) => l.id === id)) setLayoutIdState(id);
  }, []);

  const theme = getThemeById(themeId);
  const layout = getLayoutById(layoutId);

  return (
    <UIContext.Provider
      value={{ theme, setThemeId, themes, layout, setLayoutId, layouts }}
    >
      {children}
    </UIContext.Provider>
  );
}

export const useTheme = () => useContext(UIContext);
