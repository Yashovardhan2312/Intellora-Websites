# Intellora Innovations website

Marketing site for **Intellora Innovations** ("Intelligence Reimagined") and its product **ForkSight**.
Live address: <https://www.intellora.co.in>

Plain HTML, CSS and JavaScript. There is no build step and no framework.

## What is in here

| Path | Purpose |
|---|---|
| `public/` | The website itself. Everything here is served as-is. |
| `public/index.html`, `public/<page>/index.html` | Home, ForkSight, Solutions, About, Contact, Privacy |
| `public/assets/` | Styles, scripts, logo, share image |
| `public/_headers` | Security headers (including a strict Content-Security-Policy) |
| `src/worker.js` | Redirects `http` to `https` and `intellora.co.in` to `www.intellora.co.in`, then serves `public/` |
| `wrangler.jsonc` | Cloudflare deploy settings, including both domain names |

## Go live on Cloudflare (one-time, about 10 minutes)

The domain is already on Cloudflare. The domain names are listed in `wrangler.jsonc`, so deploying attaches them for you.

1. Cloudflare dashboard → **Workers & Pages** → **Create application** → **Get started** next to **Import a repository**.
2. Choose your GitHub account and the `Intellora-Websites` repository.
3. Settings on the next screen:
   - **Project name:** `intellora-website` (must match the `name` in `wrangler.jsonc` exactly, or the build fails)
   - **Production branch:** `main`
   - **Build command:** leave empty
   - **Deploy command:** `npx wrangler deploy` (the default)
4. Click **Save and Deploy**.
5. Open `https://www.intellora.co.in` and `https://intellora.co.in` (the second should jump to the first).

**If the deploy complains about a DNS conflict:** Cloudflare cannot attach a custom domain to a name that already has a DNS record. Go to the domain → **DNS** → **Records**, delete the existing record for `www` (and for the bare domain, if listed), then retry the deployment.

After this, every change pushed to `main` goes live automatically within a minute or two.

## Making changes

- Edit the text directly in the HTML files under `public/`.
- The header and footer are repeated in every page. If you change the menu or footer, change it in all six pages.
- Colours and fonts are at the top of `public/assets/css/styles.css`.
- Preview locally: `npm install`, then `npx wrangler dev --local-protocol https`.

## Things to review before promoting the site

- **Solutions page** uses general descriptions. Replace with your actual service list.
- **Privacy Policy** is a plain-language starting point. Have it reviewed against your legal obligations.
- **Contact form** opens the visitor's email app with a pre-filled message to the founder's address. Nothing is stored on a server, so no secrets or databases are involved. If you later want submissions delivered without the visitor's email app, add a form endpoint (for example a Cloudflare Worker route plus an email service) in `src/worker.js`.
- **Illustrative graphics** (forecast chart, stock plan) are clearly labelled "Illustrative" and use no real data.
- **No analytics or tracking** is included. The Content-Security-Policy in `public/_headers` blocks third-party scripts, so adding analytics needs a matching policy change.
- ForkSight is described as in active development. Update the wording when it has customers or results to show.
