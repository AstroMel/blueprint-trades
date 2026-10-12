import { useState } from "react";

// The journal's Trade Analysis page, redrawn as live vector: the same four parts in the same order, with a sample trade
// filled in. Nothing here is a photo. Tap a part to see how to fill it in; tap a score to see the total and grade move.
// Sample entries are illustrations only, not a real trade and not a price quote.

const PARTS = [
  { id: "details", title: "Trade details", how: "Fill it in as you enter, then again when you exit. Write the catalyst before you click, so you can't rewrite it later." },
  { id: "score", title: "Scoring system", how: "Score the trade, not the money. 1 is poor, 5 is excellent. A winner can score low, and a loser can score high." },
  { id: "psych", title: "Psychology check", how: "Four questions, one honest line each. Answer after the close, in your own words." },
  { id: "chart", title: "Chart", how: "Sketch the candles around your entry and exit, and mark where you got in and out. Drawn trades are easier to learn from." },
] as const;
type PartId = (typeof PARTS)[number]["id"];

const SCORE_ROWS = ["Setup quality", "Entry timing", "Exit timing", "Risk management", "Discipline", "Emotional control"] as const;

// The page's own grading key.
const GRADES = [
  { g: "A", word: "Excellent", min: 26, range: "26–30" },
  { g: "B", word: "Good", min: 20, range: "20–25" },
  { g: "C", word: "Average", min: 14, range: "14–19" },
  { g: "–", word: "Needs improvement", min: 0, range: "below 14" },
] as const;
const gradeOf = (t: number) => GRADES.find((x) => t >= x.min)!;

const LEFT = [
  ["Ticker symbol", "SPY"],
  ["Day of week", "Tue"],
  ["Call / put", "Call"],
  ["Time opened", "9:48"],
  ["Entry price", "1.20"],
  ["Trade duration", "35m"],
] as const;
const RIGHT = [
  ["Trade catalyst", "Retest of the high"],
  ["Timeframe", "5m"],
  ["Time closed", "10:23"],
  ["Exit price", "1.85"],
  ["Profit / loss", "+$65.00"],
] as const;

const QUESTIONS = [
  ["Did I follow my trading plan?", "Yes. I waited for the retest."],
  ["Did emotions influence decisions?", "A little. I nearly chased."],
  ["Did I respect stop-loss / risk rules?", "Yes. The stop never moved."],
  ["What can be improved next trade?", "Take profit at my level."],
] as const;

// [open, close, high, low] in drawing space (smaller y is higher). Close above open is an up candle.
const CANDLES = [
  [60, 68, 56, 72], [68, 74, 64, 78], [74, 70, 68, 79], [70, 62, 58, 72], [62, 58, 54, 64], [58, 61, 55, 64],
  [61, 50, 47, 63], [50, 42, 38, 52], [42, 46, 38, 49], [46, 53, 43, 56], [53, 58, 50, 61], [58, 55, 52, 60],
] as const;
const ENTRY_AT = 3, EXIT_AT = 8;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-baseline gap-3 border-b border-db-ink/40 pb-1">
      <span className="label flex-none text-[9px] leading-none text-db-ink">{label}</span>
      <span className="hand ml-auto min-w-0 truncate text-sm text-db-ember">{value}</span>
    </div>
  );
}

