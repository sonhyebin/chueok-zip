"""승인된 생성 이미지를 프로젝트에 적용: 800x600 JPG + 원본 보관 + memories.ts credit 제거."""
import re, sys, shutil
from pathlib import Path
from PIL import Image

ROOT = Path('/Users/sonhyebin/Desktop/2000')
GEN = Path(__file__).parent / 'out_ref'
ids = sys.argv[1:]
src = (ROOT / 'data/memories.ts').read_text()

for sid in ids:
    year = sid.split('-')[0]
    png = GEN / f'{sid}.png'
    assert png.exists(), sid
    im = Image.open(png).convert('RGB')
    w, h = im.size
    tw, th = (w, int(w * 3 / 4)) if w / h >= 4 / 3 else (int(h * 4 / 3), h)
    im = im.crop(((w - tw) // 2, (h - th) // 2, (w - tw) // 2 + tw, (h - th) // 2 + th)).resize((800, 600), Image.LANCZOS)
    out = ROOT / f'public/images/years/{year}/fashion/{sid}.jpg'
    out.parent.mkdir(parents=True, exist_ok=True)
    q = 82
    while True:
        im.save(out, 'JPEG', quality=q, optimize=True, progressive=True)
        if out.stat().st_size <= 240_000 or q <= 60:
            break
        q -= 5
    orig = ROOT / f'assets-src/{year}/{sid}-generated-original.png'
    orig.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(png, orig)

    # memories.ts: 해당 카드 블록의 credit 제거 + image 경로 보정
    m = re.search(r'(\{\s*id:\s*"' + re.escape(sid) + r'"[^{}]*?(?:\{[^{}]*\}[^{}]*?)*?\n  \},)', src, re.S)
    assert m, sid
    block = m.group(1)
    nb = re.sub(r'\n    credit:\s*\{[^}]*\},', '', block)
    nb = re.sub(r'image:\s*"[^"]*"', f'image: "/images/years/{year}/fashion/{sid}.jpg"', nb, count=1)
    src = src.replace(block, nb)
    print(f'{sid}: {out.stat().st_size//1024}KB q{q} credit_removed={"credit" not in nb}')

(ROOT / 'data/memories.ts').write_text(src)
