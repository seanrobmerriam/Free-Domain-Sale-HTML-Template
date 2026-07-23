import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
    // Use ADMIN_PASSWORD as the HMAC secret; falls back in dev only.
    return process.env.ADMIN_PASSWORD || 'dev-only-insecure-fallback';
}

function sign(timestamp) {
    return crypto
        .createHmac('sha256', getSecret())
        .update(timestamp)
        .digest('hex');
}

export async function isAuthenticated() {
    const cookieStore = await cookies();
    const value = cookieStore.get(COOKIE_NAME)?.value;
    if (!value) return false;
    try {
        const [timestamp, sig] = value.split('.');
        if (!timestamp || !sig) return false;
        if (sig !== sign(timestamp)) return false;
        if (Date.now() - Number(timestamp) > COOKIE_MAX_AGE * 1000) return false;
        return true;
    } catch {
        return false;
    }
}

export async function login(password) {
    if (!password || password !== process.env.ADMIN_PASSWORD) return false;
    const timestamp = Date.now().toString();
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, `${timestamp}.${sign(timestamp)}`, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: COOKIE_MAX_AGE,
        path: '/admin',
    });
    return true;
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}
