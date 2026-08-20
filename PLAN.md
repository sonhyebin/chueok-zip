# 추억.zip — 1차 웹 MVP 설계 문서

> 서비스 가칭: **추억.zip** (변경 쉬움 — `lib/config.ts` 참조)

## 1. 요구사항 분석 요약

- 출생연도 입력 → 학창시절 연도 선택 → 연도별 추억 카드 피드
- 카드는 "이미지 + 짧은 제목 + 기억을 자극하는 질문" 형태 (백과사전 금지)
- 피드 중간/끝에 "생각나는 친구 있어요?" CTA → 친구에게 공유
- 공유받은 친구가 들어오면 2인 타임캡슐 (질문 5개, 상대 답변은 제출 전까지 숨김)
- 둘 다 완료하면 결과 페이지 → 재공유
- 로그인/서버 없음. SNS 기능 없음.

## 2. 화면 구조 (라우트)

| 라우트 | 화면 | 설명 |
|---|---|---|
| `/` | 출생연도 입력 | "몇 년생이에요?" + CTA |
| `/timeline` | 연도 선택 | 출생연도+11 ~ +18 연도 그리드, 당시 나이 표시 |
| `/year/[year]` | 연도별 추억 피드 | 카드 피드 + 친구 CTA |
| `/capsule/new?year=YYYY` | 타임캡슐 만들기 (A) | 이름 + 5문항 답변 → 공유 링크 생성 |
| `/capsule?d=…` | 초대 랜딩 (B) | A의 초대 → B가 답변 (A 답변 숨김) |
| `/capsule/result?d=…` | 타임캡슐 결과 | 두 사람 답변 공개 + 재공유 |

## 3. 데이터 모델

- `MemoryItem` — 요구사항 §8의 타입 그대로 (`data/memories.ts`)
- 타임캡슐은 **서버 없이 URL에 상태를 인코딩** (base64url JSON):
  - 초대 링크: `{ v, year, from, answers[5] }` — A의 답변이 들어있지만 B 화면에는 제출 전까지 렌더링하지 않음
  - 결과 링크: `{ v, year, a:{name,answers}, b:{name,answers} }`
- 한계: URL 기반이므로 B가 완성한 결과 링크를 A에게 다시 보내야 A도 결과를 봄 (결과 화면에 재공유 CTA로 해결). 이후 서버 저장으로 교체 가능한 구조 (`lib/capsule.ts`만 교체).

## 4. 폴더 구조

```
app/            라우트 (UI 셸)
  page.tsx              출생연도 입력
  timeline/page.tsx     연도 선택
  year/[year]/page.tsx  추억 피드
  capsule/new/page.tsx  캡슐 생성(A)
  capsule/page.tsx      초대 랜딩(B)
  capsule/result/page.tsx 결과
components/     Y2K UI 컴포넌트 (Window, MemoryCard, PixelButton …)
data/           콘텐츠 데이터 (UI와 완전 분리)
  memories.ts           2004~2008 샘플 DB
  capsuleQuestions.ts   2인 질문
lib/            로직 (나이 계산, URL 인코딩, 공유)
```

## 5. 향후 확장 포인트

- `data/memories.ts`에 연도만 추가하면 타임라인에 자동 반영
- `lib/capsule.ts`의 encode/decode를 서버 저장(POST → id)으로 교체하면 SNS 단계 대응
- 얼짱캠 연동: `/?born=1992` / `/year/2005?born=1992` 쿼리 진입 지원 (URL만으로 상태 복원)
