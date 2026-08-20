# 추억.zip — UX 자동 테스트 리포트

> Claude가 Playwright로 배포된 사이트를 실제 사용자처럼 조작하며 작성한 리포트.
> 스크린샷: `screenshots/ux-test/` · 재실행: `node scripts/ux-test.mjs`
>
> **2차 (2026-08-20, 최신)**: 1차에서 발견된 M-1~M-5, L-2 수정 후 재테스트 — **자동 체크 35/35 전부 통과**
> 1차 (2026-08-20): 최초 검수 — 33개 중 31개 통과, 이슈 10건 기록

## Test environment

| 항목 | 값 |
|---|---|
| URL | https://2000-steel.vercel.app (프로덕션 배포본) |
| 최신 테스트 일시 | 2026-08-20 (수정 반영 후 2차) |
| 자동화 도구 | Playwright 1.62.1 (headless Chromium) |
| 디바이스 프로필 | iPhone 13 에뮬레이션 (모바일 UA, 터치, DPR 3) |
| 기본 viewport | 390 × 844 |
| 추가 viewport | 375×667 / 393×852 / 430×932 (레이아웃 오버플로 검사) |

제약: headless Chromium은 실제 iOS Safari(WebKit)가 아니며 `navigator.share`(네이티브 공유 시트)를 지원하지 않음. 공유는 클립보드 폴백 경로로 검증. 네이티브 공유 시트·카카오톡 인앱 동작은 실기기 확인 필요.

## Tested flow

1. 홈 접속 → 출생연도 `1992` 입력 → CTA 클릭
2. 타임라인(1992년생) → 2005년 선택
3. 2005 추억 피드 스크롤 (카테고리 연속·첫 CTA 위치·오버플로 검사)
4. 친구 공유 CTA → 타임캡슐 작성 진입
5. 사용자 A(혜빈): 이름 + 5문항 답변 → 초대 링크 생성 → 공유(클립보드 폴백)
6. **새 브라우저 컨텍스트**(localStorage 격리)에서 B(수진)가 초대 링크 진입 → A 답변 비노출 확인 → 5문항 답변 → 제출
7. 결과 페이지 검증 (제목, 조사, 답변 병합, 재공유 CTA)
8. `/?born=1992` 직접 진입 / localStorage 유지·삭제 / console·network 오류 수집

## Passed (2차 — 자동 체크 35/35)

- 홈: 로딩·핵심 질문·오버플로 없음 · **placeholder "예: 1992" 확인** · 입력 전 CTA 비활성 → 4자리 입력 시 활성
- 타임라인: 2003~2010 + 나이 병기, 준비중 구분, 2005 ★추천 배지
- 피드: 13살 계산 정확, 동일 카테고리 연속 0건, **첫 공유 CTA가 카드 5개 뒤 등장**, 오버플로 없음
- 캡슐 A: 전부 입력 시에만 제출 활성, 링크 복사 폴백 + 복사 완료 피드백 (초대 URL 360자)
- 캡슐 B: 초대 랜딩 문구, A 답변 제출 전 비노출, 숨김 안내
- 결과: "혜빈 × 수진의 2005" 제목, **조사 "혜빈이가/수진이가" 자연스러움**, 답변 5쌍 병합, 완성 메시지, 재공유 CTA
- `/?born=1992` 자동 이동, localStorage 유지/삭제 정상
- 4개 viewport 모두 가로 오버플로 없음, console/page error 0건

## Issue status

### Resolved (2차에서 수정 및 재검증 완료)

