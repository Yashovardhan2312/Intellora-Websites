# Intellora Innovations website

Marketing site for **Intellora Innovations** ("Intelligence Reimagined") and its product **ForkSight**.
Live address: <https://www.intellora.co.in>

This is a static copy of the design saved from the Airo preview (`b5jrtj7zm0.preview.c35.airoapp.ai`). The markup and the
compiled Tailwind stylesheet are taken from that saved page unchanged. There is no build step and no framework.

## What is in here

| Path | Purpose |
|---|---|
| `public/index.html` | The home page |
| `public/404.html` | Temporary page shown for every route that has not been supplied yet (see below) |
| `public/assets/css/app.css` | The original compiled stylesheet (Tailwind, colours, fonts) |
| `public/assets/js/app.js` | Scroll reveal, header-on-scroll and mobile menu (reconstructed, see below) |
| `public/_headers` | Security headers and Content-Security-Policy |
| `src/worker.js` | Redirects `http` to `https` and `intellora.co.in` to `www.intellora.co.in`, then serves `public/` |
| `wrangler.jsonc` | Cloudflare deploy settings, including both domain names |

## Not yet included (needs your input)

The saved page only contained the **home page**. These pages are linked from the menu but their content was not in the file,
so they currently show the temporary "Coming soon" page (which gives the email address and phone number):

- `/forksight`, `/solutions`, `/about`, `/contact`, `/privacy`

Also missing from the saved page, so stand-ins are used:

- **Logo image.** The saved page referenced it but did not include the file. `public/assets/img/logo-dark.svg` is a placeholder.
- **Social share image** (`/og-image.png`) and **favicon** (`/favicon.svg`, `/apple-touch-icon.png`): placeholders.

## How this copy differs from the Airo preview

- **Behaviour is reconstructed.** The original is a React app. The saved page holds its final markup but not its component code.
  The scroll fade-in, the header background on scroll, and the mobile menu in `app.js` are rebuilt from what the markup shows.
  Timing and stagger are approximations.
- **Canonical and social URLs use `https://www.intellora.co.in`** (the original used `https://intellora.co.in`), because the apex
  address redirects to `www`.
- **Airo tooling is removed** (dev overlay, analytics and session-recording scripts, a preview-domain JSON-LD block).
- **The Content-Security-Policy allows inline styles and Google Fonts.** The original design depends on both.
- **Known accessibility finding inherited from the design:** white text on the teal "Request a Demo" button has a contrast
  ratio below the WCAG AA minimum. It was left as designed.

## Go live on Cloudflare (one-time, about 10 minutes)

The domain is already on Cloudflare. Both domain names are listed in `wrangler.jsonc`, so deploying should attach them for you.

1. Cloudflare dashboard → **Workers & Pages** → **Create application** → **Get started** next to **Import a repository**.
2. Choose your GitHub account and the `Intellora-Websites` repository.
3. Settings on the next screen:
   - **Project name:** `intellora-websites` (must match the `name` in `wrangler.jsonc` exactly, or the build fails)
   - **Production branch:** `main`
   - **Build command:** leave empty
   - **Deploy command:** `npx wrangler deploy` (the default)
4. Click **Save and Deploy**.
5. Open `https://www.intellora.co.in` and `https://intellora.co.in` (the second should jump to the first).

### If the build log says a domain could not be attached

Attach the domains by hand instead:

1. **Workers & Pages** → click `intellora-websites` → **Settings** → **Domains & Routes** → **Add** → **Custom Domain**.
2. Enter `www.intellora.co.in` and add it.
3. Repeat for `intellora.co.in`.

### If Cloudflare reports a DNS conflict

Cloudflare cannot attach a custom domain to a name that already has a conflicting DNS record.

- Go to the domain → **DNS** → **Records**.
- Delete **only** an `A`, `AAAA` or `CNAME` record whose **Name** is exactly `www` or `intellora.co.in`.
- **Never delete `MX` or `TXT` records.** They run your email (`@intellora.co.in`) and its security checks.
- Then retry the deployment.

After this, every change pushed to `main` goes live automatically within a minute or two.

## Making changes

- Edit the text directly in `public/index.html`.
- Colours and fonts are CSS variables at the top of `public/assets/css/app.css` (`--primary`, `--background`, ...).
- Preview locally: `npm install`, then `npx wrangler dev --local-protocol https`.
- The most exact way to get the full site (all pages and the original animations) is to export the project's source code from
  Airo and deploy that build instead of this static copy.
