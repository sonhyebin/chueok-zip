# 이미지 에셋 가이드

## 폴더 구조

```
public/images/years/<연도>/
  ├── <MemoryItem id>.jpg|png|svg   ← 카드 이미지 (예: 2005-music-1.svg)
  └── cover.jpg|svg                 ← 연도 대표 이미지 (타임캡슐 결과 화면)
```

## 실제 사진으로 교체하는 법

1. 사진 파일을 `public/images/years/2005/` 등에 넣는다 (권장 비율 4:3, 폭 800px 내외)
2. `data/memories.ts`에서 해당 항목의 `image` 경로를 파일명에 맞게 바꾼다:

```ts
image: "/images/years/2005/2005-music-1.jpg",
```

- 같은 파일명·확장자로 덮어쓰면 데이터 수정 없이 교체된다 (현재 샘플은 .svg placeholder)
- `image`를 지우면 카테고리별 기본 플레이스홀더(그라데이션+이모지)로 돌아간다
- 비율이 달라도 카드가 4:3 프레임에 `object-fit: cover`로 맞춰지므로 레이아웃은 안 깨진다
- 날짜 스탬프는 이미지 위에 자동 오버레이된다

## 연도 대표 이미지 / 대표곡

`data/memories.ts`의 `YEAR_INFO`에서 관리:

```ts
2005: {
  year: 2005,
  title: "싸이월드 전성시대",
  image: "/images/years/2005/cover.svg",   // 타임캡슐 결과 화면 상단
  song: {
    title: "사랑했나봐",
    artist: "윤도현",
    ...ytSong("VwuP95CES70"),  // YouTube 영상 ID만 바꾸면 임베드+원본 링크 자동 생성
  },
},
```

YouTube가 아닌 서비스를 쓰려면 필드를 직접 지정:

```ts
song: {
  title: "곡명",
  artist: "아티스트",
  provider: "spotify",
  embedUrl: "https://open.spotify.com/embed/track/...",  // 없으면 외부 링크 폴백
  externalUrl: "https://open.spotify.com/track/...",
},
```

⚠️ 음원 파일(mp3 등)을 프로젝트에 직접 넣지 말 것 — 공식 임베드/링크만 사용.
추후 정식 라이선스 확보 시 provider: "self"로 자체 음원 전환 예정.