- ✅ **M-1 Resolved — 한국어 조사.** `nameIga()` 수정: 받침 있는 이름은 "혜빈이가/수진이가", 없는 이름은 "민수가/지우가". 결과 페이지·초대 랜딩 모두 반영, 자동 체크 통과. → `08-capsule-result.png`, `06-capsule-invite.png`
- ✅ **M-2 Resolved — 홈 placeholder.** "1992" → **"예: 1992"** + placeholder 색 대비를 낮춰 실제 입력값으로 오인하지 않도록 수정. → `01-home.png`
- ✅ **M-3 Resolved — 초대 랜딩 줄바꿈.** "혜빈이가 2005년에서 / 타임캡슐을 보냈어요" 2줄 구조로 재배치 + `break-keep`. 390/375/393/430 모두 orphan 없음. → `06-capsule-invite.png`
- ✅ **M-4 Resolved — placeholder 이미지 겹침.** 임시 이미지에서 제목 중복 텍스트와 "임시 이미지 · 교체 예정" 개발 문구 제거. 카테고리 아이콘 + 그라데이션 + 스캔라인 + 날짜 스탬프만 유지. → `05-share-cta.png`
- ✅ **M-5 Resolved — 첫 공유 CTA 위치.** 8번째 카드 뒤 → **5번째 카드 뒤**로 앞당김 (강한 추억 4~5개 경험 직후). 피드 마지막 CTA는 유지 (중간+마지막 2개 구조). → `05-share-cta.png`
- ✅ **L-2 Resolved — CTA 비활성 상태.** 비활성 시 grayscale + 그림자 축소 + cursor 기본값으로 "눌리지 않는 느낌" 강화. 활성 시 기존 핑크+하드섀도 그대로.

### Known Issue — intentionally deferred

- ⏸ **H-1 — A가 결과를 자동으로 못 받음.** URL 기반 MVP 구조상 B가 결과를 재공유해야 A가 봄. 서버/DB 도입 없이 현 구조 유지 결정. 서버 저장 전환 시 해결 예정.
- ⏸ **L-1 — 결과 카드 순차 등장 애니메이션(~1초).** 타임캡슐 개봉 연출로 의도적 유지. 레이아웃 깨짐 없음 재확인(2차).
- ⏸ **L-3 — BGM 재생바 장식용(0:00 고정).** 음원 연동은 별도 단계에서 검토.
- ⏸ **L-4 — 준비중 연도 다수 노출.** 데이터 확장 전까지 유지.

## Technical issues

- console error / page error / hydration error: **0건** (1·2차 동일)
- network: `/year/*?_rsc=…` ERR_ABORTED 수 건 — Next.js Link prefetch가 페이지 이동으로 중단된 것, 사용자 영향 없음
- 404 asset / 이미지 로드 실패: 0건
- `navigator.share`: headless 미지원 → 클립보드 폴백 정상. 실기기 공유 시트는 별도 확인 필요

## Screenshots (`screenshots/ux-test/` — 2차 수정 반영본으로 전체 재캡처)

| 파일 | 내용 |
|---|---|
| `01-home.png` | 홈 — "예: 1992" placeholder + 비활성 CTA (M-2/L-2 반영) |
| `02-timeline-1992.png` | 1992년생 타임라인 (2005 ★추천, 준비중 구분) |
| `03-2005-feed-top.png` | 2005 피드 상단 — 헤더 + BGM 플레이어 + 첫 카드 |
| `04-2005-feed-middle.png` | 피드 중간 스크롤 지점 |
| `05-share-cta.png` | 5번째 카드(카트라이더) 직후의 첫 공유 CTA (M-4/M-5 반영) |
| `06-capsule-invite.png` | B의 초대 랜딩 — "혜빈이가 2005년에서 / 타임캡슐을 보냈어요" (M-1/M-3 반영) |
| `07-capsule-form.png` | B의 답변 작성 화면 |
| `08-capsule-result.png` | 결과 전체 (fullPage) — "혜빈이가/수진이가" 조사 확인 (M-1 반영) |

## 다음 검토 후보 (수정하지 않고 대기)

H-1(결과 전달 루프)의 기획 방향, 실기기(iOS Safari/카카오톡 인앱)에서 공유 시트·BGM 재생 확인, 콘텐츠 밀도(연도 확장)는 ChatGPT 검수 후 결정.
