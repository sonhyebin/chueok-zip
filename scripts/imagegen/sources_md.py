"""ASSET_SOURCES.md 에 붙일 섹션 생성. usage: python3 sources_md.py id1 id2 ... > section.md"""
import sys, json, re, os
from pathlib import Path
# pin_refs/ 가 있는 루트 (기본: 이 스크립트의 상위). 환경변수 PIN_REFS_ROOT 로 지정 가능
SP = Path(os.environ.get('PIN_REFS_ROOT', Path(__file__).parent.parent))
sys.path.insert(0, str(Path(__file__).parent))
from shots import SHOTS
titles = {}
src = (Path('/Users/sonhyebin/Desktop/2000/data/memories.ts')).read_text()
for sid, body in re.findall(r'\{\s*id:\s*"([^"]+)"(.*?)\n  \},', src, re.S):
    t = re.search(r'title:\s*"([^"]*)"', body); titles[sid] = t.group(1) if t else sid
refmap = {}
for f in sorted(Path(__file__).parent.glob('refmap*.json')):
    refmap.update(json.load(open(f)))
years = {s[0]: s[1] for s in SHOTS}
ids = sys.argv[1:]
print("## 패션 카드 오리지널 생성 일괄 교체 (2026-09-04) — Pinterest 참고 · GPT 이미지 생성")
print()
print("서구권 Flickr/Commons 사진이 쓰이던 패션 카드를 **한국 그 시절 감성의 오리지널 생성 이미지**로 교체. "
      "Pinterest 검색 결과는 **reference-only**(의상 실루엣·색감·사진 질감 참고)로만 사용했고 서비스에는 핀 이미지를 넣지 않았다. "
      "생성은 Codex CLI `image_gen`(GPT 이미지 모델)으로, 프롬프트에 '실존 인물 얼굴·포즈·구도·잡지 레이아웃 복제 금지, 완전 가상 인물, 텍스트·로고 금지'를 명시했다. "
      "생성 원본 PNG는 `assets-src/<연도>/<id>-generated-original.png`, 웹 적용본은 `public/images/years/<연도>/fashion/<id>.jpg`(800×600).")
print()
print("| 카드 | 소재 | 방식 | 참고한 핀 (reference-only) |")
print("|---|---|---|---|")
for sid in ids:
    y = years.get(sid, sid[:4])
    refs = []
    for r in refmap.get(sid, []):
        folder, pid = (r.split('/') if '/' in r else (str(y), r))
        pins = json.load(open(SP / 'pin_refs' / folder / '_pins.json'))['pins']
        hit = next((p for p in pins if p['id'] == pid), None)
        url = hit['src'].replace('/236x/', '/736x/') if hit else f"https://kr.pinterest.com/pin/{pid}/"
        refs.append(f"[img]({url})")
    print(f"| {sid} | {titles.get(sid, sid)} | 자체 생성 (generated-original, 가상 인물) | {' · '.join(refs) or '-'} |")
