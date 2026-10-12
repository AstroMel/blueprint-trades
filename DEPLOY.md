# Publishing the store with GitHub Pages

Nothing here has been pushed yet. The target repo is AstroMel/kris-jordan; the domain is still open.

## 1. Put the code in a repo
Push this `source` folder to the repo (AstroMel/kris-jordan) and merge it into `main`.
`.github/workflows/pages.yml` builds with Vite and deploys `dist/` on every push to `main`.

## 2. Name the domain
- Create `public/CNAME` containing just the domain on one line (no `https://`).
- Replace `domain` and `apiBase` in `src/data.ts`.

## 3. Turn on Pages
Repo → Settings → Pages → Build and deployment → Source: **GitHub Actions**.
Then Settings → Pages → Custom domain: enter the domain and save.

## 4. DNS at your registrar
Apex domain (`your-domain.com`):

| Type | Host | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | `<github-username>.github.io` |

Remove any other A, AAAA or ALIAS records on `@` (such as a registrar parking page).

## 5. Secure it
- Verify the domain for the account or org: GitHub Settings → Pages → Add a domain (adds a TXT record). This stops anyone else claiming it.
- After DNS resolves (minutes to a day), tick **Enforce HTTPS** in Settings → Pages.

## What runs where
- Store: `/` (React build). 3D journal viewer: `/3d.html`.
- Checkout stays in test mode on Pages. Live Stripe payments need a small server endpoint (`/create-payment-intent` plus a webhook) hosted elsewhere, such as a Cloudflare Worker or Vercel function, set as `apiBase`.
