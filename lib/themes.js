/**
 * Four visual themes for the for-sale page.
 * Each theme is a flat object whose `vars` are exposed as CSS custom properties
 * on <html>, so the existing CSS modules can theme themselves with var(--...).
 *
 * To add a 5th theme: append an object below — that's it.
 */
export const themes = [
  {
    id: 'blue',
    name: 'Royal Blue',
    swatch: '#1864f0',
    vars: {
      '--bg': '#1864f0',
      '--bg-pattern': 'none',
      '--fg': '#ffffff',
      '--fg-muted': 'rgba(255, 255, 255, 0.85)',
      '--card-bg': '#ffffff',
      '--card-backdrop': 'none',
      '--card-fg': '#1a1a1a',
      '--card-muted': '#888888',
      '--card-border': '#e5e5e5',
      '--accent': '#1864f0',
      '--accent-hover': '#1252d3',
      '--badge': '#2dc653',
      '--badge-sale': '#e63946',
      '--error': '#e63946',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    swatch: '#0a0a1a',
    vars: {
      '--bg': '#0a0a1a',
      '--bg-pattern':
        'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px) 0 0 / 32px 32px',
      '--fg': '#ffffff',
      '--fg-muted': 'rgba(255, 255, 255, 0.8)',
      '--card-bg': '#ffffff',
      '--card-backdrop': 'none',
      '--card-fg': '#1a1a1a',
      '--card-muted': '#888888',
      '--card-border': '#e5e5e5',
      '--accent': '#6366f1',
      '--accent-hover': '#4f46e5',
      '--badge': '#2dc653',
      '--badge-sale': '#e63946',
      '--error': '#e63946',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    swatch: 'linear-gradient(135deg, #f97316 0%, #db2777 100%)',
    vars: {
      '--bg': 'linear-gradient(135deg, #f97316 0%, #db2777 100%)',
      '--bg-pattern': 'none',
      '--fg': '#ffffff',
      '--fg-muted': 'rgba(255, 255, 255, 0.92)',
      '--card-bg': 'rgba(255, 255, 255, 0.92)',
      '--card-backdrop': 'blur(14px)',
      '--card-fg': '#1a1a1a',
      '--card-muted': '#888888',
      '--card-border': 'rgba(255, 255, 255, 0.4)',
      '--accent': '#db2777',
      '--accent-hover': '#be185d',
      '--badge': '#10b981',
      '--badge-sale': '#e63946',
      '--error': '#e63946',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    swatch: '#f5f1ea',
    vars: {
      '--bg': '#f5f1ea',
      '--bg-pattern': 'none',
      '--fg': '#1a1a1a',
      '--fg-muted': 'rgba(26, 26, 26, 0.7)',
      '--card-bg': '#ffffff',
      '--card-backdrop': 'none',
      '--card-fg': '#1a1a1a',
      '--card-muted': '#666666',
      '--card-border': '#e0e0e0',
      '--accent': '#1a1a1a',
      '--accent-hover': '#333333',
      '--badge': '#10b981',
      '--badge-sale': '#1a1a1a',
      '--error': '#dc2626',
    },
  },
];

export const defaultThemeId = 'blue';

export function getThemeById(id) {
  return themes.find((t) => t.id === id) ?? themes[0];
}
