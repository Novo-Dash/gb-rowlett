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
    # hero (Adryan, 9 out 2026): a fachada com a chegada do tatame. Três recortes de direção de
    # arte: celular em pé (5:9, a fachada), desktop 16:9 e ultrawide ~2,4:1 (telas com proporção ≥ 2:1).
    ("hero-d",     "hero/desktop.webp",    (16, 9), [1280, 1920], (0.5, 0.5), 50),
    ("hero-w",     "hero/ultrawide.webp",  (425, 152), [1920, 2550], (0.5, 0.5), 50),
    ("film-m",     "hero/mobile.webp",     (5, 9),  [420, 600],   (0.5, 0.5), 46),
    ("logo",       "logo/gb-mark.png",     (1, 1),  [112, 160],   (0.5, 0.5)),
    # programas 3/4: fotos novas do Adryan (9 out 2026), já tratadas, 394px de origem
    ("p-lc1",      "programs/p-lc1.webp",     (3, 4),  [360, 600],   (0.5, 0.5)),
    ("p-lc2",      "programs/p-lc2.webp",     (3, 4),  [360, 600],   (0.5, 0.5)),
    ("p-juniors",  "programs/p-juniors.webp", (3, 4),  [360, 600],   (0.5, 0.5)),
    ("p-adults",   "programs/p-adults.webp",  (3, 4),  [360, 600],   (0.5, 0.5)),
    # a obra 4/5 — fotos reais de Obras GB (sem filtro que pareça render)
    ("build-1",    f"{O}/IMG_0704.HEIC",   (4, 5),  [360, 640, 1280],   (0.5, 0.45)),
    ("build-2",    f"{O}/IMG_1605.HEIC",   (4, 5),  [360, 640, 1280],   (0.5, 0.5)),
    ("build-3",    f"{O}/IMG_1604.HEIC",   (4, 5),  [360, 640, 1280],   (0.5, 0.5)),
    ("build-4",    f"{O}/IMG_1602.HEIC",   (4, 5),  [360, 640, 1280],   (0.5, 0.5)),
    ("build-5",    f"{O}/IMG_0712.HEIC",   (4, 5),  [360, 640, 1280],   (0.5, 0.42)),
    # para os pais 4/5: as fotos dos três cards (Adryan, 9 out 2026), já tratadas
    ("parents-1",  "parents/1.webp",      (517, 549), [360, 517], (0.5, 0.5)),
    ("parents-2",  "parents/2.webp",      (517, 549), [360, 517], (0.5, 0.5)),
    ("parents-3",  "parents/3.webp",      (517, 549), [360, 517], (0.5, 0.5)),
    # sem experiência: o recorte do coach sem fundo (PNG/WebP com alfa), de pé na borda da seção
    ("coach",      "coach/coach.webp",     (599, 616), [480, 800, 1198], (0.5, 0.5)),
    # abertura: fachada 16/9 a 30%
    ("opening",    f"{O}/IMG_0713.HEIC",   (16, 9), [960, 1440, 1920], (0.5, 0.35), 48),
    # fachada 1/1 encostada no pino do mapa
    ("visit",      f"{O}/IMG_0712.HEIC",   (1, 1),  [420, 560],   (0.5, 0.42)),
]

# Fotos de celular e de câmera convivem: a mesma curva (contraste +6, saturação −8).
# As da obra ficam cruas (são prova); as dos programas já chegaram tratadas. O logo não é foto.
RAW = {"hero-d", "hero-w", "film-m", "parents-1", "parents-2", "parents-3", "p-lc1", "p-lc2", "p-juniors", "p-adults", "logo", "build-1", "build-2", "build-3", "build-4", "build-5", "opening", "visit"}


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
