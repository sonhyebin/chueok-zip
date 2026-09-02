# Codex CLI 헤드리스 이미지 생성 가이드

GPT 이미지 모델을 `codex` CLI의 내장 `image_gen` 툴로, 사람 개입 없이 스크립트에서 돌리는 방법.
(ROLLIE'S 프로젝트에서 카탈로그 아트/앱스토어 인물 사진 수백 장을 생성한 검증된 워크플로.
캐노니컬 구현: `~/Desktop/retro-camera/tools/catalog-art/codex_imagegen.py` — 새 프로젝트에선 이 파일을 통째로 복사해 쓰는 것을 권장.)

## 전제 조건

- `codex` CLI 설치 + 로그인 완료 (`codex login`, ChatGPT 계정)
- 레퍼런스 이미지와 출력 경로는 **절대 경로**로

## 기본 커맨드

```bash
codex exec \
  -i /abs/path/ref1.png -i /abs/path/ref2.png \
  --skip-git-repo-check --ephemeral -C /abs/path/workdir --json \
  -- "Generate exactly ONE image with the built-in image_gen tool from the spec below. Then copy the generated PNG to \`/abs/path/out.png\` (overwrite if it exists) and reply with only that absolute path.

<여기에 실제 이미지 프롬프트>" < /dev/null
```

- `-i <파일>` : 레퍼런스 이미지 첨부 (여러 장이면 `-i`를 반복)
- `--ephemeral` : 세션 기록을 남기지 않음
- `-C <dir>` : 작업 디렉터리 (임시 폴더 하나 만들어 지정)
- `--json` : 이벤트 스트림 출력 — 로그 저장·thread_id 추출용

## 반드시 지켜야 하는 것 4가지 (전부 실측으로 밟은 함정)

1. **`< /dev/null` 필수.** codex는 non-TTY stdin에서 EOF를 기다리며 **무한 블록**된다.
   헤드리스 실행이 "멈춰 있는" 문제의 90%가 이것. 파이썬이면 `stdin=subprocess.DEVNULL`.
2. **`-i`는 앞, 프롬프트는 `--` 뒤.** `-i`가 variadic이라 순서가 틀리면 프롬프트를
   파일 인자로 먹어버린다.
3. **출력 복사를 프롬프트 안에서 지시하고, 폴백을 준비.** 태스크 문구에
   "생성된 PNG를 `<절대경로>`로 복사하고 그 경로만 답하라"를 포함시킨다.
   codex가 복사를 빼먹으면 **`$CODEX_HOME/generated_images/<thread_id>/*.png`**
   (기본 `~/.codex/…`; thread_id는 `--json` 스트림의 `thread.started` 이벤트에 있음)에서
   mtime 최신 파일을 직접 가져온다.
4. **타임아웃 + 프로세스 그룹 킬 + 재시도.** 가끔 행이 걸린다.
   `start_new_session=True`로 띄우고 600초 타임아웃 시 `os.killpg(pid, SIGKILL)` 후 1회 재시도.
   성공 판정은 **"출력 파일이 존재하고 10KB 이상"** (경로만 믿지 말 것).

## 소요 시간

장당 **60~175초** (평균 ~90초). 병렬보다는 순차 실행이 안전하다.

## 파이썬 래퍼 (codex_imagegen.py 복사 후)

```python
from pathlib import Path
from codex_imagegen import generate_image

ok, info = generate_image(
    "STYLE + Subject + …",          # 프롬프트 (태스크 지시문은 모듈이 자동으로 앞에 붙임)
    Path("out/result.png"),          # 출력 PNG
    refs=[Path("ref/style.png")],    # 레퍼런스 (없으면 생략)
    workdir=Path(".work/result"),    # 이벤트 로그(events.jsonl)가 여기 쌓임
)
print(ok, info)                      # True "93s (attempt 1)" / False "<원인>"
```

## 배치 돌릴 때의 관례 (ROLLIE'S 방식)

- 샷 목록을 `SHOTS = [(id, [ref…], subject), …]`로 두고 변형은 `TWISTS` 문구를 순환
- 실행 로그를 `tee`로 남기고, `ok/FAIL` 카운트로 완료 검증
- 재현성을 위해 **모든 프롬프트를 .xlsx로 내보내** 보관 (ChatGPT에서 툴 없이 재현 가능하게)
