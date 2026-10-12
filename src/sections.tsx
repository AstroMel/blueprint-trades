import { useEffect, useState } from "react";
import { Menu, ShoppingBag, Check, BookOpen, ArrowRight, ArrowUp, ArrowUpRight, Play, Sun, Moon } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CONFIG, COLORWAYS, FAQ, PRODUCTS, SPECS, SUPPORT, VIDEOS } from "./data";
import { productFront, productBack, productFlat, productPair, insidePageWebp } from "./images";
import { AppCard } from "./consult";
import { Book3D } from "./book3d";
import { coverFor } from "./covers";
import { LegalLinks } from "./legal";
import { money, useCart, totals } from "./cart";

const NAV = [
  ["Journal", "#shop"],
  ["Views", "#photos"],
  ["Inside", "#inside"],
  ["App", "#app"],
  ["Inner Room", "#consult"],
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
  const active = useActiveSection(NAV.map(([, h]) => h.slice(1)));
  const { count } = totals(state.lines);
  return (
    <header className="border-b border-db-line bg-db-mid/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center" aria-label="Blueprint Trades home">
          <Logo className="text-2xl sm:text-[28px]" />
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV.map(([l, h]) => (
            <a key={h} href={h} aria-current={active === h.slice(1) ? "true" : undefined} className={`label border-b-2 py-1 transition hover:text-db-ink ${active === h.slice(1) ? "border-db-sun text-db-ink" : "border-transparent text-db-muted"}`}>
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
            <SheetContent side="right" className="w-[82vw] max-w-xs border-db-line bg-db-raised/60 backdrop-blur-md">
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

const TRUST = [
  ["Free US shipping", `on orders over $${CONFIG.freeShippingOver}`],
  ["Secure checkout", "payments handled by Stripe"],
  ["Undated pages", "start any Monday"],
  ["Real paper", "A5, gold wire-o, opens flat"],
] as const;

export function TrustStrip() {
  return (
    <section aria-label="Why buy here" className="border-y border-db-line bg-db-raised/50 backdrop-blur-md">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 sm:px-6 md:grid-cols-4">
        {TRUST.map(([t, d]) => (
          <li key={t} className="flex flex-col gap-1 py-5 pr-4">
            <span className="flex items-center gap-2 font-semibold"><Check className="h-4 w-4 flex-none text-db-ember" aria-hidden />{t}</span>
            <span className="pl-6 text-sm text-db-muted">{d}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ScrollAids() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? h.scrollTop / max : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-db-sun" style={{ transform: `scaleX(${p})` }} aria-hidden />
      <a
        href="#top"
        aria-label="Back to top"
        className={`fixed bottom-24 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-sm border border-db-line bg-db-raised/70 text-db-ink shadow-db backdrop-blur-md transition hover:border-db-sun md:bottom-6 ${p > 0.12 ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <ArrowUp className="h-5 w-5" />
      </a>
    </>
  );
}

const VIEWS = [
  { src: productFront, label: "Front", note: "Gold title, bull vs bear", alt: "The journal's front cover at an angle: TRADING JOURNAL in gold above a bull and a bear, gold wire-o binding" },
  { src: productBack, label: "Back", note: "The Blueprint letter", alt: "The journal's back cover at an angle, printed with the Blueprint letter" },
  { src: productFlat, label: "Flat", note: "A5 · 148 × 210 mm", alt: "The journal's front cover seen straight on with its gold wire-o binding" },
] as const;

export function Photos() {
  return (
    <section id="photos" className="border-t border-db-line py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1fr_1.6fr] md:items-end">
          <div className="min-w-0">
            <p className="label text-db-ember">the journal</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl">Every angle.</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-db-muted">A5. Gold wire-o. Opens flat.</p>
          </div>
          <img src={productPair} alt="The journal's back cover and front cover standing side by side" className="w-full drop-shadow-[0_30px_40px_rgb(0_0_0/0.25)]" loading="lazy" />
        </div>
        <ul className="mt-14 grid grid-cols-3 gap-3 sm:gap-6">
          {VIEWS.map((v) => (
            <li key={v.label} className="flex min-w-0 flex-col items-center gap-3 sm:gap-4">
              <div className="flex aspect-[4/5] w-full max-w-[320px] items-end justify-center">
                <img src={v.src} alt={v.alt} className={`w-auto object-contain transition duration-500 hover:-translate-y-1 ${v.label === "Flat" ? "max-h-[86%]" : "max-h-full"}`} loading="lazy" />
              </div>
              <div className="w-full max-w-[320px] border-t border-db-line pt-3 text-center">
                <p className="label text-[10px] text-db-ink sm:text-xs">{v.label}</p>
                <p className="mt-1 hidden text-sm text-db-muted sm:block">{v.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -right-[20%] -top-[10%] h-[70vh] w-[70vh] rounded-full bg-db-sun/[0.07] blur-3xl" />
      <div className="absolute -left-[15%] top-[40%] h-[60vh] w-[60vh] rounded-full bg-db-bull/[0.06] blur-3xl" />
    </div>
  );
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids.join()]);
  return active;
}

export function Hero() {
  const { dispatch } = useCart();
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="gridpaper pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-[1fr_1.05fr] md:pb-24 md:pt-16 max-md:gap-6 max-md:pt-4">
        <div>
          <p className="label mb-6 inline-flex items-center gap-2 border border-db-ink bg-db-raised px-3 py-1.5 text-db-ink">
            <Play className="h-3 w-3 fill-db-ember text-db-ember" aria-hidden /> from the Blueprint Trades channel
          </p>
          <h1 className="display text-[64px] sm:text-[88px] lg:text-[104px]">
            <span className="outline-text">Master yourself.</span> <span className="accent">Master the market.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-db-muted">
            The paper trading journal for traders done following influencers. One page per trade. Scored out of 30.
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
              ["Record", "every trade"],
              ["Score", "six categories"],
              ["Reflect", "four questions"],
            ].map(([n, l]) => (
              <div key={n}>
                <dt className="display text-3xl text-db-ink">{n}</dt>
                <dd className="text-sm text-db-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative order-first mx-auto w-full max-w-[300px] sm:max-w-[420px] md:order-none md:max-w-[600px]">
          <Book3D />
        </div>
      </div>
    </section>
  );
}

const LETTER = [
  "I won\u2019t promise you profitability. No one can. But I will promise you this: if you commit to this journal, you will become a better trader.",
  "And that changes everything.",
  "Real success in this industry comes down to one thing: your ability to execute your own ideas with confidence and discipline. That\u2019s freedom. That\u2019s power.",
  "Respect the journey, and always remember this is a marathon, not a get-rich-quick shortcut. Every step you take and every lesson you learn moves you forward.",
  "Repetition and time in the market: that\u2019s where growth lives. Monitoring your habits and adjusting accordingly: that\u2019s where mastery and real strategies are built.",
  "Stay patient. Stay disciplined. Keep showing up.",
  "Do that, and you won\u2019t just improve. You\u2019ll transform.",
];

export function Letter() {
  return (
    <section id="letter" className="border-t border-db-line bg-db-ink/85 py-20 text-db-mid backdrop-blur-md">
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
        <img src={productBack} alt="The back cover of the printed journal with this letter" className="mx-auto w-full max-w-sm drop-shadow-[0_30px_40px_rgb(0_0_0/0.3)]" loading="lazy" />
      </div>
    </section>
  );
}

const PAGE_PARTS = [
  ["Trade details", "Ticker, catalyst, call or put, timeframe, times, entry, exit, P/L."],
  ["Scoring system", "Six categories, 1 to 5 each. Total out of 30."],
  ["Psychology check", "Four questions. Plan, emotions, risk, next time."],
  ["Chart", "Sketch the candles at entry and exit."],
] as const;

const SCORE_ROWS = ["Setup quality", "Entry timing", "Exit timing", "Risk management", "Discipline", "Emotional control"] as const;

// The page's own grading key: 26–30 A, 20–25 B, 14–19 C, below 14 needs improvement.
function grade(t: number) {
  return t >= 26 ? ["A", "Excellent"] : t >= 20 ? ["B", "Good"] : t >= 14 ? ["C", "Average"] : ["–", "Needs improvement"];
}

function Scorer() {
  const [s, setS] = useState<number[]>([4, 3, 3, 4, 5, 3]);
  const total = s.reduce((a, b) => a + b, 0);
  const [g, word] = grade(total);
  return (
    <div className="panel p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <p className="label text-db-muted">try the scoring</p>
        <p className="font-mono text-sm text-db-muted">tap 1–5</p>
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {SCORE_ROWS.map((r, i) => (
          <li key={r} className="flex items-center justify-between gap-3">
            <span className="min-w-0 text-sm">{r}</span>
            <span className="flex flex-none gap-1" role="radiogroup" aria-label={r}>
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  role="radio"
                  aria-checked={s[i] === v}
                  aria-label={`${r} ${v}`}
                  onClick={() => setS((xs) => xs.map((x, j) => (j === i ? v : x)))}
                  className={`h-9 w-9 rounded-sm border font-mono text-sm transition ${s[i] === v ? "border-db-sun bg-db-sun text-db-onsun" : v < s[i] ? "border-db-line bg-db-petal text-db-ink" : "border-db-line text-db-muted hover:border-db-sun"}`}
                >
                  {v}
                </button>
              ))}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-end justify-between border-t border-db-line pt-4" aria-live="polite">
        <div>
          <p className="label text-[10px] text-db-muted">total score</p>
          <p className="font-mono text-3xl">{total}<span className="text-lg text-db-muted"> / 30</span></p>
        </div>
        <div className="text-right">
          <p className="display text-5xl text-db-ember">{g}</p>
          <p className="text-sm text-db-muted">{word}</p>
        </div>
      </div>
    </div>
  );
}

export function Inside() {
  return (
    <section id="inside" className="border-t border-db-line py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="label text-db-ember">inside the journal</p>
        <h2 className="display mt-3 max-w-3xl text-5xl sm:text-6xl">
          One page per trade. <span className="accent">Scored out of 30.</span>
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1fr] md:items-start">
          <figure className="relative mx-auto w-full max-w-md">
            <img src={insidePageWebp} alt="A real Trade Analysis page from the journal: trade details, a six-category scoring table, a psychology and discipline check, and a chart box" className="w-full rounded-sm border border-db-line shadow-db" loading="lazy" />
            <figcaption className="label mt-3 text-[10px] text-db-muted">the trade analysis page, as printed</figcaption>
          </figure>
          <div className="flex min-w-0 flex-col gap-8">
            <ol className="flex flex-col">
              {PAGE_PARTS.map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-db-line py-4">
                  <span className="font-mono text-sm text-db-ember">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="font-semibold">{t}</span>
                    <span className="block text-sm text-db-muted">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
            <Scorer />
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
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-db-muted">The same lessons, on paper, at your desk.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {VIDEOS.map((v) => (
            <a key={v.title} href={CONFIG.channelUrl} target="_blank" rel="noreferrer" className="group flex flex-col rounded-sm border-2 border-db-ink bg-db-raised/60 backdrop-blur-md p-6 transition hover:-translate-y-0.5 hover:shadow-db">
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

function ProductCard({ p }: { p: (typeof PRODUCTS)[number] }) {
  const { dispatch } = useCart();
  const [color, setColor] = useState(DEFAULT_COVER);
  const featured = !!p.badge;
  const cw = COLORWAYS.find((c) => c.id === color);
  return (
    <article className={`relative flex flex-col rounded-sm border-2 p-6 ${featured ? "border-db-ember bg-db-raised/70 backdrop-blur-md" : "border-db-line bg-db-raised/60 backdrop-blur-md"}`}>
      {p.badge && <span className="label absolute -top-3 left-6 bg-db-ember px-3 py-1 text-db-onsun">{p.badge}</span>}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{p.name}</h3>
          <p className="mt-1 text-db-muted">{p.tagline}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button className="group relative flex-none" aria-label={`Open the ${p.name} journal in 3D`}>
              <img src={coverFor(color)} alt="" className="h-28 w-auto transition group-hover:-translate-y-1 group-hover:drop-shadow-[0_8px_16px_rgb(var(--db-sun)/0.35)]" />
              <span className="label absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap bg-db-sun px-2 py-0.5 text-[9px] text-db-onsun">
                <BookOpen className="h-3 w-3" aria-hidden /> open
              </span>
            </button>
          </DialogTrigger>
          <DialogContent className="max-h-[94dvh] w-[calc(100vw-24px)] max-w-xl overflow-y-auto rounded-sm border-db-line bg-db-mid gridpaper p-5 sm:p-7">
            <p className="label text-[10px] text-db-ember">model · {p.name}</p>
            <DialogTitle className="display text-3xl text-db-ink">Look <span className="accent">inside</span>.</DialogTitle>
            <DialogDescription className="text-sm text-db-muted">Tap the journal to open or close it. Drag to turn.</DialogDescription>
            <Book3D initial="open" compact />
          </DialogContent>
        </Dialog>
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
          One journal. <span className="accent">Paper or app.</span>
        </h2>
        <p className="mt-4 text-db-muted">Free standard shipping over {money(CONFIG.freeShippingOver)}.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
          <AppCard />
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
  const groups = [...new Set(FAQ.map((f) => f.group))];
  const email = CONFIG.legal.email;
  const real = !/^\[.*\]$/.test(email.trim());
  return (
    <section id="faq" className="border-t border-db-line py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1fr_1.4fr]">
        <div className="min-w-0">
          <p className="label text-db-ember">questions and support</p>
          <h2 className="display mt-3 text-5xl sm:text-6xl">
            Straight <span className="accent">answers</span>.
          </h2>
          <div id="support" className="panel mt-8 p-5 sm:p-6">
            <h3 className="text-lg font-semibold">Contact support</h3>
            <p className="mt-1 text-sm text-db-muted">
              Email{" "}
              {real ? (
                <a href={`mailto:${email}`} className="font-mono text-db-ember underline underline-offset-2">{email}</a>
              ) : (
                <span className="font-mono text-db-ink">{email}</span>
              )}{" "}
              and start the subject with the topic below. We reply within {SUPPORT.replyDays} business days.
            </p>
            <ul className="mt-5 flex flex-col gap-4">
              {SUPPORT.topics.map((t) => (
                <li key={t.subject} className="flex gap-3">
                  <span className="label mt-0.5 h-fit flex-none border border-db-line px-2 py-1 text-[10px] text-db-ink">{t.subject}</span>
                  <span className="min-w-0 text-sm">
                    <b className="font-semibold">{t.title}.</b> <span className="text-db-muted">{t.body}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-db-muted">Never email card numbers or passwords. We will never ask for them.</p>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-8">
          {groups.map((g) => (
            <div key={g}>
              <h3 className="label text-db-muted">{g}</h3>
              <Accordion type="single" collapsible className="mt-2 w-full">
                {FAQ.filter((f) => f.group === g).map((f) => (
                  <AccordionItem key={f.q} value={f.q} className="border-db-line">
                    <AccordionTrigger className="min-h-[48px] text-left text-lg hover:no-underline">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed text-db-muted">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
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
