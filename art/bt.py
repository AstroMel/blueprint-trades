"""Blueprint Trades journal art: Field Notes covers (front/back), interior Plan/Reality pages, store spread, hero shots.
Palette and type follow the YouTube kit in /mnt/project-files/youtube-brand (read-only; logos are copied, never edited)."""
import glob, math, os, random, shutil, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

KIT = "/mnt/project-files/youtube-brand"
OUT = "/mnt/project-files/blueprint/art"
CF = glob.glob("/root/.claude/skills/synced/*/canvas-design/canvas-fonts/")[0]
ANTON = f"{KIT}/fonts/Anton.ttf"; JBM = f"{KIT}/fonts/JBM-500.ttf"; JBMB = f"{KIT}/fonts/JBM-700.ttf"
SANS = CF + "InstrumentSans-Regular.ttf"; SANS_B = CF + "InstrumentSans-Bold.ttf"; SANS_I = CF + "InstrumentSans-Italic.ttf"
HAND = CF + "NothingYouCouldDo-Regular.ttf"

# Field Notes palette (kit option a): drafting paper, graph rule, graphite, red pencil, steel
PAPER = (236, 229, 210); GRAPH = (221, 211, 186); GRAPHITE = (30, 29, 26); RED = (210, 64, 43); STEEL = (122, 115, 101)
PAPER_HI = (245, 240, 227); RED_D = (184, 54, 31); GREEN = (62, 112, 72)
NIGHT = (30, 29, 26); NIGHT_D = (22, 21, 19); NIGHT_LINE = (64, 61, 54)

def F(p, s): return ImageFont.truetype(p, s)

def tracked(d, xy, text, f, fill, track=0, anchor="l"):
    w = sum(d.textlength(c, font=f) + track for c in text) - track
    x = xy[0] - (w / 2 if anchor == "m" else w if anchor == "r" else 0)
    for c in text:
        d.text((x, xy[1]), c, font=f, fill=fill); x += d.textlength(c, font=f) + track
    return w

def grid(im, step, minor=GRAPH, major=None, every=5, w=2, origin=(0, 0), alpha=255):
    d = ImageDraw.Draw(im, "RGBA"); W, H = im.size; major = major or tuple(max(0, c - 22) for c in minor)
    for i, x in enumerate(range(origin[0], W, step)): d.line([(x, 0), (x, H)], fill=(*(major if i % every == 0 else minor), alpha), width=w + (1 if i % every == 0 else 0))
    for i, y in enumerate(range(origin[1], H, step)): d.line([(0, y), (W, y)], fill=(*(major if i % every == 0 else minor), alpha), width=w + (1 if i % every == 0 else 0))

def grain(im, amt=7, seed=1):
    rng = np.random.default_rng(seed); a = np.asarray(im.convert("RGB")).astype(np.int16)
    n = rng.normal(0, amt, a.shape[:2])[..., None]; return Image.fromarray(np.clip(a + n, 0, 255).astype(np.uint8))

def pencil(d, pts, fill, width=6, seed=0, jitter=1.6):
    """A slightly wobbly pencil stroke, drawn twice for graphite texture."""
    rng = random.Random(seed)
    for k in range(2):
        q = [(x + rng.uniform(-jitter, jitter), y + rng.uniform(-jitter, jitter)) for x, y in pts]
        d.line(q, fill=fill, width=max(1, width - k * 2), joint="curve")

def series(n, seed, start=100.0, vol=2.2, drift=0.25):
    rng = random.Random(seed); out = []; p = start
    for _ in range(n):
        o = p; c = o + rng.gauss(drift, vol); h = max(o, c) + abs(rng.gauss(0, vol * .6)); l = min(o, c) - abs(rng.gauss(0, vol * .6)); out.append((o, h, l, c)); p = c
    return out

