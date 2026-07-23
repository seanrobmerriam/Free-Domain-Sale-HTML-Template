'use client';

import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import styles from './ThemeSwitcher.module.css';

export default function ThemeSwitcher() {
  const { theme, setThemeId, themes, layout, setLayoutId, layouts } = useTheme();
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

  function pickLayout(id) {
    setLayoutId(id);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className={styles.gearButton}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open theme and layout switcher"
        aria-expanded={open}
        title="Appearance"
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
            aria-label="Choose a theme and layout"
          >
            <div className={styles.panelHeader}>
              <span>Appearance</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={styles.closeBtn}
                aria-label="Close appearance panel"
              >
                <i className="fas fa-times" />
              </button>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Theme</h3>
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

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Layout</h3>
              <div className={styles.layoutList}>
                {layouts.map((l) => {
                  const isActive = layout.id === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => pickLayout(l.id)}
                      className={`${styles.layoutOption} ${
                        isActive ? styles.active : ''
                      }`}
                      aria-pressed={isActive}
                    >
                      <i
                        className={`fas ${l.icon} ${styles.layoutIcon}`}
                        aria-hidden="true"
                      />
                      <span className={styles.layoutBody}>
                        <span className={styles.layoutName}>{l.name}</span>
                        <span className={styles.layoutDesc}>
                          {l.description}
                        </span>
                      </span>
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
          </div>
        </>
      )}
    </>
  );
}
