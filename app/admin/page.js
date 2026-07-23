import { isAuthenticated } from '@/lib/admin-auth';
import { neon } from '@neondatabase/serverless';
import LoginForm from './login-form';
import OffersTable from './offers-table';

export const metadata = {
    title: 'Admin · Domain Sale',
    description: 'Offer administration',
    robots: { index: false, follow: false },
};

export default async function AdminPage() {
    if (!(await isAuthenticated())) {
        return <LoginForm />;
    }

    let offers = [];
    let error = null;
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not set');
        }
        const sql = neon(process.env.DATABASE_URL);
        const rows = await sql`
            SELECT id, name, email, offer, domain, created_at
            FROM offers
            ORDER BY created_at DESC
            LIMIT 100
        `;
        offers = rows;
    } catch (err) {
        error = err?.message || 'Unknown error';
    }

    return <OffersTable offers={offers} error={error} />;
}
