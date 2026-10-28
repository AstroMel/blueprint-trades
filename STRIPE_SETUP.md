# Stripe Setup for Blueprint Trades (easy handoff)

The site is static GitHub Pages. We use **Stripe Payment Links** so no backend is required.

## What your friend needs to do

1. Log into Stripe Dashboard (https://dashboard.stripe.com).
2. Create two Products:
   - **Blueprint Journal** — one-time price (currently shown as $79 on the page)
   - **Blueprint Consultation** — one-time price (currently shown as $250 on the page)
3. For each product, click **Create payment link**.
4. Copy the two Payment Link URLs (they look like `https://buy.stripe.com/...`).
5. Open `pricing.html` in this repo.
6. Replace:
   - `YOUR_JOURNAL_STRIPE_PAYMENT_LINK` with the Journal link
   - `YOUR_CONSULTATION_STRIPE_PAYMENT_LINK` with the Consultation link
7. (Optional) Change the displayed prices in the HTML if they differ from $79 / $250.
8. Commit and push to the `gh-pages` branch.

The page is live at: https://blueprinttrades.com/pricing.html

## Notes
- Test first in Stripe test mode.
- Set the success URL on each Payment Link to something like `https://blueprinttrades.com/thank-you` (or just the homepage).
- Payment Links handle checkout, receipt, and tax (if enabled). No server code needed.
- If later you want to automatically unlock the journal app after payment, that requires a backend or a third-party tool — Payment Links alone do not grant login access.

That's it.
