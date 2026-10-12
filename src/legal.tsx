import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CONFIG } from "./data";

// Privacy Policy, Terms of Sale and Shipping and Returns are adapted from the owner's own Privacy Notice,
// Terms and Conditions and Return Policy, rewritten for Blueprint Trades and a physical journal shop.
// Cookie Notice and Trading Disclaimer are general drafts. None of this is legal advice: fill every
// [BRACKETED] placeholder and have a lawyer review the pages before launch.

const L = CONFIG.legal;

type Page = { id: string; title: string; intro: string; sections: [string, string[]][] };

export const LEGAL: Page[] = [
  {
    id: "privacy",
    title: "Privacy Policy",
    intro: `This privacy notice for ${L.name}, trading as Blueprint Trades ("we," "us," or "our"), describes how and why we might collect, store, use and share ("process") your information when you use this site or buy the Blueprint Trades Trading Journal (the "Services"), such as when you place an order, join the restock list, or email us. If you do not agree with our policies and practices, please do not use our Services. Questions or concerns? Email ${L.email}.`,
    sections: [
      ["Summary of key points", [
        "We process the information you give us when you order, sign up or contact us, plus basic technical data from your browser. We do not process sensitive personal information. We do not sell your personal information.",
        "We get payment confirmation and fraud signals from Stripe, our payment processor. We do not buy data from public databases, marketing partners or social media platforms.",
        "You can ask to see, correct or delete your information at any time by emailing us.",
      ]],
      ["1. What information do we collect?", [
        "In short: we collect personal information that you provide to us.",
        "When you order: your name, email, phone number (optional), shipping and billing address, and what you bought. When you join the restock list: your email. When you contact us: whatever you include in your message.",
        "Payment details are typed into Stripe's secure form and go straight to Stripe. We never see or store your full card number.",
        "All personal information you provide must be true, complete and accurate, and you should tell us of any changes.",
        "Information collected automatically: some information, such as your IP address, browser and device type, operating system, language, referring page and pages viewed, is collected when you visit. It does not reveal your name or contact details. It is used to keep the site secure and working.",
      ]],
      ["2. How do we process your information?", [
        "In short: to provide and improve the Services, communicate with you, prevent fraud, and comply with law. We may also process your information for other purposes with your consent.",
        "To take payment and ship your order. To send order, shipping and support emails. To send restock and new-volume emails if you signed up (every email has an unsubscribe link). To answer your questions. To keep the site secure and prevent fraud. To keep tax and accounting records the law requires.",
      ]],
      ["3. When and with whom do we share your personal information?", [
        "In short: only with the companies that help us run the shop, and in the situations below.",
        "Service providers: Stripe (payments and fraud checks), our site host, our email provider, and our shipping carrier or fulfillment partner, each only for its job: [LIST PROVIDERS, E.G. STRIPE, GITHUB PAGES, EMAIL PROVIDER, USPS].",
        "Business transfers: we may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing or acquisition of all or part of our business.",
        "Legal reasons: if the law, a court order or a government request requires it.",
      ]],
      ["4. Do we use cookies and other tracking technologies?", [
        "This site does not use analytics or advertising cookies today. Stripe sets its own cookies on the payment form to process payments and prevent fraud. Details and your choices are in our Cookie Notice.",
      ]],
      ["5. Is your information transferred internationally?", [
        "Our servers and providers are located in the United States. If you visit from outside the US, your information will be transferred to, stored and processed in the United States, which may not have data protection laws as comprehensive as those in your country. We will still protect it as this notice describes.",
      ]],
      ["6. How long do we keep your information?", [
        "As long as needed for the purposes in this notice, unless a longer period is required by law (such as tax or accounting rules). Order records: [7] years. Restock-list emails: until you unsubscribe.",
        "When we no longer need it, we delete or anonymize it, or, if that isn't possible (for example, in backup archives), we store it securely and isolate it from further use until deletion is possible.",
      ]],
      ["7. Do we collect information from minors?", [
        "We do not knowingly collect data from or market to children under 18. By using the Services, you represent that you are at least 18, or that you are the parent or guardian of a minor and consent to their use of the Services. If we learn we have collected information from someone under 18, we will delete it promptly. If you know of such data, email us.",
      ]],
      ["8. What are your privacy rights?", [
        "Depending on where you live (for example California, other US states with privacy laws, the EEA, the UK or Switzerland), you may have the right to access, correct, delete or get a copy of your personal information, and to opt out of marketing. We will not treat you differently for using these rights.",
        "Withdrawing consent: where we rely on your consent (for example, restock emails), you can withdraw it at any time by unsubscribing or emailing us. This does not affect processing that already happened.",
      ]],
      ["9. Controls for Do-Not-Track features", [
        "Most browsers offer a Do-Not-Track setting. No uniform standard for recognizing these signals has been finalized, so we do not currently respond to them. Because we use no tracking cookies, there is nothing for the signal to switch off today. If a standard is adopted that we must follow, we will update this notice.",
      ]],
      ["10. Do we make updates to this notice?", [
        "Yes, as needed to stay compliant with law. The updated version will show a new effective date and takes effect when posted. For material changes we may also post a notice on the site or email customers.",
      ]],
      ["11. How can you contact us about this notice?", [
        `Email ${L.email}, or write to ${L.name}, ${L.address}, United States.`,
      ]],
      ["12. How can you review, update or delete the data we collect from you?", [
        `Email ${L.email} from the address you used to order, saying what you want to see, change or delete. We will verify the request and reply within the time the law allows (usually 30 to 45 days).`,
      ]],
    ],
  },
  {
    id: "terms",
    title: "Terms of Sale",
    intro: `We are ${L.name}, trading as Blueprint Trades ("Company," "we," "us," "our"). We operate this website and sell the Blueprint Trades Trading Journal (together, the "Services"). You can contact us at ${L.email}. These Legal Terms are a binding agreement between you and ${L.name} about your use of the Services and your purchases. By using the site or placing an order, you agree to them. If you do not agree, do not use the Services.`,
    sections: [
      ["Changes and minors", [
        "We may change these Legal Terms at any time. We will update the effective date above, and the version posted when you place an order applies to that order.",
        "Users who are minors where they live (generally under 18) must have a parent or guardian's permission and supervision, and the parent or guardian must agree to these terms before an order is placed.",
      ]],
      ["1. Our Services", [
        "The site is meant for buyers in the United States. If you visit or order from elsewhere, you do so on your own initiative and are responsible for following local laws.",
      ]],
      ["2. Intellectual property rights", [
        "We own or license all content on the site and in the journal, including text, page layouts, designs, photographs, graphics and code (the \"Content\"), and the Blueprint Trades name and logos (the \"Marks\"). They are protected by copyright and trademark law.",
        "You may view the site and use the journal you bought for your own personal, non-commercial use. You may not copy, reproduce, republish, sell or otherwise exploit the Content, page templates or Marks for any commercial purpose without our written permission. Requests: " + L.email + ".",
        "Submissions: if you send us questions, feedback or ideas about the Services, you agree we may use them without payment or credit to you.",
      ]],
      ["3. User representations", [
        "By using the Services you confirm that you have the legal capacity to agree to these terms, that you are not a minor (or have a parent or guardian's permission), that you will not use bots or scripts to access the site, and that you will not use the Services for anything illegal or unauthorized.",
      ]],
      ["4. Products", [
        "We make every effort to show the journal's colors, features and details accurately. Your screen may not match the printed product exactly, and small differences in color and print are normal. All products are subject to availability, and we may discontinue products at any time. Prices may change.",
        "The journal is a record-keeping tool. It does not give trading advice. See the Trading Disclaimer.",
      ]],
      ["5. Purchases and payment", [
        "Payments are processed by Stripe. We accept the cards and wallets shown at checkout, such as Visa, Mastercard, American Express and Discover. All payments are in US dollars. Sales tax is added where required.",
        "You agree to give current, complete and accurate purchase information, and to pay the prices in effect when you order plus any shipping fees. Your payment method is charged when you place the order. We may correct pricing errors, even after payment, and will refund you if we cancel.",
        "We may refuse or cancel any order, and may limit quantities per person, household or order, including orders that appear to be placed by dealers, resellers or distributors.",
      ]],
      ["6. Return and refunds policy", [
        "All sales are final. Please read our Shipping and Returns policy, which is part of these terms, before you buy. It explains what happens if an order arrives damaged, misprinted or not at all.",
      ]],
      ["7. Prohibited activities", [
        "You agree not to: scrape or systematically collect data from the site; trick or defraud us or other users; get around security features; use the site for anything unlawful; upload viruses or other harmful code; use automated tools to place orders or send messages; remove copyright notices; impersonate anyone; interfere with or overload the site; harass our staff; copy, decompile or reverse engineer the site's code; or resell the journal's page templates as your own.",
      ]],
      ["8. Third-party websites and content", [
        "The site links to third parties such as Stripe, YouTube and market-data providers. We do not control them and are not responsible for their content, accuracy or privacy practices. When you leave our site, their terms apply.",
      ]],
      ["9. Privacy policy", [
        "Our Privacy Policy is part of these terms. The Services are hosted in the United States. If you visit from another region, you consent to your data being transferred to and processed in the United States.",
      ]],
      ["10. Copyright infringements", [
        `If you believe material on the site infringes a copyright you own or control, email ${L.email} with the details. You may be liable for damages if you make a material misrepresentation in a notice.`,
      ]],
      ["11. Modifications, interruptions and corrections", [
        "We may change, update or remove the site's content, or pause or discontinue the Services, at any time without notice. We cannot guarantee the site will always be available, and we are not liable for downtime.",
        "The site may contain typos, inaccuracies or omissions, including in descriptions, pricing and availability. We may correct them at any time without prior notice.",
      ]],
      ["12. Governing law", [
        `These Legal Terms are governed by the laws of the State of ${L.state}, without regard to its conflict-of-law principles.`,
      ]],
      ["13. Dispute resolution", [
        `Informal negotiations: before starting any claim, you and we agree to try to resolve the dispute informally for at least [30] days, starting when one side emails the other with written notice.`,
        "Binding arbitration: if informal negotiation fails, the dispute will be finally resolved by binding individual arbitration under the rules of the American Arbitration Association (AAA), including its Consumer Rules where they apply. YOU UNDERSTAND THAT WITHOUT THIS PROVISION, YOU WOULD HAVE THE RIGHT TO SUE IN COURT AND HAVE A JURY TRIAL. Your fees are limited as the AAA Consumer Rules provide. Arbitration may be held in person, by documents, by phone or online.",
        "No class actions: any arbitration is limited to the dispute between you and us individually. No arbitration may be joined with another proceeding or brought on a class-action or representative basis.",
        `Exceptions: disputes about intellectual property, claims of theft, piracy, invasion of privacy or unauthorized use, and claims for injunctive relief are not subject to arbitration. Small-claims court cases are also allowed. Any dispute that goes to court will be heard in the state and federal courts located in ${L.county}, ${L.state}.`,
        "Time limit: any claim must be brought within one (1) year after it arose, where the law allows that limit.",
      ]],
      ["14. Disclaimer", [
        "THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL IMPLIED WARRANTIES ABOUT THE SITE, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT, AND WE ARE NOT RESPONSIBLE FOR ERRORS IN SITE CONTENT, INTERRUPTIONS, OR THIRD-PARTY SITES. THIS DOES NOT LIMIT OUR PROMISES IN THE SHIPPING AND RETURNS POLICY ABOUT DAMAGED, MISPRINTED OR LOST ORDERS.",
      ]],
      ["15. Limitations of liability", [
        "IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES OR AGENTS BE LIABLE FOR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS OR TRADING LOSSES. OUR TOTAL LIABILITY FOR ANY CLAIM IS LIMITED TO THE LESSER OF THE AMOUNT YOU PAID US IN THE SIX (6) MONTHS BEFORE THE CLAIM AROSE OR $500.00 USD. SOME STATES DO NOT ALLOW THESE LIMITS, SO THEY MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.",
      ]],
      ["16. Indemnification", [
        "You agree to defend, indemnify and hold us harmless, including our affiliates, officers, agents and employees, from any third-party claim, loss or demand, including reasonable attorneys' fees, arising from your misuse of the Services, your breach of these terms, or your violation of anyone else's rights.",
      ]],
      ["17. Electronic communications", [
        "Visiting the site, emailing us and placing orders online are electronic communications. You agree that agreements, notices, receipts and other communications we send electronically satisfy any legal requirement that they be in writing, and you agree to the use of electronic records and orders.",
      ]],
      ["18. California users and residents", [
        "If a complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs in writing at 1625 North Market Blvd., Suite N 112, Sacramento, California 95834, or by phone at (800) 952-5210 or (916) 445-1254.",
      ]],
      ["19. Miscellaneous", [
        "These terms and the policies posted on the site are the entire agreement between you and us. If we don't enforce a right, we haven't waived it. We may assign our rights and obligations. We are not liable for delays or failures caused by events beyond our reasonable control. If any provision is found unenforceable, the rest still applies. These terms create no partnership, employment or agency relationship.",
      ]],
      ["20. Contact us", [`${L.name}, ${L.address}, United States. Email ${L.email}.`]],
    ],
  },
  {
    id: "shipping",
    title: "Shipping and Returns",
    intro: "How orders ship, our final-sale policy, and what to do if something goes wrong.",
    sections: [
      ["Shipping", [
        `Orders ship within ${L.handlingDays} business days. Standard delivery in the US takes about 3 to 6 business days; express about 1 to 2. Standard shipping is free on orders over $${CONFIG.freeShippingOver}.`,
        "You get a tracking link by email when your order ships. [STATE WHETHER YOU SHIP INTERNATIONALLY, AND WHO PAYS DUTIES.]",
      ]],
      ["Refunds", [
        "All sales are final and no refund will be issued, except as described below for orders that arrive damaged, misprinted or not at all.",
      ]],
      ["Damaged, misprinted or lost orders", [
        `If your journal arrives damaged or misprinted, or your tracking shows no delivery, email ${L.email} within ${L.claimDays} days of delivery (or of the expected delivery date) with your order number and photos where possible. We will send a replacement or refund you, and you will not need to pay return shipping.`,
        `Approved refunds go back to the original payment method within ${L.refundDays} business days.`,
      ]],
      ["Questions", [`If you have questions about our policy, email ${L.email}.`]],
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
                Effective <Text s={L.effective} /> · Draft, not legal advice. Placeholders are highlighted.
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
