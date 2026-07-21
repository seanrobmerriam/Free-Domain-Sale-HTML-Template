import { neon } from '@neondatabase/serverless';

export const runtime = 'nodejs'; // can switch to 'edge' for global low-latency
export const dynamic = 'force-dynamic';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email, offer, domain } = body ?? {};

  // Validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return Response.json({ error: 'Invalid name' }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Invalid email' }, { status: 400 });
  }
  const offerNumber = Number(offer);
  if (!Number.isFinite(offerNumber) || offerNumber <= 0) {
    return Response.json({ error: 'Invalid offer' }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    return Response.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      INSERT INTO offers (name, email, offer, domain)
      VALUES (${name.trim()}, ${email.trim()}, ${offerNumber}, ${domain ?? null})
    `;
    return Response.json({ ok: true });
  } catch (err) {
    console.error('Neon insert failed:', err);
    return Response.json({ error: 'Failed to save offer' }, { status: 500 });
  }
}
