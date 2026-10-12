"""Trace the owner's four journal pictures into colour SVGs (vtracer) for the store.

Usage: python3 vectorize.py <uploads_dir> <out_dir>
Settings balance fidelity against size (about 3 MB for all four).
"""
import os, re, sys
import vtracer
from PIL import Image, ImageOps

SRC = {"hand": "854214e2-166a-44e3-b185-6f8ec0dbd75e", "box": "15d586ea-c6a7-4ced-9107-76d3e1665f95",
       "front": "bb07a5ca-d2c1-4e1d-9f54-4a289554042f", "back": "ca2c8c64-5338-4e35-9356-111acc14466b"}

def main(src, out):
    os.makedirs(out, exist_ok=True)
    for k, f in SRC.items():
        im = ImageOps.exif_transpose(Image.open(os.path.join(src, f))).convert("RGB")
        w = 560
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        png, svg = os.path.join(out, k + ".png"), os.path.join(out, k + ".svg")
        im.save(png)
        vtracer.convert_image_to_svg_py(png, svg, colormode="color", hierarchical="stacked", mode="spline",
                                        filter_speckle=4, color_precision=6, layer_difference=16, corner_threshold=60,
                                        length_threshold=4.0, splice_threshold=45, path_precision=1)
        s = open(svg).read()
        s = re.sub(r'<svg[^>]*width="(\d+)" height="(\d+)"[^>]*>',
                   lambda m: f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {m.group(1)} {m.group(2)}" preserveAspectRatio="xMidYMid slice">', s, count=1)
        open(svg, "w").write(s)
        os.remove(png)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
