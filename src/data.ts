// Store configuration. Everything marked PLACEHOLDER is swapped at launch.
export const CONFIG = {
  brand: "ledgerline",
  // PLACEHOLDER: the custom domain is not chosen yet. Set it here and in DNS (see plan, phase 4).
  domain: "your-domain.com",
  supportEmail: "hello@your-domain.com",
  currency: "USD",
  // PLACEHOLDER: Stripe publishable key (pk_live_… / pk_test_…). The secret key lives only on the server.
  stripePublishableKey: "pk_test_REPLACE_ME",
  // PLACEHOLDER: serverless endpoint that creates a PaymentIntent and returns its client_secret.
  apiBase: "https://api.your-domain.com",
  freeShippingOver: 75,
  testMode: true,
};

export type Colorway = { id: string; name: string; swatch: string; ring: string };

export const COLORWAYS: Colorway[] = [
  { id: "predawn", name: "Forest", swatch: "#12261e", ring: "#c19a4b" },
  { id: "ember", name: "Oxblood", swatch: "#96342c", ring: "#f1ead8" },
  { id: "bone", name: "Cream", swatch: "#f1ead8", ring: "#c19a4b" },
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

// PLACEHOLDER pricing until the owner confirms unit cost and margin.
export const PRODUCTS: Product[] = [
  {
    id: "journal",
    name: "The Trading Journal",
    tagline: "365 sessions, one honest record.",
    price: 49,
    includes: ["A5 vegan-leather hardcover", "240 lay-flat pages, 120gsm", "Two ribbons + elastic band"],
    hasColorway: true,
  },
  {
    id: "bundle",
    name: "The Desk Bundle",
    tagline: "Journal, risk ruler and the pen.",
    price: 79,
    compareAt: 92,
    badge: "Most picked",
    includes: ["The Trading Journal", "Acrylic risk-to-reward ruler", "Brass-clip gel pen, 0.5mm", "Sticker sheet: candles + tally marks"],
    hasColorway: true,
  },
  {
    id: "refill",
    name: "Refill Pages",
    tagline: "Another 180 sessions, same format.",
    price: 24,
    includes: ["180 trade-log + recap pages", "Monthly P&L calendars", "Fits the journal's insert sleeve"],
    hasColorway: false,
  },
];

export const TICKER = [
  ["NQ1!", "+0.84%"],
  ["ES1!", "+0.41%"],
  ["EURUSD", "−0.12%"],
  ["XAUUSD", "+0.67%"],
  ["BTCUSD", "+1.92%"],
  ["GBPJPY", "−0.38%"],
  ["CL1!", "+0.22%"],
  ["SPY", "+0.35%"],
] as const;

export const FEATURES = [
  { k: "01", title: "Trade log", body: "Pair, side, entry, stop, target, R and how you felt. Every trade, even the ugly ones." },
  { k: "02", title: "Session recap", body: "A dot-grid chart box to redraw the move and mark where you got in." },
  { k: "03", title: "Pre-market ritual", body: "Risk set, news checked, A+ setups only. Tick it before you click." },
  { k: "04", title: "Monthly P&L calendar", body: "Green days, red days, all of them. Patterns show up by week three." },
  { k: "05", title: "Psychology check-in", body: "Rate focus, patience and FOMO 1 to 5. Your mood is a market variable." },
  { k: "06", title: "Quarterly review", body: "Best setup, worst habit, one rule to add. The page that compounds." },
];

export const SPECS = [
  ["Format", "A5, 148 × 210 mm"],
  ["Pages", "240, 120gsm ivory, lay-flat binding"],
  ["Cover", "Vegan leather, brass foil mark, debossed ledger ruling"],
  ["Extras", "2 ribbons, elastic band, back pocket, risk table inside cover"],
  ["Dated?", "Undated. Start any Monday."],
] as const;

export const FAQ = [
  {
    q: "Is this financial advice?",
    a: "No. It's a notebook that helps you follow your own plan. Trading involves risk of loss.",
  },
  {
    q: "When does it ship?",
    a: "Orders ship within 2 business days. Standard delivery is 3 to 6 business days in the US; express is 1 to 2.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, to most countries. Duties and taxes are calculated at checkout.",
  },
  {
    q: "What if I don't love it?",
    a: "Return it unused within 30 days for a full refund.",
  },
  {
    q: "Why paper when there are apps?",
    a: "Writing a trade by hand slows you down at exactly the moment you'd revenge-trade. That's the feature.",
  },
];
