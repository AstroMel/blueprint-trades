import { useId, useState } from "react";
import { money } from "./cart";

// Position-size calculator. Everything is plain arithmetic on what the visitor types; nothing here is advice or a quote.
// Point values are the standard contract multipliers. "Per unit" is what 1 point (or pip, or $1 move) is worth for 1 unit.
const MARKETS = [
  { id: "es", label: "ES · E-mini S&P 500", per: 50, unit: "contract", step: "point", whole: true },
  { id: "mes", label: "MES · Micro E-mini S&P", per: 5, unit: "contract", step: "point", whole: true },
  { id: "nq", label: "NQ · E-mini Nasdaq-100", per: 20, unit: "contract", step: "point", whole: true },
  { id: "mnq", label: "MNQ · Micro E-mini Nasdaq", per: 2, unit: "contract", step: "point", whole: true },
  { id: "stock", label: "Stocks / ETFs", per: 1, unit: "share", step: "$1 move", whole: true },
  { id: "fx", label: "Forex · USD-quoted pair (EUR/USD, GBP/USD)", per: 10, unit: "standard lot", step: "pip", whole: false, pip: 0.0001 },
  { id: "crypto", label: "Crypto · spot (BTC, ETH, SOL)", per: 1, unit: "coin", step: "$1 move", whole: false },
  { id: "custom", label: "Custom", per: 1, unit: "unit", step: "point", whole: false },
] as const;
type MarketId = (typeof MARKETS)[number]["id"];

// Keep the raw text so people can type "0.", "1.0" or clear a field without it snapping back.
const parse = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

function Field({ label, hint, value, onChange, suffix }: { label: string; hint?: string; value: string; onChange: (v: string) => void; suffix?: string }) {
  const id = useId();
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={id} className="text-sm text-db-muted">{label}</label>
      <div className="relative">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          className="field font-mono"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.,]/g, ""))}
          aria-describedby={hint ? id + "-h" : undefined}
        />
        {suffix && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-sm text-db-muted">{suffix}</span>}
      </div>
      {hint && <span id={id + "-h"} className="text-xs text-db-muted">{hint}</span>}
    </div>
  );
}

