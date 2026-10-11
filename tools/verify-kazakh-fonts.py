"""Check the exact shipped WOFF2 files and source text. Requires fonttools and brotli."""
from pathlib import Path
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
FONT_DIR = ROOT / "public" / "fonts"
LETTERS = "ӘәҒғҚқҢңӨөҰұҮүҺһІі"
SAMPLES = (
    "«Ұлттық дәстүрлердің жаңа өмірі»",
    "«Қазақтың әдет-ғұрыптары»",
    "«Бесікке салу»",
    "«Қымызмұрындық»",
    "«Әже, шаңырақ, өрнек, күміс, ғұрып»",
)
FONTS = ("NotoSans", "NotoSerif", "NotoSansMono")

for name in FONTS:
    file = FONT_DIR / f"{name}.woff2"
    font = TTFont(file)
    cmap = font.getBestCmap()
    missing = [letter for letter in LETTERS if ord(letter) not in cmap]
    sample_missing = sorted({char for sample in SAMPLES for char in sample if not char.isspace() and ord(char) not in cmap})
    axes = {axis.axisTag: (axis.minValue, axis.maxValue) for axis in font["fvar"].axes}
    print(f"{file.relative_to(ROOT)}: {file.stat().st_size} bytes; missing={missing}; sample_missing={sample_missing}; axes={axes}")
    if missing or sample_missing or axes.get("wght", (0, 0))[0] > 400 or axes["wght"][1] < 900:
        raise SystemExit(f"Kazakh coverage or weights incomplete in {name}")

bad_files = []
for file in [ROOT / "index.html", *(ROOT / "src").rglob("*")]:
    if file.suffix not in {".ts", ".tsx", ".css"}:
        continue
    data = file.read_text(encoding="utf-8")
    if "\ufffd" in data or "\u00d0\u00b0" in data or "\u00d0\u0090" in data:
        bad_files.append(str(file.relative_to(ROOT)))
if bad_files:
    raise SystemExit(f"Possible encoding damage: {bad_files}")
print("Source UTF-8 scan: no replacement characters or common mojibake sequences")
