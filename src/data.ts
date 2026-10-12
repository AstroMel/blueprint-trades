// Store configuration. Everything marked PLACEHOLDER is swapped at launch.
export const CONFIG = {
  brand: "blueprint-trades",
  channelUrl: "https://www.youtube.com/@Blueprint_Trades",
  // PLACEHOLDER: the custom domain is not chosen yet. Set it here and in DNS (see DEPLOY.md).
  domain: "blueprinttrades.com",
  supportEmail: "hello@your-domain.com",
  currency: "USD",
  // PLACEHOLDER: Stripe publishable key (pk_live_… / pk_test_…). The secret key lives only on the server.
  stripePublishableKey: "pk_test_REPLACE_ME",
  // PLACEHOLDER: serverless endpoint that creates a PaymentIntent and returns its client_secret.
  apiBase: "https://api.your-domain.com",
  freeShippingOver: 75,
  testMode: true,
  // Free consultation requests. Set consultEndpoint to a form service URL (e.g. Formspree) that accepts a JSON POST,
  // or leave it empty to send requests by email to legal.email once that placeholder is filled in.
  consultEndpoint: "",
  appUrl: "app.html",
  // The Journal App is a subscription. PLACEHOLDER: set the same Stripe Payment Link and portal link in public/app.html (PLAN).
  appPrice: 7.99,
  // PLACEHOLDER: the owner's separate member app (built with Grok Build). Empty = hidden. Set once the address is confirmed.
  memberAppUrl: "https://blueprinttrades.grok.me/",
  // Optional free Finnhub key (finnhub.io) for live SPY / QQQ / DIA quotes in the top bar. Empty = session status only.
  // Finnhub keys used from a browser are visible to anyone; this is a free, quote-only key. Rotate it at finnhub.io if abused.
  finnhubKey: "db66ht1r01qmd5li5480db66ht1r01qmd5li548g",
  // PLACEHOLDERS for the legal pages (src/legal.tsx). Fill these in before launch.
  legal: {
    name: "[BUSINESS LEGAL NAME]",
    address: "[BUSINESS MAILING ADDRESS]",
    email: "[CONTACT EMAIL]",
    state: "[GOVERNING STATE]",
    county: "[COUNTY]",
    effective: "[EFFECTIVE DATE]",
    handlingDays: "[2]",
    claimDays: "[14]",
    refundDays: "[5 to 10]",
  },
};

export type Colorway = { id: string; name: string; note: string; swatch: string };

// One edition: the printed Bull & Bear journal. The colorway field stays so a second cover can be added later.
export const COLORWAYS: Colorway[] = [
  { id: "printed", name: "Bull & Bear", note: "the printed cover", swatch: "linear-gradient(135deg,#1c2a6b,#4a1f5c 55%,#8a2a3a)" },
];

export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  compareAt?: number;
  badge?: string;
  includes: string[];
  hasColorway: boolean;
};

// PLACEHOLDER pricing and page counts until the owner confirms the print spec, unit cost and margin.
export const PRODUCTS: Product[] = [
  {
    id: "journal",
    name: "The Trading Journal",
    tagline: "Plan it. Take it. Write down what really happened.",
    price: 49,
    badge: "In print",
    includes: ["A5, gold wire-o, opens flat", "One Trade Analysis page per trade", "Scored out of 30, with a psychology check"],
    hasColorway: true,
  },
];

// The tape: the channel's rules, not prices. Nothing here is a market quote.
export const TAPE = [
  "Red days included",
  "No signals",
  "Key levels first",
  "Wait for the retest",
  "Size it before you click",
  "Good trade, bad result is still a good trade",
  "Only you can save yourself",
  "Process over outcome",
] as const;



export const VIDEOS = [
  { title: "I Followed Trading Influencers and It Nearly Destroyed Me", page: "What can be improved next trade?", tag: "Reality check" },
  { title: "How to find Key levels in trading for Beginners", page: "Setup quality, scored 1 to 5", tag: "The plan" },
  { title: "Don't Fall for This Market Maker Setup", page: "Did I respect my stop-loss and risk rules?", tag: "Avoid the trap" },
] as const;

