import { describe, it, expect } from 'vitest';
import { domains, getDomainBySlug } from '../lib/domains.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hasDigits(str) { return /\d/.test(str); }

describe('domains config', () => {
    it('declares at least one domain', () => {
        expect(domains.length).toBeGreaterThan(0);
    });

    it('every domain has a unique slug', () => {
        const slugs = domains.map((d) => d.slug);
        expect(new Set(slugs).size).toBe(slugs.length);
    });

    it('every domain has the required contact fields', () => {
        for (const d of domains) {
            expect(typeof d.name).toBe('string');
            expect(d.name).toContain('.');
            expect(d.name.length).toBeGreaterThan(3);

            expect(typeof d.phone).toBe('string');
            expect(d.phone.length).toBeGreaterThan(0);
            expect(hasDigits(d.phone), `phone "${d.phone}" must contain digits`).toBe(true);

            expect(typeof d.email).toBe('string');
            expect(EMAIL_REGEX.test(d.email), `email "${d.email}" must be valid`).toBe(true);
        }
    });

    it('every domain has a numeric estimatedValue', () => {
        for (const d of domains) {
            expect(typeof d.estimatedValue).toBe('number');
            expect(d.estimatedValue).toBeGreaterThan(0);
        }
    });

    it('whatsapp number is digits-only (E.164 ready)', () => {
        for (const d of domains) {
            if (d.whatsapp !== undefined) {
                expect(d.whatsapp).toMatch(/^\d{6,}$/);
                expect(d.whatsapp).not.toMatch(/[+\s-]/);
            }
        }
    });

    it('telegram handle is non-empty and has no leading @', () => {
        for (const d of domains) {
            if (d.telegram !== undefined) {
                expect(typeof d.telegram).toBe('string');
                expect(d.telegram.length).toBeGreaterThan(0);
                expect(d.telegram.startsWith('@')).toBe(false);
            }
        }
    });

    it('getDomainBySlug returns the right domain', () => {
        const first = domains[0];
        expect(getDomainBySlug(first.slug)).toBe(first);
    });

    it('getDomainBySlug returns undefined for unknown slugs', () => {
        expect(getDomainBySlug('not-a-real-slug-zzz')).toBeUndefined();
    });
});
