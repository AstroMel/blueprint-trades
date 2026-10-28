# Stripe Setup for Blueprint Trades (easy handoff)

The site is static GitHub Pages. We use **Stripe Payment Links** so no backend is required for checkout.

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
- Payment Links handle checkout, receipt, and tax (if enabled). No server code needed for the purchase itself.
- If later you want to automatically unlock the journal app after payment, that requires a backend or a third-party tool — Payment Links alone do not grant login access.

---

## Stripe Webhook Setup (optional but recommended)

Webhooks let Stripe notify you when a payment succeeds (e.g. to unlock the journal, send an email, or log the sale). GitHub Pages cannot receive webhooks, so you need a tiny serverless endpoint.

### Easiest options
1. **Cloudflare Workers** (free tier, very simple)
2. **Netlify Functions** or **Vercel Serverless**
3. **Stripe CLI** for local testing only

### Steps (Cloudflare Worker example)
1. Create a free Cloudflare account and a Worker.
2. Add this code to the Worker (or use the example in `webhook-example.js`):

```js
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    // Verify signature (recommended)
    // Use the Stripe library or the webhook secret from your Stripe Dashboard
    // For a minimal version you can skip verification in test mode, but always verify in production.

    try {
      const event = JSON.parse(body);
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // TODO: unlock access, send email, log to database, etc.
        console.log('Payment succeeded:', session.id, session.customer_email);
      }
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    } catch (err) {
      return new Response('Webhook error', { status: 400 });
    }
  }
};
```

3. In Stripe Dashboard → Developers → Webhooks → Add endpoint:
   - Endpoint URL: your Worker URL (e.g. `https://your-worker.your-subdomain.workers.dev`)
   - Events to send: at minimum `checkout.session.completed`
4. Copy the **Webhook signing secret** (`whsec_...`) and store it as an environment variable in the Worker.
5. Test with Stripe CLI or the Dashboard “Send test webhook” button.

### What the webhook is useful for
- Confirming the payment actually completed (don’t rely only on the success redirect).
- Granting access to the journal app (store a flag, email a license key, etc.).
- Logging sales or triggering other actions.

Without a webhook the Payment Links still work — customers can pay and get receipts. The webhook is only needed if you want automatic post-payment actions.

That's it.
