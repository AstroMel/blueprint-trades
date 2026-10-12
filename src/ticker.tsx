import { useEffect, useState } from "react";
import { CONFIG } from "./data";

// Live quotes for the top bar. Crypto comes from Coinbase's public market data (no key, browser-friendly),
// with Binance as a fallback. US equities need a free Finnhub key in CONFIG.finnhubKey; without one they
// show only the market session, never a price. Nothing here is ever filled with made-up numbers.

type Quote = { price: number; changePct: number; at: number; source: string };
type Sym = { id: string; label: string; kind: "crypto" | "stock"; coinbase?: string; binance?: string };

const SYMBOLS: Sym[] = [
  { id: "BTC", label: "BTC", kind: "crypto", coinbase: "BTC-USD", binance: "BTCUSDT" },
  { id: "ETH", label: "ETH", kind: "crypto", coinbase: "ETH-USD", binance: "ETHUSDT" },
  { id: "SOL", label: "SOL", kind: "crypto", coinbase: "SOL-USD", binance: "SOLUSDT" },
  { id: "SPY", label: "SPY", kind: "stock" },
  { id: "QQQ", label: "QQQ", kind: "stock" },
  { id: "DIA", label: "DIA", kind: "stock" },
];

const POLL_MS = 15_000;

async function getJSON(url: string) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    if (!r.ok) throw new Error(String(r.status));
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

async function cryptoQuote(s: Sym): Promise<Quote> {
  try {
    const d = await getJSON(`https://api.exchange.coinbase.com/products/${s.coinbase}/stats`);
    const last = Number(d.last), open = Number(d.open);
    if (!last || !open) throw new Error("bad");
    return { price: last, changePct: ((last - open) / open) * 100, at: Date.now(), source: "Coinbase" };
  } catch {
    const d = await getJSON(`https://api.binance.com/api/v3/ticker/24hr?symbol=${s.binance}`);
    return { price: Number(d.lastPrice), changePct: Number(d.priceChangePercent), at: Date.now(), source: "Binance" };
  }
}

async function stockQuote(s: Sym): Promise<Quote> {
  const d = await getJSON(`https://finnhub.io/api/v1/quote?symbol=${s.id}&token=${CONFIG.finnhubKey}`);
  if (!d.c) throw new Error("no quote");
  return { price: d.c, changePct: d.dp, at: (d.t || 0) * 1000 || Date.now(), source: "Finnhub" };
}

// NYSE regular session in New York time. Exchange holidays are not modelled.
function nyseOpen(now = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(now)
      .map((x) => [x.type, x.value]),
  );
  if (p.weekday === "Sat" || p.weekday === "Sun") return false;
  const m = Number(p.hour) * 60 + Number(p.minute);
  return m >= 9 * 60 + 30 && m < 16 * 60;
}

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: n < 10 ? 4 : 2 });
const clock = (t: number) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export function LiveTicker() {
  const [quotes, setQuotes] = useState<Record<string, Quote | null>>({});
  const [lastOk, setLastOk] = useState<number | null>(null);
  const [tried, setTried] = useState(false);
  const [usOpen, setUsOpen] = useState(nyseOpen());

  useEffect(() => {
    let alive = true;
    const run = async () => {
      setUsOpen(nyseOpen());
      const list = SYMBOLS.filter((s) => s.kind === "crypto" || CONFIG.finnhubKey);
      const res = await Promise.allSettled(list.map((s) => (s.kind === "crypto" ? cryptoQuote(s) : stockQuote(s))));
      if (!alive) return;
      const next: Record<string, Quote | null> = {};
      let any = false;
      res.forEach((r, i) => {
        next[list[i].id] = r.status === "fulfilled" ? r.value : null;
        if (r.status === "fulfilled") any = true;
      });
      setQuotes((q) => ({ ...q, ...next }));
      if (any) setLastOk(Date.now());
      setTried(true);
    };
    run();
    const id = setInterval(run, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const offline = tried && lastOk === null;
  const stale = lastOk !== null && Date.now() - lastOk > POLL_MS * 4;
  const sources = [...new Set(Object.values(quotes).filter(Boolean).map((q) => q!.source))].join(" + ");

  return (
    <div className="border-b border-db-line bg-db-deep text-db-ink" role="region" aria-label="Market quotes">
      <div className="mx-auto flex max-w-6xl items-center gap-4 overflow-x-auto px-4 py-2 font-mono text-[12px] tabular-nums sm:px-6">
        <span className="flex flex-none items-center gap-2 uppercase tracking-[0.12em] text-db-muted">
          <span
            className={`h-2 w-2 ${offline ? "bg-db-muted" : stale ? "bg-db-sun" : "bg-db-sun animate-pulse"}`}
            aria-hidden
          />
          {!tried ? "connecting" : offline ? "feed offline · no prices shown" : stale ? `delayed · ${clock(lastOk!)}` : `live · ${clock(lastOk!)}`}
        </span>
        {SYMBOLS.map((s) => {
          const q = quotes[s.id];
          const status = s.kind === "crypto" ? "24/7" : usOpen ? "open" : "closed";
          const up = q ? q.changePct >= 0 : null;
          return (
            <span key={s.id} className="flex flex-none items-baseline gap-2 border-l border-db-line pl-4">
              <b className="font-bold">{s.label}</b>
              {q ? (
                <>
                  <span>{fmt(q.price)}</span>
                  <span className={up ? "text-db-bull" : "text-db-bear"}>
                    {up ? "▲" : "▼"} {Math.abs(q.changePct).toFixed(2)}%
                  </span>
                </>
              ) : (
                <span className="text-db-muted">{s.kind === "stock" && !CONFIG.finnhubKey ? "no feed" : "—"}</span>
              )}
              <span className={`text-[10px] uppercase tracking-[0.12em] ${status === "closed" ? "text-db-muted" : "text-db-ink/80"}`}>{status}</span>
            </span>
          );
        })}
        {sources && <span className="flex-none border-l border-db-line pl-4 text-[10px] uppercase tracking-[0.12em] text-db-muted">{sources} · crypto 24h change</span>}
      </div>
    </div>
  );
}
