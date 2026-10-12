# Blueprint Trades data context

There is no data warehouse behind this store: everything lives in the visitor's browser or in `src/data.ts`. This note records the definitions that the site and the member app must agree on. The scoring rules exist twice (`src/tradesheet.tsx` and `public/app.html`), so change both together.

## Entities

| Entity | Where it lives | Notes |
| --- | --- | --- |
| Product | `PRODUCTS` in `src/data.ts` | One printed journal, $49. The app is a separate $7.99/month subscription. The desk-kit bundle and refill pages were removed. |
| Cart | `localStorage` key `db-cart-v1` | Product id, cover, quantity. Old key name kept so carts survive. |
| Trade entry | `localStorage` key `bt-journal-v1` (app only) | One record per trade, see fields below. Never sent to a server. |
| App access | `localStorage` key `bt-app-access` | `{status: "test" \| "active", since}`. Device-only until a server check against Stripe exists. |
| Theme | `bt-app-theme` (app), site theme key in `sections.tsx` | `light` or `dark`. |
| Consultation request | Posted to `CONFIG.consultEndpoint`, else a prepared email | Confidential. Not stored by the site. |

## Trade entry fields (app)

`date` (local date, `YYYY-MM-DD`), `symbol`, `side` (long or short), `kind` (call, put or empty), `size`, `timeframe`, `catalyst`, `levels`, `entry`, `stop`, `target`, `opened`, `closed` (`HH:MM`), `exit`, `rOverride`, `pnl`, `held`, `checks` (4 booleans, the market-maker risk check), `scores` (6 integers 1 to 5 or null), `psy0` to `psy2` (psychology answers), `lesson` (answer to "What can be improved next trade?").
Older entries may carry unused fields (`rules`, `emoBefore`, `emoAfter`, `pastSelf`); they are kept but not shown. Every loaded or imported entry is normalized so missing fields never throw.

## Definitions

- **Score categories (in page order):** Setup quality, Entry timing, Exit timing, Risk management, Discipline, Emotional control. Each is 1 (poor) to 5 (excellent).
- **Total score:** sum of the six, out of 30. Only counted when all six are filled.
- **Grade key (printed on the page):** 26 to 30 = A Excellent, 20 to 25 = B Good, 14 to 19 = C Average, below 14 = Needs improvement.
- **Psychology and discipline check:** four questions: Did I follow my trading plan? Did emotions influence decisions? Did I respect stop-loss / risk rules? What can be improved next trade?
- **Planned R:** `|target - entry| / |entry - stop|`.
- **Result R:** long `(exit - entry) / (entry - stop)`, short `(entry - exit) / (stop - entry)`. A manual R override wins when set.
- **Closed trade:** has an exit price, an R override or a P/L.
- **Monthly review:** trades whose date starts with the month. Win rate counts closed trades with R above 0. Equity curve is cumulative R over closed trades in date order. Score by category averages only fully scored trades.
- **Trade duration:** the typed value, else computed from opened and closed (crossing midnight adds 24 hours).
- **Dates** are the device's local date, not UTC.

## Position-size calculator (`src/riskcalc.tsx`, and the app's Plan form)

Risk budget = account x risk %. Risk per unit = stop distance in market steps x value per step. Size = budget / risk per unit, rounded down (whole units for futures and stocks, two decimals for forex and crypto), with a 1e-9 tolerance so 0.5 never shows as 0.49. If one unit already exceeds the budget, size is 0 and the tool shows what one unit would risk.

| Preset | Value per point or step, per unit |
| --- | --- |
| ES | $50 per point, contract |
| MES | $5 per point, contract |
| NQ | $20 per point, contract |
| MNQ | $2 per point, contract |
| Stocks and ETFs | $1 per $1 move, share |
| Forex (USD-quoted) | $10 per pip (0.0001), standard lot |
| Crypto spot | $1 per $1 move, coin |
| Custom | entered by the visitor |

Point values are standard contract specs. The tool is arithmetic on typed numbers, not advice.

## Store configuration (`CONFIG` in `src/data.ts`)

- Free standard shipping over $75. Standard $8 (USPS Ground Advantage, 2 to 5 business days). Express $14 (USPS Priority Mail, 1 to 3 business days).
- App price $7.99/month. `memberAppUrl` is the Grok-built member app (confirmed 2026-10-12).
- Domain is blueprinttrades.com. Stripe stays in test mode.
- Still placeholders: legal name, address, contact email, governing state and county, effective date, handling, claim and refund days, Stripe keys, `consultEndpoint`.

## Gotchas

- The top-bar tape shows market status and live crypto prices only when the feeds respond. Offline it says so; it never shows made-up prices.
- Sample figures on the site (the Trade Analysis sample, the calculator defaults) are illustrations, not results.
- Never use the phrase "insider trading". The consultation offer is the Inner Room.
