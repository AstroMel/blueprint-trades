"""Canva bulk-create stand-in: one CSV of rows, and every row rendered to a 1080x1350 post with the Field Notes kit."""
import csv, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from bt import *
from PIL import Image, ImageDraw
O = "/mnt/project-files/blueprint/bulk"; os.makedirs(f"{O}/posts", exist_ok=True)
A = "/mnt/project-files/blueprint/art"
ROWS = [
  ("launch-bullbear", "product", "Master yourself.", "Master the market.", "The Bull & Bear edition. Plan + Reality pages for every trade.", "Shop the journal", "cover-front.jpg"),
  ("launch-fieldnotes", "product", "Plan. Trade.", "Reality.", "The Field Notes edition. Same pages, channel cover.", "Shop the journal", "fieldnotes-front.png"),
  ("field-key-levels", "feature", "Key levels", "first.", "Write the HTF level and the zone before you look for an entry.", "See inside", "page-plan-sample.png"),
  ("field-mm-check", "feature", "Don't be", "the liquidity.", "The market-maker risk check: four ticks before every trade.", "See inside", "page-plan-sample.png"),
  ("field-emotion", "feature", "Calm or", "wired?", "Score yourself 1 to 5 before and after. Your state is a market variable.", "See inside", "page-plan-sample.png"),
  ("field-adherence", "feature", "Score the rules,", "not the P&L.", "Plan adherence: did you do what the plan said?", "See inside", "page-reality-sample.png"),
  ("field-lesson", "feature", "Red days", "included.", "One lesson per trade. Losing days get the most ink.", "See inside", "page-reality-sample.png"),
  ("field-past-self", "feature", "What would you tell", "your past self?", "The question that turns a bad week into tuition you pay once.", "See inside", "page-reality-sample.png"),
  ("letter-1", "quote", "No one can promise", "profitability.", "But commit to this journal and you will become a better trader. - Blueprint", "Read the back cover", "cover-back.jpg"),
  ("letter-2", "quote", "A marathon,", "not a shortcut.", "Every step you take, every lesson you learn, moves you forward. - Blueprint", "Read the back cover", "cover-back.jpg"),
  ("video-influencers", "video", "Stop relying on", "influencers.", "Watch: I Followed Trading Influencers and It Nearly Destroyed Me", "Watch on YouTube", "page-reality-sample.png"),
  ("video-mm-setup", "video", "Don't fall for", "this setup.", "Watch: Don't Fall for This Market Maker Setup. Then log it on the Plan page.", "Watch on YouTube", "page-plan-sample.png"),
]
def post(r):
    name, kind, h1, h2, body, cta, img = r; PW, PH = 1080, 1350
    dark = kind in ("quote", "video"); bg = NIGHT if dark else PAPER; ink = PAPER if dark else GRAPHITE; red = (236, 104, 80) if dark else RED
    im = Image.new("RGB", (PW, PH), bg); grid(im, 36, minor=(44, 42, 38) if dark else GRAPH, major=(58, 55, 49) if dark else None, every=5, w=1); d = ImageDraw.Draw(im, "RGBA")
    tracked(d, (60, 60), {"product": "THE TRADING JOURNAL", "feature": "INSIDE THE JOURNAL", "quote": "FROM THE BACK COVER", "video": "WATCH, THEN WRITE"}[kind], F(JBMB, 24), red, 5)
    a = anton_block(h1.upper(), 120, ink, 2); b = anton_block(h2.upper(), 120, red, 2)
    sc = min(1, 960 / max(a.width, b.width)); a = a.resize((int(a.width * sc), int(a.height * sc))); b = b.resize((int(b.width * sc), int(b.height * sc)))
    im.paste(a, (60, 120), a); im.paste(b, (60, 140 + a.height), b); y = 170 + a.height + b.height
    for ln in wrap(d, body, F(SANS, 36), 960): d.text((60, y), ln, font=F(SANS, 36), fill=ink); y += 48
    src = Image.open(f"{A}/{img}").convert("RGB"); src.thumbnail((620, PH - y - 220)); x = (PW - src.width) // 2; yy = y + 40
    sh = Image.new("RGBA", (PW, PH), (0, 0, 0, 0)); ImageDraw.Draw(sh).rectangle([x + 16, yy + 22, x + src.width + 16, yy + src.height + 22], fill=(0, 0, 0, 110))
    im = Image.alpha_composite(im.convert("RGBA"), sh.filter(ImageFilter.GaussianBlur(18))).convert("RGB"); im.paste(src, (x, yy)); d = ImageDraw.Draw(im, "RGBA")
    d.rectangle([0, PH - 120, PW, PH], fill=GRAPHITE if not dark else PAPER)
    lk = kit_logo("lockup-on-dark" if not dark else "lockup-on-light", 40); im.paste(lk, (60, PH - 80), lk)
    tracked(d, (PW - 60, PH - 76), cta.upper() + "  →", F(JBMB, 26), (236, 104, 80) if not dark else RED, 3, "r")
    im.save(f"{O}/posts/{name}.png"); return f"posts/{name}.png"
with open(f"{O}/bulk-create.csv", "w", newline="") as f:
    w = csv.writer(f); w.writerow(["name", "type", "headline_1", "headline_2_red", "body", "cta", "image", "rendered_post", "size"])
    for r in ROWS: w.writerow([*r, post(r), "1080x1350"])
print(len(ROWS))