// PLACEHOLDER: final print spec comes from the printer quote.
export const SPECS = [
  ["Format", "A5, 148 × 210 mm"],
  ["Binding", "Gold wire-o, opens flat and folds back"],
  ["Inside", "One Trade Analysis page per trade: details, score out of 30, psychology check, chart box"],
  ["Writing", "Filled in by hand, in pen or pencil"],
  ["Dated?", "Undated. Start any Monday."],
] as const;

// Support routes. Everything goes to one inbox (CONFIG.legal.email); the subject line routes it.
// PLACEHOLDER: replyDays until the owner confirms a response time.
export const SUPPORT = {
  replyDays: "1 to 2",
  topics: [
    { subject: "Billing", title: "Payments and subscriptions", body: "Double charges, failed payments, refunds, canceling the app." },
    { subject: "Order", title: "Orders and shipping", body: "Tracking, damaged or misprinted journals, address changes." },
    { subject: "Consultation", title: "Consultations", body: "Questions about a request you sent or a session that's booked." },
    { subject: "Privacy", title: "Privacy and your data", body: "Access, correct or delete the details we hold about you." },
  ],
} as const;

export type FaqItem = { group: string; q: string; a: string };

export const FAQ: FaqItem[] = [
  { group: "The journal", q: "Will this make me profitable?", a: "No one can promise that, and we won't. The journal shows you what you actually do, trade after trade. That record is where improving starts." },
  { group: "The journal", q: "Is this financial advice?", a: "No. The journal, the app and the calculator are tools for following your own plan. We don't give signals, calls or personal recommendations. Trading involves risk of loss." },
  { group: "The journal", q: "Is that the real cover?", a: "Yes. The product views and the 3D journal use the actual Bull & Bear cover art, front and back, exactly as it's printed." },
  { group: "The journal", q: "Paper or app?", a: "Both work. Writing by hand slows you down at exactly the moment you'd chase or revenge-trade. The app does the math, keeps the record and builds the monthly review. Many traders plan on paper and review in the app." },
  { group: "Privacy and data", q: "Where are my app entries stored, and who can see them?", a: "On your device only, in your browser's storage. They are not sent to us, and we never sell or share them. Because we never receive them, we can't recover them if your browser data is cleared, so export a backup from the app's Settings from time to time." },
  { group: "Privacy and data", q: "What do you collect when I buy or subscribe?", a: "Your name, email and shipping address to fulfill the order, and your subscription status to give you access to the app. Card details go straight to Stripe, our payment processor. We never see or store your full card number. The Privacy Policy has the full detail." },
  { group: "Privacy and data", q: "Is what I share in a consultation request kept private?", a: "Yes. Requests are read only by the Blueprint Trades team, used only to screen and reply, and never published, sold or shared. Nothing from a request or a session appears in our content unless you give written permission. You can ask us to delete your request at any time." },
  { group: "Payments and support", q: "How does the app subscription work?", a: "The Journal App is $7.99 a month, billed monthly by Stripe. Cancel anytime from the app's Settings and you keep access until the end of the month you've paid for. Partial months aren't refunded." },
  { group: "Payments and support", q: "I was charged twice, or my payment failed. What should I do?", a: "Email support with the subject \"Billing\", the email you used at checkout and the date of the charge. Never send your card number. We reply within 1 to 2 business days, and any charge made in error is refunded to the original payment method." },
  { group: "Payments and support", q: "How do I reach you about a consultation?", a: "Email support with the subject \"Consultation\" and the email you used on your request. We'll confirm where your request stands. Every request is reviewed, but not every request is accepted." },
  { group: "Orders", q: "When does it ship?", a: "Orders ship within 2 business days by USPS Ground Advantage, with tracking. Standard delivery is 2 to 5 business days in the US for $8, free on orders over $75. Express arrives in 1 to 3 business days." },
  { group: "Orders", q: "Can I return it?", a: "All sales are final. If your journal arrives damaged or misprinted, or never arrives, email us with the subject \"Order\" and we'll replace it or refund you." },
];
