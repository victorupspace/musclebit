#!/usr/bin/env python3
"""
Gera os assets de marca a partir de assets/musclebit.png (pixel art 102x96, halter + wordmark).

- assets/splash-icon.png : arte completa, upscale 12x (1224x1152). Usada pela splash.
- assets/dumbbell.png    : só o halter (primeiro bloco de linhas opacas), upscale 12x.
- assets/wordmark-dark.png : só o wordmark "MUSCLEBIT" como está na arte (branco + coral), para
                             fundos escuros.
- assets/wordmark-light.png: o mesmo wordmark com o branco recolorido para o navy da marca, para
                             fundos claros. O coral do "BIT" é preservado.

Pixel art exige upscale nearest-neighbor em fator inteiro para não borrar. Com fator 12, telas 3x
(6x) e 2x (4x) reduzem por razão inteira e os pixels continuam nítidos. As larguras em pontos
ficam em src/theme/sizes.ts.

Uso: python3 scripts/generate-brand-assets.py   (requer Pillow: pip3 install Pillow)
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
SOURCE = ASSETS / "musclebit.png"
FACTOR = 12


def opaque_row_groups(im: Image.Image) -> list[tuple[int, int]]:
    """Blocos contíguos de linhas com algum pixel opaco: [(inicio, fim_exclusivo), ...]."""
    alpha = im.getchannel("A")
    w, h = im.size
    rows = [any(alpha.getpixel((x, y)) > 0 for x in range(w)) for y in range(h)]
    groups, start = [], None
    for y, opaque in enumerate(rows + [False]):
        if opaque and start is None:
            start = y
        elif not opaque and start is not None:
            groups.append((start, y))
            start = None
    return groups


def upscale(im: Image.Image) -> Image.Image:
    return im.resize((im.width * FACTOR, im.height * FACTOR), Image.NEAREST)


src = Image.open(SOURCE).convert("RGBA")
groups = opaque_row_groups(src)
print(f"fonte {src.width}x{src.height}, blocos de linhas opacas: {groups}")
if len(groups) < 2:
    raise SystemExit("Esperava dois blocos (halter e wordmark) separados por linhas transparentes.")

full = upscale(src)
full.save(ASSETS / "splash-icon.png", optimize=True)
print(f"splash-icon.png: {full.width}x{full.height}")

NAVY = (1, 33, 92)  # palette.navy[700] em src/theme/colors.ts


def crop_group(group: tuple[int, int]) -> Image.Image:
    top, bottom = group
    band = src.crop((0, top, src.width, bottom))
    return band.crop(band.getbbox())  # remove colunas transparentes nas laterais


def key_out_navy(im: Image.Image, coral: tuple[int, int, int]) -> Image.Image:
    """
    A arte foi desenhada sobre navy, e os miolos das letras do "BIT" estão pintados com esse navy.
    Fora do fundo navy isso vira uma mancha azul. Aqui o navy passa a ser transparente e os pixels
    de transição navy→coral viram coral com alpha proporcional, preservando o antialias.
    """
    out = im.copy()
    px = out.load()
    vec = tuple(c - n for c, n in zip(coral, NAVY))
    norm = sum(v * v for v in vec)
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = px[x, y]
            if a == 0 or (r > 240 and g > 240 and b > 240):
                continue
            # posição do pixel na reta navy→coral: 0 = navy puro, 1 = coral puro
            t = sum((p - n) * v for p, n, v in zip((r, g, b), NAVY, vec)) / norm
            if t < 0.02:
                px[x, y] = (0, 0, 0, 0)
            elif t < 0.98:
                px[x, y] = (*coral, round(a * max(0.0, min(1.0, t))))
    return out


def recolor_white(im: Image.Image, rgb: tuple[int, int, int]) -> Image.Image:
    """Troca pixels brancos (inclusive os semitransparentes do antialiasing) pela cor dada."""
    out = im.copy()
    px = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = px[x, y]
            if a > 0 and r > 240 and g > 240 and b > 240:
                px[x, y] = (*rgb, a)
    return out


dumbbell = crop_group(groups[0])
out = upscale(dumbbell)
out.save(ASSETS / "dumbbell.png", optimize=True)
print(f"dumbbell.png: {out.width}x{out.height} (recorte {dumbbell.width}x{dumbbell.height} px)")

CORAL = (253, 82, 80)  # o coral do "BIT" na arte original
wordmark = key_out_navy(crop_group(groups[1]), CORAL)
for name, im in (("wordmark-dark.png", wordmark), ("wordmark-light.png", recolor_white(wordmark, NAVY))):
    out = upscale(im)
    out.save(ASSETS / name, optimize=True)
    print(f"{name}: {out.width}x{out.height} (recorte {im.width}x{im.height} px)")
