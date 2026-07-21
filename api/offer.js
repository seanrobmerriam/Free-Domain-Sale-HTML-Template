import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, offer, domain } = req.body ?? {};

    // Basic validation
    if (!name || !email || !offer) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const sql = neon(process.env.DATABASE_URL);
        await sql`
            INSERT INTO offers (name, email, offer, domain)
            VALUES (${name}, ${email}, ${offer}, ${domain ?? null})
        `;
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save offer' });
    }
}