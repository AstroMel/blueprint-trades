import { useEffect, useMemo, useState } from "react";
import { Menu, ShoppingBag, Check, ArrowRight, ArrowUpRight, Play, Sun, Moon } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CONFIG, COLORWAYS, FAQ, FEATURES, PRODUCTS, REVIEW, SPECS, VIDEOS } from "./data";
import { photoBox, photoHand, coverFront, coverBack } from "./images";
import { coverFor } from "./covers";
import { LegalLinks } from "./legal";
import { money, useCart, totals } from "./cart";

const NAV = [
  ["Journal", "#shop"],
  ["Inside", "#inside"],
  ["Channel", "#channel"],
  ["FAQ", "#faq"],
] as const;

const DEFAULT_COVER = COLORWAYS[0].id;

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
      className="flex h-11 w-11 items-center justify-center rounded-sm border border-db-line transition hover:border-db-ember"
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

function Logo({ className }: { className: string }) {
  return (
    <>
      <span className={`display inline-flex items-center whitespace-nowrap leading-none ${className}`} aria-label="Blueprint Trades">
        Blueprint<span className="accent ml-[0.25em]">Trades</span>
      </span>
    </>
  );
}

export function Nav() {
  const { state, dispatch } = useCart();
  const { count } = totals(state.lines);
  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-db-line bg-db-mid/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center" aria-label="Blueprint Trades home">
          <Logo className="text-2xl sm:text-[28px]" />
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV.map(([l, h]) => (
            <a key={h} href={h} className="label text-db-muted transition hover:text-db-ink">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => dispatch({ type: "open", open: true })}
            className="relative flex h-11 w-11 items-center justify-center rounded-sm border border-db-line transition hover:border-db-sun"
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-sm bg-db-sun px-1 font-mono text-[11px] font-medium text-db-onsun">
                {count}
              </span>
            )}
          </button>
          <Sheet>
            <SheetTrigger className="flex h-11 w-11 items-center justify-center rounded-sm border border-db-line md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[82vw] max-w-xs border-db-line bg-db-raised">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="mt-10 flex flex-col gap-1" aria-label="Mobile">
                {NAV.map(([l, h]) => (
                  <a key={h} href={h} className="display rounded-sm px-3 py-3 text-4xl text-db-ink hover:bg-db-petal">
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

const PHOTOS = [
  { src: photoHand, alt: "The printed Bull and Bear trading journal held in a hand, with more copies stacked behind it" },
  { src: photoBox, alt: "A printed copy of the journal resting on its shipping box" },
  { src: coverFront, alt: "Front cover: TRADING JOURNAL in gold above a bull and a bear, with Master yourself, to master the market" },
  { src: coverBack, alt: "Back cover with the Blueprint letter" },
];

function Gallery() {
  const [i, setI] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-sm border border-db-line bg-db-deep">
        <img src={PHOTOS[i].src} alt={PHOTOS[i].alt} className="aspect-[4/5] w-full object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-3" role="group" aria-label="Journal photos">
        {PHOTOS.map((p, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            aria-pressed={i === k}
            aria-label={`Show photo ${k + 1}: ${p.alt}`}
            className={`overflow-hidden rounded-sm border-2 transition ${i === k ? "border-db-sun" : "border-db-line hover:border-db-muted"}`}
          >
            <img src={p.src} alt="" className="aspect-square w-full object-cover" />
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-db-muted">Photos of the printed journal.</p>
    </div>
  );
}

const SPREAD = [
  {
    title: "The Plan",
    when: "before the open",
    rows: [
      ["1", "Key levels used", "Higher-timeframe level, zone, prior day low"],
      ["2", "The trade I want", "Entry, stop, target, size, R"],
      ["3", "Market-maker risk check", "Four questions before you click"],
      ["4", "Emotion before", "Calm 1 to wired 5"],
    ],
  },
  {
    title: "The Reality",
    when: "after the close",
    rows: [
      ["5", "Redraw the move and the result", "R, P/L, time held"],
      ["6", "Plan adherence", "Rules followed, out of four"],
      ["7", "Emotion after", "Calm 1 to wired 5"],
      ["8", "Lesson learned", "One line, every trade"],
      ["9", "What would I tell my past self?", "The note you read next week"],
    ],
  },
] as const;

export function Hero() {
  const { dispatch } = useCart();
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="gridpaper pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-[1fr_1.05fr] md:pb-24 md:pt-16">
        <div>
          <p className="label mb-6 inline-flex items-center gap-2 border border-db-ink bg-db-raised px-3 py-1.5 text-db-ink">
            <Play className="h-3 w-3 fill-db-ember text-db-ember" aria-hidden /> from the Blueprint Trades channel
          </p>
          <h1 className="display text-[64px] sm:text-[88px] lg:text-[104px]">
            Master yourself. <span className="accent">Master the market.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-db-muted">
            The paper trading journal for traders who are done following influencers. Write the plan before the open, take the trade, then write down what really happened.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="btn-primary" onClick={() => dispatch({ type: "add", productId: "journal", colorway: DEFAULT_COVER })}>
              Add the journal · {money(PRODUCTS[0].price)}
            </button>
            <a href="#inside" className="btn-ghost">
              See inside <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t-2 border-db-ink pt-5">
            {[
              ["Plan", "before the open"],
              ["Trade", "at your level"],
              ["Reality", "after the close"],
            ].map(([n, l]) => (
              <div key={n}>
                <dt className="display text-3xl text-db-ink">{n}</dt>
                <dd className="text-sm text-db-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative mx-auto w-full max-w-[600px]">
          <Gallery />
        </div>
      </div>
    </section>
  );
}

const LETTER = [
  "I won't promise you profitability, no one can. But I will promise you this: if you commit to this journal, you will become a better trader.",
  "And that changes everything.",
  "Real success in this industry comes down to one thing, your ability to execute your own ideas with confidence and discipline. That's freedom. That's power.",
  "Respect the journey and always remember this is a marathon, not some rich quick shortcut. Every step you take, every lesson you learn, moves you forward.",
  "Repetition and time in the market, that's where growth lives. Monitoring your habits and adjusting accordingly, that's where mastery and real strategies are built.",
  "Stay patient. Stay disciplined. Keep showing up.",
  "Do that, and you won't just improve, you'll transform.",
];

export function Letter() {
  return (
    <section id="letter" className="border-t border-db-line bg-db-ink py-20 text-db-mid">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-[1.3fr_1fr] md:items-start">
        <div className="min-w-0">
          <p className="label text-db-ember">printed on the back cover</p>
          <h2 className="display mt-3 text-5xl sm:text-6xl">No promises. Just the work.</h2>
          <div className="mt-8 flex max-w-[62ch] flex-col gap-4 text-lg leading-relaxed text-db-mid/85">
            {LETTER.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <p className="hand text-3xl text-db-ember">- Blueprint</p>
          </div>
        </div>
        <img src={coverBack} alt="The back cover of the printed journal with this letter" className="mx-auto w-full max-w-sm rounded-sm shadow-db" loading="lazy" />
      </div>
    </section>
  );
}

export function Inside() {
  return (
    <section id="inside" className="border-t border-db-line py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="label text-db-ember">inside the journal</p>
        <h2 className="display mt-3 max-w-3xl text-5xl sm:text-6xl">
          One spread per trade. <span className="accent">The plan, then the reality.</span>
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-db-muted">
          The left page is written while you're calm. The right page is written after the close, whatever happened. Most P&L trackers stop at the number; this one asks how you got there.
        </p>
        <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-db-line bg-db-line md:grid-cols-2">
          {SPREAD.map((pg) => (
            <div key={pg.title} className="bg-db-raised p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="display text-4xl">{pg.title}</h3>
                <span className="label text-db-ember">{pg.when}</span>
              </div>
              <ol className="mt-6 flex flex-col">
                {pg.rows.map(([n, t, d]) => (
                  <li key={n} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-db-line py-3">
                    <span className="font-mono text-sm text-db-muted">{n}</span>
                    <span>
                      <span className="font-semibold">{t}</span>
                      <span className="block text-sm text-db-muted">{d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-db-line bg-db-line sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.k} className="bg-db-raised p-6">
              <div className="label text-db-ember">{f.k}</div>
              <h3 className="mt-2 text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-db-muted">{f.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-[1fr_1.3fr] md:items-center">
          <div>
            <p className="label text-db-ember">every month</p>
            <h3 className="display mt-2 text-4xl">Score the process, not just the P&L.</h3>
            <p className="mt-4 max-w-md text-db-muted">The monthly review sets your rule adherence and emotion scores beside your results, so you can see which version of you makes money.</p>
          </div>
          <div className="overflow-x-auto rounded-sm border border-db-line">
            <table className="w-full min-w-[420px] text-left text-sm sm:text-base">
              <caption className="sr-only">Sample monthly review</caption>
              <tbody>
                {REVIEW.map(([k, sub, v]) => (
                  <tr key={k} className="border-b border-db-line last:border-0">
                    <th scope="row" className="bg-db-raised px-4 py-3 font-medium sm:px-5">
                      {k}
                      <span className="block text-xs font-normal text-db-muted">{sub}</span>
                    </th>
                    <td className={`px-4 py-3 text-right font-mono text-lg tabular-nums sm:px-5 ${v.startsWith("−") ? "text-db-bear" : v.startsWith("+") ? "text-db-bull" : "text-db-ink"}`}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-db-line px-4 py-2 text-xs text-db-muted sm:px-5">Sample page, not results.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Channel() {
  return (
    <section id="channel" className="gridpaper border-t border-db-line py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="label text-db-ember">watch, then write</p>
        <h2 className="display mt-3 max-w-3xl text-5xl sm:text-6xl">Every page comes from a video.</h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-db-muted">
          Blueprint Trades is an environment to speak about the reality of trading. The journal is the same lessons, on paper, at your desk.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {VIDEOS.map((v) => (
            <a key={v.title} href={CONFIG.channelUrl} target="_blank" rel="noreferrer" className="group flex flex-col rounded-sm border-2 border-db-ink bg-db-raised p-6 transition hover:-translate-y-0.5 hover:shadow-db">
              <span className="label inline-flex items-center gap-2 text-db-ember">
                <Play className="h-3 w-3 fill-current" aria-hidden /> {v.tag}
              </span>
              <h3 className="mt-3 flex-1 text-lg font-semibold leading-snug">{v.title}</h3>
              <p className="mt-5 border-t border-db-line pt-3 text-sm text-db-muted">
                In the journal: <span className="hand text-lg text-db-ink">{v.page}</span>
              </p>
            </a>
          ))}
        </div>
        <a href={CONFIG.channelUrl} target="_blank" rel="noreferrer" className="btn-ghost mt-8">
          Watch on YouTube <ArrowUpRight className="h-4 w-4" />
        </a>
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
    <section id="risk" className="border-t border-db-line bg-db-deep py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center">
        <div>
          <p className="label text-db-ember">printed inside the cover</p>
          <h2 className="display mt-3 text-5xl sm:text-6xl">
            Size it <span className="accent">before</span> you click.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-db-muted">
            The inside cover carries a risk table, so "The trade I want" always has a size that fits your account. Try the math here.
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
                <input inputMode="decimal" className="field font-mono" value={String(v)} onChange={(e) => (set as (n: number) => void)(num(e.target.value))} />
              </label>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-db-line bg-db-line">
            <div className="bg-db-mid p-4">
              <div className="label text-[10px] text-db-muted">max loss</div>
              <div className="font-mono text-2xl text-db-bear">−{money(riskUsd)}</div>
            </div>
            <div className="bg-db-mid p-4">
              <div className="label text-[10px] text-db-muted">position size</div>
              <div className="font-mono text-2xl text-db-ink">{size.toFixed(2)} units</div>
            </div>
            <div className="col-span-2 bg-db-mid p-4">
              <div className="label text-[10px] text-db-muted">at 2R, a winner pays</div>
              <div className="font-mono text-2xl text-db-bull">+{money(riskUsd * 2)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p }: { p: (typeof PRODUCTS)[number] }) {
  const { dispatch } = useCart();
  const [color, setColor] = useState(DEFAULT_COVER);
  const featured = !!p.badge;
  const cw = COLORWAYS.find((c) => c.id === color);
  return (
    <article className={`relative flex flex-col rounded-sm border-2 p-6 ${featured ? "border-db-ember bg-db-raised" : "border-db-line bg-db-raised"}`}>
      {p.badge && <span className="label absolute -top-3 left-6 bg-db-ember px-3 py-1 text-db-onsun">{p.badge}</span>}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{p.name}</h3>
          <p className="mt-1 text-db-muted">{p.tagline}</p>
        </div>
        {p.id !== "refill" && <img src={coverFor(color)} alt={`${cw?.name} cover`} className="h-24 w-auto rounded-sm shadow-db" />}
      </div>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="font-mono text-3xl">{money(p.price)}</span>
        {p.compareAt && <span className="font-mono text-db-muted line-through">{money(p.compareAt)}</span>}
      </div>
      <ul className="mt-5 flex flex-1 flex-col gap-2">
        {p.includes.map((i) => (
          <li key={i} className="flex gap-2 text-sm text-db-ink">
            <Check className="mt-0.5 h-4 w-4 flex-none text-db-ember" aria-hidden /> {i}
          </li>
        ))}
      </ul>
      {p.hasColorway && COLORWAYS.length > 1 && (
        <fieldset className="mt-6">
          <legend className="label mb-2 text-db-muted">
            cover · {cw?.name}
          </legend>
          <div className="flex gap-3">
            {COLORWAYS.map((c) => (
              <button
                key={c.id}
                onClick={() => setColor(c.id)}
                aria-label={`${c.name}, ${c.note}`}
                aria-pressed={color === c.id}
                className="h-11 w-11 rounded-sm border-2 transition"
                style={{ background: c.swatch, borderColor: "rgb(var(--db-line))", boxShadow: color === c.id ? "0 0 0 3px rgb(var(--db-raised)), 0 0 0 5px rgb(var(--db-ember))" : undefined }}
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
    <section id="shop" className="border-t border-db-line py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="label text-db-ember">shop</p>
        <h2 className="display mt-3 text-5xl sm:text-6xl">
          One journal. <span className="accent">Three ways in.</span>
        </h2>
        <p className="mt-4 text-db-muted">Free standard shipping over {money(CONFIG.freeShippingOver)}.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
        <div className="mt-12 overflow-hidden rounded-sm border border-db-line">
          <table className="w-full text-left text-sm sm:text-base">
            <caption className="sr-only">Journal specifications</caption>
            <tbody>
              {SPECS.map(([k, v]) => (
                <tr key={k} className="border-b border-db-line last:border-0">
                  <th scope="row" className="label w-1/3 bg-db-raised px-4 py-3 text-db-muted sm:px-6">{k}</th>
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
  const lines = ["Stop relying on influencers.", "Good trade, bad result.", "Red days included."];
  return (
    <section className="border-t border-db-line bg-db-deep py-16" aria-label="Brand lines">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-3">
        {lines.map((l) => (
          <p key={l} className="display border-l-4 border-db-ember pl-5 text-3xl text-db-ink">
            {l}
          </p>
        ))}
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="border-t border-db-line py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1fr_1.4fr]">
        <h2 className="display text-5xl sm:text-6xl">
          Straight <span className="accent">answers</span>.
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
    <footer className="border-t-2 border-db-ink pb-28 pt-16 md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2">
        <div>
          <Logo className="text-4xl" />
          <p className="mt-4 max-w-sm text-db-muted">An environment to speak about the reality of trading.</p>
          <a href={CONFIG.channelUrl} target="_blank" rel="noreferrer" className="label mt-4 inline-flex items-center gap-1 text-db-ember hover:underline">
            @Blueprint_Trades on YouTube <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (/^\S+@\S+\.\S+$/.test(email)) setDone(true);
          }}
          className="flex flex-col gap-3"
        >
          <label htmlFor="news" className="label text-db-muted">restocks + new volumes</label>
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
      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-db-line px-4 pt-6 text-sm text-db-muted sm:px-6 md:flex-row md:flex-wrap md:justify-between">
        <span>© 2026 Blueprint Trades · {CONFIG.domain}</span>
        <LegalLinks />
        <span>Educational only. Not financial advice. Trading involves risk of loss.</span>
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
        <button className="btn-primary w-full" onClick={() => dispatch({ type: "add", productId: "journal", colorway: DEFAULT_COVER })}>
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