def sketch_candles(d, box, data, up=GRAPHITE, dn=GRAPHITE, seed=3, w=5):
    x0, y0, x1, y1 = box; lo = min(c[2] for c in data); hi = max(c[1] for c in data); n = len(data); cw = (x1 - x0) / n
    Y = lambda v: y1 - (v - lo) / (hi - lo) * (y1 - y0)
    for i, (o, h, l, c) in enumerate(data):
        cx = x0 + cw * (i + .5); col = up if c >= o else dn; bw = cw * .32
        pencil(d, [(cx, Y(h)), (cx, Y(l))], col, max(2, w - 2), seed + i)
        top, bot = Y(max(o, c)), Y(min(o, c)); bot = max(bot, top + 4)
        if c >= o: d.rectangle([cx - bw, top, cx + bw, bot], outline=col, width=w)
        else: d.rectangle([cx - bw, top, cx + bw, bot], fill=col)
    return Y

def kit_logo(name, h):
    im = Image.open(f"{KIT}/logo/{name}.png").convert("RGBA"); im = im.crop(im.getbbox())
    return im.resize((int(im.width * h / im.height), h), Image.LANCZOS)

def anton_block(text, size, color, track=0):
    f = F(ANTON, size); d0 = ImageDraw.Draw(Image.new("RGBA", (8, 8))); w = int(sum(d0.textlength(c, font=f) + track for c in text) + 40)
    im = Image.new("RGBA", (w, int(size * 1.5)), (0, 0, 0, 0)); tracked(ImageDraw.Draw(im), (20, 0), text, f, (*color, 255), track)
    return im.crop(im.getbbox())

W, H = 1480, 2100  # A5 at 10 px/mm

