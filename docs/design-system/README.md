# Blueprint Trades design system (store, journal, 3D mockup)

The store and the journal use the **Night Session** direction (v2.0) of the Blueprint Trades YouTube kit: night navy #0F1330, starlight type #E9ECF5, one gold accent #D4A640, blue up candles #3D7BFF and red down candles #E5484D. Field Notes is retired. Tokens: [tokens.json](tokens.json), extending the kit's own system in `/mnt/project-files/youtube-brand/design-system` (v2.0, section 6 maps the store). Kit rules kept: one gold mark per frame, red and blue for price only, no green, radius 0. Code: `src/index.css` (`--db-*` RGB triplets, light on `:root`, dark under `prefers-color-scheme` and `[data-theme="dark"]`).

## Voice (from the channel analysis)
| Say | Not |
|---|---|
| "No one can promise profitability." | "Make money fast." |
| "Good trade, bad result is still a good trade." | "My secret strategy." |
| "Red days included." | Posting only winners. |
| "Stop relying on influencers." | "Copy my trades." |
Every sample figure carries "sample page, not results". Every page footer carries "Not financial advice. Trading involves risk of loss."

## Components
| Component | Variants | States | Notes |
|---|---|---|---|
| Button | primary (gold fill, navy text), ghost (2px ink frame) | hover brighten / gold border, active 0.98 scale, focus 2px outline, disabled 50% | min height 48px, radius 2px |
| Tape (ticker) | one | paused under reduced motion | channel rules, never fake quotes |
| Product card | default, featured (gold frame + badge) | cover swatch pressed = gold ring | swatches: Night Session (default), Bull & Bear |
| Note chip | one | floats | mono value + mono label |
| Section header | label (mono, gold) + display headline + lead | | one accent phrase in gold per headline |
| Data table | specs, review | | mono numbers; negative R in bear red, positive R in bull blue |
| Field | text, decimal | focus gold border | 48px |

## Journal page system
Left page **THE PLAN** (before the open): ticker / timeframe / session, 1 Key levels used (HTF, zone, PDL), 2 The trade I want (entry, stop, target, size, R), 3 Market-maker risk check, 4 Emotion before (1 calm to 5 wired).
Right page **THE REALITY** (after the close): redraw the move, 5 Result, 6 Plan adherence (rules followed x / y), 7 Emotion after, 8 Lesson learned, 9 What would I tell my past self?
Monthly review: rule adherence %, average R by emotion score, share of trades at a marked level.

## Editions
- **Bull & Bear**: the printed cover (front + back supplied by the owner), gold wire-o.
- **Night Session** (default): generated from `art/bt2.py`, gold wire-o. Same interior.

## Do / don't
- Do keep the graph grid behind hero and channel sections only; plain paper elsewhere.
- Do keep gold for one thing per view: the action, the accent phrase or the level line.
- Don't use red or blue for UI; they mean price direction only.
- Handwriting appears only inside sample journal pages, never in the UI.
- Don't round into pills or add gradients; keep corners square like the kit.
