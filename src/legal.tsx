import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CONFIG } from "./data";

// DRAFT legal pages from a general template for a US store selling a physical product through Stripe.
// They are not legal advice. Fill every [BRACKETED] placeholder and have a lawyer review them before launch.

const L = CONFIG.legal;

type Page = { id: string; title: string; intro: string; sections: [string, string[]][] };

export const LEGAL: Page[] = [
  {
    id: "privacy",
    title: "Privacy Policy",
    intro: `This policy explains what ${L.name} ("we", "us") collects when you visit this site or buy the Blueprint Trades Trading Journal, how we use it, and the choices you have.`,
    sections: [
      ["What we collect", [
        "Order details you give us: name, email, phone (optional), shipping and billing address, and what you bought.",
        "Payment details are entered into Stripe's secure form and go straight to Stripe. We never see or store your full card number.",
        "Newsletter sign-ups: your email address, if you choose to join.",
        "Basic technical data: browser type, device, pages viewed and approximate location from your IP address, collected through server logs and, if you allow them, analytics cookies.",
      ]],
      ["How we use it", [
        "To take payment, ship your order, send order and shipping emails, and handle returns.",
        "To answer your questions and keep records we are required to keep (for example tax records).",
        "To send restock and new-volume emails if you signed up. Every email has an unsubscribe link.",
        "To keep the site secure, prevent fraud, and understand which pages are useful.",
      ]],
      ["Who we share it with", [
        "Stripe (payments and fraud checks), our hosting provider, our email provider, and our shipping carrier or fulfillment partner, only as needed to do the jobs above: [LIST PROVIDERS, E.G. STRIPE, GITHUB PAGES, EMAIL PROVIDER, CARRIER].",
        "Authorities, if the law requires it.",
        "We do not sell your personal information, and we do not share it for cross-context behavioral advertising.",
      ]],
      ["How long we keep it", [
        "Order records: as long as tax and accounting law requires, typically [7] years. Newsletter emails: until you unsubscribe. Analytics data: up to [26] months.",
      ]],
      ["Your rights", [
        "Depending on where you live (including California under the CCPA/CPRA and the EU/UK under the GDPR), you can ask to access, correct, delete or get a copy of your personal information, and to opt out of marketing.",
        `Email ${L.email} with your request. We will verify it is you and reply within the time the law sets (usually 30 to 45 days). We will not treat you differently for using these rights.`,
        "If you are in the EU or UK, our legal bases are performing our contract with you (orders), legitimate interests (security, improving the site), and consent (marketing emails and analytics cookies). You can complain to your local data protection authority.",
      ]],
      ["Children", ["This site is not meant for children under 13, and we do not knowingly collect their information."]],
      ["Security", ["We use HTTPS and trusted providers, but no method of transmission or storage is completely secure."]],
      ["Changes and contact", [
        `We will post changes here with a new date. Questions: ${L.email}, or ${L.name}, ${L.address}.`,
      ]],
    ],
  },
  {
    id: "terms",
    title: "Terms of Sale and Use",
    intro: `These terms apply when you use this site or buy from ${L.name}. By placing an order you agree to them.`,
    sections: [
      ["The product", [
        "We sell a printed paper trading journal and related refills and accessories. Photos show the printed journal; small differences in color and print are normal.",
        "The journal is a record-keeping tool. It does not give trading advice. See the Trading Disclaimer.",
      ]],
      ["Orders and prices", [
        "Prices are in US dollars and can change before you order. Sales tax is added at checkout where required.",
        "Your order is accepted when we send a confirmation email. We may cancel and refund an order if an item is out of stock, a price was clearly wrong, or we suspect fraud.",
      ]],
      ["Payment", [
        "Payments are processed by Stripe. By paying you also agree to Stripe's terms for the payment method you use. Your card is charged when you place the order.",
      ]],
      ["Shipping, returns and refunds", ["Covered by our Shipping and Returns policy, which is part of these terms."]],
      ["Using this site", [
        "Do not misuse the site: no attempts to break security, scrape it at scale, or use it for anything unlawful.",
        "The site's text, design and the Blueprint Trades name and journal design belong to us or our licensors. You may not copy or resell them.",
      ]],
      ["Limits of liability", [
        `To the fullest extent the law allows, ${L.name} is not liable for trading losses or for indirect or consequential damages, and our total liability for any claim is limited to the amount you paid for the order involved. Nothing here limits rights you have under consumer law that cannot be waived.`,
      ]],
      ["Governing law", [
        `These terms are governed by the laws of the State of ${L.state}, USA, without regard to conflict-of-law rules. [ADD DISPUTE RESOLUTION OR VENUE CLAUSE IF DESIRED.]`,
      ]],
      ["Contact", [`${L.name}, ${L.address}. Email ${L.email}.`]],
    ],
  },
  {
    id: "shipping",
    title: "Shipping and Returns",
    intro: "How orders ship, and what to do if something is wrong.",
    sections: [
      ["Shipping", [
        `Orders ship within ${L.handlingDays} business days. Standard delivery in the US takes about 3 to 6 business days; express about 1 to 2. Standard shipping is free on orders over $${CONFIG.freeShippingOver}.`,
        "You get a tracking link by email when your order ships. [STATE WHETHER YOU SHIP INTERNATIONALLY, AND WHO PAYS DUTIES.]",
      ]],
      ["Returns", [
        `You can return unused, unwritten-in items within ${L.returnDays} days of delivery. Email ${L.email} with your order number first. Return shipping is paid by [YOU / THE CUSTOMER] unless the item arrived damaged or wrong.`,
        "Journals that have been written in cannot be returned, for hygiene and resale reasons, unless they are defective.",
      ]],
      ["Refunds", [
        `Once we receive and check the return, we refund the original payment method within ${L.refundDays} business days. Original shipping costs are [REFUNDED / NOT REFUNDED].`,
      ]],
      ["Damaged, defective or lost", [
        `If your order arrives damaged or misprinted, or never arrives, email ${L.email} within [14] days with photos where possible. We will replace it or refund you.`,
      ]],
    ],
  },
  {
    id: "cookies",
    title: "Cookie Notice",
    intro: "What this site stores in your browser.",
    sections: [
      ["Essential", [
        "Your light or dark theme choice is saved in your browser's local storage. Your bag lives in the page while you shop.",
        "Stripe sets cookies on its own payment form to process payments and prevent fraud.",
      ]],
      ["Analytics and advertising", [
        "We do not use analytics or advertising cookies today. If we add them [NAME THE TOOLS], we will ask for your consent first where the law requires it and update this notice.",
      ]],
      ["Your choices", ["You can clear or block cookies in your browser settings. Blocking Stripe's cookies may stop checkout from working."]],
    ],
  },
  {
    id: "disclaimer",
    title: "Trading Disclaimer",
    intro: "Please read this before you buy or use the journal.",
    sections: [
      ["Not financial advice", [
        `The Blueprint Trades Trading Journal, this site and the Blueprint Trades channel are for education and record-keeping only. Nothing here is financial, investment, tax or legal advice, or a recommendation to buy or sell anything. ${L.name} is not a registered investment adviser or broker-dealer.`,
      ]],
      ["No promises of profit", [
        "No one can promise profitability, and we do not. Any sample figures in the journal or on this site, such as R-multiples, win rates or P/L, are illustrations, not results.",
      ]],
      ["Risk", [
        "Trading stocks, futures, options, forex and crypto involves substantial risk of loss and is not suitable for everyone. You can lose more than you invest with leveraged products. Only trade money you can afford to lose.",
      ]],
      ["Market data", [
        "Prices in the bar at the top of the page come from public third-party feeds, may be delayed, incomplete or wrong, and are shown for information only. Do not use them to trade.",
      ]],
      ["Your decisions", ["You are solely responsible for your trading decisions and their results."]],
    ],
  },
];

