"""
build-og.py — gera a imagem de compartilhamento (Open Graph, 1200×630).

Fontes: brand/hero/ultrawide.webp (a fachada com a chegada do tatame),
public/img/badge-150.webp (o selo da academia) e a AdihausDIN Cn Bold Italic de
brand/fonts (fora do deploy). Saída: public/og.jpg.
Rodar de novo se a fachada, a marca ou o título do hero mudarem.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
from pillow_heif import register_heif_opener

register_heif_opener()
ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
FONT = ROOT / "brand/fonts/AdihausDIN/ttf/AdihausDIN-CnBoldItalic.ttf"
BLACK, RED, PAPER = (0, 0, 0), (215, 25, 32), (255, 255, 255)

W, H = 1200, 630
src = ImageOps.exif_transpose(Image.open(ROOT / "brand/hero/ultrawide.webp")).convert("RGB")
photo = ImageOps.fit(src, (W, H), centering=(0.3, 0.4))
veil = Image.new("RGB", (W, H), BLACK)
mask = Image.new("L", (W, H))
md = ImageDraw.Draw(mask)
for y in range(H):
    md.line([(0, y), (W, y)], fill=int(110 + 110 * (y / H)))
img = Image.composite(veil, photo, mask)
d = ImageDraw.Draw(img)
small = ImageFont.truetype(str(FONT), 34)
d.text((72, 196), "OPENING SOON · ROWLETT, TX", font=small, fill=(255, 92, 95))
f = ImageFont.truetype(str(FONT), 88)
y = 246
for t in ["A NEW GRACIE BARRA", "IS COMING TO ROWLETT.", "FOUNDING MEMBERS: $87 / 2 WEEKS."]:
    d.text((72, y), t, font=f, fill=PAPER)
    y += 92
# o selo redondo da academia (o mesmo da navbar e do rodapé)
mark = Image.open(PUB / "img/badge-150.webp").convert("RGBA").resize((128, 128), Image.LANCZOS)
img.paste(mark, (W - 128 - 56, 48), mark)
img.save(PUB / "og.jpg", quality=86, optimize=True, progressive=True)
print("og.jpg", (PUB / "og.jpg").stat().st_size // 1024, "KB")