function Chart() {
  const step = 24, w = CANDLES.length * step + 24, ex = ENTRY_AT * step + 24, xx = EXIT_AT * step + 24;
  // Stretch the sketch's vertical range to fill the box.
  const Y = (y: number) => (y - 34) * 2.3;
  const entryY = Y(CANDLES[ENTRY_AT][1]), exitY = Y(CANDLES[EXIT_AT][0]);
  return (
    <svg viewBox={`0 0 ${w} 112`} className="h-auto w-full" role="img" aria-label="Sample candle sketch: blue up candles and red down candles, with the entry and exit marked">
      <g className="stroke-db-major" strokeWidth="0.6">
        {[22, 49, 76, 103].map((y) => <line key={y} x1="0" x2={w} y1={y} y2={y} strokeDasharray="2 4" />)}
      </g>
      {CANDLES.map(([o0, c0, h0, l0], i) => {
        const [o, c, h, l] = [Y(o0), Y(c0), Y(h0), Y(l0)];
        const up = c < o, x = i * step + 24, top = Math.min(o, c), ht = Math.max(4, Math.abs(o - c));
        return (
          <g key={i} className={up ? "fill-db-bull stroke-db-bull" : "fill-db-bear stroke-db-bear"}>
            <line x1={x} x2={x} y1={h} y2={l} strokeWidth="1.5" />
            <rect x={x - 6} y={top} width="12" height={ht} strokeWidth="1" />
          </g>
        );
      })}
      <g className="stroke-db-sun" strokeWidth="1.2" strokeDasharray="3 3">
        <line x1={ex - 14} x2={ex + 40} y1={entryY} y2={entryY} />
        <line x1={xx - 40} x2={xx + 14} y1={exitY} y2={exitY} />
      </g>
      <g className="fill-db-ember" style={{ font: "700 9px 'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>
        <text x={ex - 14} y={entryY + 13}>IN</text>
        <text x={xx + 14} y={exitY - 6} textAnchor="end">OUT</text>
      </g>
    </svg>
  );
}

function Part({ id, title, active, onPick, children }: { id: PartId; title: string; active: PartId; onPick: (p: PartId) => void; children: React.ReactNode }) {
  const on = active === id;
  return (
    // Tapping anywhere on a part selects it. Keyboard users pick parts from the list beside the sheet.
    <section
      onClick={() => onPick(id)}
      className={`rounded-sm px-3 py-4 outline outline-1 transition ${on ? "bg-db-sun/[0.07] outline-db-sun" : "outline-transparent hover:outline-db-line"}`}
      aria-label={title}
    >
      {children}
    </section>
  );
}

const Rule = ({ children }: { children: React.ReactNode }) => (
  <p className="label mb-3 text-center text-[10px] text-db-ink underline decoration-db-ink/50 underline-offset-4">{children}</p>
);

export function TradeSheet() {
  const [active, setActive] = useState<PartId>("score");
  const [s, setS] = useState<number[]>([4, 3, 3, 4, 5, 3]);
  const total = s.reduce((a, b) => a + b, 0);
  const grade = gradeOf(total);

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-start md:gap-12">
      <figure className="min-w-0 max-md:order-2">
        <div className="relative border border-db-major bg-db-mid/80 backdrop-blur-[2px]">
          {/* drawing-sheet corner marks */}
          <span className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-db-sun" aria-hidden />
          <span className="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 border-db-sun" aria-hidden />
          <span className="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-db-sun" aria-hidden />
          <span className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-db-sun" aria-hidden />

          <div className="bg-db-ink py-2.5 text-center">
            <p className="display text-xl tracking-wide text-db-mid sm:text-2xl">Trade Analysis</p>
          </div>

          <div className="flex flex-col gap-1 p-2 sm:p-3">
            <Part id="details" title="Trade details" active={active} onPick={setActive}>
              <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                <div className="flex flex-col gap-3">{LEFT.map(([l, v]) => <Field key={l} label={l} value={v} />)}</div>
                <div className="flex flex-col gap-3">{RIGHT.map(([l, v]) => <Field key={l} label={l} value={v} />)}</div>
              </div>
            </Part>

            <Part id="score" title="Scoring system" active={active} onPick={setActive}>
              <Rule>Scoring system (1–5 scale)</Rule>
              <div className="overflow-hidden border border-db-ink/40">
                <div className="grid grid-cols-[1fr_auto] bg-db-ink px-3 py-1.5">
                  <span className="label text-[9px] text-db-mid">Category</span>
                  <span className="label text-[9px] text-db-mid">1 – 5</span>
                </div>
                {SCORE_ROWS.map((r, i) => (
                  <div key={r} className={`grid grid-cols-[1fr_auto] items-center gap-2 px-3 py-1.5 ${i % 2 ? "bg-db-petal/60" : ""}`}>
                    <span className="min-w-0 text-[13px] leading-tight text-db-ink">{r}</span>
                    <span className="flex gap-1" role="radiogroup" aria-label={r}>
                      {[1, 2, 3, 4, 5].map((v) => (
                        <button
                          key={v}
                          role="radio"
                          aria-checked={s[i] === v}
                          aria-label={`${r}: ${v}`}
                          onClick={() => setS((xs) => xs.map((x, j) => (j === i ? v : x)))}
                          className={`h-8 w-8 rounded-sm border font-mono text-[13px] transition sm:h-8 sm:w-9 ${s[i] === v ? "border-db-sun bg-db-sun text-db-onsun" : "border-db-line bg-db-mid/60 text-db-muted hover:border-db-sun hover:text-db-ink"}`}
                        >
                          {v}
                        </button>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-end justify-between gap-4" aria-live="polite">
                <p className="label text-[10px] text-db-ink">
                  Total score <span className="font-mono text-base text-db-ember">{total}</span> <span className="text-db-muted">/ 30</span>
                </p>
                <p className="text-right text-sm text-db-muted">
                  <span className="display text-2xl text-db-ember">{grade.g}</span> {grade.word}
                </p>
              </div>
              <ul className="mt-2 grid grid-cols-2 gap-1 sm:grid-cols-4" aria-label="Grading key">
                {GRADES.map((x) => (
                  <li key={x.g + x.range} className={`label rounded-sm border px-2 py-1 text-center text-[9px] leading-tight ${x === grade ? "border-db-sun bg-db-sun text-db-onsun" : "border-db-line text-db-muted"}`}>
                    {x.g === "–" ? x.range : `${x.range} = ${x.g}`}
                  </li>
                ))}
              </ul>
            </Part>

            <Part id="psych" title="Psychology and discipline check" active={active} onPick={setActive}>
              <Rule>Psychology &amp; discipline check</Rule>
              <div className="flex flex-col gap-3">
                {QUESTIONS.map(([q, a]) => (
                  <div key={q}>
                    <p className="text-[13px] font-medium leading-tight text-db-ink">— {q}</p>
                    <p className="hand mt-1 border-b border-db-ink/40 pb-1 text-sm text-db-ember">{a}</p>
                  </div>
                ))}
              </div>
            </Part>

            <Part id="chart" title="Chart and candle formation" active={active} onPick={setActive}>
              <Rule>Chart / candle formation (entry &amp; exit)</Rule>
              <div className="border border-dashed border-db-major bg-db-raised/40 p-2">
                <Chart />
              </div>
            </Part>
          </div>
        </div>
        <figcaption className="label mt-3 text-[10px] text-db-muted">Sample entries for illustration. Not a real trade, and not advice.</figcaption>
      </figure>

      <ol className="flex flex-col max-md:order-1" aria-label="The four parts of the page">
        {PARTS.map((p, i) => {
          const on = active === p.id;
          return (
            <li key={p.id} className="border-t border-db-line last:border-b">
              <button
                onClick={() => setActive(p.id)}
                aria-expanded={on}
                className="grid w-full grid-cols-[2.5rem_1fr] gap-3 py-4 text-left transition hover:text-db-ember"
              >
                <span className={`font-mono text-sm ${on ? "text-db-ember" : "text-db-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="font-semibold">{p.title}</span>
                  {on && <span className="mt-1 block text-sm leading-relaxed text-db-muted">{p.how}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
