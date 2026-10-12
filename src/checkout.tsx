import { useState } from "react";
import { Minus, Plus, Trash2, Lock, ArrowLeft, CheckCircle2, CreditCard } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CONFIG, COLORWAYS, PRODUCTS } from "./data";
import { money, SHIPPING, totals, useCart } from "./cart";
import { coverFor } from "./covers";

export function CartSheet({ onCheckout }: { onCheckout: () => void }) {
  const { state, dispatch } = useCart();
  const t = totals(state.lines);
  const toFree = CONFIG.freeShippingOver - t.subtotal;
  return (
    <Sheet open={state.open} onOpenChange={(o) => dispatch({ type: "open", open: o })}>
      <SheetContent side="right" className="flex w-full flex-col border-db-line bg-db-raised p-0 sm:max-w-md">
        <div className="border-b border-db-line px-6 py-5">
          <SheetTitle className="display text-3xl text-db-ink">Your <span className="accent">bag</span></SheetTitle>
          {t.count > 0 && (
            <div className="mt-3">
              <div className="h-1.5 overflow-hidden rounded-full bg-db-mid">
                <div className="h-full rounded-full bg-db-bull transition-[width] duration-300 ease-out" style={{ width: `${Math.min(100, (t.subtotal / CONFIG.freeShippingOver) * 100)}%` }} />
              </div>
              <p className="mt-2 text-sm text-db-muted">
                {toFree > 0 ? `${money(toFree)} away from free shipping` : "Free standard shipping unlocked"}
              </p>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {state.lines.length === 0 && <p className="py-10 text-center text-db-muted">Your bag is empty. The journal is waiting.</p>}
          <ul className="flex flex-col gap-4">
            {state.lines.map((l) => {
              const p = PRODUCTS.find((x) => x.id === l.productId)!;
              const c = COLORWAYS.find((x) => x.id === l.colorway);
              return (
                <li key={l.key} className="flex gap-4 rounded-sm border border-db-line bg-db-mid p-3">
                  <img src={coverFor(l.colorway)} alt="" className="h-20 w-auto" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <span className="font-semibold">{p.name}</span>
                      <span className="font-mono">{money(p.price * l.qty)}</span>
                    </div>
                    {c && <span className="text-sm text-db-muted">{c.name}</span>}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-sm border border-db-line">
                        <button className="flex h-10 w-10 items-center justify-center" aria-label="Decrease quantity" onClick={() => dispatch({ type: "qty", key: l.key, qty: l.qty - 1 })}>
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center font-mono" aria-live="polite">{l.qty}</span>
                        <button className="flex h-10 w-10 items-center justify-center" aria-label="Increase quantity" onClick={() => dispatch({ type: "qty", key: l.key, qty: l.qty + 1 })}>
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button className="flex h-10 w-10 items-center justify-center text-db-muted hover:text-db-bear" aria-label={`Remove ${p.name}`} onClick={() => dispatch({ type: "remove", key: l.key })}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="border-t border-db-line px-6 pb-[max(20px,env(safe-area-inset-bottom))] pt-5">
          <div className="flex justify-between text-lg">
            <span>Subtotal</span>
            <span className="font-mono">{money(t.subtotal)}</span>
          </div>
          <p className="mt-1 text-sm text-db-muted">Shipping and tax calculated at checkout.</p>
          <button className="btn-primary mt-4 w-full" disabled={t.count === 0} onClick={onCheckout}>
            <Lock className="h-4 w-4" /> Checkout
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

type Ship = { email: string; name: string; address: string; city: string; region: string; zip: string; country: string };
const STEPS = ["Shipping", "Delivery", "Payment"] as const;

export function Checkout({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { state, dispatch } = useCart();
  const [step, setStep] = useState(0);
  const [ship, setShip] = useState<Ship>({ email: "", name: "", address: "", city: "", region: "", zip: "", country: "United States" });
  const [method, setMethod] = useState<string>("standard");
  const [paying, setPaying] = useState(false);
  const [order, setOrder] = useState<null | { id: string; total: number }>(null);
  const [touched, setTouched] = useState(false);
  const [agree, setAgree] = useState(false);
  const t = totals(state.lines, method);

  const shipValid = /^\S+@\S+\.\S+$/.test(ship.email) && ship.name && ship.address && ship.city && ship.zip;

  const close = (o: boolean) => {
    onOpenChange(o);
    if (!o) {
      setStep(0);
      setOrder(null);
      setTouched(false);
    }
  };

  // STRIPE: in production this POSTs the cart to `${CONFIG.apiBase}/create-payment-intent`,
  // mounts Stripe's Payment Element with the returned client_secret, then calls stripe.confirmPayment().
  // Here it simulates a successful test-mode payment. No card data is collected and nothing is charged.
  const pay = async () => {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1300));
    const id = "DB-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setOrder({ id, total: t.total });
    dispatch({ type: "clear" });
    setPaying(false);
  };

  const F = (k: keyof Ship, label: string, opts: { type?: string; auto?: string; full?: boolean } = {}) => {
    const bad = touched && k !== "region" && k !== "country" && !ship[k];
    return (
      <label className={`flex flex-col gap-1.5 text-sm text-db-muted ${opts.full ? "col-span-2" : "col-span-2 sm:col-span-1"}`}>
        {label}
        <input
          className={`field ${bad ? "border-db-bear" : ""}`}
          type={opts.type ?? "text"}
          autoComplete={opts.auto}
          value={ship[k]}
          aria-invalid={bad || undefined}
          onChange={(e) => setShip({ ...ship, [k]: e.target.value })}
        />
      </label>
    );
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[100dvh] w-full max-w-2xl overflow-y-auto border-db-line bg-db-raised p-0 sm:max-h-[92vh] sm:rounded-sm">
        {CONFIG.testMode && (
          <div className="label bg-db-sun px-6 py-2 text-center text-db-onsun">test mode · nothing will be charged</div>
        )}
        <div className="px-5 pb-6 pt-5 sm:px-8">
          {order ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-db-bull" />
              <DialogTitle className="display mt-4 text-4xl text-db-ink">Order <span className="accent">placed</span>.</DialogTitle>
              <DialogDescription className="mt-3 text-db-muted">
                Order <span className="font-mono text-db-ink">{order.id}</span> · {money(order.total)}. A confirmation would be emailed to {ship.email}.
              </DialogDescription>
              <button className="btn-primary mt-8" onClick={() => close(false)}>Back to the shop</button>
            </div>
          ) : (
            <>
              <DialogTitle className="display text-3xl text-db-ink">Checkout</DialogTitle>
              <DialogDescription className="sr-only">Three steps: shipping, delivery, payment.</DialogDescription>
              <ol className="mt-4 grid grid-cols-3 gap-2" aria-label="Checkout steps">
                {STEPS.map((s, i) => (
                  <li key={s} aria-current={i === step ? "step" : undefined} className="flex flex-col gap-2">
                    <span className={`h-1 rounded-full ${i <= step ? "bg-db-sun" : "bg-db-line"}`} />
                    <span className={`label text-[10px] ${i === step ? "text-db-ink" : "text-db-muted"}`}>{s}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
                <div>
                  {step === 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {F("email", "Email", { type: "email", auto: "email", full: true })}
                      {F("name", "Full name", { auto: "name", full: true })}
                      {F("address", "Address", { auto: "street-address", full: true })}
                      {F("city", "City", { auto: "address-level2" })}
                      {F("region", "State / region", { auto: "address-level1" })}
                      {F("zip", "ZIP / postcode", { auto: "postal-code" })}
                      {F("country", "Country", { auto: "country-name" })}
                    </div>
                  )}
                  {step === 1 && (
                    <fieldset className="flex flex-col gap-3">
                      <legend className="sr-only">Delivery method</legend>
                      {SHIPPING.map((m) => {
                        const free = m.id === "standard" && t.subtotal >= CONFIG.freeShippingOver;
                        return (
                          <label key={m.id} className={`flex min-h-[64px] cursor-pointer items-center justify-between rounded-sm border p-4 ${method === m.id ? "border-db-sun bg-db-petal" : "border-db-line bg-db-mid"}`}>
                            <span className="flex items-center gap-3">
                              <input type="radio" name="ship" className="h-5 w-5 accent-[#96342c]" checked={method === m.id} onChange={() => setMethod(m.id)} />
                              <span>
                                <span className="block font-semibold">{m.name}</span>
                                <span className="text-sm text-db-muted">{m.eta}</span>
                              </span>
                            </span>
                            <span className="font-mono">{free ? "Free" : money(m.price)}</span>
                          </label>
                        );
                      })}
                    </fieldset>
                  )}
                  {step === 2 && (
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" className="btn-ghost bg-db-ink text-db-mid hover:text-db-mid" disabled aria-label="Apple Pay, available at launch">Apple Pay</button>
                        <button type="button" className="btn-ghost" disabled aria-label="Google Pay, available at launch">G Pay</button>
                      </div>
                      <div className="flex min-h-[150px] flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-db-line bg-db-mid p-5 text-center">
                        <CreditCard className="h-7 w-7 text-db-sun" />
                        <p className="font-semibold">Stripe Payment Element mounts here</p>
                        <p className="text-sm text-db-muted">Card, Apple Pay, Google Pay, Link and Klarna appear in this secure frame once live keys are added.</p>
                      </div>
                      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-db-muted">
                        <input type="checkbox" className="mt-1 h-5 w-5 flex-none accent-[rgb(var(--db-sun))]" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                        <span>
                          I agree to the <a href="#terms" className="text-db-ember underline underline-offset-2">Terms of Sale</a> and{" "}
                          <a href="#shipping" className="text-db-ember underline underline-offset-2">Shipping and Returns</a>, have read the{" "}
                          <a href="#privacy" className="text-db-ember underline underline-offset-2">Privacy Policy</a>, and understand the journal is not financial advice (
                          <a href="#disclaimer" className="text-db-ember underline underline-offset-2">Trading Disclaimer</a>).
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                <aside className="rounded-sm border border-db-line bg-db-mid p-4 text-sm" aria-label="Order summary">
                  <ul className="flex flex-col gap-2">
                    {state.lines.map((l) => {
                      const p = PRODUCTS.find((x) => x.id === l.productId)!;
                      return (
                        <li key={l.key} className="flex justify-between gap-2">
                          <span>{p.name} × {l.qty}</span>
                          <span className="font-mono">{money(p.price * l.qty)}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-3 flex flex-col gap-1 border-t border-db-line pt-3 text-db-muted">
                    <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">{money(t.subtotal)}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span className="font-mono">{step === 0 ? "—" : t.shipping === 0 ? "Free" : money(t.shipping)}</span></div>
                    <div className="flex justify-between"><span>Tax</span><span className="font-mono">at payment</span></div>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-db-line pt-3 text-base text-db-ink">
                    <span>Total</span><span className="font-mono">{money(t.total)}</span>
                  </div>
                </aside>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                {step > 0 ? (
                  <button className="btn-ghost" onClick={() => setStep(step - 1)}>
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                ) : <span />}
                {step < 2 ? (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      if (step === 0 && !shipValid) return setTouched(true);
                      setStep(step + 1);
                    }}
                  >
                    Continue
                  </button>
                ) : (
                  <button className="btn-primary" onClick={pay} disabled={paying || t.count === 0 || !agree}>
                    <Lock className="h-4 w-4" /> {paying ? "Processing…" : `Pay ${money(t.total)} (test)`}
                  </button>
                )}
              </div>
              {touched && step === 0 && !shipValid && <p className="mt-3 text-sm text-db-bear" role="alert">Fill in the highlighted fields and a valid email to continue.</p>}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
