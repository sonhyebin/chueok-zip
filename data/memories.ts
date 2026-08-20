export type MemoryCategory =
  | "music"
  | "drama"
  | "movie"
  | "game"
  | "device"
  | "internet"
  | "fashion"
  | "food"
  | "meme"
  | "school"
  | "photo";

export type MemoryItem = {
  id: string;
  year: number;
  category: MemoryCategory;

  title: string;
  subtitle?: string;

  targetAgeMin?: number;
  targetAgeMax?: number;

  /** 1~5. 5에 가까울수록 그 연도를 대표하는 강한 추억 */
  memoryStrength: number;

  /** 기억을 자극하는 질문 */
  prompt?: string;

  /**
   * 카드 이미지 경로. 비어 있으면 카테고리별 플레이스홀더가 렌더링된다.
   * 실제 이미지는 public/images/years/<연도>/ 아래에 두고
   * "/images/years/<연도>/<id>.jpg" 형태로 지정한다.
   * 예: image: "/images/years/2005/2005-music-1.jpg"
   */
  image?: string;

  keywords?: string[];
};

export const CATEGORY_META: Record<
  MemoryCategory,
  { emoji: string; label: string }
> = {
  music: { emoji: "🎧", label: "그때 듣던 노래" },
  drama: { emoji: "📺", label: "그때 보던 방송" },
  movie: { emoji: "🎬", label: "그때 보던 영화" },
  game: { emoji: "🎮", label: "그때 하던 게임" },
  device: { emoji: "📱", label: "그때 쓰던 기기" },
  internet: { emoji: "💻", label: "그때 인터넷" },
  fashion: { emoji: "👕", label: "그때 유행" },
  food: { emoji: "🍢", label: "그때 먹던 것" },
  meme: { emoji: "💬", label: "그때 유행어" },
  school: { emoji: "🏫", label: "그때 학교" },
  photo: { emoji: "📷", label: "그때 사진" },
};

/** 피드에서 카테고리가 등장하는 순서 */
export const CATEGORY_ORDER: MemoryCategory[] = [
  "music",
  "drama",
  "internet",
  "game",
  "device",
  "photo",
  "fashion",
  "food",
  "movie",
  "meme",
  "school",
];

/* ── 연도 단위 메타데이터 (대표곡 · 대표 이미지) ─────────────── */

export type SongProvider = "youtube" | "spotify" | "self";

export type YearSong = {
  title: string;
  artist: string;
  /** 재생 방식. "self"는 추후 자체 라이선스 음원 확보 시 사용 */
  provider: SongProvider;
  /**
   * 사이트 내부 재생용 공식 임베드 URL (iframe src).
   * 없으면 externalUrl로 이동하는 폴백 버튼만 표시된다.
   */
  embedUrl?: string;
  /** 원본 음악 서비스 페이지 URL (폴백 / 새 탭 열기) */
  externalUrl: string;
};

export type YearInfo = {
  year: number;
  /** 그 해를 한 줄로 요약하는 제목 */
  title: string;
  description?: string;
  /** 연도 대표 이미지 — 타임캡슐 결과 화면 등에 사용 */
  image?: string;
  song?: YearSong;
};

/** YouTube 영상 ID 하나로 임베드/원본 URL을 함께 생성하는 헬퍼 */
const ytSong = (videoId: string) =>
  ({
    provider: "youtube",
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
    externalUrl: `https://www.youtube.com/watch?v=${videoId}`,
  }) as const;

export const YEAR_INFO: Record<number, YearInfo> = {
  2004: {
    year: 2004,
    title: "버디버디와 도토리의 해",
    song: {
      title: "내 여자라니까",
      artist: "이승기",
      ...ytSong("6NqCmI4IyLA"),
    },
  },
  2005: {
    year: 2005,
    title: "싸이월드 전성시대",
    description: "미니홈피 투데이 숫자에 하루 기분이 갈리던 해",
    image: "/images/years/2005/cover.svg",
    song: {
      title: "사랑했나봐",
      artist: "윤도현",
      ...ytSong("VwuP95CES70"),
    },
  },
  2006: {
    year: 2006,
    title: "네이트온과 서든어택의 해",
    song: {
      title: "사랑 안 해",
      artist: "백지영",
      ...ytSong("jN0uXBwKn8w"),
    },
  },
  2007: {
    year: 2007,
    title: "전국민 텔미 열풍",
    song: {
      title: "Tell Me",
      artist: "원더걸스",
      ...ytSong("BlHv3BbBv6A"),
    },
  },
  2008: {
    year: 2008,
    title: "빠삐놈과 햅틱의 해",
    song: {
      title: "하루하루",
      artist: "빅뱅",
      ...ytSong("8OAQ6RuYFGE"),
    },
  },
};

