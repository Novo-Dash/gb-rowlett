"""
subset-fonts.py — gera os woff2 da AdihausDIN só com os glifos que a LP usa.

Origem: brand/fonts/AdihausDIN/ttf (TTFs completos, fora do repositório).
Saída:  public/fonts/*.woff2. Cobertura: ASCII + Latin-1, aspas e travessões
tipográficos, reticências, bullet, ≈, setas e ▲/▶. Métricas não mudam, então
os fallbacks com size-adjust do index.css continuam valendo.
Uso: python scripts/subset-fonts.py
"""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "brand" / "fonts" / "AdihausDIN" / "ttf"
OUT = ROOT / "public" / "fonts"
OUT.mkdir(parents=True, exist_ok=True)

UNICODES = (
    "U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,"
    "U+2013-2014,U+2018-201A,U+201C-201E,U+2022,U+2026,U+2032-2033,U+2039-203A,"
    "U+20AC,U+2122,U+2190-2193,U+2212,U+2248,U+25B2,U+25B6"
)

for ttf in sorted(SRC.glob("*.ttf")):
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["kern", "liga", "calt", "tnum", "lnum", "case"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    opts.hinting = False
    font = TTFont(ttf)
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=subset.parse_unicodes(UNICODES))
    sub.subset(font)
    out = OUT / (ttf.stem + ".woff2")
    font.flavor = "woff2"
    font.save(out)
    print(f"{out.name:34s} {out.stat().st_size / 1024:6.1f} KB")
