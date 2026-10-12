"""Blueprint Trades journal art, Night Session (kit v2.0): night navy, starlight, gold, red and blue candles.
Reuses the drawing helpers in bt.py and re-points its palette. Kit files are read, never edited."""
import os, sys, random, csv
sys.path.insert(0, os.path.dirname(__file__))
import bt
from bt import F, tracked, grid, grain, pencil, anton_block, wrap, spiral_book, drop_shadow, LETTER, ANTON, JBM, JBMB, SANS, SANS_B, SANS_I, HAND, KIT
from PIL import Image, ImageDraw, ImageFilter

OUT = bt.OUT
NIGHT = (15, 19, 48); NIGHT_D = (10, 13, 34); NIGHT_G = (30, 37, 80); STAR = (233, 236, 245); GOLD = (212, 166, 64)
HAZE = (138, 147, 184); BLUE = (61, 123, 255); REDC = (229, 72, 77)
# light-surface variants (journal paper and the light store)
PAGE = (244, 245, 250); PAGE_G = (224, 228, 240); INK = (15, 19, 48); INK_M = (82, 90, 125); GOLD_D = (154, 116, 32); BLUE_D = (47, 102, 224); RED_D = (201, 54, 60)
W, H = bt.W, bt.H

def candles(d, box, data, up=BLUE, dn=REDC, seed=3, w=5):
    """Night Session candles: blue up, red down, both filled, same weight."""
    x0, y0, x1, y1 = box; lo = min(c[2] for c in data); hi = max(c[1] for c in data); n = len(data); cw = (x1 - x0) / n
    Y = lambda v: y1 - (v - lo) / (hi - lo) * (y1 - y0)
    for i, (o, h, l, c) in enumerate(data):
        cx = x0 + cw * (i + .5); col = up if c >= o else dn; bw = cw * .3
        d.line([(cx, Y(h)), (cx, Y(l))], fill=col, width=max(2, w - 2))
        top, bot = Y(max(o, c)), Y(min(o, c)); d.rectangle([cx - bw, top, cx + bw, max(bot, top + 4)], fill=col)
    return Y

def lockup(h, dark=True):
    """Kit horizontal lockup with its two candles recoloured red then blue, as in the kit's mark."""
    im = Image.open(f"{KIT}/logo/lockup-on-{'dark' if dark else 'light'}.png").convert("RGBA")
    px = im.load(); base = STAR if dark else NIGHT
    for y in range(im.height):
        for x in range(0, 240):
            r, g, b, a = px[x, y]
            if a and abs(r - base[0]) < 40 and abs(g - base[1]) < 40 and abs(b - base[2]) < 40:
                px[x, y] = (*(REDC if x < 150 else BLUE), a)
    im = im.crop(im.getbbox()); return im.resize((int(im.width * h / im.height), h), Image.LANCZOS)

def mark(h):
    lk = lockup(400); return lk.crop((0, 0, int(lk.height * 0.95), lk.height)).resize((int(h * 0.95), h), Image.LANCZOS)

def stars(im, n=260, seed=5):
    rng = random.Random(seed); d = ImageDraw.Draw(im, "RGBA")
    for _ in range(n):
        x, y, r = rng.randrange(im.width), rng.randrange(im.height), rng.choice([1, 1, 1, 2, 2, 3])
        d.ellipse([x - r, y - r, x + r, y + r], fill=(*STAR, rng.randrange(40, 150)))

SESSION = [(100, 101.2, 98.8, 99.4), (99.4, 100, 97, 97.6), (97.6, 98.6, 96.6, 98.2), (98.2, 98.8, 95.2, 96.0), (96, 97.4, 93.6, 97.0),
           (97, 99.8, 96.6, 99.4), (99.4, 100.4, 98.2, 98.6), (98.6, 101.8, 98.4, 101.4), (101.4, 103, 100.6, 102.6), (102.6, 103.4, 101, 101.6),
           (101.6, 104.4, 101.4, 104), (104, 106.6, 103.6, 106.2), (106.2, 107, 104.6, 105.2), (105.2, 108.6, 105, 108.2), (108.2, 110.4, 107.6, 110),
           (110, 110.8, 108.6, 109.2), (109.2, 111.8, 109, 111.4), (111.4, 112.2, 110.2, 110.6)]

