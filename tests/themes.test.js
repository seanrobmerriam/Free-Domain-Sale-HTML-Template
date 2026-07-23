import { describe, it, expect } from 'vitest';
import { themes, defaultThemeId, getThemeById } from '../lib/themes.js';

const REQUIRED_VARS = [
    '--bg', '--bg-pattern',
    '--fg', '--fg-muted',
    '--card-bg', '--card-backdrop',
    '--card-fg', '--card-muted',
    '--card-border',
    '--accent', '--accent-hover',
    '--badge', '--badge-sale',
    '--error',
];

describe('themes config', () => {
    it('declares at least one theme', () => {
        expect(themes.length).toBeGreaterThan(0);
    });

    it('every theme has a unique id', () => {
        const ids = themes.map((t) => t.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('every theme has a name and a swatch', () => {
        for (const t of themes) {
            expect(typeof t.name).toBe('string');
            expect(t.name.length).toBeGreaterThan(0);
            expect(typeof t.swatch).toBe('string');
        }
    });

    it('every theme has all required CSS variables', () => {
        for (const t of themes) {
            for (const v of REQUIRED_VARS) {
                expect(t.vars[v], `theme "${t.id}" missing ${v}`).toBeDefined();
            }
        }
    });

    it('defaultThemeId points to an existing theme', () => {
        expect(themes.some((t) => t.id === defaultThemeId)).toBe(true);
    });

    it('getThemeById returns the right theme', () => {
        const first = themes[0];
        expect(getThemeById(first.id)).toBe(first);
    });

    it('getThemeById falls back to the default for unknown ids', () => {
        const fb = getThemeById('not-a-real-theme');
        expect(fb.id).toBe(defaultThemeId);
    });
});
