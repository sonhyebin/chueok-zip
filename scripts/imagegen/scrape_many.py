"""여러 Pinterest 검색어를 순차 수집. usage: python3 scrape_many.py <out_root> "폴더=검색어" ..."""
import subprocess, sys
from pathlib import Path
root = Path(sys.argv[1])
here = Path(__file__).parent
for spec in sys.argv[2:]:
    folder, q = spec.split('=', 1)
    r = subprocess.run(['node', str(here / 'pin-refs.mjs'), q, str(root / folder), '30'],
                       cwd=str(here.parent.parent), capture_output=True, text=True)
    last = (r.stdout.strip().splitlines() or [r.stderr.strip()[-200:]])[-1]
    print(last, flush=True)
