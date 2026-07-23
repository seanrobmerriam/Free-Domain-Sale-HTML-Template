import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @neondatabase/serverless BEFORE importing the route
vi.mock('@neondatabase/serverless', () => ({
    neon: vi.fn(() => mockSql),
}));

const mockSql = vi.fn();

describe('POST /api/offer route handler', () => {
    beforeEach(() => {
        mockSql.mockReset();
        process.env.DATABASE_URL = 'postgres://test:test@localhost/test';
        delete process.env.TURNSTILE_SECRET_KEY;
        delete process.env.RESEND_API_KEY;
    });

    it('exports a POST function', async () => {
        const route = await import('../app/api/offer/route.js');
        expect(typeof route.POST).toBe('function');
    });

    it('returns 400 when name/email/offer are missing', async () => {
        const route = await import('../app/api/offer/route.js');
        const req = new Request('http://localhost/api/offer', {
            method: 'POST',
            body: JSON.stringify({ email: 'a@b.com' }),
        });
        const res = await route.POST(req);
        expect(res.status).toBe(400);
    });

    it('inserts the offer and returns 200 for valid input', async () => {
        mockSql.mockResolvedValueOnce([]);
        const route = await import('../app/api/offer/route.js');
        const req = new Request('http://localhost/api/offer', {
            method: 'POST',
            body: JSON.stringify({
                name: 'Alice',
                email: 'alice@example.com',
                offer: 5000,
                domain: 'MyDomain.com',
            }),
        });
        const res = await route.POST(req);
        expect(res.status).toBe(200);
        expect(mockSql).toHaveBeenCalledTimes(1);
    });
});