def cover_front():
    im = Image.new("RGB", (W, H), PAPER); grid(im, 37, origin=(18, 18)); d = ImageDraw.Draw(im, "RGBA")
    # title block border, like a drafting sheet
    d.rectangle([70, 70, W - 70, H - 70], outline=GRAPHITE, width=6); d.rectangle([86, 86, W - 86, H - 86], outline=(*GRAPHITE, 120), width=2)
    mk = kit_logo("mark-on-light", 150); im.paste(mk, (140, 150), mk)
    tracked(d, (W - 140, 165), "VOL. 01", F(JBMB, 34), GRAPHITE, 6, "r"); tracked(d, (W - 140, 215), "PLAN · TRADE · REALITY", F(JBM, 26), STEEL, 4, "r")
    t1 = anton_block("TRADING", 330, GRAPHITE, 4); t2 = anton_block("JOURNAL", 330, RED, 4)
    s = min(1, (W - 280) / max(t1.width, t2.width)); t1 = t1.resize((int(t1.width * s), int(t1.height * s))); t2 = t2.resize((int(t2.width * s), int(t2.height * s)))
    im.paste(t1, (140, 380), t1); im.paste(t2, (140, 380 + t1.height + 40), t2)
    y = 380 + t1.height + 40 + t2.height + 70
    d.text((140, y), "Master yourself,", font=F(SANS_B, 64), fill=GRAPHITE); d.text((140, y + 80), "to master the market.", font=F(SANS_B, 64), fill=GRAPHITE)
    # pencil chart: price sweeps under the level, reclaims it, then trends (the retest the channel teaches)
    bx = (140, 1240, W - 140, 1700); d.rectangle(bx, outline=(*GRAPHITE, 90), width=2)
    data = [(100,101.5,98.5,99),(99,100,96.5,97.2),(97.2,98,95.8,96.4),(96.4,97,93.2,95.2),(95.2,98.4,94.8,98),(98,99.5,96.6,97),
            (97,98.2,95.9,97.8),(97.8,101,97.4,100.6),(100.6,102.6,100,102.2),(102.2,103,100.4,101),(101,103.8,100.8,103.4),
            (103.4,106,103,105.6),(105.6,106.4,104.2,104.8),(104.8,108,104.6,107.6),(107.6,110.2,107,109.8),(109.8,110.6,108.4,109)]
    Y = sketch_candles(d, (bx[0] + 30, bx[1] + 110, bx[2] - 30, bx[3] - 30), data, seed=5)
    lv = Y(95.6); pencil(d, [(bx[0] + 10, lv), (bx[2] - 10, lv)], RED, 5, 9)
    cw = (bx[2] - bx[0] - 60) / len(data); sx = bx[0] + 30 + cw * 3.5
    d.ellipse([sx - 46, Y(93.2) - 30, sx + 46, Y(93.2) + 30], outline=RED, width=5)
    hf = F(HAND, 44); d.text((bx[2] - 230, lv + 12), "key level", font=hf, fill=RED)
    d.text((bx[0] + 30, bx[1] + 22), "sweep. reclaim. retest. then size in.", font=hf, fill=RED)
    # title block at the foot
    fy = H - 300; d.line([(86, fy), (W - 86, fy)], fill=GRAPHITE, width=4)
    for i, (k, v) in enumerate([("TRADER", ""), ("STARTED", ""), ("ACCOUNT", "")]):
        x = 140 + i * 420; tracked(d, (x, fy + 40), k, F(JBMB, 24), STEEL, 4); d.line([(x, fy + 130), (x + 360, fy + 130)], fill=(*GRAPHITE, 140), width=2)
    lk = kit_logo("lockup-on-light", 56); im.paste(lk, ((W - lk.width) // 2, H - 150), lk)
    return grain(im, 5, 2)

LETTER = [
    "I won't promise you profitability, no one can. But I will promise you this: if you commit to this journal, you will become a better trader.",
    "And that changes everything.",
    "Real success in this industry comes down to one thing, your ability to execute your own ideas with confidence and discipline. That's freedom. That's power.",
    "Respect the journey and always remember this is a marathon, not some rich quick shortcut. Every step you take, every lesson you learn, moves you forward.",
    "Repetition and time in the market, that's where growth lives. Monitoring your habits and adjusting accordingly, that's where mastery and real strategies are built.",
    "Stay patient. Stay disciplined. Keep showing up.",
    "Do that, and you won't just improve, you'll transform.",
]

def wrap(d, text, f, width):
    out, line = [], ""
    for w in text.split():
        t = (line + " " + w).strip()
        if d.textlength(t, font=f) <= width: line = t
        else: out.append(line); line = w
    return out + [line]

def cover_back():
    im = Image.new("RGB", (W, H), PAPER); grid(im, 37, origin=(18, 18)); d = ImageDraw.Draw(im, "RGBA")
    d.rectangle([70, 70, W - 70, H - 70], outline=GRAPHITE, width=6)
    t = anton_block("TRADING JOURNAL", 120, GRAPHITE, 3); im.paste(t, ((W - t.width) // 2, 200), t)
    tracked(d, (W / 2, 360), "A NOTE BEFORE YOU START", F(JBMB, 26), RED, 6, "m")
    # letter on a paper plate so it reads over the grid
    d.rectangle([140, 440, W - 140, 1640], fill=(*PAPER_HI, 235), outline=(*GRAPHITE, 60), width=2)
    f = F(SANS, 40); y = 500
    for p in LETTER:
        for ln in wrap(d, p, f, W - 400): d.text((200, y), ln, font=f, fill=GRAPHITE); y += 54
        y += 26
    d.text((200, y - 6), "- Blueprint", font=F(HAND, 64), fill=RED)
    # foot: lockup, channel, barcode placeholder
    fy = H - 330; d.line([(86, fy), (W - 86, fy)], fill=GRAPHITE, width=4)
    lk = kit_logo("lockup-on-light", 60); im.paste(lk, (140, fy + 70), lk)
    tracked(d, (140, fy + 170), "YOUTUBE.COM/@BLUEPRINT_TRADES", F(JBM, 24), STEEL, 3)
    tracked(d, (140, fy + 210), "NOT FINANCIAL ADVICE. TRADING INVOLVES RISK OF LOSS.", F(JBM, 20), STEEL, 2)
    bx = W - 140 - 300; d.rectangle([bx, fy + 50, W - 140, fy + 230], fill=PAPER_HI, outline=GRAPHITE, width=2)
    rng = random.Random(4); x = bx + 24
    while x < W - 164:
        w = rng.choice([2, 3, 5]); d.rectangle([x, fy + 70, x + w, fy + 190], fill=GRAPHITE); x += w + rng.choice([3, 4, 6])
    tracked(d, (bx + 150, fy + 198), "ISBN PLACEHOLDER", F(JBM, 16), STEEL, 2, "m")
    return grain(im, 5, 3)

# ---------- interior: THE PLAN (left) and THE REALITY (right) ----------
def section(d, x, y, n, title, w):
    d.rectangle([x, y, x + 46, y + 46], fill=GRAPHITE); tracked(d, (x + 23, y + 7), n, F(JBMB, 26), PAPER, 0, "m")
    tracked(d, (x + 64, y + 8), title, F(JBMB, 28), GRAPHITE, 4); d.line([(x, y + 60), (x + w, y + 60)], fill=GRAPHITE, width=3)
    return y + 84

def lines(d, x, y, w, n, gap=58, col=GRAPH):
    for i in range(n): d.line([(x, y + i * gap + gap - 8), (x + w, y + i * gap + gap - 8)], fill=col, width=3)
    return y + n * gap

def boxes(d, x, y, items, checked=(), hand=True, f=None):
    f = f or F(SANS, 34)
    for i, t in enumerate(items):
        yy = y + i * 62; d.rectangle([x, yy, x + 38, yy + 38], outline=GRAPHITE, width=3)
        if hand and i in checked: pencil(d, [(x + 6, yy + 20), (x + 16, yy + 32), (x + 36, yy + 2)], RED, 6, i)
        d.text((x + 60, yy - 2), t, font=f, fill=GRAPHITE)
    return y + len(items) * 62

def scale5(d, x, y, label, pick=None):
    tracked(d, (x, y + 8), label, F(JBM, 24), STEEL, 2)
    for i in range(5):
        cx = x + 330 + i * 76; d.ellipse([cx, y, cx + 50, y + 50], outline=GRAPHITE, width=3); tracked(d, (cx + 25, y + 9), str(i + 1), F(JBMB, 24), GRAPHITE, 0, "m")
        if pick == i + 1: d.ellipse([cx - 8, y - 8, cx + 58, y + 58], outline=RED, width=5)
    return y + 74

def page_plan(filled=True, PW=1480, PH=2100):
    im = Image.new("RGB", (PW, PH), PAPER_HI); grid(im, 37, minor=(232, 225, 206), every=5, w=1); d = ImageDraw.Draw(im, "RGBA")
    X, R = 120, PW - 120; w = R - X; hf = F(HAND, 46)
    d.text((X, 90), "THE PLAN", font=F(ANTON, 120), fill=GRAPHITE)
    tracked(d, (R, 110), "BEFORE THE OPEN", F(JBMB, 26), RED, 4, "r"); tracked(d, (R, 156), "DATE ____ / ____", F(JBM, 26), STEEL, 3, "r")
    y = 280
    # ticker row
    for i, k in enumerate(["TICKER", "TIMEFRAME", "SESSION"]):
        xx = X + i * (w // 3); tracked(d, (xx, y), k, F(JBM, 22), STEEL, 3); d.line([(xx, y + 92), (xx + w // 3 - 40, y + 92)], fill=GRAPHITE, width=2)
        if filled: d.text((xx + 4, y + 30), ["NQ", "15m / 1H", "NY open"][i], font=hf, fill=GRAPHITE)
    y = section(d, X, y + 140, "1", "KEY LEVELS USED", w)
    for i, (tag, val) in enumerate([("HTF", "18 412 daily high, tested 3x"), ("ZONE", "18 350 - 18 365 demand"), ("PDL", "18 296 prior day low")]):
        yy = y + i * 64; tracked(d, (X, yy + 14), tag, F(JBMB, 22), RED, 2); d.line([(X + 110, yy + 56), (R, yy + 56)], fill=GRAPH, width=3)
        if filled: d.text((X + 120, yy + 4), val, font=hf, fill=GRAPHITE)
    y = section(d, X, y + 220, "2", "THE TRADE I WANT", w)
    cols = [("ENTRY", "18 368"), ("STOP", "18 344"), ("TARGET", "18 416"), ("SIZE", "2 MNQ"), ("R", "2.0")]
    cw = w // 5
    for i, (k, v) in enumerate(cols):
        xx = X + i * cw; d.rectangle([xx, y, xx + cw - 14, y + 120], outline=GRAPHITE, width=2); tracked(d, (xx + 14, y + 12), k, F(JBM, 20), STEEL, 2)
        if filled: d.text((xx + 14, y + 46), v, font=F(HAND, 44), fill=GRAPHITE)
    y = section(d, X, y + 170, "3", "MARKET-MAKER RISK CHECK", w)
    y = boxes(d, X, y, ["Is this level obvious to everyone?", "Did price just sweep a high or low?", "Am I chasing a wick, or waiting for a retest?", "Red-folder news inside 30 minutes?"], checked=(0, 1, 2) if filled else ())
    y = section(d, X, y + 40, "4", "EMOTION BEFORE", w)
    y = scale5(d, X, y, "CALM  →  WIRED", 2 if filled else None)
    if filled: d.text((X, y + 4), "slept fine, no revenge from yesterday", font=hf, fill=STEEL)
    tracked(d, (X, PH - 90), "IF IT'S NOT ON THIS PAGE, IT'S NOT A TRADE.", F(JBMB, 22), STEEL, 3)
    tracked(d, (R, PH - 90), "BLUEPRINT TRADES", F(JBMB, 22), RED, 3, "r")
    return grain(im, 3, 7)

def page_reality(filled=True, PW=1480, PH=2100):
    im = Image.new("RGB", (PW, PH), PAPER_HI); grid(im, 37, minor=(232, 225, 206), every=5, w=1); d = ImageDraw.Draw(im, "RGBA")
    X, R = 120, PW - 120; w = R - X; hf = F(HAND, 46)
    d.text((X, 90), "THE REALITY", font=F(ANTON, 120), fill=GRAPHITE)
    tracked(d, (R, 110), "AFTER THE CLOSE", F(JBMB, 26), RED, 4, "r")
    y = 280; bx = (X, y, R, y + 420); d.rectangle(bx, outline=GRAPHITE, width=2); tracked(d, (X + 16, y + 14), "REDRAW THE MOVE", F(JBM, 20), STEEL, 2)
    if filled:
        Y = sketch_candles(d, (X + 40, y + 60, R - 40, y + 390), series(24, 11, vol=2.0, drift=.4), seed=2)
        ly = y + 250; pencil(d, [(X + 20, ly), (R - 20, ly)], RED, 4, 3); d.text((R - 330, ly + 8), "entry  +1.6R", font=F(HAND, 40), fill=RED)
    y = section(d, X, y + 470, "5", "RESULT", w)
    for i, (k, v) in enumerate([("R", "+1.6"), ("P / L", "+$412"), ("HELD", "38 min")]):
        xx = X + i * (w // 3); tracked(d, (xx, y + 8), k, F(JBM, 22), STEEL, 2); d.line([(xx, y + 90), (xx + w // 3 - 40, y + 90)], fill=GRAPHITE, width=2)
        if filled: d.text((xx + 4, y + 30), v, font=hf, fill=GRAPHITE)
    y = section(d, X, y + 130, "6", "PLAN ADHERENCE", w)
    y = boxes(d, X, y, ["Entered at my level, not before", "Stop where the plan said", "Size matched the risk table", "Took profit at target, no fiddling"], checked=(0, 1, 2) if filled else ())
    tracked(d, (X, y + 8), "RULES FOLLOWED", F(JBM, 22), STEEL, 2)
    if filled: d.text((X + 290, y - 8), "3 / 4", font=F(HAND, 52), fill=RED)
    y = section(d, X, y + 80, "7", "EMOTION AFTER", w); y = scale5(d, X, y, "CALM  →  WIRED", 3 if filled else None)
    y = section(d, X, y + 10, "8", "LESSON LEARNED", w); y0 = y; y = lines(d, X, y, w, 2)
    if filled: d.text((X, y0 + 2), "moved my target early. it hit anyway.", font=hf, fill=GRAPHITE)
    y = section(d, X, y + 10, "9", "WHAT WOULD I TELL MY PAST SELF?", w); y0 = y; y = lines(d, X, y, w, 2)
    if filled: d.text((X, y0 + 2), "trust the plan you wrote when you were calm.", font=hf, fill=RED)
    tracked(d, (X, PH - 90), "GOOD TRADE, BAD RESULT IS STILL A GOOD TRADE.", F(JBMB, 22), STEEL, 3)
    return grain(im, 3, 8)

def spread(bg=NIGHT_D, SW=3200, SH=2140):
    im = Image.new("RGB", (SW, SH), bg); pw, ph = 1480, 2040; top = (SH - ph) // 2; lx = SW // 2 - pw
    L = page_plan().resize((pw, ph)); Rr = page_reality().resize((pw, ph)); im.paste(L, (lx, top)); im.paste(Rr, (SW // 2, top))
    g = Image.new("RGBA", (SW, SH), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    for i in range(80):
        a = int(80 * (1 - i / 80) ** 2)
        for x in (SW // 2 - i, SW // 2 + i): gd.line([(x, top), (x, top + ph)], fill=(40, 30, 10, a))
    im = Image.alpha_composite(im.convert("RGBA"), g); return im.convert("RGB")

# ---------- product shots ----------
def spiral_book(cov, scale, gold=True):
    w, h = int(cov.width * scale), int(cov.height * scale); c = cov.resize((w, h), Image.LANCZOS)
    pad = int(40 * scale * 3); B = Image.new("RGBA", (w + pad, h + pad), (0, 0, 0, 0)); bd = ImageDraw.Draw(B)
    for i in range(10, 0, -1):
        off = int(i * 2.0 * scale * 3); s = 238 - i * 3; bd.rectangle([off, off, w + off - 4, h + off - 4], fill=(s, s - 5, s - 18, 255))
    B.paste(c, (0, 0))
    hole = int(16 * scale * 3); n = 34; wc = (212, 166, 64) if gold else (60, 58, 54); hl = (246, 214, 130) if gold else (120, 116, 108)
    for i in range(n):
        y = int(h * 0.03 + i * (h * 0.94) / (n - 1)); x = int(w * 0.03)
        bd.ellipse([x - hole // 2, y - hole // 2, x + hole // 2, y + hole // 2], fill=(20, 18, 16, 255))
        for dy in (-hole // 3, hole // 3):
            bd.arc([x - hole * 1.6, y + dy - hole // 2, x + hole // 2, y + dy + hole // 2], 90, 270, fill=(*wc, 255), width=max(3, hole // 4))
            bd.arc([x - hole * 1.5, y + dy - hole // 2 + 2, x + hole // 2 - 2, y + dy + hole // 2 - 2], 150, 230, fill=(*hl, 255), width=max(1, hole // 9))
    return B

def drop_shadow(canvas, obj, pos, blur=60, offset=(30, 50), alpha=170):
    sh = Image.new("RGBA", canvas.size, (0, 0, 0, 0)); a = obj.split()[3].point(lambda v: alpha if v > 0 else 0)
    blk = Image.new("RGBA", obj.size, (0, 0, 0, 255)); blk.putalpha(a); sh.alpha_composite(blk, (pos[0] + offset[0], pos[1] + offset[1]))
    canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(blur))); canvas.alpha_composite(obj, pos)

def hero(printed, fieldnotes, dark=False, HW=2400, HH=1900):
    if dark: im = Image.new("RGB", (HW, HH), NIGHT); grid(im, 60, minor=(42, 40, 36), major=(56, 53, 47), every=5, w=2)
    else: im = Image.new("RGB", (HW, HH), PAPER); grid(im, 60, every=5, w=2)
    im = im.convert("RGBA")
    b2 = spiral_book(fieldnotes, 0.56).rotate(8, resample=Image.BICUBIC, expand=True)
    drop_shadow(im, b2, (int(HW * 0.40), int(HH * 0.14)), blur=50, offset=(40, 60), alpha=200 if dark else 120)
    b1 = spiral_book(printed, 0.58).rotate(-6, resample=Image.BICUBIC, expand=True)
    drop_shadow(im, b1, (int(HW * 0.05), int(HH * 0.20)), blur=60, offset=(50, 80), alpha=220 if dark else 150)
    d = ImageDraw.Draw(im, "RGBA"); hf = F(HAND, 64)
    d.text((HW * 0.66, HH * 0.06), "plan. trade. reality.", font=hf, fill=RED if not dark else (232, 96, 72))
    return im.convert("RGB")

def thumb(cov, w=300):
    return cov.resize((w, int(w * cov.height / cov.width)), Image.LANCZOS)

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True); WEB = sys.argv[1]; os.makedirs(WEB, exist_ok=True)
    printed_f = Image.open(f"{OUT}/cover-front.jpg").convert("RGB"); printed_b = Image.open(f"{OUT}/cover-back.jpg").convert("RGB")
    ff = cover_front(); fb = cover_back(); ff.save(f"{OUT}/fieldnotes-front.png"); fb.save(f"{OUT}/fieldnotes-back.png")
    pp = page_plan(); pr = page_reality(); pp.save(f"{OUT}/page-plan-sample.png"); pr.save(f"{OUT}/page-reality-sample.png")
    page_plan(False).save(f"{OUT}/page-plan-blank.png"); page_reality(False).save(f"{OUT}/page-reality-blank.png")
    sp = spread(); sp.save(f"{OUT}/spread-plan-reality.jpg", quality=90)
    hl = hero(printed_f, ff); hd = hero(printed_f, ff, dark=True); hl.save(f"{OUT}/hero-light.jpg", quality=90); hd.save(f"{OUT}/hero-dark.jpg", quality=90)
    for nm in ["lockup-on-dark", "lockup-on-light", "mark-on-light", "mark-on-dark"]: shutil.copy(f"{KIT}/logo/{nm}.png", f"{OUT}/kit-{nm}.png")
    # web sizes
    hl.resize((1200, 950), Image.LANCZOS).save(f"{WEB}/hero-light.jpg", quality=80); hd.resize((1200, 950), Image.LANCZOS).save(f"{WEB}/hero-dark.jpg", quality=80)
    sp.resize((1600, 1070), Image.LANCZOS).save(f"{WEB}/spread.jpg", quality=80)
    thumb(printed_f, 240).save(f"{WEB}/cover-printed.jpg", quality=82); thumb(ff, 240).save(f"{WEB}/cover-fieldnotes.jpg", quality=82)
    printed_b.resize((700, int(700 * printed_b.height / printed_b.width)), Image.LANCZOS).save(f"{WEB}/back-printed.jpg", quality=80)
    for nm, h in [("lockup-on-dark", 80), ("lockup-on-light", 80)]: kit_logo(nm, h).save(f"{WEB}/{nm}.png")
    # 3D textures (power-of-two-ish, ~1k)
    T = f"{WEB}/tex"; os.makedirs(T, exist_ok=True)
    for nm, im in [("printed_front", printed_f), ("printed_back", printed_b), ("fn_front", ff), ("fn_back", fb), ("page", pp)]:
        im.resize((740, 1050), Image.LANCZOS).save(f"{T}/{nm}.jpg", quality=82)
    print("ok")
