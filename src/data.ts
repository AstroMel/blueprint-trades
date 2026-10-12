// Store configuration. Everything marked PLACEHOLDER is swapped at launch.
export const CONFIG = {
  brand: "blueprint-trades",
  channelUrl: "https://www.youtube.com/@Blueprint_Trades",
  // PLACEHOLDER: the custom domain is not chosen yet. Set it here and in DNS (see DEPLOY.md).
  domain: "your-domain.com",
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
    includes: ["A5, gold wire-o, opens flat", "Plan + Reality spread for every trade", "Monthly process review pages"],
    hasColorway: true,
  },
  {
    id: "bundle",
    name: "Journal + Desk Kit",
    tagline: "The journal, the ruler and the pens for both colors.",
    price: 79,
    compareAt: 92,
    badge: "Most picked",
    includes: ["The Trading Journal", "Clear R-multiple ruler for marking levels", "Blue and red fineliners for up and down candles", "Key-level sticky flags"],
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

// Every journal field maps to something the channel teaches.
export const FEATURES = [
  { k: "01", title: "Key levels used", body: "Write the higher-timeframe level, the zone and why it matters before you look for an entry." },
  { k: "02", title: "Market-maker risk check", body: "Is the level obvious to everyone? Did price just sweep a high? Four ticks before you become the liquidity." },
  { k: "03", title: "Emotion score", body: "Rate yourself calm to wired, before and after. Your state is a market variable." },
  { k: "04", title: "Plan adherence", body: "Entry, stop, size, exit: did you do what the plan said? Score the rules, not the P&L." },
  { k: "05", title: "Lesson learned", body: "One line, every trade. Losing days get the most ink." },
  { k: "06", title: "What would I tell my past self?", body: "The question that turns a bad week into tuition you only pay once." },
];

// Monthly review page: process metrics sit next to the money. Sample figures, not results.
export const REVIEW = [
  ["Rule adherence", "38 of 44 rules followed", "86%"],
  ["Calm entries (1–2)", "average result", "+0.9R"],
  ["Wired entries (4–5)", "average result", "−0.7R"],
  ["Trades taken at a marked level", "share of all trades", "71%"],
] as const;

export const VIDEOS = [
  { title: "I Followed Trading Influencers and It Nearly Destroyed Me", page: "What would I tell my past self?", tag: "Reality check" },
  { title: "How to find Key levels in trading for Beginners", page: "Key levels used", tag: "The plan" },
  { title: "Don't Fall for This Market Maker Setup", page: "Market-maker risk check", tag: "Avoid the trap" },
] as const;

// PLACEHOLDER: final print spec comes from the printer quote.
export const SPECS = [
  ["Format", "A5, 148 × 210 mm"],
  ["Binding", "Gold wire-o, opens flat and folds back"],
  ["Inside", "Plan + Reality spread per trade, monthly reviews, risk table inside the cover"],
  ["Paper", "Graph-ruled, takes pencil and gel pen"],
  ["Dated?", "Undated. Start any Monday."],
] as const;

export const FAQ = [
  {
    q: "Will this make me profitable?",
    a: "No one can promise that, and we won't. It will show you what you actually do, which is where getting better starts.",
  },
  {
    q: "Is this financial advice?",
    a: "No. It's a notebook for following your own plan. No signals, no calls. Trading involves risk of loss.",
  },
  {
    q: "Is that the real cover?",
    a: "Yes. The product views and the 3D journal use the actual Bull & Bear cover art, front and back, exactly as it's printed.",
  },
  {
    q: "Why paper when there are apps?",
    a: "Writing a trade by hand slows you down at exactly the moment you'd chase or revenge-trade. That's the feature.",
  },
  {
    q: "How does the app subscription work?",
    a: "The Journal App is $7.99 a month, billed monthly. Cancel anytime and you keep access until the end of the month you paid for. Your entries stay on your device either way.",
  },
  {
    q: "When does it ship?",
    a: "Orders ship within 2 business days. Standard delivery is 3 to 6 business days in the US; express is 1 to 2.",
  },
  {
    q: "Can I return it?",
    a: "All sales are final. If your journal arrives damaged or misprinted, or never arrives, email us and we'll replace it or refund you.",
  },
];
