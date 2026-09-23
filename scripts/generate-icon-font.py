#!/usr/bin/env python3
"""
Gera a fonte de ícones do app a partir do Material Symbols Rounded (Google).

Entrada : assets/fonts/material-symbols.json (lista de nomes de ícones)
Saídas  : assets/fonts/MaterialSymbolsRounded.ttf         (subconjunto, poucos KB)
          src/shared/components/ui/Icon/codepoints.ts     (mapa nome → codepoint, tipado)

A fonte oficial é variável (~15 MB, eixos FILL/GRAD/opsz/wght). Aqui ela é instanciada em
wght=400, FILL=0, GRAD=0, opsz=24 (o estilo "outlined" padrão) e recortada só para os ícones
listados. Para outro peso ou versão preenchida, mude AXES abaixo e gere outro arquivo.

Os codepoints originais do Material Symbols ficam na área de uso privado do BMP (U+E000–U+F8FF),
onde o iOS remapeia alguns códigos para símbolos próprios (herança dos emojis SoftBank) e ignora o
glifo da nossa fonte. Por isso cada ícone é realocado para a Área de Uso Privado Suplementar A
(U+F0000 em diante), que nenhuma plataforma toca. O mapa em codepoints.ts já reflete isso.

Requer fonttools (pip3 install fonttools). O download da fonte fica em ~/.cache/musclebit.

Uso: python3 scripts/generate-icon-font.py
"""
import json
import urllib.request
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont, newTable
from fontTools.ttLib.tables._c_m_a_p import CmapSubtable
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
ICON_LIST = ROOT / "assets" / "fonts" / "material-symbols.json"
FONT_OUT = ROOT / "assets" / "fonts" / "MaterialSymbolsRounded.ttf"
TS_OUT = ROOT / "src" / "shared" / "components" / "ui" / "Icon" / "codepoints.ts"
CACHE = Path.home() / ".cache" / "musclebit"

BASE = (
    "https://raw.githubusercontent.com/google/material-design-icons/master/variablefont/"
    "MaterialSymbolsRounded%5BFILL%2CGRAD%2Copsz%2Cwght%5D"
)
AXES = {"wght": 400, "FILL": 0, "GRAD": 0, "opsz": 24}


def fetch(url: str, target: Path) -> Path:
    if not target.exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        print(f"baixando {target.name}...")
        urllib.request.urlretrieve(url, target)
    return target


names = json.loads(ICON_LIST.read_text())["icons"]
codepoints_file = fetch(BASE + ".codepoints", CACHE / "MaterialSymbolsRounded.codepoints")
variable_font = fetch(BASE + ".ttf", CACHE / "MaterialSymbolsRounded-var.ttf")

table = dict(line.split() for line in codepoints_file.read_text().splitlines() if line.strip())
missing = [n for n in names if n not in table]
if missing:
    raise SystemExit(f"Ícones inexistentes no Material Symbols: {missing}")
selected = {n: int(table[n], 16) for n in sorted(names)}

font = instantiateVariableFont(TTFont(variable_font), AXES, inplace=False)
options = subset.Options()
options.layout_features = []  # ligaduras fora: renderizamos por codepoint
options.name_IDs = ["*"]
options.notdef_outline = True
subsetter = subset.Subsetter(options)
subsetter.populate(unicodes=selected.values())
subsetter.subset(font)

# Realoca cada glifo para U+F0000, U+F0001, ... na ordem alfabética dos nomes.
PUA_BASE = 0xF0000
original_cmap = font.getBestCmap()
remapped = {PUA_BASE + i: original_cmap[cp] for i, cp in enumerate(selected.values())}
cmap_table = newTable("cmap")
cmap_table.tableVersion = 0
sub_unicode = CmapSubtable.newSubtable(12)
sub_unicode.platformID, sub_unicode.platEncID, sub_unicode.language = 0, 4, 0
sub_unicode.cmap = dict(remapped)
sub_windows = CmapSubtable.newSubtable(12)
sub_windows.platformID, sub_windows.platEncID, sub_windows.language = 3, 10, 0
sub_windows.cmap = dict(remapped)
cmap_table.tables = [sub_unicode, sub_windows]
font["cmap"] = cmap_table

# Métricas verticais normalizadas: ascendente = em, descendente = 0, sem entrelinha. Os glifos do
# Material Symbols são centrados no em, então um <Text> com lineHeight = fontSize centraliza o
# ícone exatamente, em vez de deixá-lo alto (iOS) ou baixo (Android) por causa das métricas
# assimétricas da fonte original (1056 / -96).
upm = font["head"].unitsPerEm
hhea, os2 = font["hhea"], font["OS/2"]
hhea.ascent, hhea.descent, hhea.lineGap = upm, 0, 0
os2.sTypoAscender, os2.sTypoDescender, os2.sTypoLineGap = upm, 0, 0
os2.usWinAscent, os2.usWinDescent = upm, 0
os2.fsSelection |= 1 << 7  # USE_TYPO_METRICS

font.save(FONT_OUT)
selected = {name: PUA_BASE + i for i, name in enumerate(selected)}

lines = [
    "// GERADO por scripts/generate-icon-font.py. Não edite à mão.",
    "// Para adicionar um ícone, inclua o nome em assets/fonts/material-symbols.json e rode o script.",
    "export const codepoints = {",
    *[f"  {name}: 0x{cp:05x}," for name, cp in selected.items()],
    "} as const;",
    "",
    "export type IconName = keyof typeof codepoints;",
    "",
]
TS_OUT.write_text("\n".join(lines))
print(f"{FONT_OUT.relative_to(ROOT)}: {FONT_OUT.stat().st_size // 1024} KB, {len(selected)} ícones")
print(f"{TS_OUT.relative_to(ROOT)} atualizado")
