// The page reads like an architect's drawing set: each section is a numbered stage, and a thin title strip between
// sections marks the step. The candles fill in as you move through the set: blue for stages done, red for the
// one you're on, outlines for what's ahead. Decorative only; the section headings carry the meaning.

export const STAGES = [
  "Concept",
  "Elevations",
  "Brief",
  "Floor plan",
  "Survey",
  "Load calc",
  "Build",
  "Model",
  "Review",
  "Handover",
] as const;

function Candles({ n }: { n: number }) {
  const total = STAGES.length;
  // Fixed heights so the row reads like a rising chart, not noise.
  const hs = [10, 14, 12, 18, 16, 22, 20, 26, 24, 30];
  return (
    <svg viewBox={`0 0 ${total * 12} 36`} className="h-6 w-auto flex-none" aria-hidden>
      {hs.map((h, i) => {
        const x = i * 12 + 6;
        const done = i < n - 1, here = i === n - 1;
        const cls = here ? "fill-db-sun stroke-db-sun" : done ? "fill-db-bull stroke-db-bull" : "fill-none stroke-db-major";
        return (
          <g key={i} className={cls}>
            <line x1={x} x2={x} y1={34 - h - 3} y2={34} strokeWidth="1" />
            <rect x={x - 3} y={34 - h} width="6" height={Math.max(4, h - 6)} strokeWidth="1" />
          </g>
        );
      })}
    </svg>
  );
}

export function Stage({ n }: { n: number }) {
  const name = STAGES[n - 1];
  return (
    <div className="border-t border-db-line bg-db-mid/70 backdrop-blur-sm" aria-hidden>
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <span className="label flex-none text-[11px] text-db-ember">
          {String(n).padStart(2, "0")}
          <span className="text-db-muted"> / {STAGES.length}</span>
        </span>
        <span className="label flex-none text-[11px] text-db-ink">{name}</span>
        <span className="h-px min-w-6 flex-1 border-t border-dashed border-db-major" />
        <Candles n={n} />
        <span className="label hidden flex-none text-[10px] text-db-muted sm:inline">dwg bt-{String(n).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

// Small eyebrow for a section heading: "04 · Floor plan".
export function StageTag({ n, children }: { n: number; children?: string }) {
  return (
    <p className="label text-db-ember">
      {String(n).padStart(2, "0")} · {children ?? STAGES[n - 1]}
    </p>
  );
}
