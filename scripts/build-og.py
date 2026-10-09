"""
build-og.py — gera a imagem de compartilhamento (Open Graph, 1200×630).

Fontes: brand/drive/obras/IMG_0713.HEIC (a fachada com o letreiro instalado),
brand/logo/gb-mark.png (o triângulo GB) e a AdihausDIN Cn Bold Italic de
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
NAVY, RED, PAPER = (11, 18, 51), (200, 16, 46), (255, 255, 255)

W, H = 1200, 630
src = ImageOps.exif_transpose(Image.open(ROOT / "brand/drive/obras/IMG_0713.HEIC")).convert("RGB")
photo = ImageOps.fit(src, (W, H), centering=(0.5, 0.32))
veil = Image.new("RGB", (W, H), NAVY)
mask = Image.new("L", (W, H))
md = ImageDraw.Draw(mask)
for y in range(H):
    md.line([(0, y), (W, y)], fill=int(90 + 130 * (y / H)))
img = Image.composite(veil, photo, mask)
d = ImageDraw.Draw(img)
# as mordidas do hero: triângulos vermelhos nos cantos
d.polygon([(0, 0), (120, 0), (0, 120)], fill=RED)
d.polygon([(W, H), (W - 120, H), (W, H - 120)], fill=RED)
small = ImageFont.truetype(str(FONT), 34)
d.text((72, 196), "OPENING SOON · ROWLETT, TX", font=small, fill=(255, 90, 107))
f = ImageFont.truetype(str(FONT), 88)
y = 246
for t in ["A NEW GRACIE BARRA", "IS COMING TO ROWLETT.", "FOUNDING MEMBERS: $87 / 2 WEEKS."]:
    d.text((72, y), t, font=f, fill=PAPER)
    y += 92
mark = Image.open(ROOT / "brand/logo/gb-mark.png").convert("RGBA").resize((132, 99), Image.LANCZOS)
img.paste(mark, (W - 132 - 64, 56), mark)
img.save(PUB / "og.jpg", quality=86, optimize=True, progressive=True)
print("og.jpg", (PUB / "og.jpg").stat().st_size // 1024, "KB")
