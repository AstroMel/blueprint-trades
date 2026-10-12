import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { CONFIG, PRODUCTS } from "./data";

export type Line = { key: string; productId: string; colorway?: string; qty: number };
type State = { lines: Line[]; open: boolean };
type Action =
  | { type: "add"; productId: string; colorway?: string; qty?: number }
  | { type: "qty"; key: string; qty: number }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "open"; open: boolean };

const STORAGE_KEY = "db-cart-v1";

function load(): Line[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // Drop lines for products that no longer exist (e.g. the retired refill pages).
    return raw ? (JSON.parse(raw) as Line[]).filter((l) => PRODUCTS.some((p) => p.id === l.productId)) : [];
  } catch {
    return [];
  }
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "add": {
      const key = `${a.productId}:${a.colorway ?? "-"}`;
      const found = s.lines.find((l) => l.key === key);
      const lines = found
        ? s.lines.map((l) => (l.key === key ? { ...l, qty: Math.min(9, l.qty + (a.qty ?? 1)) } : l))
        : [...s.lines, { key, productId: a.productId, colorway: a.colorway, qty: a.qty ?? 1 }];
      return { lines, open: true };
    }
    case "qty":
      return { ...s, lines: s.lines.map((l) => (l.key === a.key ? { ...l, qty: Math.max(1, Math.min(9, a.qty)) } : l)) };
    case "remove":
      return { ...s, lines: s.lines.filter((l) => l.key !== a.key) };
    case "clear":
      return { ...s, lines: [] };
    case "open":
      return { ...s, open: a.open };
  }
}

export const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: CONFIG.currency }).format(n);

export const SHIPPING = [
  { id: "standard", name: "Standard", eta: "3–6 business days", price: 8 },
  { id: "express", name: "Express", eta: "1–2 business days", price: 14 },
] as const;

export function totals(lines: Line[], shippingId: string = "standard") {
  const subtotal = lines.reduce((sum, l) => sum + (PRODUCTS.find((p) => p.id === l.productId)?.price ?? 0) * l.qty, 0);
  const method = SHIPPING.find((m) => m.id === shippingId) ?? SHIPPING[0];
  const shipping = subtotal === 0 ? 0 : method.id === "standard" && subtotal >= CONFIG.freeShippingOver ? 0 : method.price;
  // Sales tax is calculated by Stripe Tax at payment time; shown as pending here.
  return { subtotal, shipping, total: subtotal + shipping, count: lines.reduce((n, l) => n + l.qty, 0) };
}

const Ctx = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({ lines: load(), open: false }));
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      /* storage unavailable: cart still works for this visit */
    }
  }, [state.lines]);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
