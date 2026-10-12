# Blueprint Trades design system (store, journal, 3D mockup)

The store and the journal use the **Field Notes** direction of the Blueprint Trades YouTube kit: drafting paper, graphite and a red pencil. Tokens: [tokens.json](tokens.json), extending the channel kit's own system in `/mnt/project-files/youtube-brand/design-system` (v1.0). Kit rules kept: one red mark per frame, no green, up candles hollow and down candles solid graphite. Code: `src/index.css` (`--db-*` RGB triplets, light on `:root`, dark under `prefers-color-scheme` and `[data-theme="dark"]`).

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
| Button | primary (red pencil fill), ghost (2px graphite frame) | hover brighten / red border, active 0.98 scale, focus 2px outline, disabled 50% | min height 48px, radius md |
| Tape (ticker) | one | paused under reduced motion | channel rules, never fake quotes |
| Product card | default, featured (red frame + badge) | cover swatch pressed = red ring | swatches: Bull & Bear, Field Notes |
| Note chip | one | floats | handwriting value + mono label |
| Section header | label (mono, red) + display headline + lead | | one accent phrase in red per headline |
| Data table | specs, review | | mono numbers; negative R in red pencil, positive R in graphite |
| Field | text, decimal | focus red border | 48px |

## Journal page system
Left page **THE PLAN** (before the open): ticker / timeframe / session, 1 Key levels used (HTF, zone, PDL), 2 The trade I want (entry, stop, target, size, R), 3 Market-maker risk check, 4 Emotion before (1 calm to 5 wired).
Right page **THE REALITY** (after the close): redraw the move, 5 Result, 6 Plan adherence (rules followed x / y), 7 Emotion after, 8 Lesson learned, 9 What would I tell my past self?
Monthly review: rule adherence %, average R by emotion score, share of trades at a marked level.

## Editions
- **Bull & Bear**: the printed cover (front + back supplied by the owner), gold wire-o.
- **Field Notes**: generated from `bt.py`, graphite wire-o. Same interior.

## Do / don't
- Do keep the graph grid behind hero and channel sections only; plain paper elsewhere.
- Do keep red for one thing per view: the action or the accent phrase.
- Don't use the handwriting face for anything a user must read to complete a task.
- Don't round into pills or add gradients; this is a drafting sheet.