export function getYearInfo(year: number): YearInfo | null {
  return YEAR_INFO[year] ?? null;
}

export const MEMORIES: MemoryItem[] = [
  // ───────────────────────── 2004 ─────────────────────────
  {
    id: "2004-music-1",
    year: 2004,
    category: "music",
    title: "SG워너비 - Timeless",
    subtitle: "소몰이 창법의 시작",
    memoryStrength: 5,
    prompt: "노래방에서 이거 부르다가 목 나간 적 있죠?",
    keywords: ["발라드", "노래방"],
  },
  {
    id: "2004-music-2",
    year: 2004,
    category: "music",
    title: "이승기 - 내 여자라니까",
    subtitle: "누난 내 여자니까",
    memoryStrength: 5,
    prompt: "이 노래로 데뷔한 이승기, 그때 몇 살이었는지 알아요?",
  },
  {
    id: "2004-music-3",
    year: 2004,
    category: "music",
    title: "김종국 - 한 남자",
    subtitle: "미니홈피 BGM 단골",
    memoryStrength: 4,
    prompt: "이 노래 도토리로 산 사람 손",
  },
  {
    id: "2004-drama-1",
    year: 2004,
    category: "drama",
    title: "파리의 연인",
    subtitle: "\"애기야 가자\"",
    memoryStrength: 5,
    prompt: "마지막 회 결말 보고 배신감 느꼈던 사람?",
  },
  {
    id: "2004-drama-2",
    year: 2004,
    category: "drama",
    title: "풀하우스",
    subtitle: "비 & 송혜교",
    memoryStrength: 5,
    prompt: "곰 세 마리 율동, 아직 기억나요?",
  },
  {
    id: "2004-game-1",
    year: 2004,
    category: "game",
    title: "카트라이더",
    subtitle: "출시하자마자 PC방 점령",
    memoryStrength: 5,
    prompt: "다오? 배찌? 뭐 골랐어요?",
  },
  {
    id: "2004-game-2",
    year: 2004,
    category: "game",
    title: "메이플스토리",
    subtitle: "커닝시티에서 밤새던 날들",
    memoryStrength: 4,
    prompt: "첫 직업 뭐였어요? 설마 도적?",
  },
  {
    id: "2004-internet-1",
    year: 2004,
    category: "internet",
    title: "버디버디",
    subtitle: "ㅎr늘 Browser 아이디의 시대",
    memoryStrength: 5,
    prompt: "특수문자 섞은 아이디, 아직 기억나요?",
  },
  {
    id: "2004-internet-2",
    year: 2004,
    category: "internet",
    title: "싸이월드 도토리",
    subtitle: "한 알에 100원",
    memoryStrength: 5,
    prompt: "도토리 선물 받으면 심장 뛰던 사람?",
  },
  {
    id: "2004-device-1",
    year: 2004,
    category: "device",
    title: "가로본능 폰",
    subtitle: "화면이 돌아간다고?",
    memoryStrength: 4,
    prompt: "친구 폰 뺏어서 돌려본 적 있죠?",
  },
  {
    id: "2004-photo-1",
    year: 2004,
    category: "photo",
    title: "스티커사진",
    subtitle: "네 컷에 우정 박제",
    memoryStrength: 4,
    prompt: "필통 안쪽에 붙여놨던 스티커사진, 누구랑 찍었어요?",
  },
  {
    id: "2004-photo-2",
    year: 2004,
    category: "photo",
    title: "얼짱 문화",
    subtitle: "5대 얼짱 전성시대",
    memoryStrength: 4,
    prompt: "반에 한 명씩 있던 '얼짱 닮은 애', 기억나요?",
  },
  {
    id: "2004-fashion-1",
    year: 2004,
    category: "fashion",
    title: "트레이닝복 등교",
    subtitle: "체육복인지 사복인지",
    memoryStrength: 3,
    prompt: "삼선 슬리퍼까지 신으면 완성",
  },
  {
    id: "2004-fashion-2",
    year: 2004,
    category: "fashion",
    title: "어그부츠",
    subtitle: "겨울 교문 앞 풍경",
    memoryStrength: 3,
    prompt: "교복 치마/바지에 어그, 해봤어요?",
  },
  {
    id: "2004-food-1",
    year: 2004,
    category: "food",
    title: "뿌셔뿌셔",
    subtitle: "부숴서 스프 뿌려 흔들기",
    memoryStrength: 4,
    prompt: "수업시간에 몰래 부숴 먹다 걸린 적 있죠?",
  },
  {
    id: "2004-food-2",
    year: 2004,
    category: "food",
    title: "피카츄 돈까스",
    subtitle: "학교 앞 500원의 행복",
    memoryStrength: 4,
    prompt: "케첩 뿌려서? 그냥?",
  },

  // ───────────────────────── 2005 ─────────────────────────
  {
    id: "2005-music-1",
    image: "/images/years/2005/2005-music-1.svg",
    year: 2005,
    category: "music",
    title: "윤도현 - 사랑했나봐",
    subtitle: "미니홈피 BGM 1위",
    memoryStrength: 5,
    prompt: "이 노래 싸이월드 BGM으로 해본 적 있어요?",
  },
  {
    id: "2005-music-2",
    image: "/images/years/2005/2005-music-2.svg",
    year: 2005,
    category: "music",
    title: "SG워너비 - 죄와 벌",
    subtitle: "노래방 애창곡",
    memoryStrength: 4,
    prompt: "2절 가사 안 보고 부를 수 있었던 사람?",
  },
  {
    id: "2005-music-3",
    image: "/images/years/2005/2005-music-3.svg",
    year: 2005,
    category: "music",
    title: "버즈 - 겁쟁이",
    subtitle: "남자들의 노래방 필수곡",
    memoryStrength: 5,
    prompt: "노래방에서 이 노래 최고음, 끝까지 올라갔어요?",
  },
  {
    id: "2005-drama-1",
    image: "/images/years/2005/2005-drama-1.svg",
    year: 2005,
    category: "drama",
    title: "내 이름은 김삼순",
    subtitle: "삼순이 신드롬",
    memoryStrength: 5,
    prompt: "이거 본방으로 봤어요?",
  },
  {
    id: "2005-drama-2",
    image: "/images/years/2005/2005-drama-2.svg",
    year: 2005,
    category: "drama",
    title: "무한도전 (무모한 도전)",
    subtitle: "지하철과 달리기하던 시절",
    memoryStrength: 4,
    prompt: "이때부터 봤으면 진짜 찐팬",
  },
  {
    id: "2005-game-1",
    image: "/images/years/2005/2005-game-1.svg",
    year: 2005,
    category: "game",
    title: "카트라이더",
    subtitle: "PC방 1순위",
    memoryStrength: 5,
    prompt: "PC방 가면 이거부터 켰어요?",
  },
  {
    id: "2005-game-2",
    image: "/images/years/2005/2005-game-2.svg",
    year: 2005,
    category: "game",
    title: "던전앤파이터",
    subtitle: "오락실 감성 온라인",
    memoryStrength: 4,
    prompt: "첫 캐릭터 귀검사였죠? 솔직히",
  },
  {
    id: "2005-internet-1",
    image: "/images/years/2005/2005-internet-1.svg",
    year: 2005,
    category: "internet",
    title: "싸이월드 미니홈피",
    subtitle: "투데이 방문자 수 확인",
    memoryStrength: 5,
    prompt: "미니홈피 방문자 수 확인하던 사람?",
  },
  {
    id: "2005-internet-2",
    image: "/images/years/2005/2005-internet-2.svg",
    year: 2005,
    category: "internet",
    title: "MP3 플레이어",
    subtitle: "아이리버, 예스24에서 다운",
    memoryStrength: 4,
    prompt: "128MB에 노래 몇 곡 들어갔는지 기억나요?",
  },
  {
    id: "2005-device-1",
    image: "/images/years/2005/2005-device-1.svg",
    year: 2005,
    category: "device",
    title: "슬라이드폰",
    subtitle: "스르륵 올리는 그 손맛",
    memoryStrength: 4,
    prompt: "수업시간에 책상 밑에서 문자 보내다 걸린 적?",
  },
  {
    id: "2005-photo-1",
    image: "/images/years/2005/2005-photo-1.svg",
    year: 2005,
    category: "photo",
    title: "얼짱각도 45도",
    subtitle: "위에서 아래로, 턱은 당기고",
    memoryStrength: 5,
    prompt: "지금도 셀카 찍을 때 이 각도죠?",
  },
  {
    id: "2005-photo-2",
    image: "/images/years/2005/2005-photo-2.svg",
    year: 2005,
    category: "photo",
    title: "디카 날짜 스탬프",
    subtitle: "주황색 글씨 2005.07.24",
    memoryStrength: 4,
    prompt: "하얗게 날아간 셀카, 폴더 어딘가에 있을걸요",
  },
  {
    id: "2005-fashion-1",
    image: "/images/years/2005/2005-fashion-1.svg",
    year: 2005,
    category: "fashion",
    title: "매직 스트레이트",
    subtitle: "찰랑찰랑 생머리 열풍",
    memoryStrength: 3,
    prompt: "고데기로 앞머리 일자로 폈던 사람?",
  },
  {
    id: "2005-fashion-2",
    image: "/images/years/2005/2005-fashion-2.svg",
    year: 2005,
    category: "fashion",
    title: "샤기컷",
    subtitle: "남학생 헤어 유행 1위",
    memoryStrength: 4,
    prompt: "졸업앨범 속 그 머리… 지금 봐도 괜찮아요?",
  },
  {
    id: "2005-food-1",
    image: "/images/years/2005/2005-food-1.svg",
    year: 2005,
    category: "food",
    title: "컵떡볶이",
    subtitle: "학교 앞 300원",
    memoryStrength: 4,
    prompt: "이쑤시개로 찍어 먹는 그 맛, 기억나요?",
  },
  {
    id: "2005-food-2",
    image: "/images/years/2005/2005-food-2.svg",
    year: 2005,
    category: "food",
    title: "슬러시",
    subtitle: "파랗게 물든 혀",
    memoryStrength: 3,
    prompt: "콜라맛? 소다맛? 반반?",
  },

  // ───────────────────────── 2006 ─────────────────────────
  {
    id: "2006-music-1",
    year: 2006,
    category: "music",
    title: "백지영 - 사랑 안 해",
    subtitle: "이별 노래의 정석",
    memoryStrength: 5,
    prompt: "이 노래 부르고 노래방 점수 몇 점 나왔어요?",
  },
  {
    id: "2006-music-2",
    year: 2006,
    category: "music",
    title: "SG워너비 - 내 사람",
    subtitle: "3년 연속 음원 강자",
    memoryStrength: 4,
    prompt: "이 시절 노래방 예약 목록, 절반이 SG워너비였죠",
  },
  {
    id: "2006-music-3",
    year: 2006,
    category: "music",
    title: "씨야 - 여인의 향기",
    subtitle: "미니홈피 감성 발라드",
    memoryStrength: 4,
    prompt: "BGM 미리듣기 30초만 반복해서 듣던 사람?",
  },
  {
    id: "2006-drama-1",
    year: 2006,
    category: "drama",
    title: "궁",
    subtitle: "황태자비 신드롬",
    memoryStrength: 5,
    prompt: "곰인형 나오는 엔딩까지 다 챙겨봤어요?",
  },
  {
    id: "2006-drama-2",
    year: 2006,
    category: "drama",
    title: "주몽",
    subtitle: "월화 밤의 국민 드라마",
    memoryStrength: 4,
    prompt: "다음날 학교에서 어제 주몽 얘기했던 사람?",
  },
  {
    id: "2006-game-1",
    year: 2006,
    category: "game",
    title: "서든어택",
    subtitle: "PC방 FPS 천하통일",
    memoryStrength: 5,
    prompt: "웨어하우스에서 만나요. 주무기 뭐 썼어요?",
  },
  {
    id: "2006-game-2",
    year: 2006,
    category: "game",
    title: "오디션",
    subtitle: "스페이스바 타이밍이 생명",
    memoryStrength: 4,
    prompt: "커플 등록해본 적… 있죠?",
  },
  {
    id: "2006-internet-1",
    year: 2006,
    category: "internet",
    title: "네이트온",
    subtitle: "쪽지와 이모티콘의 시대",
    memoryStrength: 5,
    prompt: "좋아하는 애 로그인하면 심장 뛰던 사람?",
  },
  {
    id: "2006-internet-2",
    year: 2006,
    category: "internet",
    title: "UCC 열풍",
    subtitle: "판도라TV, 엠엔캐스트",
    memoryStrength: 3,
    prompt: "친구들이랑 UCC 찍어본 적 있어요?",
  },
  {
    id: "2006-device-1",
    year: 2006,
    category: "device",
    title: "초콜릿폰",
    subtitle: "빨간 터치 버튼의 감성",
    memoryStrength: 4,
    prompt: "이거 갖고 싶어서 부모님 조른 적 있죠?",
  },
  {
    id: "2006-photo-1",
    year: 2006,
    category: "photo",
    title: "폰카 셀카",
    subtitle: "화소는 낮아도 감성은 높게",
    memoryStrength: 4,
    prompt: "폰카로 찍고 미니홈피에 올리던 그 사진들, 어디 갔을까요",
  },
  {
    id: "2006-photo-2",
    year: 2006,
    category: "photo",
    title: "하두리캠",
    subtitle: "웹캠 셀카의 원조",
    memoryStrength: 4,
    prompt: "뽀샤시 효과 최대로 올려본 적 있죠?",
  },
  {
    id: "2006-fashion-1",
    year: 2006,
    category: "fashion",
    title: "스키니진",
    subtitle: "일자바지의 종말",
    memoryStrength: 4,
    prompt: "처음 입었을 때 다리에 쥐 났던 사람?",
  },
  {
    id: "2006-fashion-2",
    year: 2006,
    category: "fashion",
    title: "롱티 + 레깅스",
    subtitle: "그 시절 국민 코디",
    memoryStrength: 3,
    prompt: "주말에 이 조합으로 시내 나갔던 사람?",
  },
  {
    id: "2006-food-1",
    year: 2006,
    category: "food",
    title: "마이쮸",
    subtitle: "한 개만 달라는 친구들",
    memoryStrength: 4,
    prompt: "딸기맛 vs 포도맛, 어느 쪽이에요?",
  },
  {
    id: "2006-food-2",
    year: 2006,
    category: "food",
    title: "아이셔",
    subtitle: "눈 찡그리기 대결",
    memoryStrength: 3,
    prompt: "안 시다고 허세 부리다가 표정 무너진 적 있죠?",
  },

  // ───────────────────────── 2007 ─────────────────────────
  {
    id: "2007-music-1",
    year: 2007,
    category: "music",
    title: "원더걸스 - Tell Me",
    subtitle: "전국민 텔미 열풍",
    memoryStrength: 5,
    prompt: "텔미 춤, 지금도 출 수 있어요?",
  },
  {
    id: "2007-music-2",
    year: 2007,
    category: "music",
    title: "빅뱅 - 거짓말",
    subtitle: "아이돌 판도를 바꾼 노래",
    memoryStrength: 5,
    prompt: "\"IyaIyaIya~\" 자동재생되죠?",
  },
  {
    id: "2007-music-3",
    year: 2007,
    category: "music",
    title: "소녀시대 - 다시 만난 세계",
    subtitle: "전설의 시작",
    memoryStrength: 4,
    prompt: "이때 최애 멤버 누구였어요?",
  },
  {
    id: "2007-drama-1",
    year: 2007,
    category: "drama",
    title: "커피프린스 1호점",
    subtitle: "고은찬 앓이",
    memoryStrength: 5,
    prompt: "\"네가 남자든 외계인이든\" 그 대사, 기억나요?",
  },
  {
    id: "2007-drama-2",
    year: 2007,
    category: "drama",
    title: "거침없이 하이킥",
    subtitle: "야동순재, 식신준하",
    memoryStrength: 5,
    prompt: "저녁 먹으면서 온 가족이 같이 봤죠?",
  },
  {
    id: "2007-game-1",
    year: 2007,
    category: "game",
    title: "카오스 (워크래프트3)",
    subtitle: "PC방 단체전 국룰",
    memoryStrength: 4,
    prompt: "한 명 접속 안 되면 다 같이 기다렸던 그 시절",
  },
  {
    id: "2007-game-2",
    year: 2007,
    category: "game",
    title: "테일즈런너",
    subtitle: "달리기에 진심이던 우리",
    memoryStrength: 4,
    prompt: "구미호 뽑으려고 런너 모으던 사람?",
  },
  {
    id: "2007-internet-1",
    year: 2007,
    category: "internet",
    title: "싸이월드 일촌평",
    subtitle: "우정의 공개 인증",
    memoryStrength: 5,
    prompt: "일촌평에 뭐라고 써줬는지 기억나는 친구 있어요?",
  },
  {
    id: "2007-internet-2",
    year: 2007,
    category: "internet",
    title: "인터넷 소설",
    subtitle: "늑대의 유혹, 그놈은 멋있었다",
    memoryStrength: 4,
    prompt: "수업시간에 책상 밑으로 몰래 읽다 걸린 적?",
  },
  {
    id: "2007-device-1",
    year: 2007,
    category: "device",
    title: "샤인폰 / DMB폰",
    subtitle: "폰으로 TV 보는 시대",
    memoryStrength: 4,
    prompt: "야자시간에 몰래 DMB 봤던 사람?",
  },
  {
    id: "2007-photo-1",
    year: 2007,
    category: "photo",
    title: "미니홈피 사진첩",
    subtitle: "폴더명: ♡내새끼들♡",
    memoryStrength: 4,
    prompt: "사진첩 폴더 이름, 특수문자 꼭 들어갔죠?",
  },
  {
    id: "2007-photo-2",
    year: 2007,
    category: "photo",
    title: "팔 뻗어 단체샷",
    subtitle: "셀카봉이 없던 시절",
    memoryStrength: 3,
    prompt: "팔 제일 긴 애가 항상 찍었죠?",
  },
  {
    id: "2007-fashion-1",
    year: 2007,
    category: "fashion",
    title: "하이탑 운동화",
    subtitle: "빅뱅 따라 신기",
    memoryStrength: 4,
    prompt: "교복에 하이탑, 그게 제일 멋있는 줄 알았던 시절",
  },
  {
    id: "2007-fashion-2",
    year: 2007,
    category: "fashion",
    title: "커플 후드티",
    subtitle: "우정템이자 커플템",
    memoryStrength: 3,
    prompt: "친한 친구랑 맞춰 입어본 적 있어요?",
  },
  {
    id: "2007-food-1",
    year: 2007,
    category: "food",
    title: "피자스쿨",
    subtitle: "5천원의 기적",
    memoryStrength: 4,
    prompt: "시험 끝나고 친구들이랑 한 판씩 먹었죠?",
  },
  {
    id: "2007-food-2",
    year: 2007,
    category: "food",
    title: "매점 소보로빵",
    subtitle: "쉬는시간 전쟁",
    memoryStrength: 4,
    prompt: "매점 뛰어가서 줄 서던 그 10분, 기억나요?",
  },

  // ───────────────────────── 2008 ─────────────────────────
  {
    id: "2008-music-1",
    year: 2008,
    category: "music",
    title: "원더걸스 - Nobody",
    subtitle: "장기자랑 단골 1위",
    memoryStrength: 5,
    prompt: "수학여행 장기자랑에서 이거 춘 반 꼭 있었죠?",
  },
  {
    id: "2008-music-2",
    year: 2008,
    category: "music",
    title: "빅뱅 - 하루하루",
    subtitle: "노래방 떼창곡",
    memoryStrength: 5,
    prompt: "랩 파트 담당 친구, 누구였어요?",
  },
  {
    id: "2008-music-3",
    year: 2008,
    category: "music",
    title: "쥬얼리 - One More Time",
    subtitle: "롤리팝 이전의 후크송",
    memoryStrength: 4,
    prompt: "\"딱 걸렸어 you~\" 따라 불렀죠?",
  },
  {
    id: "2008-drama-1",
    year: 2008,
    category: "drama",
    title: "베토벤 바이러스",
    subtitle: "\"똥.덩.어.리.\"",
    memoryStrength: 4,
    prompt: "강마에 말투 따라해본 적 있죠?",
  },
  {
    id: "2008-drama-2",
    year: 2008,
    category: "drama",
    title: "우리 결혼했어요",
    subtitle: "가상결혼의 시대",
    memoryStrength: 4,
    prompt: "최애 커플 누구였어요?",
  },
  {
    id: "2008-game-1",
    year: 2008,
    category: "game",
    title: "서든어택",
    subtitle: "여전한 PC방 1위",
    memoryStrength: 4,
    prompt: "클랜 이름, 아직 기억나요?",
  },
  {
    id: "2008-game-2",
    year: 2008,
    category: "game",
    title: "아이온",
    subtitle: "날개 달고 날던 그 순간",
    memoryStrength: 4,
    prompt: "오픈 첫날 서버 대기열 뚫어본 사람?",
  },
  {
    id: "2008-internet-1",
    year: 2008,
    category: "internet",
    title: "빠삐놈 리믹스",
    subtitle: "빠빠라빠라빠라 빠삐코",
    memoryStrength: 5,
    prompt: "이 노래 벨소리로 해놨던 사람 분명 있다",
  },
  {
    id: "2008-internet-2",
    year: 2008,
    category: "internet",
    title: "네이트 판",
    subtitle: "야자시간의 유일한 낙",
    memoryStrength: 4,
    prompt: "판 레전드 글 친구한테 링크 보내던 사람?",
  },
  {
    id: "2008-device-1",
    year: 2008,
    category: "device",
    title: "햅틱폰",
    subtitle: "풀터치의 충격",
    memoryStrength: 4,
    prompt: "\"만지지 마세요\" 광고 기억나요?",
  },
  {
    id: "2008-device-2",
    year: 2008,
    category: "device",
    title: "PMP + 인강",
    subtitle: "공부하는 척 영화 보기",
    memoryStrength: 4,
    prompt: "PMP에 인강 말고 뭐 넣어놨었어요?",
  },
  {
    id: "2008-photo-1",
    year: 2008,
    category: "photo",
    title: "폰카 거울샷",
    subtitle: "화장실 거울 앞 필수 코스",
    memoryStrength: 4,
    prompt: "플래시 터뜨리고 찍어서 얼굴 다 날아갔죠?",
  },
  {
    id: "2008-photo-2",
    year: 2008,
    category: "photo",
    title: "싸이월드 감성 사진",
    subtitle: "사진 위에 하얀 글씨체",
    memoryStrength: 4,
    prompt: "사진에 오글거리는 문구 박아서 올린 적… 있죠?",
  },
  {
    id: "2008-fashion-1",
    year: 2008,
    category: "fashion",
    title: "체크셔츠",
    subtitle: "전국민 교복 아닌 교복",
    memoryStrength: 3,
    prompt: "옷장에 체크셔츠 몇 벌이었어요?",
  },
  {
    id: "2008-fashion-2",
    year: 2008,
    category: "fashion",
    title: "뿔테안경",
    subtitle: "도수 없는 패션 안경",
    memoryStrength: 3,
    prompt: "시력 좋은데 뿔테 꼈던 사람?",
  },
  {
    id: "2008-food-1",
    year: 2008,
    category: "food",
    title: "빠삐코",
    subtitle: "빠삐놈 덕에 품절 대란",
    memoryStrength: 4,
    prompt: "끝까지 쭉 짜서 먹는 그 마지막 한 입",
  },
  {
    id: "2008-food-2",
    year: 2008,
    category: "food",
    title: "김밥천국",
    subtitle: "천원의 성지",
    memoryStrength: 4,
    prompt: "학원 가기 전 참치김밥 한 줄, 국룰이었죠?",
  },
];

