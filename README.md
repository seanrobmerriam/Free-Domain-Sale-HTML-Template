![Screenshot](logos/logo.png)

# Domain Sale Landing Pages

A free Next.js 14 app that hosts domain for-sale landing pages for multiple domains. Form submissions are stored in Neon serverless Postgres.

A while ago I needed a quick way to put up a domain name sale landing page, and I was far too lazy to take the 10 minutes to write it by hand. I also wanted to be able to route to multiple pages listing multiple domains from one app, so I created this. It is offered 100% free of charge, MIT licensed. There are no hidden affiliate tracking links or any other spam included. 


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

### Sign up

Go to https://neon.com/ and sign up for a free account.

### Create Project & Table

1. Create a new project and name it whatever you want.
2. On the left sidebar, click "SQL Editor"
3. When the SQL editor opens, paste this and click "Run":

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

8. Go back to the sidebar and click "Overview", go down to "Computes", and click "Connect"
9. Copy the link starting with "postgresql://", and paste the entire thing into `.env.local` as `DATABASE_URL`.

 NOTE: Do **NOT** track your env.local with git. If you are deploying somewhere that deploys from a git repo, you are going to have to add an the environment variable manually.
 Find the area on netlify, vercel, coolify, dokploy, etc. labeled "Environments", "Env", or something similar, and add DATABASE_URL=postgresql://... (use your full connection string)

## Troubleshooting

- **`/api/offer` returns 500** → `DATABASE_URL` is missing or wrong. Check `.env.local` (and Vercel env vars if deployed). Format: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
- **Turnstile widget doesn't show** → the site key must be prefixed with `NEXT_PUBLIC_`. Restart `npm run dev` after changing env vars.
- **Form submits but no email** → check [Resend logs](https://resend.com/logs); make sure `NOTIFICATION_FROM_EMAIL` uses a verified sending domain.
- **Theme switcher gear icon is missing** → it's pinned to the left edge of the viewport, vertically centered. Ad-blockers can hide it.
- **Theme doesn't persist across page loads** → `localStorage` is disabled (private mode or browser setting).
- **404 on a domain I just added** → run `npm run build` (or redeploy on Vercel) after editing `lib/domains.js` — routes are SSG.
- **Hydration mismatch warning** → never read `localStorage` / `window` during render; only inside `useEffect`.
- **Vercel deploy fails** → add every var from `.env.local` in Project Settings → Environment Variables.

## Deployment

Push to GitHub and import into [Vercel](https://vercel.com) for easy, free hosting — zero config. Add `DATABASE_URL` in **Settings → Environment Variables** before the first deploy.