def cover_front():
    im = Image.new("RGB", (W, H), NIGHT); grid(im, 40, minor=(24, 30, 66), major=(32, 40, 84), every=5, w=1); stars(im)
    d = ImageDraw.Draw(im, "RGBA")
    d.rectangle([70, 70, W - 70, H - 70], outline=(*NIGHT_G, 255), width=3)
    mk = mark(130); im.paste(mk, (130, 140), mk)
    tracked(d, (W - 130, 150), "NIGHT SESSION", F(JBMB, 30), GOLD, 8, "r"); tracked(d, (W - 130, 198), "VOL. 01 · BEFORE THE OPEN", F(JBM, 24), HAZE, 5, "r")
    t1 = anton_block("TRADING", 330, GOLD, 4); t2 = anton_block("JOURNAL", 330, GOLD, 4)
    s = (W - 260) / max(t1.width, t2.width); t1 = t1.resize((int(t1.width * s), int(t1.height * s))); t2 = t2.resize((int(t2.width * s), int(t2.height * s)))
    im.paste(t1, (130, 360), t1); im.paste(t2, (130, 360 + t1.height + 36), t2); y = 360 + t1.height + 36 + t2.height + 80
    d.text((130, y), "Master yourself,", font=F(SANS_B, 62), fill=STAR); d.text((130, y + 78), "to master the market.", font=F(SANS_B, 62), fill=STAR)
    bx = (130, 1290, W - 130, 1730)
    Y = candles(d, (bx[0] + 20, bx[1] + 70, bx[2] - 20, bx[3] - 20), SESSION, seed=4, w=6)
    lv = Y(95.8); d.line([(bx[0], lv), (bx[2], lv)], fill=GOLD, width=5)
    cw = (bx[2] - bx[0] - 40) / len(SESSION)
    for i in (4,):
        cx = bx[0] + 20 + cw * (i + .5); cy = Y(93.6); d.ellipse([cx - 34, cy - 34, cx + 34, cy + 34], outline=GOLD, width=5)
    tracked(d, (bx[2], lv + 18), "LEVEL HELD · RETEST", F(JBMB, 24), GOLD, 4, "r")
    tracked(d, (bx[0], bx[1] + 6), "BLUE · UP     RED · DOWN     GOLD · THE LEVEL", F(JBM, 22), HAZE, 4)
    fy = H - 300; d.line([(70, fy), (W - 70, fy)], fill=(*NIGHT_G, 255), width=3)
    for i, k in enumerate(["TRADER", "STARTED", "ACCOUNT"]):
        x = 130 + i * 420; tracked(d, (x, fy + 40), k, F(JBMB, 22), HAZE, 4); d.line([(x, fy + 120), (x + 360, fy + 120)], fill=(*HAZE, 120), width=2)
    lk = lockup(54); im.paste(lk, ((W - lk.width) // 2, H - 150), lk)
    return grain(im, 3, 2)

def cover_back():
    im = Image.new("RGB", (W, H), NIGHT); grid(im, 40, minor=(24, 30, 66), major=(32, 40, 84), every=5, w=1); stars(im, 200, 9)
    d = ImageDraw.Draw(im, "RGBA"); d.rectangle([70, 70, W - 70, H - 70], outline=(*NIGHT_G, 255), width=3)
    t = anton_block("TRADING JOURNAL", 120, GOLD, 3); im.paste(t, ((W - t.width) // 2, 190), t)
    tracked(d, (W / 2, 350), "A NOTE BEFORE YOU START", F(JBMB, 26), HAZE, 6, "m")
    d.rectangle([140, 430, W - 140, 1640], fill=(*NIGHT_D, 230), outline=(*NIGHT_G, 255), width=2)
    f = F(SANS, 40); y = 490
    for p in LETTER:
        for ln in wrap(d, p, f, W - 400): d.text((200, y), ln, font=f, fill=STAR); y += 54
        y += 26
    d.text((200, y - 4), "- Blueprint", font=F(SANS_I, 50), fill=GOLD)
    fy = H - 330; d.line([(70, fy), (W - 70, fy)], fill=(*NIGHT_G, 255), width=3)
    lk = lockup(58); im.paste(lk, (140, fy + 70), lk)
    tracked(d, (140, fy + 170), "YOUTUBE.COM/@BLUEPRINT_TRADES", F(JBM, 24), HAZE, 3)
    tracked(d, (140, fy + 210), "NOT FINANCIAL ADVICE. TRADING INVOLVES RISK OF LOSS.", F(JBM, 20), HAZE, 2)
    bx = W - 140 - 300; d.rectangle([bx, fy + 50, W - 140, fy + 230], fill=STAR)
    rng = random.Random(4); x = bx + 24
    while x < W - 164:
        w = rng.choice([2, 3, 5]); d.rectangle([x, fy + 70, x + w, fy + 190], fill=NIGHT); x += w + rng.choice([3, 4, 6])
    tracked(d, (bx + 150, fy + 198), "ISBN PLACEHOLDER", F(JBM, 16), INK_M, 2, "m")
    return grain(im, 3, 3)

def pages():
    """Interior stays light for writing: starlight paper, night ink, gold marks, red and blue candles."""
    bt.PAPER_HI, bt.GRAPHITE, bt.RED, bt.STEEL, bt.GRAPH, bt.PAPER = PAGE, INK, GOLD_D, INK_M, PAGE_G, STAR
    bt.sketch_candles = lambda d, box, data, up=None, dn=None, seed=3, w=5: candles(d, box, data, BLUE_D, RED_D, seed, w)
    orig_grid = bt.grid
    bt.grid = lambda im, step, minor=None, major=None, every=5, w=1, origin=(0, 0), alpha=255: orig_grid(im, step, (228, 231, 242), (214, 219, 235), every, w, origin, alpha)
    pp, pr = bt.page_plan(), bt.page_reality(); bp, br = bt.page_plan(False), bt.page_reality(False)
    bt.grid = orig_grid
    return pp, pr, bp, br

def spread(pp, pr, SW=3200, SH=2140):
    im = Image.new("RGB", (SW, SH), NIGHT_D); pw, ph = 1480, 2040; top = (SH - ph) // 2; lx = SW // 2 - pw
    im.paste(pp.resize((pw, ph)), (lx, top)); im.paste(pr.resize((pw, ph)), (SW // 2, top))
    g = Image.new("RGBA", (SW, SH), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    for i in range(80):
        a = int(80 * (1 - i / 80) ** 2)
        for x in (SW // 2 - i, SW // 2 + i): gd.line([(x, top), (x, top + ph)], fill=(10, 13, 34, a))
    return Image.alpha_composite(im.convert("RGBA"), g).convert("RGB")

def hero(printed, night, dark=True, HW=2400, HH=1900):
    bg = NIGHT if dark else STAR
    im = Image.new("RGB", (HW, HH), bg)
    if dark: grid(im, 60, minor=(24, 30, 66), major=(32, 40, 84), every=5, w=2); stars(im, 220, 12)
    else: grid(im, 60, minor=(222, 226, 239), major=(208, 213, 230), every=5, w=2)
    d = ImageDraw.Draw(im, "RGBA")
    # faint session chart behind the books
    Y = candles(d, (80, 300, HW - 80, HH - 300), (SESSION * 3)[:46], (*BLUE, 70) if dark else (*BLUE_D, 60), (*REDC, 70) if dark else (*RED_D, 60), w=7)
    im = im.convert("RGBA")
    b2 = spiral_book(night, 0.56).rotate(8, resample=Image.BICUBIC, expand=True)
    drop_shadow(im, b2, (int(HW * 0.40), int(HH * 0.14)), blur=50, offset=(40, 60), alpha=220 if dark else 120)
    b1 = spiral_book(printed, 0.58).rotate(-6, resample=Image.BICUBIC, expand=True)
    drop_shadow(im, b1, (int(HW * 0.05), int(HH * 0.20)), blur=60, offset=(50, 80), alpha=230 if dark else 150)
    d = ImageDraw.Draw(im, "RGBA"); tracked(d, (HW - 120, HH * 0.06), "BULL & BEAR  ·  NIGHT SESSION", F(JBMB, 34), GOLD if dark else GOLD_D, 6, "r")
    return im.convert("RGB")

POSTS = [
  ("launch-bullbear", "THE TRADING JOURNAL", "Master yourself.", "Master the market.", "The Bull & Bear edition. Plan + Reality pages for every trade.", "Shop the journal", "cover-front.jpg"),
  ("launch-night", "THE TRADING JOURNAL", "Written", "before the open.", "The Night Session edition. Same pages, the channel's cover.", "Shop the journal", "night-front.png"),
  ("field-key-levels", "INSIDE THE JOURNAL", "Key levels", "first.", "Write the higher-timeframe level and the zone before you look for an entry.", "See inside", "page-plan-sample.png"),
  ("field-mm-check", "INSIDE THE JOURNAL", "Don't be", "the liquidity.", "The market-maker risk check: four ticks before every trade.", "See inside", "page-plan-sample.png"),
  ("field-emotion", "INSIDE THE JOURNAL", "Calm or", "wired?", "Score yourself 1 to 5 before and after. Your state is a market variable.", "See inside", "page-plan-sample.png"),
  ("field-adherence", "INSIDE THE JOURNAL", "Score the rules,", "not the P&L.", "Plan adherence: did you do what the plan said?", "See inside", "page-reality-sample.png"),
  ("field-lesson", "INSIDE THE JOURNAL", "Red days", "included.", "One lesson per trade. Losing days get the same ink as winners.", "See inside", "page-reality-sample.png"),
  ("field-past-self", "INSIDE THE JOURNAL", "What would you tell", "your past self?", "The question that turns a bad week into tuition you pay once.", "See inside", "page-reality-sample.png"),
  ("letter-1", "FROM THE BACK COVER", "No one can promise", "profitability.", "But commit to this journal and you will become a better trader. - Blueprint", "Read the back cover", "night-back.png"),
  ("letter-2", "FROM THE BACK COVER", "A marathon,", "not a shortcut.", "Every step you take, every lesson you learn, moves you forward. - Blueprint", "Read the back cover", "cover-back.jpg"),
  ("video-influencers", "WATCH, THEN WRITE", "Stop relying on", "influencers.", "Watch: I Followed Trading Influencers and It Nearly Destroyed Me", "Watch on YouTube", "page-reality-sample.png"),
  ("video-mm-setup", "WATCH, THEN WRITE", "Don't fall for", "this setup.", "Watch: Don't Fall for This Market Maker Setup. Then log it on the Plan page.", "Watch on YouTube", "page-plan-sample.png"),
]

def post(r, O):
    name, kicker, h1, h2, body, cta, img = r; PW, PH = 1080, 1350
    im = Image.new("RGB", (PW, PH), NIGHT); grid(im, 40, minor=(24, 30, 66), major=(32, 40, 84), every=5, w=1); d = ImageDraw.Draw(im, "RGBA")
    tracked(d, (60, 60), kicker, F(JBMB, 24), GOLD, 5)
    a = anton_block(h1.upper(), 120, STAR, 2); b = anton_block(h2.upper(), 120, GOLD, 2)
    sc = min(1, 960 / max(a.width, b.width)); a = a.resize((int(a.width * sc), int(a.height * sc))); b = b.resize((int(b.width * sc), int(b.height * sc)))
    im.paste(a, (60, 120), a); im.paste(b, (60, 140 + a.height), b); y = 170 + a.height + b.height
    for ln in wrap(d, body, F(SANS, 36), 960): d.text((60, y), ln, font=F(SANS, 36), fill=HAZE); y += 48
    src = Image.open(f"{OUT}/{img}").convert("RGB"); src.thumbnail((620, PH - y - 220)); x = (PW - src.width) // 2; yy = y + 40
    sh = Image.new("RGBA", (PW, PH), (0, 0, 0, 0)); ImageDraw.Draw(sh).rectangle([x + 16, yy + 22, x + src.width + 16, yy + src.height + 22], fill=(0, 0, 0, 160))
    im = Image.alpha_composite(im.convert("RGBA"), sh.filter(ImageFilter.GaussianBlur(18))).convert("RGB"); im.paste(src, (x, yy)); d = ImageDraw.Draw(im, "RGBA")
    d.rectangle([0, PH - 120, PW, PH], fill=NIGHT_D); d.line([(0, PH - 120), (PW, PH - 120)], fill=NIGHT_G, width=2)
    lk = lockup(40); im.paste(lk, (60, PH - 80), lk)
    tracked(d, (PW - 60, PH - 76), cta.upper() + "  →", F(JBMB, 26), GOLD, 3, "r")
    im.save(f"{O}/posts/{name}.png"); return f"posts/{name}.png"

if __name__ == "__main__":
    WEB = sys.argv[1]; T = f"{WEB}/tex"; os.makedirs(T, exist_ok=True)
    printed_f = Image.open(f"{OUT}/cover-front.jpg").convert("RGB"); printed_b = Image.open(f"{OUT}/cover-back.jpg").convert("RGB")
    nf, nb = cover_front(), cover_back(); nf.save(f"{OUT}/night-front.png"); nb.save(f"{OUT}/night-back.png")
    pp, pr, bp, br = pages()
    for nm, im in [("page-plan-sample", pp), ("page-reality-sample", pr), ("page-plan-blank", bp), ("page-reality-blank", br)]: im.save(f"{OUT}/{nm}.png")
    sp = spread(pp, pr); sp.save(f"{OUT}/spread-plan-reality.jpg", quality=90)
    hd, hl = hero(printed_f, nf, True), hero(printed_f, nf, False); hd.save(f"{OUT}/hero-dark.jpg", quality=90); hl.save(f"{OUT}/hero-light.jpg", quality=90)
    lockup(80, True).save(f"{OUT}/lockup-night-on-dark.png"); lockup(80, False).save(f"{OUT}/lockup-night-on-light.png")
    hd.resize((1200, 950), Image.LANCZOS).save(f"{WEB}/hero-dark.jpg", quality=80); hl.resize((1200, 950), Image.LANCZOS).save(f"{WEB}/hero-light.jpg", quality=80)
    sp.resize((1600, 1070), Image.LANCZOS).save(f"{WEB}/spread.jpg", quality=80)
    bt.thumb(printed_f, 240).save(f"{WEB}/cover-printed.jpg", quality=82); bt.thumb(nf, 240).save(f"{WEB}/cover-night.jpg", quality=82)
    printed_b.resize((700, int(700 * printed_b.height / printed_b.width)), Image.LANCZOS).save(f"{WEB}/back-printed.jpg", quality=80)
    lockup(80, True).save(f"{WEB}/lockup-on-dark.png"); lockup(80, False).save(f"{WEB}/lockup-on-light.png")
    for nm, im in [("printed_front", printed_f), ("printed_back", printed_b), ("night_front", nf), ("night_back", nb), ("page", pp)]:
        im.resize((740, 1050), Image.LANCZOS).save(f"{T}/{nm}.jpg", quality=84)
    O = "/mnt/project-files/blueprint/bulk"; os.makedirs(f"{O}/posts", exist_ok=True)
    for f in os.listdir(f"{O}/posts"): os.remove(f"{O}/posts/{f}")
    with open(f"{O}/bulk-create.csv", "w", newline="") as fh:
        w = csv.writer(fh); w.writerow(["name", "kicker", "headline_1", "headline_2_gold", "body", "cta", "image", "rendered_post", "size"])
        for r in POSTS: w.writerow([*r, post(r, O), "1080x1350"])
    for old in ["fieldnotes-front.png", "fieldnotes-back.png"]:
        if os.path.exists(f"{OUT}/{old}"): os.makedirs(f"{OUT}/retired-field-notes", exist_ok=True); os.replace(f"{OUT}/{old}", f"{OUT}/retired-field-notes/{old}")
    print("ok")
