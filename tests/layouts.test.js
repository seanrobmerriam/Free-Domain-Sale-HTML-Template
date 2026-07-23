import { describe, it, expect } from 'vitest';
import { layouts, defaultLayoutId, getLayoutById } from '../lib/layouts.js';

describe('layouts config', () => {
    it('declares at least one layout', () => {
        expect(layouts.length).toBeGreaterThan(0);
    });

    it('every layout has a unique id', () => {
        const ids = layouts.map((l) => l.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('every layout has name, description, and an icon', () => {
        for (const l of layouts) {
            expect(typeof l.name).toBe('string');
            expect(l.name.length).toBeGreaterThan(0);
            expect(typeof l.description).toBe('string');
            expect(l.description.length).toBeGreaterThan(0);
            expect(typeof l.icon).toBe('string');
        }
    });

    it('defaultLayoutId points to an existing layout', () => {
        expect(layouts.some((l) => l.id === defaultLayoutId)).toBe(true);
    });

    it('getLayoutById returns the right layout', () => {
        const first = layouts[0];
        expect(getLayoutById(first.id)).toBe(first);
    });

    it('getLayoutById falls back to the default for unknown ids', () => {
        const fb = getLayoutById('not-a-real-layout');
        expect(fb.id).toBe(defaultLayoutId);
    });
});
