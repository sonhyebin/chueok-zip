"""핀터레스트 레퍼런스 기반 변형 생성. usage: python3 run_ref.py refmap.json [ids...]"""
import sys, json, time, concurrent.futures as cf
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from codex_imagegen import generate_image
from shots import SHOTS, style, RULES

SP = Path(__file__).parent.parent
OUT = Path(__file__).parent / "out_ref"; OUT.mkdir(exist_ok=True)
refmap = json.load(open(sys.argv[1]))
only = set(sys.argv[2:])
subjects = {s[0]: (s[1], s[2], len(s) > 3 and s[3]) for s in SHOTS}

REF_RULE = ("REFERENCE USAGE: The attached reference photos show the real Korean fashion of that year. Use them ONLY for the clothing silhouettes, "
            "fabrics, colors, styling details, hairstyles of the era and the photographic texture (film/scan/snapshot look). "
            "Do NOT reproduce any person's face, identity, pose or the reference composition, and do NOT copy any magazine layout or text. "
            "Create an entirely new scene with new fictional Korean people. ")

def run(sid):
    year, subject, allow_text = subjects[sid]
    refs = [Path(pid) if pid.startswith("/") else (SP / "pin_refs" / (pid.split("/")[0] if "/" in pid else str(year)) / (pid.split("/")[-1] + ".jpg")) for pid in refmap[sid]]
    refs = [r for r in refs if r.exists()]
    out = OUT / f"{sid}.png"
    if out.exists() and out.stat().st_size > 10_000:
        return sid, True, "exists"
    rules = RULES
    if allow_text:
        rules = RULES.replace("No text, no readable letters or Hangul, no brand logos, no watermarks anywhere. Signage in the background must be blurred/unreadable.",
                              "Text is allowed ONLY on the garment embroidery described in SUBJECT and must be spelled exactly as given. No real brand logos, no watermarks, background signage blurred.")
    prompt = f"{style(year)}\n{REF_RULE}\nSUBJECT: {subject}\n{rules}"
    ok, info = generate_image(prompt, out, refs=refs, workdir=Path(__file__).parent / "work_ref" / sid)
    return sid, ok, f"{info} refs={len(refs)}"

todo = [sid for sid in refmap if sid in subjects and (not only or sid in only)]
t0 = time.time()
with cf.ThreadPoolExecutor(max_workers=2) as ex:
    for sid, ok, info in ex.map(run, todo):
        print(f"{'ok  ' if ok else 'FAIL'} {sid} {info} [{time.time()-t0:.0f}s]", flush=True)
