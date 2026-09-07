# imagegen — 카드 이미지 오리지널 생성 파이프라인

Pinterest 검색 결과를 **reference-only**로 모아, GPT 이미지 모델(Codex CLI `image_gen`)로
"한국 그 시절 스냅샷" 감성의 오리지널 이미지를 생성하고 프로젝트에 적용하는 도구 모음.
2026-09 패션 카드 34장 교체에 사용됨(`ASSET_SOURCES.md` 참조).

## 흐름

1. **레퍼런스 수집** — `node scripts/imagegen/pin-refs.mjs "1998년 패션" <out_dir>/pin_refs/1998 40`
   - 로그인 없이 Playwright 헤드리스로 검색 결과 핀 이미지(736x)와 `_pins.json`을 저장한다.
   - 핀 이미지는 저작권 미확인 자료이므로 **서비스에 넣지 않는다.** 실루엣·색감·질감 참고용.
2. **샷 정의** — `shots.py`의 `SHOTS`에 `(카드 id, 연도, 장면 설명)` 추가. 연도별 카메라 질감은 `style()`.
3. **레퍼런스 매핑** — `refmap*.json`에 `{ "<카드 id>": ["<폴더>/<핀 id>", ...] }`.
4. **생성** — `python3 run_ref.py refmap.json [id...]` (out_ref/ 에 PNG, 2병렬, 장당 2~4분).
   - 프롬프트에 "얼굴·포즈·구도·잡지 레이아웃 복제 금지, 완전 가상 인물, 텍스트·로고 금지"가 고정으로 들어간다.
   - 타임아웃/재시도는 `codex_imagegen.py` (네트워크 끊기면 600s 타임아웃 후 실패로 기록됨 — 재실행하면 기존 결과는 건너뜀).
5. **검수** — 텍스트/로고/실존 인물 유사/시대 불일치 확인 후 합격분만
6. **적용** — `python3 apply.py <id...>`: 4:3 크롭 → 800×600 JPG(≤240KB) → `public/images/years/<연도>/fashion/<id>.jpg`,
   원본 PNG → `assets-src/<연도>/<id>-generated-original.png`, `data/memories.ts`의 `credit` 제거.
7. **출처 기록** — `PIN_REFS_ROOT=<out_dir> python3 sources_md.py <id...> >> ASSET_SOURCES.md`

## 전제

- `/Applications/Codex.app/Contents/Resources/codex` (로그인 완료), `pip install pillow`
- 스크립트 경로(`apply.py`의 `ROOT`, `run_ref.py`의 `SP`)는 세션 작업 폴더 기준이라 재사용 시 맞춰 준다.
