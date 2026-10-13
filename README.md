# Intellora Innovations website

Marketing site for **Intellora Innovations** ("Intelligence Reimagined") and its product **ForkSight**.
Live address: <https://www.intellora.co.in>

This is a static copy of the design saved from the Airo preview (`b5jrtj7zm0.preview.c35.airoapp.ai`). The markup and the
compiled Tailwind stylesheet are taken from the saved pages unchanged. There is no build step and no framework.

## What is in here

| Path | Purpose |
|---|---|
| `public/index.html`, `forksight.html`, `solutions.html`, `about.html`, `contact.html`, `privacy.html` | The six pages (served at `/`, `/forksight`, `/solutions`, `/about`, `/contact`, `/privacy`) |
| `public/404.html` | "Page not found" page. The original's 404 was not in the saved pages, so this one is a stand-in in the same style |
| `public/assets/css/app.css` | The original compiled stylesheet (identical across all six saved pages) |
| `public/assets/js/app.js` | Scroll reveal, header-on-scroll, mobile menu and contact form (reconstructed, see below) |
| `public/assets/img/logo-dark.png` | The Intellora logo, from your upload |
| `public/_headers` | Security headers and Content-Security-Policy |
| `src/worker.js` | Redirects `http` to `https` and `intellora.co.in` to `www.intellora.co.in`, then serves `public/` |
| `wrangler.jsonc` | Cloudflare deploy settings, including both domain names |

## Stand-ins (not in the saved pages)

- **Favicon, apple-touch icon and social share image** (`favicon.png`, `apple-touch-icon.png`, `og-image.png`), made from your logo and the site colours.
- **404 page** (`404.html`), in the same style as the site.

## How this copy differs from the Airo preview

- **Behaviour is reconstructed.** The original is a React app. The saved pages hold its final markup but not its component code.
  The scroll fade-in, the header background on scroll, the mobile menu and the contact form in `app.js` are rebuilt from what the
  markup shows. Timing and stagger are approximations.
- **The contact form opens the visitor's email app** with a pre-filled message to `yashovardhan.singh@intellora.co.in`. The saved page
  does not show where the original sent submissions (its hidden `_gotcha` field is the convention used by form-handling services).
  If you tell us the service and endpoint, the form can post there instead.
- **Canonical and social URLs use `https://www.intellora.co.in`** (the original used `https://intellora.co.in`), because the apex
  address redirects to `www`.
- **Airo tooling is removed**: the dev overlay, FullStory session recording, the analytics bundle, the media patch scripts, and a
  preview-domain JSON-LD block. The site therefore records no visitor sessions.
- **The Content-Security-Policy allows inline styles and Google Fonts.** The original design depends on both.
- **Known accessibility findings inherited from the design:** the Privacy page's contents list is an `<ol>` whose children include wrapper `<div>`s, which strict list checks flag. Also, white text on the teal buttons has a contrast ratio of 2.26:1, below the
  WCAG AA minimum of 4.5:1. It was left as designed.

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
- To get the full site (all pages and the original animations) exactly, check whether Airo offers a code download or a GitHub
  export, and deploy that build instead of this static copy.