export function RiskCalc() {
  const [market, setMarket] = useState<MarketId>("mes");
  const [side, setSide] = useState<"long" | "short">("long");
  const [account, setAccount] = useState("10000");
  const [riskPct, setRiskPct] = useState("1");
  const [entry, setEntry] = useState("5120");
  const [stop, setStop] = useState("5110");
  const [target, setTarget] = useState("5140");
  const [customPer, setCustomPer] = useState("1");

  const m = MARKETS.find((x) => x.id === market)!;
  const per = market === "custom" ? parse(customPer) : m.per;
  const acct = parse(account), pct = parse(riskPct), e = parse(entry), s = parse(stop), t = parse(target);

  // Distance in the market's own steps (pips for forex).
  const pip = "pip" in m ? m.pip : 1;
  const stopSteps = Math.abs(e - s) / pip;
  const budget = (acct * pct) / 100;
  const riskPerUnit = stopSteps * per;

  const problems: string[] = [];
  if (!(acct > 0)) problems.push("Enter your account size.");
  if (!(pct > 0)) problems.push("Enter how much of the account you'll risk.");
  if (!(e > 0) || !(s > 0)) problems.push("Enter an entry and a stop price.");
  else if (e === s) problems.push("Entry and stop can't be the same price.");
  else if (side === "long" && s > e) problems.push("For a long, the stop goes below the entry.");
  else if (side === "short" && s < e) problems.push("For a short, the stop goes above the entry.");
  if (market === "custom" && !(per > 0)) problems.push("Enter what one point is worth for one unit.");
  const ok = problems.length === 0;

  const exact = ok ? budget / riskPerUnit : 0;
  // Round down (with a hair of tolerance for floating-point, so 0.5 doesn't become 0.49).
  const size = m.whole ? Math.floor(exact + 1e-9) : Math.floor(exact * 100 + 1e-9) / 100;
  const actualRisk = size * riskPerUnit;
  const targetValid = ok && t > 0 && (side === "long" ? t > e : t < e);
  const rr = targetValid ? Math.abs(t - e) / Math.abs(e - s) : null;
  const reward = rr != null ? actualRisk * rr : null;

  const fmtSize = m.whole ? String(size) : size.toFixed(2);
  const unitWord = (n: number) => (n === 1 ? m.unit : m.unit + "s");

  return (
    <section id="risk" className="border-t border-db-line bg-db-deep py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div className="min-w-0">
          <p className="label text-db-ember">position-size calculator</p>
          <h2 className="display mt-3 text-5xl sm:text-6xl">
            Size it <span className="accent">before</span> you click.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-db-muted">
            Decide what you're willing to lose first. Then let the stop decide the size, not the other way around.
          </p>
          <ol className="mt-8 flex max-w-md flex-col gap-3 text-sm text-db-muted">
            <li><b className="text-db-ink">1. Risk budget.</b> Account × risk % = the most this trade can cost.</li>
            <li><b className="text-db-ink">2. Risk per unit.</b> Distance from entry to stop × what one point is worth.</li>
            <li><b className="text-db-ink">3. Size.</b> Budget ÷ risk per unit, rounded down so you never go over.</li>
          </ol>
          <p className="mt-8 max-w-md text-xs text-db-muted">
            For education and planning only. This is arithmetic on the numbers you enter, not financial advice. Point values are standard contract specs; check your broker's, and remember slippage and fees can make a real loss larger. Trading involves risk of loss.
          </p>
        </div>

        <div className="panel min-w-0 p-5 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <div className="flex min-w-0 flex-col gap-2">
              <label htmlFor="rc-market" className="text-sm text-db-muted">Market</label>
              <select id="rc-market" className="field" value={market} onChange={(e) => setMarket(e.target.value as MarketId)}>
                {MARKETS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
              </select>
            </div>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm text-db-muted">Direction</legend>
              <div className="flex gap-2">
                {(["long", "short"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={side === d}
                    onClick={() => setSide(d)}
                    className={`label min-h-[48px] flex-1 rounded-sm border px-4 text-[11px] transition ${side === d ? "border-db-sun bg-db-sun text-db-onsun" : "border-db-line text-db-ink hover:border-db-sun"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <Field label="Account size" value={account} onChange={setAccount} suffix="$" />
            <Field label="Risk per trade" value={riskPct} onChange={setRiskPct} suffix="%" hint="Many traders keep this at 1% or less." />
            <Field label="Entry price" value={entry} onChange={setEntry} />
            <Field label="Stop price" value={stop} onChange={setStop} />
            <Field label="Target price" value={target} onChange={setTarget} hint="Optional. Used for R." />
            {market === "custom" ? (
              <Field label="$ per point, 1 unit" value={customPer} onChange={setCustomPer} suffix="$" />
            ) : (
              <div className="flex min-w-0 flex-col gap-2">
                <span className="text-sm text-db-muted">Value per {m.step}</span>
                <span className="field flex items-center whitespace-nowrap font-mono text-sm text-db-muted">{money(m.per)}/{m.unit === "standard lot" ? "lot" : m.unit}</span>
              </div>
            )}
          </div>

          {!ok ? (
            <p role="status" className="mt-6 rounded-sm border border-db-line bg-db-mid p-4 text-sm text-db-ink">{problems[0]}</p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-db-line bg-db-line" role="status" aria-live="polite">
              <div className="col-span-2 bg-db-mid p-4">
                <div className="label text-[10px] text-db-muted">position size</div>
                <div className="font-mono text-3xl text-db-ink">{fmtSize} <span className="text-lg text-db-muted">{unitWord(size)}</span></div>
                {size <= 0 ? (
                  <p className="mt-2 text-sm text-db-bear">The stop is too wide for this budget, even at one {m.unit}. Tighten the stop, use a micro contract, or pass on the trade.</p>
                ) : (
                  m.whole && exact - size > 0.001 && <p className="mt-1 text-xs text-db-muted">Exact size {exact.toFixed(2)}, rounded down to whole {m.unit}s.</p>
                )}
              </div>
              <div className="bg-db-mid p-4">
                <div className="label text-[10px] text-db-muted">risk budget</div>
                <div className="font-mono text-xl text-db-ink">{money(budget)}</div>
              </div>
              <div className="bg-db-mid p-4">
                <div className="label text-[10px] text-db-muted">{size > 0 ? "if stopped out" : `one ${m.unit} would risk`}</div>
                <div className="font-mono text-xl text-db-bear">−{money(size > 0 ? actualRisk : riskPerUnit)}</div>
              </div>
              <div className="bg-db-mid p-4">
                <div className="label text-[10px] text-db-muted">stop distance</div>
                <div className="font-mono text-xl text-db-ink">{stopSteps.toLocaleString("en-US", { maximumFractionDigits: 2 })} {m.step === "pip" ? "pips" : m.step === "point" ? "pts" : "$"}</div>
              </div>
              <div className="bg-db-mid p-4">
                <div className="label text-[10px] text-db-muted">{rr != null ? `at target · ${rr.toFixed(2)}R` : "reward : risk"}</div>
                <div className={`font-mono text-xl ${reward != null && size > 0 ? "text-db-bull" : "text-db-muted"}`}>{reward == null ? "add a target" : size > 0 ? "+" + money(reward) : "—"}</div>
              </div>
              {pct > 2 && (
                <p className="col-span-2 bg-db-mid p-4 text-sm text-db-muted">Risking {pct}% per trade means a run of five losses costs about {Math.round((1 - Math.pow(1 - pct / 100, 5)) * 100)}% of the account.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