/** 데이터가 존재하는 연도 목록 (오름차순) */
export const AVAILABLE_YEARS: number[] = [
  ...new Set(MEMORIES.map((m) => m.year)),
].sort((a, b) => a - b);

/** 대표 샘플 연도 — 콘텐츠·UX 완성도를 우선적으로 관리하는 연도 */
export const FEATURED_YEAR = 2005;

/**
 * 연도별 추억 피드 정렬.
 * memoryStrength가 높은 콘텐츠가 전체적으로 먼저 나오되,
 * 같은 카테고리가 연속으로 등장하지 않도록 그리디하게 배치한다.
 * (동점일 때는 CATEGORY_ORDER 순서로 안정 정렬 → 결과가 결정적)
 */
export function getMemoriesForYear(year: number): MemoryItem[] {
  const pool = MEMORIES.filter((m) => m.year === year).sort((a, b) => {
    if (b.memoryStrength !== a.memoryStrength) {
      return b.memoryStrength - a.memoryStrength;
    }
    const catDiff =
      CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
    if (catDiff !== 0) return catDiff;
    return a.id.localeCompare(b.id);
  });

  const feed: MemoryItem[] = [];
  while (pool.length > 0) {
    const prev = feed[feed.length - 1];
    const idx = prev
      ? pool.findIndex((m) => m.category !== prev.category)
      : 0;
    // 남은 항목이 전부 같은 카테고리면 그냥 순서대로 붙인다
    feed.push(...pool.splice(idx === -1 ? 0 : idx, 1));
  }
  return feed;
}
