import cv2, numpy as np, sys
from PIL import Image, ImageDraw, ImageFont
src, out = sys.argv[1], sys.argv[2]
F='/tmp/claude-0/-home-user/d988d1a0-8979-5512-a76d-1a2b9abffaf4/scratchpad/fonts/'
im = cv2.imread(src); h, w = im.shape[:2]
gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
mask = np.zeros((h, w), np.uint8)
for (x0, y0, x1, y1, t) in [(400, 240, 820, 470, 70), (40, 520, 1190, 1420, 85)]:
    reg = gray[y0:y1, x0:x1]
    m = (reg > t).astype(np.uint8) * 255
    mask[y0:y1, x0:x1] = m
mask = cv2.dilate(mask, np.ones((7, 7), np.uint8), iterations=2)
clean = cv2.inpaint(im, mask, 9, cv2.INPAINT_TELEA)
# soften the inpainted areas a touch so no smudges read as text
blur = cv2.GaussianBlur(clean, (0, 0), 6)
mf = cv2.GaussianBlur(mask, (0, 0), 8).astype(np.float32)[..., None] / 255
clean = (clean * (1 - mf) + blur * mf).astype(np.uint8)
# a gentle dark scrim behind the text column for legibility
pil = Image.fromarray(cv2.cvtColor(clean, cv2.COLOR_BGR2RGB)).convert('RGBA')
scrim = Image.new('RGBA', pil.size, (0, 0, 0, 0)); sd = ImageDraw.Draw(scrim)
from PIL import ImageFilter
sd.rectangle([70, 560, w - 70, 1450], fill=(8, 10, 26, 90))
scrim = scrim.filter(ImageFilter.GaussianBlur(50))
pil = Image.alpha_composite(pil, scrim)
d = ImageDraw.Draw(pil)
# heading in Anton gold, centered where the original sat
hf = ImageFont.truetype(F + 'anton.ttf', 104)
txt = Image.new('L', pil.size, 0); td = ImageDraw.Draw(txt)
for i, line in enumerate(["TRADING", "JOURNAL"]):
    tw = td.textlength(line, font=hf)
    td.text(((w - tw) / 2, 232 + i * 118), line, font=hf, fill=255)
grad = Image.new('RGBA', pil.size); gd = ImageDraw.Draw(grad)
for yy in range(h):
    t = min(1, max(0, (yy - 250) / 240)); gd.line([(0, yy), (w, yy)], fill=(int(240 - 40 * t), int(206 - 50 * t), int(122 - 60 * t), 255))
pil.paste(grad, (0, 0), txt)
d = ImageDraw.Draw(pil)
LETTER = [
  "I won’t promise you profitability. No one can. But I will promise you this: if you commit to this journal, you will become a better trader.",
  "And that changes everything.",
  "Real success in this industry comes down to one thing: your ability to execute your own ideas with confidence and discipline. That’s freedom. That’s power.",
  "Respect the journey, and always remember this is a marathon, not a get-rich-quick shortcut. Every step you take and every lesson you learn moves you forward.",
  "Repetition and time in the market: that’s where growth lives. Monitoring your habits and adjusting accordingly: that’s where mastery and real strategies are built.",
  "Stay patient. Stay disciplined. Keep showing up.",
  "Do that, and you won’t just improve. You’ll transform.",
]
bf = ImageFont.truetype(F + 'is400.ttf', 33); sf = ImageFont.truetype(F + 'is500.ttf', 36)
x, y, maxw, lh = 92, 600, w - 184, 47
for p in LETTER:
    words, line = p.split(), ""
    for wd in words:
        t = (line + " " + wd).strip()
        if d.textlength(t, font=bf) > maxw: d.text((x, y), line, font=bf, fill=(233, 236, 245, 240)); y += lh; line = wd
        else: line = t
    d.text((x, y), line, font=bf, fill=(233, 236, 245, 240)); y += lh + 22
d.text((x, y + 4), "– Blueprint", font=sf, fill=(212, 166, 64, 255))
print("text ends at", y)
pil.convert('RGB').save(out, quality=90)
