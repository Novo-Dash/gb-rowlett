"""
build-images.py — gera as imagens da LP em public/img/ + src/data/media.json.

Cada entrada: (nome, origem, proporção w:h, larguras, foco (x, y) 0–1, [qualidade AVIF]).
A origem é recortada no foco para a proporção fixa e exportada em AVIF e WebP
em cada largura. As proporções são as mesmas do CSS (aspect-ratio): trocar a
foto de origem nunca muda o layout. HEIC do iPhone entra direto (pillow-heif).

Origens em brand/ (fora do git): brand/drive/<pasta>/ (Drive do cliente),
brand/lindale/ (fotos da GB Lindale usadas como placeholder MARCADO),
brand/logo/. Uso: python scripts/build-images.py
"""
import json
from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance
from pillow_heif import register_heif_opener

register_heif_opener()

ROOT = Path(__file__).resolve().parent.parent
BRAND = ROOT / "brand"
OUT = ROOT / "public" / "img"
OUT.mkdir(parents=True, exist_ok=True)

D = "drive/10-08"
O = "drive/obras"
F = "drive/fotos"

# nome, origem (relativa a brand/), (w, h), larguras, foco (x, y), [q_avif]
IMAGES = [
    # hero: poster do filme (o b-roll IMG_1600/1601.MOV ainda não chegou — >10 MB no conector)
    # desktop: o Andre ensinando no terço direito; a parede livre à esquerda recebe o texto
    ("hero-d",     f"{D}/IMG_0201.HEIC",   (16, 9), [1280, 1920, 2560], (0.5, 0.40), 50),
    ("film-m",     f"{D}/IMG_0192.HEIC",   (9, 16), [540, 760],   (0.5, 0.42), 46),
    ("logo",       "logo/gb-mark.png",     (1, 1),  [112, 160],   (0.5, 0.5)),
    # programas 3/4 — LC1 e Juniors: fotos da GB Lindale, [CONFIRMAR autorização]
    ("p-lc1",      "lindale/kids.webp",    (3, 4),  [360, 600],   (0.5, 0.45)),
    ("p-lc2",      f"{F}/6T7A0276.JPG",    (3, 4),  [360, 600],   (0.5, 0.86)),
    ("p-juniors",  "lindale/inside-5.webp",(3, 4),  [360, 600],   (0.5, 0.4)),
    ("p-adults",   f"{D}/IMG_0224.HEIC",   (3, 4),  [360, 600],   (0.5, 0.5)),
    # a obra 4/5 — fotos reais de Obras GB (sem filtro que pareça render)
    ("build-1",    f"{O}/IMG_0704.HEIC",   (4, 5),  [360, 640],   (0.5, 0.45)),
    ("build-2",    f"{O}/IMG_1605.HEIC",   (4, 5),  [360, 640],   (0.5, 0.5)),
    ("build-3",    f"{O}/IMG_1604.HEIC",   (4, 5),  [360, 640],   (0.5, 0.5)),
    ("build-4",    f"{O}/IMG_1602.HEIC",   (4, 5),  [360, 640],   (0.5, 0.5)),
    ("build-5",    f"{O}/IMG_0712.HEIC",   (4, 5),  [360, 640],   (0.5, 0.42)),
    # para os pais 4/5 (única foto de criança)
    ("parents",    f"{F}/6T7A0276.JPG",    (4, 5),  [480, 800],   (0.5, 0.86)),
    # abertura: fachada 16/9 a 30%
    ("opening",    f"{O}/IMG_0713.HEIC",   (16, 9), [960, 1440, 1920], (0.5, 0.35), 48),
    # pedido: vertical 9/16 da obra
    ("claim-v",    f"{O}/IMG_1606.HEIC",   (9, 16), [540, 760],   (0.5, 0.5)),
    # fachada 1/1 encostada no pino do mapa
    ("visit",      f"{O}/IMG_0712.HEIC",   (1, 1),  [420, 560],   (0.5, 0.42)),
]

# Fotos de celular e de câmera convivem: a mesma curva (contraste +6, saturação −8).
# As da obra ficam cruas (são prova). O logo não é foto.
RAW = {"logo", "build-1", "build-2", "build-3", "build-4", "build-5", "opening", "claim-v", "visit"}


def crop_to(im: Image.Image, ratio, focus):
    rw, rh = ratio
    W, H = im.size
    target = rw / rh
    if W / H > target:  # largo demais: corta lados
        nw = round(H * target)
        x = min(max(round(W * focus[0] - nw / 2), 0), W - nw)
        return im.crop((x, 0, x + nw, H))
    nh = round(W / target)
    y = min(max(round(H * focus[1] - nh / 2), 0), H - nh)
    return im.crop((0, y, W, y + nh))


def main():
    manifest = {}
    for name, src, ratio, widths, focus, *rest in IMAGES:
        q_avif = rest[0] if rest else 58
        src_im = ImageOps.exif_transpose(Image.open(BRAND / src))
        has_alpha = src_im.mode in ("RGBA", "LA") or (src_im.mode == "P" and "transparency" in src_im.info)
        im = src_im.convert("RGBA" if has_alpha else "RGB")
        im = crop_to(im, ratio, focus)
        if name not in RAW and not has_alpha:
            im = ImageEnhance.Contrast(im).enhance(1.06)
            im = ImageEnhance.Color(im).enhance(0.92)
        made = []
        for w in sorted({min(w, im.width) for w in widths}):  # nunca amplia
            h2 = round(w * ratio[1] / ratio[0])
            out = im.resize((w, h2), Image.LANCZOS)
            out.save(OUT / f"{name}-{w}.webp", "WEBP", quality=78, method=6)
            out.save(OUT / f"{name}-{w}.avif", "AVIF", quality=q_avif, speed=5)
            made.append(w)
        manifest[name] = {"ratio": list(ratio), "widths": made}
        print(f"{name:10s} {ratio} {made}  (origem {im.width}px)")
    (ROOT / "src" / "data" / "media.json").write_text(json.dumps(manifest, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
