![Postbox logo](logos/logo.png)

# Domain Sale Landing Pages

A Next.js 14 app that hosts **for-sale landing pages for multiple domain names**. Each domain gets its own static page at `/<slug>`, with an offer form that persists to **Neon Postgres** and emails you via **Resend** (Optional).

Visitors see a polished landing page, switch between **4 themes** and **5 layouts** with a single gear icon, and submit offers through a bot-protected form. Per-domain entries live in a single config file — adding a new domain is a 6-line edit.

---

## What you get out of the box

| Capability | Details |
|---|---|
| **Multi-domain** | One app, unlimited domains. Each domain is statically generated at build time. |
| **4 themes** | Royal Blue (default), Midnight (dark), Sunset (gradient + frosted card), Minimal (light). Click the gear → "Theme" section. Choice persists in `localStorage`. |
| **5 layouts** | Split (default), Stack, Center, Compact, Editorial. Click the gear → "Layout" section. Each has a small visual preview in the picker. |
| **Per-domain data** | `slug`, `name`, `estimatedValue`, `description`, `phone`, `email`, `whatsapp`, `telegram`. Edit `lib/domains.js`. |
| **Offer form** | Name + email + offer amount. Persists to Neon. Email you via Resend. |
| **Bot protection** | Cloudflare Turnstile (invisible) — gracefully bypassed if keys aren't set. |
| **Floating chat** | WhatsApp + Telegram buttons with pre-filled messages and pulse animations. |
| **SSR-safe** | Server-rendered first paint matches what crawlers see — no FOUC, no hydration warnings. |
| **CI + pre-commit** | Husky pre-commit + GitHub Actions run a 24-check smoke test on every push/PR. |

---

## Routes

| URL | Shows |
|---|---|
| `/` | First domain in `lib/domains.js` (your primary listing) |
| `/[slug]` | Any domain — e.g. `/mydomain` |
| `/domains` | Index of every domain you're selling |
| `/api/offer` | `POST` endpoint that saves offers + sends email |

Unknown slugs hit a custom 404 page.

---

## Project structure

```
domain_sale/
├── app/
│   ├── api/offer/route.js       # POST endpoint → Neon + Resend + Turnstile verify
│   ├── [domain]/page.js         # /[slug] — dynamic domain page
│   ├── domains/page.js          # /domains — list view
│   ├── globals.css              # body bg driven by CSS vars
│   ├── layout.js                # wraps everything in <ThemeProvider>
│   ├── not-found.js             # 404
│   └── page.js                  # / → primary domain
├── components/
│   ├── DomainSalePage.js        # the actual sale page
│   ├── DomainSalePage.module.css
│   ├── ThemeProvider.js         # context + localStorage + CSS-var injection
│   ├── ThemeSwitcher.js         # gear button + theme/layout picker panel
│   └── ThemeSwitcher.module.css
├── lib/
│   ├── domains.js               # edit to add/change domains
│   ├── layouts.js               # edit to add/change layouts
│   └── themes.js                # edit to add/change themes
├── scripts/
│   └── smoke-test.js            # static checks used by Husky + CI
├── .env.local.example
├── .eslintrc.json
├── .github/workflows/ci.yml
├── .husky/pre-commit
├── .nvmrc
├── jsconfig.json                # @/* path aliases
├── next.config.mjs
└── package.json
```

---

## Adding a domain

Edit `lib/domains.js` and append an object to the `domains` array:

```js
{
  slug: 'newdomain',           // URL: /newdomain
  name: 'NewDomain.com',       // shown on the page
  estimatedValue: 999,         // shown in green badge
  description: 'Why this domain is worth buying...',
  phone: '(+1) 555-0100',
  email: 'you@newdomain.com',
  whatsapp: '15550100100',     // digits only, with country code (NO '+')
  telegram: 'yourusername',    // public Telegram handle (NO '@')
}
```

Then `npm run build` (or let Vercel deploy on push). The new route is now live.

## Adding a theme

Edit `lib/themes.js` and append an object. Each theme is a flat map of CSS custom properties. Available variables:

| Var | Used for |
|---|---|
| `--bg` | Body background — color **or** gradient |
| `--bg-pattern` | Optional overlay (e.g. dot pattern) on top of `--bg` |
| `--fg` / `--fg-muted` | Text on the background |
| `--card-bg` / `--card-backdrop` | Form card background + `backdrop-filter` |
| `--card-fg` / `--card-muted` | Text inside the card |
| `--card-border` | Card & input borders |
| `--accent` / `--accent-hover` | Submit button |
| `--badge` | Green "value" badge |
| `--badge-sale` | Red "For Sale!" badge |
| `--error` | Error state on the submit button |

To change the default theme, edit `defaultThemeId` in `lib/themes.js`.

## Adding a layout

Layouts are CSS variants driven by `data-layout={layout.id}` on the container. To add one:

1. Append to `lib/layouts.js`:
   ```js
   { id: 'my-cool-layout', name: 'Cool', description: 'Does the thing', icon: 'fa-bolt' }
   ```
