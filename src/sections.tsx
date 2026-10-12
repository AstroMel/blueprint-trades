import { useEffect, useMemo, useState } from "react";
import { Menu, ShoppingBag, Check, ArrowRight, Sun, Moon } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CONFIG, COLORWAYS, FAQ, FEATURES, PRODUCTS, SPECS, TICKER } from "./data";
import { heroBook, heroBookLight, logo, logoInk, spread, cover, coverBone, coverOx } from "./images";
import { money, useCart, totals } from "./cart";

const NAV = [
  ["Journal", "#shop"],
  ["Inside", "#inside"],
  ["Risk calc", "#risk"],
  ["FAQ", "#faq"],
] as const;

export function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="overflow-hidden border-b border-db-line bg-db-deep" aria-label="Market ticker, illustrative">
      <div className="marquee flex w-max gap-10 py-2 font-mono text-[13px]">
        {items.map(([sym, ch], i) => (
          <span key={i} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-db-muted">{sym}</span>
            <span className={ch.startsWith("+") ? "text-db-bull" : "text-db-bear"}>{ch}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-db-sun" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}

const THEME_KEY = "db-theme";

function systemDark() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
}

export function applySavedTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
  } catch {
    /* no storage: follow the device */
  }
}

function ThemeToggle() {
  const current = () => (document.documentElement.dataset.theme as "light" | "dark" | undefined) ?? (systemDark() ? "dark" : "light");
  const [mode, setMode] = useState<"light" | "dark">(current);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onChange = () => setMode(current());
    mq?.addEventListener?.("change", onChange);
    return () => mq?.removeEventListener?.("change", onChange);
  }, []);
  const toggle = () => {
    const next = mode === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage blocked: the choice lasts for this visit */
    }
    setMode(next);
  };
  return (
    <button
      onClick={toggle}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-db-line transition hover:border-db-ember"
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

export function Nav() {
  const { state, dispatch } = useCart();
  const { count } = totals(state.lines);
  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-db-line/60 bg-db-mid/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center" aria-label="Ledgerline home">
          <img src={logo} alt="Ledgerline" className="only-dark h-6 w-auto sm:h-7" />
          <img src={logoInk} alt="Ledgerline" className="only-light h-6 w-auto sm:h-7" />
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV.map(([l, h]) => (
            <a key={h} href={h} className="text-sm font-medium text-db-muted transition hover:text-db-ink">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => dispatch({ type: "open", open: true })}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-db-line transition hover:border-db-sun"
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-db-sun px-1 font-mono text-[11px] font-medium text-db-onsun">
                {count}
              </span>
            )}
          </button>
          <Sheet>
            <SheetTrigger className="flex h-11 w-11 items-center justify-center rounded-full border border-db-line md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[82vw] max-w-xs border-db-line bg-db-raised">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="mt-10 flex flex-col gap-1" aria-label="Mobile">
                {NAV.map(([l, h]) => (
                  <a key={h} href={h} className="display rounded-xl px-3 py-3 text-3xl text-db-ink hover:bg-db-petal">
                    {l}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function LiveChip({ label, value, tone, className }: { label: string; value: string; tone: string; className: string }) {
  return (
    <div className={`floaty absolute rounded-2xl border border-db-line bg-db-raised/90 px-4 py-3 shadow-db backdrop-blur ${className}`}>
      <div className="label text-[10px] text-db-muted">{label}</div>
      <div className={`font-mono text-lg font-medium sm:text-xl ${tone}`}>{value}</div>
    </div>
  );
}

export function Hero() {
  const { dispatch } = useCart();
  const [r, setR] = useState(1.8);
  useEffect(() => {
    const id = setInterval(() => setR((v) => Math.round((1.6 + Math.random() * 0.5) * 10) / 10 || v), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="glow pointer-events-none absolute inset-0" />
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-[1.05fr_1fr] md:pb-24 md:pt-16">
        <div>
          <p className="label mb-5 inline-flex items-center gap-2 rounded-full border border-db-line bg-db-raised px-3 py-1.5 text-db-muted">
            <span className="h-2 w-2 rounded-full bg-db-bull" aria-hidden /> edition 01 now shipping
          </p>
          <h1 className="display text-[44px] leading-[0.98] sm:text-6xl lg:text-7xl">
            Keep the ledger. <span className="accent">Trade the line.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-db-muted">
            The physical trading journal for traders who start before the open. Log every entry, stop and mood by hand, and see which rules actually pay.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="btn-primary" onClick={() => dispatch({ type: "add", productId: "journal", colorway: "predawn" })}>
              Add the journal · {money(PRODUCTS[0].price)}
            </button>
            <a href="#inside" className="btn-ghost">
              See inside <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-db-line pt-6">
            {[
              ["240", "lay-flat pages"],
              ["365", "trade sessions"],
              ["30-day", "easy returns"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-mono text-2xl text-db-ink">{n}</dd>
                <dd className="text-sm text-db-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative mx-auto w-full max-w-[560px]">
          <img src={heroBook} alt="The Ledgerline trading journal in Forest green with the brass ledger-line mark and oxblood elastic" className="only-dark w-full rounded-[28px]" />
          <img src={heroBookLight} alt="The Ledgerline trading journal in Forest green on a cream desk" className="only-light w-full rounded-[28px]" />
          <LiveChip label="avg r / trade" value={`+${r.toFixed(1)}R`} tone="text-db-bull" className="left-2 top-4 sm:-left-6" />
          <LiveChip label="rules followed" value="21 / 22" tone="text-db-sun" className="bottom-6 right-2 sm:-right-4" />
          <LiveChip label="worst day, journaled" value="−0.9R" tone="text-db-bear" className="bottom-24 left-0 hidden sm:block sm:-left-10" />
          <p className="mt-3 text-center text-xs text-db-muted">Figures shown are a sample journal page, not results.</p>
        </div>
      </div>
    </section>
  );
}

export function Inside() {
  return (
    <section id="inside" className="border-t border-db-line bg-db-deep py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="label text-db-sun">inside the journal</p>
        <h2 className="display mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
          Every page is built like a <span className="accent">dashboard</span>.
        </h2>
        <div className="mt-10 overflow-hidden rounded-[28px] border border-db-line">
          <img src={spread} alt="Open journal: a trade log table on the left, a session recap chart and pre-market checklist on the right" className="w-full" loading="lazy" />
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-db-line bg-db-line sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.k} className="bg-db-raised p-6">
              <div className="font-mono text-sm text-db-sun">{f.k}</div>
              <h3 className="mt-2 text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-db-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RiskCalc() {
  const [account, setAccount] = useState(10000);
  const [riskPct, setRiskPct] = useState(1);
  const [stop, setStop] = useState(25);
  const [valuePer, setValuePer] = useState(1);
  const riskUsd = (account * riskPct) / 100;
  const size = useMemo(() => (stop > 0 && valuePer > 0 ? riskUsd / (stop * valuePer) : 0), [riskUsd, stop, valuePer]);
  const num = (v: string) => Math.max(0, Number(v.replace(/[^0-9.]/g, "")) || 0);
  return (
    <section id="risk" className="border-t border-db-line py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center">
        <div>
          <p className="label text-db-sun">printed inside the cover</p>
          <h2 className="display mt-3 text-4xl leading-tight sm:text-5xl">
            Size it <span className="accent">before</span> you click.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-db-muted">
            The journal's inside cover carries a risk table. Here's the live version so you can try the math now.
          </p>
          <p className="mt-6 text-sm text-db-muted">Not financial advice. Trading involves risk of loss.</p>
        </div>
        <div className="panel p-5 sm:p-7">
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Account size ($)", account, setAccount],
              ["Risk per trade (%)", riskPct, setRiskPct],
              ["Stop distance (pts / pips)", stop, setStop],
              ["$ value per point, 1 unit", valuePer, setValuePer],
            ].map(([label, v, set]) => (
              <label key={label as string} className="flex flex-col gap-2 text-sm text-db-muted">
                {label as string}
                <input
                  inputMode="decimal"
                  className="field font-mono"
                  value={String(v)}
                  onChange={(e) => (set as (n: number) => void)(num(e.target.value))}
                />
              </label>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-db-line bg-db-line">
            <div className="bg-db-mid p-4">
              <div className="label text-[10px] text-db-muted">max loss</div>
              <div className="font-mono text-2xl text-db-bear">−{money(riskUsd)}</div>
            </div>
            <div className="bg-db-mid p-4">
              <div className="label text-[10px] text-db-muted">position size</div>
              <div className="font-mono text-2xl text-db-bull">{size.toFixed(2)} units</div>
            </div>
            <div className="col-span-2 bg-db-mid p-4">
              <div className="label text-[10px] text-db-muted">at 2:1, a winner pays</div>
              <div className="font-mono text-2xl text-db-ink">+{money(riskUsd * 2)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p }: { p: (typeof PRODUCTS)[number] }) {
  const { dispatch } = useCart();
  const [color, setColor] = useState(COLORWAYS[0].id);
  const featured = !!p.badge;
  return (
    <article className={`relative flex flex-col rounded-[28px] border p-6 ${featured ? "border-db-sun bg-db-petal" : "border-db-line bg-db-raised"}`}>
      {p.badge && <span className="label absolute -top-3 left-6 rounded-full bg-db-sun px-3 py-1 text-db-onsun">{p.badge}</span>}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{p.name}</h3>
          <p className="mt-1 text-db-muted">{p.tagline}</p>
        </div>
        {p.id !== "refill" && <img src={color === "bone" ? coverBone : color === "ember" ? coverOx : cover} alt="" className="h-20 w-auto rounded-md shadow-db" />}
      </div>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="font-mono text-3xl">{money(p.price)}</span>
        {p.compareAt && <span className="font-mono text-db-muted line-through">{money(p.compareAt)}</span>}
      </div>
      <ul className="mt-5 flex flex-1 flex-col gap-2">
        {p.includes.map((i) => (
          <li key={i} className="flex gap-2 text-sm text-db-ink">
            <Check className="mt-0.5 h-4 w-4 flex-none text-db-bull" aria-hidden /> {i}
          </li>
        ))}
      </ul>
      {p.hasColorway && (
        <fieldset className="mt-6">
          <legend className="label mb-2 text-db-muted">colorway · {COLORWAYS.find((c) => c.id === color)?.name}</legend>
          <div className="flex gap-3">
            {COLORWAYS.map((c) => (
              <button
                key={c.id}
                onClick={() => setColor(c.id)}
                aria-label={c.name}
                aria-pressed={color === c.id}
                className="h-11 w-11 rounded-full border-2 transition"
                style={{ background: c.swatch, borderColor: "rgb(var(--db-line))", boxShadow: color === c.id ? "0 0 0 3px rgb(var(--db-mid)), 0 0 0 5px rgb(var(--db-ember))" : undefined }}
              />
            ))}
          </div>
        </fieldset>
      )}
      <button className={`${featured ? "btn-primary" : "btn-ghost"} mt-6 w-full`} onClick={() => dispatch({ type: "add", productId: p.id, colorway: p.hasColorway ? color : undefined })}>
        Add to cart
      </button>
    </article>
  );
}

export function Shop() {
  return (
    <section id="shop" className="border-t border-db-line bg-db-deep py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="label text-db-sun">shop</p>
        <h2 className="display mt-3 text-4xl leading-tight sm:text-5xl">
          Pick your <span className="accent">setup</span>.
        </h2>
        <p className="mt-4 text-db-muted">Free standard shipping over {money(CONFIG.freeShippingOver)}.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
        <div className="mt-12 overflow-hidden rounded-2xl border border-db-line">
          <table className="w-full text-left text-sm sm:text-base">
            <caption className="sr-only">Journal specifications</caption>
            <tbody>
              {SPECS.map(([k, v]) => (
                <tr key={k} className="border-b border-db-line last:border-0">
                  <th scope="row" className="w-1/3 bg-db-raised px-4 py-3 font-medium text-db-muted sm:px-6">{k}</th>
                  <td className="px-4 py-3 sm:px-6">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function Voice() {
  const lines = ["Every session starts before the open.", "Keep the ledger. Trade the line.", "Your edge lives in the margins."];
  return (
    <section className="border-t border-db-line py-16" aria-label="Brand lines">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-3">
        {lines.map((l) => (
          <p key={l} className="display border-l-2 border-db-ember pl-5 text-2xl leading-snug text-db-ink">
            {l}
          </p>
        ))}
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="border-t border-db-line bg-db-deep py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1fr_1.4fr]">
        <h2 className="display text-4xl leading-tight sm:text-5xl">
          Good <span className="accent">questions</span>.
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQ.map((f, i) => (
            <AccordionItem key={i} value={`q${i}`} className="border-db-line">
              <AccordionTrigger className="min-h-[48px] text-left text-lg hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-db-muted">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <footer className="border-t border-db-line pb-28 pt-16 md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2">
        <div>
          <img src={logo} alt="Ledgerline" className="only-dark h-10 w-auto" />
          <img src={logoInk} alt="Ledgerline" className="only-light h-10 w-auto" />
          <p className="mt-4 max-w-sm text-db-muted">Every session, accounted for.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (/^\S+@\S+\.\S+$/.test(email)) setDone(true);
          }}
          className="flex flex-col gap-3"
        >
          <label htmlFor="news" className="label text-db-muted">restock + new volume alerts</label>
          {done ? (
            <p className="text-db-bull">You're on the list.</p>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <input id="news" type="email" required className="field" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn-primary">Join</button>
            </div>
          )}
        </form>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-db-line px-4 pt-6 text-sm text-db-muted sm:px-6 md:flex-row md:justify-between">
        <span>© 2026 Ledgerline · {CONFIG.domain}</span>
        <span>Not financial advice. Trading involves risk of loss.</span>
      </div>
    </footer>
  );
}

export function MobileBuyBar() {
  const { state, dispatch } = useCart();
  const { count, subtotal } = totals(state.lines);
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-db-line bg-db-raised/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
      {count === 0 ? (
        <button className="btn-primary w-full" onClick={() => dispatch({ type: "add", productId: "journal", colorway: "predawn" })}>
          Add the journal · {money(PRODUCTS[0].price)}
        </button>
      ) : (
        <button className="btn-primary w-full" onClick={() => dispatch({ type: "open", open: true })}>
          View cart · {count} · {money(subtotal)}
        </button>
      )}
    </div>
  );
}
