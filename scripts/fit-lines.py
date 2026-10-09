"""
fit-lines.py — largura (em "em") de linhas de display na AdihausDIN Cn Bold
Italic, para o CSS ajustar cada linha à mesma largura sem JS:
    font-size: calc(100cqi / var(--w))
Uso: python scripts/fit-lines.py "No experience" "needed." "Little Champions 1"
"""
import sys
from pathlib import Path
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "brand" / "fonts" / "AdihausDIN" / "ttf" / "AdihausDIN-CnBoldItalic.ttf"
LETTER_SPACING = -0.01  # em

font = TTFont(FONT)
upm = font["head"].unitsPerEm
cmap = font.getBestCmap()
hmtx = font["hmtx"]


def width(text: str) -> float:
    w = 0.0
    for ch in text.upper():
        g = cmap.get(ord(ch))
        if g is None:
            continue
        w += hmtx[g][0] / upm + LETTER_SPACING
    return w


for line in sys.argv[1:]:
    print(f"{line!r}: {width(line):.4f}em")
