# Domain Sale Landing Pages

A Next.js 14 app that hosts for-sale landing pages for multiple domains. Form submissions are stored in Neon serverless Postgres.

## Routes

| URL | Shows |
|---|---|
| `/` | The first domain in `lib/domains.js` (your primary listing) |
| `/mydomain` | Any domain by its `slug` |
| `/domains` | Index of every domain you're selling |
| `/api/offer` | `POST` endpoint that saves offers to Neon |

## Adding a new domain

Open `lib/domains.js` and append an object to the `domains` array:

```js
{
  slug: 'newdomain',           // appears in the URL: /newdomain
  name: 'NewDomain.com',       // shown on the page
  estimatedValue: 999,
  description: 'Why this domain is worth buying...',
  phone: '(+1) 555-0100',
  email: 'you@newdomain.com',
  whatsapp: '15550100100',     // digits only, with country code
  telegram: 'yourusername',    // your public Telegram handle (no @)
}
```

That's it. Rebuild (`npm run build`) and the new route is live.

## Local setup

```bash
npm install
cp .env.local.example .env.local   # then fill in DATABASE_URL
npm run dev
```

Visit `http://localhost:3000`.

## Neon setup

Run this once in the Neon SQL editor:

```sql
CREATE TABLE offers (
    id          SERIAL PRIMARY KEY,
    name        TEXT        NOT NULL,
    email       TEXT        NOT NULL,
    offer       NUMERIC     NOT NULL,
    domain      TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Then drop your connection string into `.env.local` as `DATABASE_URL`.

## Deployment

Push to GitHub and import into [Vercel](https://vercel.com) — zero config. Add `DATABASE_URL` in **Settings → Environment Variables** before the first deploy.
