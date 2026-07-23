'use client';

import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import styles from './ThemeSwitcher.module.css';

export default function ThemeSwitcher() {
  const { theme, setThemeId, themes } = useTheme();
  const [open, setOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function pickTheme(id) {
    setThemeId(id);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className={styles.gearButton}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open theme switcher"
        aria-expanded={open}
        title="Themes"
      >
        <i className="fas fa-cog" />
      </button>

      {open && (
        <>
          <div
            className={styles.overlay}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className={styles.panel}
            role="dialog"
            aria-label="Choose a theme"
          >
            <div className={styles.panelHeader}>
              <span>Choose a theme</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={styles.closeBtn}
                aria-label="Close theme switcher"
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <div className={styles.swatches}>
              {themes.map((t) => {
                const isActive = theme.id === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => pickTheme(t.id)}
                    className={`${styles.swatch} ${
                      isActive ? styles.active : ''
                    }`}
                    aria-pressed={isActive}
                  >
                    <span
                      className={styles.swatchColor}
                      style={{ background: t.swatch }}
                    />
                    <span className={styles.swatchName}>{t.name}</span>
                    {isActive && (
                      <i
                        className={`fas fa-check ${styles.checkmark}`}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
