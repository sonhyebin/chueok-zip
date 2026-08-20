# ASSET_REVIEW_2005 — 우선순위 5장 적용 검수 리포트

> 검수일: 2026-08-20 · 환경: Playwright(headless Chromium), iPhone 13 프로필, 390×844
> 검수 스크린샷: `screenshots/asset-review/`

## 적용된 5장

| 카드 | 방식 | 파일 | 출처 표기 |
|---|---|---|---|
| 싸이월드 미니홈피 | recreated (완전 오리지널 화면) | `internet/cyworld-room.jpg` (61KB) | 없음 (자체 제작) |
| 사랑했나봐 → BGM 감성 | recreated | `music/cyworld-bgm.jpg` (52KB) | 없음 (자체 제작) |
| 얼짱각도 45도 | generated-original (가상 인물 일러스트) | `photo/uljjang-angle.jpg` (64KB) | 없음 (자체 제작) |
| 카트라이더 → PC방 | **licensed-actual** (2001년 실제 PC방) | `game/pcbang-racing.jpg` (89KB) | ✅ Alex C · CC BY 2.0 + 원본 링크 |
| 컵떡볶이 | **licensed-actual** (2007년 분식 떡볶이) | `food/cup-tteokbokki.jpg` (82KB) | ✅ jetalone · CC BY 2.0 + 원본 링크 |

전 파일 4:3 · 800×600 · JPG q80 · 200KB 이하. 고화질 원본(1600×1200 PNG / 원본 JPG)은 `assets-src/2005/` 보관.

## 검수 결과

- ✅ `npm run build` 통과 (오류 0)
- ✅ 390×844 모바일에서 2005 피드 전체 확인 — 5장 모두 4:3 프레임에 정상 크롭, 레이아웃 흔들림 없음
- ✅ 깨진 이미지 0건, console error 0건, 4xx/5xx 요청 0건
- ✅ 날짜 스탬프: 5장 모두 우하단에서 겹침 없이 가독 (PC방·떡볶이 사진 위에서도 주황 스탬프 판독 가능)
- ✅ 출처 표기: licensed-actual 2장에만 "자료: …" 소형 링크 노출, 자체 제작 3장에는 미노출
- ✅ 이미지 로딩 실패 시 기존 폴백(카테고리 그라데이션+이모지) 동작 구조 유지 (`onError`로 img 숨김)
- ✅ 실제 자료·재구성·생성 이미지가 혼합되어 "전부 AI" / "전부 자료사진"으로 보이지 않음

## 스크린샷

| 파일 | 내용 |
|---|---|
| `card-cyworld-room.png` | 미니홈피 recreated 카드 |
| `card-cyworld-bgm.png` | BGM 감성 recreated 카드 |
| `card-uljjang.png` | 얼짱각도 generated-original 카드 |
| `card-pcbang.png` | PC방 licensed-actual 카드 (출처 표기 포함) |
| `card-tteokbokki.png` | 떡볶이 licensed-actual 카드 (출처 표기 포함) |
| `feed-top.png` | 피드 상단 전경 |

## 남은 문제 / 다음 단계 판단 필요

1. **떡볶이가 컵이 아닌 접시** — 컵떡볶이 전용 라이선스 자료가 없어 2007년 분식 떡볶이로 대체. 자체 촬영 컵떡볶이 확보 시 교체 권장.
2. **PC방 사진에 원거리 인물 포함** — 800×600 저해상+어두운 조도로 식별 곤란하나, 초상권 무결을 원하면 recreated 버전으로 교체 가능 (reference-only 자료로 재현 근거 확보됨).
3. **얼짱각도가 일러스트 스타일** — 현 환경에서 포토리얼 인물 생성 불가. 서비스 픽셀 톤과는 어울리나, ChatGPT와 확정한 포토리얼 비주얼이 나오면 같은 경로에 덮어쓰기만 하면 됨.
4. recreated 2장(미니홈피·BGM)은 일러스트풍 렌더 — 포토리얼 방향을 원하면 동일하게 파일 교체로 대응.

## 나머지 11장 확장 시 유지할 비주얼 기준

- 4:3 · 800×600 · q80 · ≤200KB, 우하단 10% 스탬프 여백, 이미지 내 텍스트 금지
- 톤: 저채도+따뜻한 캐스트+미세 그레인+비네팅 (본 5장의 후처리 파이프라인과 동일)
- 혼합 비율 유지: 실제 자료(출처 확인분)와 재구성/생성 이미지를 카테고리 단위로 섞기
- licensed-actual은 `credit` 필드 필수 + `ASSET_SOURCES.md` 선기록, CC BY-SA·출처불명은 reference-only
- 인접 카드 구도 유형(공간 와이드 / 정물 / 인물 / 화면 클로즈업)이 반복되지 않게 배치