const PH = /(\[[^\]]+\])/g;
function Text({ s }: { s: string }) {
  return (
    <>
      {s.split(PH).map((part, i) =>
        PH.test(part) ? (
          <mark key={i} className="bg-db-sun/25 px-0.5 font-mono text-[0.9em] text-db-ink">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

const pageFromHash = () => LEGAL.find((p) => `#${p.id}` === window.location.hash) ?? null;

export function openLegal(id: string) {
  window.location.hash = id;
}

export function LegalDialog() {
  const [page, setPage] = useState<Page | null>(pageFromHash);
  useEffect(() => {
    const on = () => setPage(pageFromHash());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  const close = () => {
    setPage(null);
    try {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    } catch {
      window.location.hash = "";
    }
  };
  return (
    <Dialog open={!!page} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-h-[90dvh] w-[calc(100vw-32px)] max-w-2xl overflow-y-auto rounded-sm border-db-line bg-db-raised p-6 sm:p-8">
        {page && (
          <article className="flex flex-col gap-5">
            <div>
              <p className="label text-db-ember">Blueprint Trades · legal</p>
              <DialogTitle className="display mt-2 text-4xl">{page.title}</DialogTitle>
              <p className="mt-2 font-mono text-xs text-db-muted">
                Effective <Text s={L.effective} /> · Draft from a template, not legal advice. Placeholders are highlighted.
              </p>
              <DialogDescription className="mt-4 leading-relaxed text-db-muted"><Text s={page.intro} /></DialogDescription>
            </div>
            {page.sections.map(([h, ps]) => (
              <section key={h} className="flex flex-col gap-2 border-t border-db-line pt-4">
                <h3 className="text-lg font-semibold">{h}</h3>
                {ps.map((p, i) => (
                  <p key={i} className="leading-relaxed text-db-ink/90"><Text s={p} /></p>
                ))}
              </section>
            ))}
            <nav className="flex flex-wrap gap-x-4 gap-y-2 border-t border-db-line pt-4 text-sm" aria-label="Other policies">
              {LEGAL.filter((p) => p.id !== page.id).map((p) => (
                <a key={p.id} href={`#${p.id}`} className="text-db-ember underline-offset-4 hover:underline">{p.title}</a>
              ))}
            </nav>
          </article>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function LegalLinks({ className = "" }: { className?: string }) {
  return (
    <nav className={`flex flex-wrap gap-x-5 gap-y-2 ${className}`} aria-label="Policies">
      {LEGAL.map((p) => (
        <a key={p.id} href={`#${p.id}`} className="hover:text-db-ink hover:underline">{p.title}</a>
      ))}
    </nav>
  );
}
