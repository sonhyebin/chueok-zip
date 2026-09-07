/**
 * 유입 채널 태그 (?s=코드).
 *
 * 공유 링크·배포 링크에 s=코드 를 붙이면 VisitTracker 가 link_visit 이벤트의 src 로 기록하고,
 * /api/stats 의 byChannel 키가 된다. 마케팅 대시보드(mayacrew-dashboard)는 이 키를 그대로 표시하므로
 * 여기 name 값은 바꾸지 말고 추가만 한다 (기존 kakao / share / direct 는 대시보드 계약).
 *
 * 코드는 링크에 붙는 짧은 값, name 은 저장·집계 키, label 은 사람이 읽는 이름.
 */
export const CHANNELS: Record<string, { name: string; label: string }> = {
  k: { name: "kakao", label: "카카오톡 공유" },
  s: { name: "share", label: "링크 복사·기타 앱" },
  th: { name: "threads", label: "스레드" },
  ig: { name: "instagram", label: "인스타그램" },
  yt: { name: "youtube", label: "유튜브" },
  x: { name: "x", label: "X(트위터)" },
  fb: { name: "facebook", label: "페이스북" },
  et: { name: "everytime", label: "에브리타임" },
  bl: { name: "blind", label: "블라인드" },
  dc: { name: "dcinside", label: "디시인사이드" },
  pn: { name: "pann", label: "네이트판" },
  tk: { name: "theqoo", label: "더쿠" },
  iz: { name: "instiz", label: "인스티즈" },
  oc: { name: "openchat", label: "카카오 오픈채팅" },
  cam: { name: "uljjangcam", label: "얼짱캠 앱" },
  ad: { name: "meta_ads", label: "메타 광고" },
  nv: { name: "naver", label: "네이버(블로그·카페)" },
};

/** name → label (대시보드·통계 표기용) */
export const CHANNEL_LABELS: Record<string, string> = Object.fromEntries(
  Object.values(CHANNELS).map((c) => [c.name, c.label]),
);
CHANNEL_LABELS.direct = "직접 방문·검색";

/**
 * ?s= 값을 집계 키로 변환. 등록된 코드는 name 으로, 모르는 코드는 영문·숫자만 남겨 그대로 쓴다
 * (새 채널을 코드 배포 없이 링크만으로 시작할 수 있게). 값이 없으면 direct.
 */
export function channelFromParam(s: string | null): string {
  if (!s) return "direct";
  const known = CHANNELS[s];
  if (known) return known.name;
  const raw = s.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 16);
  return raw || "direct";
}