2. Add a matching CSS rule in `components/DomainSalePage.module.css`:
   ```css
   .container[data-layout='my-cool-layout'] {
     display: grid;
     /* ... */
   }
   ```
3. (Optional) Add a `.preview_my-cool-layout` rule in `ThemeSwitcher.module.css` for the panel preview.

That's it. The smoke test enforces the wiring (≥4 layouts declared, ≥4 `[data-layout=...]` CSS rules) — failing the build if either drops.

---

## 🛠 Local setup

```bash
git clone <this-repo>
cd domain_sale
npm install
cp .env.local.example .env.local
# fill in DATABASE_URL at minimum — other vars are optional
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Environment variables

All optional except `DATABASE_URL`. The app degrades gracefully when optional vars are missing.

| Var | Required? | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Neon Postgres connection string |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional | Turnstile site key (client). Skip → no CAPTCHA |
| `TURNSTILE_SECRET_KEY` | Optional | Turnstile secret (server). Skip → verification bypassed |
| `RESEND_API_KEY` | Optional | Resend API key for offer-notification emails |
| `NOTIFICATION_EMAIL` | Optional | Inbox that receives offer notifications |
| `NOTIFICATION_FROM_EMAIL` | Optional | Verified Resend sender (e.g. `Offers <offers@yourdomain.com>`). Defaults to Resend's onboarding address |

---

## Neon setup

Run once in the [Neon SQL editor](https://console.neon.tech):

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

Copy your connection string from the Neon dashboard and paste into `.env.local` as `DATABASE_URL`.

---

## Bot protection (Cloudflare Turnstile - Optional)

1. [Cloudflare dashboard → Turnstile](https://dash.cloudflare.com) → add a widget for your domain
2. Copy the **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
3. Copy the **Secret Key** → `TURNSTILE_SECRET_KEY`

The widget renders in the form when the site key is set. Without it, the form still works (handy for local dev).

---

## Email notifications (Resend - Optional)

You get an HTML email at `NOTIFICATION_EMAIL` whenever someone submits an offer.

1. [resend.com](https://resend.com) → verify a sending domain
2. Create an API key → `RESEND_API_KEY`
3. Set `NOTIFICATION_EMAIL` to your inbox
4. Set `NOTIFICATION_FROM_EMAIL` to a verified sender

Without these, offers still save — emails are skipped. The DB insert is the source of truth.

---

## WhatsApp / Telegram numbers & links (Optional)

Per-domain in `lib/domains.js`:

- **WhatsApp**: `whatsapp: '15551234567'` — digits only, **no `+`**, with country code
- **Telegram**: `telegram: 'yourusername'` — public `@handle` (without the `@`)

Both floating buttons pre-fill: `"Hi, I'm interested in {domain}. Is it still available?"`

---

## CI + pre-commit hooks

Every commit is gated by a **24-check smoke test** that catches static issues (missing imports, broken theme/layout wiring, dead API routes) before they land.

- **Local**: `.husky/pre-commit` runs `npm run smoke-test` before each commit.
- **Remote**: `.github/workflows/ci.yml` runs smoke test + lint + build on every push/PR to `main`.

To bypass the hook for a one-off commit (e.g. WIP): `git commit --no-verify`.

---

## Deployment Options

### Vercel (Free)

1. Push to GitHub
2. Import into [Vercel](https://vercel.com) — zero config
3. Add every var from `.env.local` in **Settings → Environment Variables**
4. For each domain (`yourdomain.com`, `otherdomain.com`):
   - Add the domain in Vercel's project settings
   - Set up a [rewrite](https://vercel.com/docs/edge-network/rewrites) so `yourdomain.com/*` → `/[slug]/*` (or use middleware to map host → slug)

For a single domain, just point your DNS A/CNAME to Vercel and you're done.

---

## Useful scripts

```bash
npm run dev        # dev server with hot reload
npm run build      # production build (SSG all known domains)
npm run start      # serve the production build
npm run lint       # eslint
npm run smoke-test # 21 static checks (no server needed)
npm test           # smoke-test + lint
```

---

## Troubleshooting

- **`/api/offer` returns 500** → `DATABASE_URL` is missing or wrong. Check `.env.local` (and Vercel env vars if deployed). Format: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
- **Turnstile widget doesn't show** → the site key must be prefixed with `NEXT_PUBLIC_`. Restart `npm run dev` after changing env vars.
- **Form submits but no email** → check [Resend logs](https://resend.com/logs); make sure `NOTIFICATION_FROM_EMAIL` uses a verified sending domain.
- **Theme switcher gear icon is missing** → it's pinned to the left edge of the viewport, vertically centered. Ad-blockers can hide it.
- **Theme / layout doesn't persist** → `localStorage` is disabled (private mode or browser setting). Both are saved under `domain-sale-ui` as one JSON blob.
- **404 on a domain I just added** → run `npm run build` (or redeploy on Vercel) after editing `lib/domains.js` — routes are SSG.
- **Hydration mismatch warning** → never read `localStorage` / `window` during render; only inside `useEffect`.
- **Vercel deploy fails** → add every var from `.env.local` in Project Settings → Environment Variables.

---

## License

MIT
