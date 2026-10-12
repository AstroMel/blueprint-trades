import { useState } from "react";
import { ArrowUpRight, Check, Lock, Smartphone } from "lucide-react";
import { CONFIG } from "./data";
import { money } from "./cart";

// Free consultations on request. Every request is screened; nothing here promises a call.
// Without a backend, requests go to CONFIG.consultEndpoint (JSON POST) or, failing that, open an email to the contact address.

const placeholder = (s: string) => /^\[.*\]$/.test(s.trim());

const LEVELS = ["Brand new, not trading yet", "Under 1 year", "1 to 3 years", "3+ years"] as const;
const MARKETS = ["Futures", "Stocks", "Options", "Forex", "Crypto"] as const;

export function Consult() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "mailed" | "unavailable" | "error">("idle");
  const [markets, setMarkets] = useState<string[]>([]);
  const [ack, setAck] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      experience: String(fd.get("experience") || ""),
      markets: markets.join(", "),
      goal: String(fd.get("goal") || "").trim(),
      availability: String(fd.get("availability") || "").trim(),
    };
    if (CONFIG.consultEndpoint) {
      setState("sending");
      try {
        const r = await fetch(CONFIG.consultEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
        setState(r.ok ? "sent" : "error");
      } catch {
        setState("error");
      }
      return;
    }
    if (placeholder(CONFIG.legal.email)) {
      setState("unavailable");
      return;
    }
    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Trading experience: ${data.experience}`,
      `Markets: ${data.markets || "-"}`,
      `Availability / time zone: ${data.availability || "-"}`,
      "",
      "What I'd like help with:",
      data.goal,
    ].join("\n");
    window.location.href = `mailto:${CONFIG.legal.email}?subject=${encodeURIComponent("Consultation request: " + data.name)}&body=${encodeURIComponent(body)}`;
    setState("mailed");
  }

  return (
    <section id="consult" className="border-t border-db-line py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1fr_1.15fr] md:items-start">
        <div className="min-w-0">
          <p className="label flex items-center gap-2 text-db-ember"><Lock className="h-3.5 w-3.5" aria-hidden /> the inner room · by request</p>
          <h2 className="display mt-3 text-5xl sm:text-6xl">
            A private room. <span className="accent">No charge.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-db-muted">
            One-to-one sessions for traders who are serious about their process. There's no fee and no upsell. Every request is reviewed privately, and a seat is offered only where we can genuinely help.
          </p>
          <ol className="mt-8 flex max-w-md flex-col gap-4">
            {[
              ["Request", "Tell us where your trading is and what you want to work on."],
              ["Private review", "Read only by the Blueprint Trades team. Not every request is accepted."],
              ["Your seat", "If it's a fit, you get a private invitation by email to set a time. Still free."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="flex h-8 w-8 flex-none items-center justify-center bg-db-sun font-mono text-sm font-bold text-db-onsun">{i + 1}</span>
                <div>
                  <p className="font-semibold">{t}</p>
                  <p className="text-sm text-db-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 max-w-md border-l-2 border-db-sun pl-5">
            <p className="label text-db-ink">what stays in the room</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-db-muted">
              <li><b className="text-db-ink">Confidential.</b> What you share is never published, sold or shared, and never used in our content without your written permission.</li>
              <li><b className="text-db-ink">Closed door.</b> One-to-one and by invitation only. Sessions aren't recorded unless you ask.</li>
              <li><b className="text-db-ink">Yours to delete.</b> Ask and we erase your request and notes.</li>
              <li><b className="text-db-ink">Process, not picks.</b> We talk journaling, risk and discipline. No signals, no calls, no financial advice. See the{" "}
                <a href="#disclaimer" className="text-db-ember underline underline-offset-2">Trading Disclaimer</a>.</li>
            </ul>
          </div>
        </div>

        <div className="panel p-5 sm:p-7">
          {state === "sent" || state === "mailed" ? (
            <div className="flex flex-col gap-4 py-6" role="status">
              <Check className="h-8 w-8 text-db-ember" aria-hidden />
              <h3 className="display text-3xl">{state === "sent" ? "Request received." : "Almost there."}</h3>
              <p className="text-db-muted">
                {state === "sent"
                  ? "Thanks. Your request is with our team for private review. If it's a fit, you'll get an invitation by email to set a time."
                  : "Your email app should have opened with your request filled in. Press send there to submit it. If nothing opened, email us directly at " + CONFIG.legal.email + "."}
              </p>
              <button className="btn-ghost self-start" onClick={() => setState("idle")}>Send another request</button>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4" aria-describedby="consult-note">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-db-muted">
                  Name
                  <input name="name" required autoComplete="name" className="field" />
                </label>
                <label className="flex flex-col gap-2 text-sm text-db-muted">
                  Email
                  <input name="email" type="email" required autoComplete="email" className="field" />
                </label>
              </div>
              <label className="flex flex-col gap-2 text-sm text-db-muted">
                Trading experience
                <select name="experience" required className="field" defaultValue="">
                  <option value="" disabled>Choose one</option>
                  {LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </label>
              <fieldset>
                <legend className="mb-2 text-sm text-db-muted">Markets you trade</legend>
                <div className="flex flex-wrap gap-2">
                  {MARKETS.map((m) => {
                    const on = markets.includes(m);
                    return (
                      <button
                        type="button"
                        key={m}
                        aria-pressed={on}
                        onClick={() => setMarkets((xs) => (on ? xs.filter((x) => x !== m) : [...xs, m]))}
                        className={`label min-h-[40px] rounded-sm border px-3 text-[11px] transition ${on ? "border-db-sun bg-db-sun text-db-onsun" : "border-db-line text-db-ink hover:border-db-sun"}`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <label className="flex flex-col gap-2 text-sm text-db-muted">
                What would you like help with?
                <textarea name="goal" required rows={4} className="field min-h-[110px] resize-y" placeholder="e.g. I keep moving my stop after entry and want to fix my process." />
              </label>
              <label className="flex flex-col gap-2 text-sm text-db-muted">
                Availability and time zone <span className="sr-only">(optional)</span>
                <input name="availability" className="field" placeholder="Optional, e.g. weekday evenings, EST" />
              </label>
              <label className="flex items-start gap-3 text-sm text-db-ink">
                <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} required className="mt-0.5 h-5 w-5 flex-none accent-[rgb(var(--db-sun))]" />
                <span>I understand every request is reviewed, a seat isn't guaranteed, and a consultation is education, not financial advice.</span>
              </label>
              <button type="submit" className="btn-primary" disabled={state === "sending" || !ack}>
                {state === "sending" ? "Sending…" : "Request a seat"}
              </button>
              <p id="consult-note" className="text-xs text-db-muted">
                Read only by our team, used only to review and reply to your request, and deleted on request. See the <a href="#privacy" className="underline underline-offset-2">Privacy Policy</a>.
              </p>
              {state === "unavailable" && (
                <p role="alert" className="rounded-sm border border-db-sun bg-db-sun/10 p-3 text-sm text-db-ink">
                  Requests open as soon as our private inbox is set up. Please check back soon.
                </p>
              )}
              {state === "error" && (
                <p role="alert" className="rounded-sm border border-db-bear bg-db-bear/10 p-3 text-sm text-db-ink">
                  Your request didn't go through. Please try again in a moment.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const APP_FEATURES = [
  "The Plan + Reality spread for every trade",
  "Position size from your account and risk %",
  "Market-maker risk check and plan adherence",
  "Monthly review: win rate, R curve, lessons",
  "Works offline and installs to your home screen",
  "Entries stay on your device, with backup export",
];

export function DigitalApp() {
  return (
    <section id="app" className="border-t border-db-line bg-db-deep py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center">
        <div className="min-w-0">
          <p className="label text-db-ember">the digital edition</p>
          <h2 className="display mt-3 text-5xl sm:text-6xl">
            The journal, <span className="accent">as an app.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-db-muted">
            Same pages, same questions, in your pocket. Plan before the open, log what really happened, and let the monthly review do the math.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={CONFIG.appUrl} className="btn-primary" target="_blank" rel="noopener">
              Subscribe for {money(CONFIG.appPrice)}/month <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
{CONFIG.memberAppUrl ? (
              <a href={CONFIG.memberAppUrl} className="btn-ghost" target="_blank" rel="noopener">
                Open the member app <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            ) : (
              <a href="#shop" className="btn-ghost">Or get it on paper</a>
            )}
          </div>
          <p className="mt-4 text-sm text-db-muted">{money(CONFIG.appPrice)} a month, billed monthly. Cancel anytime. On your phone, tap Share then Add to Home Screen (iPhone) or Install (Android) to keep it.</p>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-sm border border-db-line bg-db-line sm:grid-cols-2">
          {APP_FEATURES.map((f, i) => (
            <li key={f} className="flex gap-3 bg-db-raised/80 p-5">
              {i === 0 ? <Smartphone className="h-5 w-5 flex-none text-db-ember" aria-hidden /> : <Check className="h-5 w-5 flex-none text-db-ember" aria-hidden />}
              <span className="text-sm">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AppCard() {
  return (
    <article className="relative flex flex-col rounded-sm border-2 border-db-line bg-db-raised/60 p-6 backdrop-blur-md">
      <div>
        <h3 className="text-xl font-semibold">The Journal App</h3>
        <p className="mt-1 text-db-muted">The digital edition, on any phone or laptop. Cancel anytime.</p>
      </div>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="font-mono text-3xl">{money(CONFIG.appPrice)}</span>
        <span className="text-db-muted">/month</span>
      </div>
      <ul className="mt-5 flex flex-1 flex-col gap-2">
        {APP_FEATURES.slice(0, 4).map((i) => (
          <li key={i} className="flex gap-2 text-sm text-db-ink">
            <Check className="mt-0.5 h-4 w-4 flex-none text-db-ember" aria-hidden /> {i}
          </li>
        ))}
      </ul>
      <a href={CONFIG.appUrl} target="_blank" rel="noopener" className="btn-ghost mt-6 w-full">
        Subscribe <ArrowUpRight className="h-4 w-4" aria-hidden />
      </a>
    </article>
  );
}
