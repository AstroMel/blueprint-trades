// Minimal Stripe webhook receiver (Cloudflare Worker style)
// Deploy this as a Cloudflare Worker, Netlify Function, or similar.
// Do NOT put this on GitHub Pages — it needs a server.

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    // In production, verify the signature using the Stripe library
    // and env.STRIPE_WEBHOOK_SECRET (whsec_... from the Stripe Dashboard).
    // Example (Node):
    // const stripe = require('stripe')(env.STRIPE_SECRET_KEY);
    // const event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);

    let event;
    try {
      event = JSON.parse(body);
    } catch (err) {
      return new Response('Invalid JSON', { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Payment completed:', {
          id: session.id,
          email: session.customer_email || session.customer_details?.email,
          amount: session.amount_total,
          metadata: session.metadata,
        });
        // TODO: unlock journal access, send confirmation email, etc.
        break;
      }
      case 'payment_intent.succeeded':
        console.log('PaymentIntent succeeded');
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
