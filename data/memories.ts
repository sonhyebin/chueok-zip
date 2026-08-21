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

  /**
   * 실제 자료(licensed-actual) 이미지에만 설정 — 카드 하단에 "자료: …"로 표시되고 원본으로 링크.
   * recreated / generated-original 이미지에는 넣지 않는다.
   */
  credit?: {
    label: string;
    url?: string;
  };

  /**
   * 카드 안에서 곡을 바로 재생할 때 설정 (주로 music 카드).
   * 연도 대표곡(YEAR_INFO.song)과 동일하게 공식 임베드 플레이어로만 재생한다.
   */
  song?: YearSong;

  /** 발매일 — "YYYY.MM.DD" 표기. 카드 부제 아래에 "○○ 발매"로 표시된다. */
  releaseDate?: string;

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
    description: "네이트온 로그인 소리에 심장 뛰고, PC방에선 서든어택뿐이던 해",
    image: "/images/years/2006/cover.svg",
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
  2009: {
    year: 2009,
    title: "Gee와 아이폰 상륙의 해",
    song: { title: "Gee", artist: "소녀시대", ...ytSong("U7mPqycQ0tQ") },
  },
  2010: {
    year: 2010,
    title: "카카오톡이 태어난 해",
    song: { title: "Oh!", artist: "소녀시대", ...ytSong("TGbwL8kSpEk") },
  },
  2011: {
    year: 2011,
    title: "노스페이스와 롤의 해",
    song: { title: "좋은 날", artist: "아이유", ...ytSong("jeqdYqsrsA0") },
  },
  2012: {
    year: 2012,
    title: "강남스타일과 애니팡의 해",
    song: { title: "강남스타일", artist: "싸이", ...ytSong("9bZkp7q19f0") },
  },
};

export function getYearInfo(year: number): YearInfo | null {
  return YEAR_INFO[year] ?? null;
}

export const MEMORIES: MemoryItem[] = [
  // ───────────────────────── 2004 ─────────────────────────
  {
    id: "2004-music-1",
    image: "/images/years/2004/music/2004-music-1.jpg",
    credit: {
      label: "striegel · Wikimedia Commons · CC BY 2.0",
      url: "https://commons.wikimedia.org/wiki/File%3ASony_Car_Discman_CD_player_D-830K%2C_front%2C_power_on_%2834979355295%29.jpg",
    },
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
    image: "/images/years/2004/music/2004-music-2.jpg",
    credit: {
      label: "Department of Defense. Ameri · Wikimedia Commons · Public domain",
      url: "https://commons.wikimedia.org/wiki/File%3AA_member_of_the_stage_crew_makes_adjustments_on_lights_for_the_US_Navy_Band%27s_Silver_Anniversary_Lollipop_Concert_-_DPLA_-_bba9273ee2b50d2a53595243a16342a9.jpeg",
    },
    year: 2004,
    category: "music",
    title: "이승기 - 내 여자라니까",
    subtitle: "누난 내 여자니까",
    memoryStrength: 5,
    prompt: "이 노래로 데뷔한 이승기, 그때 몇 살이었는지 알아요?",
  },
  {
    id: "2004-music-3",
    image: "/images/years/2004/music/2004-music-3.jpg",
    credit: {
      label: "kohlmann.sascha · Flickr · CC BY-SA 2.0",
      url: "https://www.flickr.com/photos/96323831@N06/10960938633",
    },
    year: 2004,
    category: "music",
    title: "김종국 - 한 남자",
    subtitle: "미니홈피 BGM 단골",
    memoryStrength: 4,
    prompt: "이 노래 도토리로 산 사람 손",
  },
  {
    id: "2004-drama-1",
    image: "/images/years/2004/drama/paris-livingroom.jpg",
    year: 2004,
    category: "drama",
    title: "파리의 연인",
    subtitle: "\"애기야 가자\"",
    memoryStrength: 5,
    prompt: "마지막 회 결말 보고 배신감 느꼈던 사람?",
  },
  {
    id: "2004-drama-2",
    image: "/images/years/2004/drama/2004-drama-2.jpg",
    credit: {
      label: "Wonderlane · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/71401718@N00/465852851",
    },
    year: 2004,
    category: "drama",
    title: "풀하우스",
    subtitle: "비 & 송혜교",
    memoryStrength: 5,
    prompt: "곰 세 마리 율동, 아직 기억나요?",
  },
  {
    id: "2004-game-1",
    image: "/images/years/2004/game/2004-game-1.jpg",
    credit: {
      label: "Alex C · Wikimedia Commons · CC BY 2.0",
      url: "https://commons.wikimedia.org/wiki/File:People_playing_StarCraft_at_PC_Bang_in_2001.jpg",
    },
    year: 2004,
    category: "game",
    title: "카트라이더",
    subtitle: "출시하자마자 PC방 점령",
    memoryStrength: 5,
    prompt: "다오? 배찌? 뭐 골랐어요?",
  },
  {
    id: "2004-game-2",
    image: "/images/years/2005/game/pcbang-racing.jpg",
    credit: {
      label: "Alex C · Wikimedia Commons · CC BY 2.0",
      url: "https://commons.wikimedia.org/wiki/File:PC_bang_in_2001.jpg",
    },
    year: 2004,
    category: "game",
    title: "메이플스토리",
    subtitle: "커닝시티에서 밤새던 날들",
    memoryStrength: 4,
    prompt: "첫 직업 뭐였어요? 설마 도적?",
  },
  {
    id: "2004-internet-1",
    image: "/images/years/2004/internet/buddybuddy-messenger.jpg",
    year: 2004,
    category: "internet",
    title: "버디버디",
    subtitle: "ㅎr늘 Browser 아이디의 시대",
    memoryStrength: 5,
    prompt: "특수문자 섞은 아이디, 아직 기억나요?",
  },
  {
    id: "2004-internet-2",
    image: "/images/years/2004/internet/dotori-acorns.jpg",
    credit: {
      label: "David Hill · Wikimedia Commons · CC BY 2.0",
      url: "https://commons.wikimedia.org/wiki/File:Acorns_small_to_large.jpg",
    },
    year: 2004,
    category: "internet",
    title: "싸이월드 도토리",
    subtitle: "한 알에 100원",
    memoryStrength: 5,
    prompt: "도토리 선물 받으면 심장 뛰던 사람?",
  },
  {
    id: "2004-device-1",
    image: "/images/years/2004/device/garobon-phone.jpg",
    year: 2004,
    category: "device",
    title: "가로본능 폰",
    subtitle: "화면이 돌아간다고?",
    memoryStrength: 4,
    prompt: "친구 폰 뺏어서 돌려본 적 있죠?",
  },
  {
    id: "2004-photo-1",
    image: "/images/years/2004/photo/sticker-photo.jpg",
    year: 2004,
    category: "photo",
    title: "스티커사진",
    subtitle: "네 컷에 우정 박제",
    memoryStrength: 4,
    prompt: "필통 안쪽에 붙여놨던 스티커사진, 누구랑 찍었어요?",
  },
  {
    id: "2004-photo-2",
    image: "/images/years/2004/photo/2004-photo-2.jpg",
    credit: {
      label: "Alessandro Grussu · Flickr · CC BY-NC-SA 2.0",
      url: "https://www.flickr.com/photos/36553196@N08/4584895568",
    },
    year: 2004,
    category: "photo",
    title: "얼짱 문화",
    subtitle: "5대 얼짱 전성시대",
    memoryStrength: 4,
    prompt: "반에 한 명씩 있던 '얼짱 닮은 애', 기억나요?",
  },
  {
    id: "2004-fashion-1",
    image: "/images/years/2004/fashion/2004-fashion-1.jpg",
    credit: {
      label: "Gareth1953 All Right Now · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/40837632@N05/6602334993",
    },
    year: 2004,
    category: "fashion",
    title: "트레이닝복 등교",
    subtitle: "체육복인지 사복인지",
    memoryStrength: 3,
    prompt: "삼선 슬리퍼까지 신으면 완성",
  },
  {
    id: "2004-fashion-2",
    image: "/images/years/2004/fashion/2004-fashion-2.jpg",
    credit: {
      label: "Annie Mole · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/21309047@N00/120408248",
    },
    year: 2004,
    category: "fashion",
    title: "어그부츠",
    subtitle: "겨울 교문 앞 풍경",
    memoryStrength: 3,
    prompt: "교복 치마/바지에 어그, 해봤어요?",
  },
  {
    id: "2004-food-1",
    image: "/images/years/2004/food/2004-food-1.jpg",
    credit: {
      label: "Kolforn · Wikimedia Commons · CC BY-SA 4.0",
      url: "https://commons.wikimedia.org/wiki/File%3A-2022-01-14_Instant_noodles_%26_paster_packets%2C_Morrisons%2C_Cromer.JPG",
    },
    year: 2004,
    category: "food",
    title: "뿌셔뿌셔",
    subtitle: "부숴서 스프 뿌려 흔들기",
    memoryStrength: 4,
    prompt: "수업시간에 몰래 부숴 먹다 걸린 적 있죠?",
  },
  {
    id: "2004-food-2",
    image: "/images/years/2004/food/2004-food-2.jpg",
    credit: {
      label: "Guilhem Vellut from Paris, F · Wikimedia Commons · CC BY 2.0",
      url: "https://commons.wikimedia.org/wiki/File%3APork_cutlet%2C_Tonkatsu_Menu%2C_Tonkatsu_Tombo%2C_Paris_6_December_2016_001.jpg",
    },
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
    image: "/images/years/2005/music/cyworld-bgm.jpg",
    credit: {
      label: "Mrs. Gemstone · Flickr · CC BY-SA 2.0",
      url: "https://www.flickr.com/photos/21893264@N00/2215657406",
    },
    year: 2005,
    category: "music",
    title: "윤도현 - 사랑했나봐",
    subtitle: "미니홈피 BGM 1위",
    memoryStrength: 5,
    prompt: "이 노래 싸이월드 BGM으로 해본 적 있어요?",
  },
  {
    id: "2005-music-2",
    image: "/images/years/2005/music/noraebang-book.jpg",
    credit: {
      label: "la_minai · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/46348337@N02/5029488840",
    },
    year: 2005,
    category: "music",
    title: "SG워너비 - 죄와 벌",
    subtitle: "노래방 애창곡",
    memoryStrength: 4,
    prompt: "2절 가사 안 보고 부를 수 있었던 사람?",
  },
  {
    id: "2005-music-3",
    image: "/images/years/2005/music/noraebang-highnote.jpg",
    credit: {
      label: "derekGavey · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/45170709@N06/4917447111",
    },
    year: 2005,
    category: "music",
    title: "버즈 - 겁쟁이",
    subtitle: "남자들의 노래방 필수곡",
    releaseDate: "2005.03.03",
    song: {
      title: "겁쟁이",
      artist: "버즈",
      ...ytSong("GSXvwmamkoU"),
    },
    memoryStrength: 5,
    prompt: "노래방에서 이 노래 최고음, 끝까지 올라갔어요?",
  },
  {
    id: "2005-drama-1",
    image: "/images/years/2005/drama/livingroom-drama-night.jpg",
    credit: {
      label: "Paladin27 · Flickr · CC BY-NC 2.0",
      url: "https://www.flickr.com/photos/98227537@N00/177469102",
    },
    year: 2005,
    category: "drama",
    title: "내 이름은 김삼순",
    subtitle: "삼순이 신드롬",
    memoryStrength: 5,
    prompt: "이거 본방으로 봤어요?",
  },
  {
    id: "2005-drama-2",
    image: "/images/years/2005/drama/saturday-variety.jpg",
    credit: {
      label: "Tobyotter · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/78428166@N00/6631862399",
    },
    year: 2005,
    category: "drama",
    title: "무한도전 (무모한 도전)",
    subtitle: "지하철과 달리기하던 시절",
    memoryStrength: 4,
    prompt: "이때부터 봤으면 진짜 찐팬",
  },
  {
    id: "2005-game-1",
    image: "/images/years/2005/game/pcbang-racing.jpg",
    credit: {
      label: "Alex C · Wikimedia Commons · CC BY 2.0",
      url: "https://commons.wikimedia.org/wiki/File:PC_bang_in_2001.jpg",
    },
    year: 2005,
    category: "game",
    title: "카트라이더",
    subtitle: "PC방 1순위",
    memoryStrength: 5,
    prompt: "PC방 가면 이거부터 켰어요?",
  },
  {
    id: "2005-game-2",
    image: "/images/years/2005/game/night-gaming.jpg",
    credit: {
      label: "Hachimaki · Wikimedia Commons · CC BY-SA 2.0",
      url: "https://commons.wikimedia.org/wiki/File:Korean.culture-PC.bang-01.jpg",
    },
    year: 2005,
    category: "game",
    title: "던전앤파이터",
    subtitle: "오락실 감성 온라인",
    memoryStrength: 4,
    prompt: "첫 캐릭터 귀검사였죠? 솔직히",
  },
  {
    id: "2005-internet-1",
    image: "/images/years/2005/internet/cyworld-room.jpg",
    credit: {
      label: "Wikimedia Commons · Public Domain (2005)",
      url: "https://commons.wikimedia.org/wiki/File:Seoul-Cyworld_control_room.jpg",
    },
    year: 2005,
    category: "internet",
    title: "싸이월드 미니홈피",
    subtitle: "투데이 방문자 수 확인",
    memoryStrength: 5,
    prompt: "미니홈피 방문자 수 확인하던 사람?",
  },
  {
    id: "2005-internet-2",
    image: "/images/years/2005/internet/mp3-player.jpg",
    credit: {
      label: "Graham Stanley · Wikimedia Commons · CC BY 2.0",
      url: "https://commons.wikimedia.org/wiki/File:IRiver_ifp-890.jpg",
    },
    year: 2005,
    category: "internet",
    title: "MP3 플레이어",
    subtitle: "아이리버, 예스24에서 다운",
    memoryStrength: 4,
    prompt: "128MB에 노래 몇 곡 들어갔는지 기억나요?",
  },
  {
    id: "2005-device-1",
    image: "/images/years/2005/device/slide-phone.jpg",
    credit: {
      label: "Wikimedia Commons · Public Domain",
      url: "https://commons.wikimedia.org/wiki/File:LG_Chocolate_Phone_Open.jpg",
    },
    year: 2005,
    category: "device",
    title: "슬라이드폰",
    subtitle: "스르륵 올리는 그 손맛",
    memoryStrength: 4,
    prompt: "수업시간에 책상 밑에서 문자 보내다 걸린 적?",
  },
  {
    id: "2005-photo-1",
    image: "/images/years/2005/photo/uljjang-angle.jpg",
    credit: {
      label: "jpmatth · Flickr · CC BY-NC-ND 2.0",
      url: "https://www.flickr.com/photos/21893885@N00/5395865",
    },
    year: 2005,
    category: "photo",
    title: "얼짱각도 45도",
    subtitle: "위에서 아래로, 턱은 당기고",
    memoryStrength: 5,
    prompt: "지금도 셀카 찍을 때 이 각도죠?",
  },
  {
    id: "2005-photo-2",
    image: "/images/years/2005/photo/digicam-snap.jpg",
    credit: {
      label: "David Gerard · Wikimedia Commons · Public Domain",
      url: "https://commons.wikimedia.org/wiki/File:Canon_Digital_IXUS_400_front.jpg",
    },
    year: 2005,
    category: "photo",
    title: "디카 날짜 스탬프",
    subtitle: "주황색 글씨 2005.07.24",
    memoryStrength: 4,
    prompt: "하얗게 날아간 셀카, 폴더 어딘가에 있을걸요",
  },
  {
    id: "2005-fashion-1",
    image: "/images/years/2005/fashion/magic-straight.jpg",
    credit: {
      label: "Leomedia · Wikimedia Commons · CC0",
      url: "https://commons.wikimedia.org/wiki/File:Hair_straighteners_(3).JPG",
    },
    year: 2005,
    category: "fashion",
    title: "매직 스트레이트",
    subtitle: "찰랑찰랑 생머리 열풍",
    memoryStrength: 3,
    prompt: "고데기로 앞머리 일자로 폈던 사람?",
  },
  {
    id: "2005-fashion-2",
    image: "/images/years/2005/fashion/shaggy-cut.jpg",
    year: 2005,
    category: "fashion",
    title: "샤기컷",
    subtitle: "남학생 헤어 유행 1위",
    memoryStrength: 4,
    prompt: "졸업앨범 속 그 머리… 지금 봐도 괜찮아요?",
  },
  {
    id: "2005-food-1",
    image: "/images/years/2005/food/cup-tteokbokki.jpg",
    credit: {
      label: "jetalone · Wikimedia Commons · CC BY 2.0",
      url: "https://commons.wikimedia.org/wiki/File:Korean.snacks-Tteokbokki-08.jpg",
    },
    year: 2005,
    category: "food",
    title: "컵떡볶이",
    subtitle: "학교 앞 300원",
    memoryStrength: 4,
    prompt: "이쑤시개로 찍어 먹는 그 맛, 기억나요?",
  },
  {
    id: "2005-food-2",
    image: "/images/years/2005/food/blue-slush.jpg",
    credit: {
      label: "Chris Yarzab · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/10957255@N08/4765230501",
    },
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
    image: "/images/years/2006/music/2006-music-1.jpg",
    credit: {
      label: "themusicianlab · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/142356394@N05/28158933050",
    },
    year: 2006,
    category: "music",
    title: "백지영 - 사랑 안 해",
    subtitle: "이별 노래의 정석",
    memoryStrength: 5,
    prompt: "이 노래 부르고 노래방 점수 몇 점 나왔어요?",
  },
  {
    id: "2006-music-2",
    image: "/images/years/2006/music/2006-music-2.jpg",
    credit: {
      label: "hojusaram · Flickr · CC BY-NC-SA 2.0",
      url: "https://www.flickr.com/photos/7122909@N05/3927766495",
    },
    year: 2006,
    category: "music",
    title: "SG워너비 - 내 사람",
    subtitle: "3년 연속 음원 강자",
    memoryStrength: 4,
    prompt: "이 시절 노래방 예약 목록, 절반이 SG워너비였죠",
  },
  {
    id: "2006-music-3",
    image: "/images/years/2006/music/2006-music-3.jpg",
    credit: {
      label: "The Cleveland Kid · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/21395880@N02/4430896810",
    },
    year: 2006,
    category: "music",
    title: "씨야 - 여인의 향기",
    subtitle: "미니홈피 감성 발라드",
    memoryStrength: 4,
    prompt: "BGM 미리듣기 30초만 반복해서 듣던 사람?",
  },
  {
    id: "2006-drama-1",
    image: "/images/years/2006/drama/2006-drama-1.jpg",
    credit: {
      label: "Basile Morin · Wikimedia Commons · CC BY-SA 4.0",
      url: "https://commons.wikimedia.org/wiki/File%3AFinely_painted_wooden_ceiling_of_Jibokjae_Hall_seen_from_below_at_Gyeongbokgung_Palace_in_Seoul.jpg",
    },
    year: 2006,
    category: "drama",
    title: "궁",
    subtitle: "황태자비 신드롬",
    memoryStrength: 5,
    prompt: "곰인형 나오는 엔딩까지 다 챙겨봤어요?",
  },
  {
    id: "2006-drama-2",
    image: "/images/years/2006/drama/2006-drama-2.jpg",
    credit: {
      label: "Basile Morin · Wikimedia Commons · CC BY-SA 4.0",
      url: "https://commons.wikimedia.org/wiki/File%3AFront_view_of_Jibokjae_Hall_under_blue_sky_at_Gyeongbokgung_Palace_in_Seoul.jpg",
    },
    year: 2006,
    category: "drama",
    title: "주몽",
    subtitle: "월화 밤의 국민 드라마",
    memoryStrength: 4,
    prompt: "다음날 학교에서 어제 주몽 얘기했던 사람?",
  },
  {
    id: "2006-game-1",
    image: "/images/years/2006/game/pcbang-fps.jpg",
    credit: {
      label: "Alex C · Wikimedia Commons · CC BY 2.0",
      url: "https://commons.wikimedia.org/wiki/File:People_playing_StarCraft_at_PC_Bang_in_2001.jpg",
    },
    year: 2006,
    category: "game",
    title: "서든어택",
    subtitle: "PC방 FPS 천하통일",
    memoryStrength: 5,
    prompt: "웨어하우스에서 만나요. 주무기 뭐 썼어요?",
  },
  {
    id: "2006-game-2",
    image: "/images/years/2006/game/2006-game-2.jpg",
    credit: {
      label: "jasoneppink · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/38102495@N00/9226580528",
    },
    year: 2006,
    category: "game",
    title: "오디션",
    subtitle: "스페이스바 타이밍이 생명",
    memoryStrength: 4,
    prompt: "커플 등록해본 적… 있죠?",
  },
  {
    id: "2006-internet-1",
    image: "/images/years/2005/music/cyworld-bgm.jpg",
    credit: {
      label: "Mrs. Gemstone · Flickr · CC BY-SA 2.0",
      url: "https://www.flickr.com/photos/21893264@N00/2215657406",
    },
    year: 2006,
    category: "internet",
    title: "네이트온",
    subtitle: "쪽지와 이모티콘의 시대",
    memoryStrength: 5,
    prompt: "좋아하는 애 로그인하면 심장 뛰던 사람?",
  },
  {
    id: "2006-internet-2",
    image: "/images/years/2006/internet/2006-internet-2.jpg",
    credit: {
      label: "Free Photo Fun · Wikimedia Commons · CC BY 2.0",
      url: "https://commons.wikimedia.org/wiki/File%3ACanon_XL-1_3_CCD_Digital_Video_Camcorder_PAL_Mini_DV.jpg",
    },
    year: 2006,
    category: "internet",
    title: "UCC 열풍",
    subtitle: "판도라TV, 엠엔캐스트",
    memoryStrength: 3,
    prompt: "친구들이랑 UCC 찍어본 적 있어요?",
  },
  {
    id: "2006-device-1",
    image: "/images/years/2006/device/chocolate-phone.jpg",
    credit: {
      label: "Petar Milošević · Wikimedia Commons · CC BY 4.0",
      url: "https://commons.wikimedia.org/wiki/File:LG_KG800.jpg",
    },
    year: 2006,
    category: "device",
    title: "초콜릿폰",
    subtitle: "빨간 터치 버튼의 감성",
    memoryStrength: 4,
    prompt: "이거 갖고 싶어서 부모님 조른 적 있죠?",
  },
  {
    id: "2006-photo-1",
    image: "/images/years/2006/photo/2006-photo-1.jpg",
    credit: {
      label: "Raimond Spekking · Wikimedia Commons · CC BY-SA 4.0",
      url: "https://commons.wikimedia.org/wiki/File%3AMotorola_RAZR_V3-4899.jpg",
    },
    year: 2006,
    category: "photo",
    title: "폰카 셀카",
    subtitle: "화소는 낮아도 감성은 높게",
    memoryStrength: 4,
    prompt: "폰카로 찍고 미니홈피에 올리던 그 사진들, 어디 갔을까요",
  },
  {
    id: "2006-photo-2",
    image: "/images/years/2006/photo/haduri-webcam.jpg",
    credit: {
      label: "Dave Pape · Wikimedia Commons · Public Domain",
      url: "https://commons.wikimedia.org/wiki/File:Logitech_Quickcam_Pro_4000.jpg",
    },
    year: 2006,
    category: "photo",
    title: "하두리캠",
    subtitle: "웹캠 셀카의 원조",
    memoryStrength: 4,
    prompt: "뽀샤시 효과 최대로 올려본 적 있죠?",
  },
  {
    id: "2006-fashion-1",
    image: "/images/years/2006/fashion/2006-fashion-1.jpg",
    credit: {
      label: "Jamie · Wikimedia Commons · CC BY-SA 2.0",
      url: "https://commons.wikimedia.org/wiki/File%3AFox_Print_Ruffle_Sleeve_Top%2C_High_Waisted_Skinny_Jeans%2C_and_Brown_Clogs_%2817880335784%29.jpg",
    },
    year: 2006,
    category: "fashion",
    title: "스키니진",
    subtitle: "일자바지의 종말",
    memoryStrength: 4,
    prompt: "처음 입었을 때 다리에 쥐 났던 사람?",
  },
  {
    id: "2006-fashion-2",
    image: "/images/years/2006/fashion/2006-fashion-2.jpg",
    credit: {
      label: "Ian Sane · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/31246066@N04/4252587897",
    },
    year: 2006,
    category: "fashion",
    title: "롱티 + 레깅스",
    subtitle: "그 시절 국민 코디",
    memoryStrength: 3,
    prompt: "주말에 이 조합으로 시내 나갔던 사람?",
  },
  {
    id: "2006-food-1",
    image: "/images/years/2006/food/2006-food-1.jpg",
    credit: {
      label: "terren in Virginia · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/8136496@N05/2098283991",
    },
    year: 2006,
    category: "food",
    title: "마이쮸",
    subtitle: "한 개만 달라는 친구들",
    memoryStrength: 4,
    prompt: "딸기맛 vs 포도맛, 어느 쪽이에요?",
  },
  {
    id: "2006-food-2",
    image: "/images/years/2006/food/2006-food-2.jpg",
    credit: {
      label: "Adam Wood · Wikimedia Commons · CC BY-SA 2.0",
      url: "https://commons.wikimedia.org/wiki/File%3AComfits.jpg",
    },
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
    image: "/images/years/2007/music/2007-music-1.jpg",
    credit: {
      label: "siobhanmc · Flickr · CC BY-NC-SA 2.0",
      url: "https://www.flickr.com/photos/71508971@N00/4037930851",
    },
    year: 2007,
    category: "music",
    title: "원더걸스 - Tell Me",
    subtitle: "전국민 텔미 열풍",
    memoryStrength: 5,
    prompt: "텔미 춤, 지금도 출 수 있어요?",
  },
  {
    id: "2007-music-2",
    image: "/images/years/2005/music/noraebang-highnote.jpg",
    credit: {
      label: "derekGavey · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/45170709@N06/4917447111",
    },
    year: 2007,
    category: "music",
    title: "빅뱅 - 거짓말",
    subtitle: "아이돌 판도를 바꾼 노래",
    memoryStrength: 5,
    prompt: "\"IyaIyaIya~\" 자동재생되죠?",
  },
  {
    id: "2007-music-3",
    image: "/images/years/2007/music/2007-music-3.jpg",
    credit: {
      label: "Department of Defense. Ameri · Wikimedia Commons · Public domain",
      url: "https://commons.wikimedia.org/wiki/File%3AA_member_of_the_stage_crew_makes_adjustments_on_lights_for_the_US_Navy_Band%27s_Silver_Anniversary_Lollipop_Concert_-_DPLA_-_bba9273ee2b50d2a53595243a16342a9.jpeg",
    },
    year: 2007,
    category: "music",
    title: "소녀시대 - 다시 만난 세계",
    subtitle: "전설의 시작",
    memoryStrength: 4,
    prompt: "이때 최애 멤버 누구였어요?",
  },
  {
    id: "2007-drama-1",
    image: "/images/years/2007/drama/2007-drama-1.jpg",
    credit: {
      label: "tapecode · Flickr · CC PDM 1.0",
      url: "https://www.flickr.com/photos/148019735@N08/31813073584",
    },
    year: 2007,
    category: "drama",
    title: "커피프린스 1호점",
    subtitle: "고은찬 앓이",
    memoryStrength: 5,
    prompt: "\"네가 남자든 외계인이든\" 그 대사, 기억나요?",
  },
  {
    id: "2007-drama-2",
    image: "/images/years/2007/drama/2007-drama-2.jpg",
    credit: {
      label: "Digi_shot · Flickr · CC BY-NC-ND 2.0",
      url: "https://www.flickr.com/photos/25828103@N03/4704185948",
    },
    year: 2007,
    category: "drama",
    title: "거침없이 하이킥",
    subtitle: "야동순재, 식신준하",
    memoryStrength: 5,
    prompt: "저녁 먹으면서 온 가족이 같이 봤죠?",
  },
  {
    id: "2007-game-1",
    image: "/images/years/2007/game/2007-game-1.jpg",
    credit: {
      label: "Syced · Wikimedia Commons · CC0",
      url: "https://commons.wikimedia.org/wiki/File%3ALAN_party_in_France_in_2003.jpg",
    },
    year: 2007,
    category: "game",
    title: "카오스 (워크래프트3)",
    subtitle: "PC방 단체전 국룰",
    memoryStrength: 4,
    prompt: "한 명 접속 안 되면 다 같이 기다렸던 그 시절",
  },
  {
    id: "2007-game-2",
    image: "/images/years/2007/game/2007-game-2.jpg",
    credit: {
      label: "comedy_nose · Flickr · CC PDM 1.0",
      url: "https://www.flickr.com/photos/23408922@N07/9320845849",
    },
    year: 2007,
    category: "game",
    title: "테일즈런너",
    subtitle: "달리기에 진심이던 우리",
    memoryStrength: 4,
    prompt: "구미호 뽑으려고 런너 모으던 사람?",
  },
  {
    id: "2007-internet-1",
    image: "/images/years/2007/internet/2007-internet-1.jpg",
    credit: {
      label: "DarlingJack · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/92584549@N08/33104968363",
    },
    year: 2007,
    category: "internet",
    title: "싸이월드 일촌평",
    subtitle: "우정의 공개 인증",
    memoryStrength: 5,
    prompt: "일촌평에 뭐라고 써줬는지 기억나는 친구 있어요?",
  },
  {
    id: "2007-internet-2",
    image: "/images/years/2007/internet/2007-internet-2.jpg",
    credit: {
      label: "Enokson · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/47823583@N03/5537660712",
    },
    year: 2007,
    category: "internet",
    title: "인터넷 소설",
    subtitle: "늑대의 유혹, 그놈은 멋있었다",
    memoryStrength: 4,
    prompt: "수업시간에 책상 밑으로 몰래 읽다 걸린 적?",
  },
  {
    id: "2007-device-1",
    image: "/images/years/2007/device/2007-device-1.jpg",
    credit: {
      label: "Horst · Wikimedia Commons · CC BY 3.0",
      url: "https://commons.wikimedia.org/wiki/File%3ALG_KE970_1.jpg",
    },
    year: 2007,
    category: "device",
    title: "샤인폰 / DMB폰",
    subtitle: "폰으로 TV 보는 시대",
    memoryStrength: 4,
    prompt: "야자시간에 몰래 DMB 봤던 사람?",
  },
  {
    id: "2007-photo-1",
    image: "/images/years/2007/photo/2007-photo-1.jpg",
    credit: {
      label: "Alessandro Grussu · Flickr · CC BY-NC-SA 2.0",
      url: "https://www.flickr.com/photos/36553196@N08/4584895568",
    },
    year: 2007,
    category: "photo",
    title: "미니홈피 사진첩",
    subtitle: "폴더명: ♡내새끼들♡",
    memoryStrength: 4,
    prompt: "사진첩 폴더 이름, 특수문자 꼭 들어갔죠?",
  },
  {
    id: "2007-photo-2",
    image: "/images/years/2007/photo/2007-photo-2.jpg",
    credit: {
      label: "Zach Dischner · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/35557234@N07/7352752372",
    },
    year: 2007,
    category: "photo",
    title: "팔 뻗어 단체샷",
    subtitle: "셀카봉이 없던 시절",
    memoryStrength: 3,
    prompt: "팔 제일 긴 애가 항상 찍었죠?",
  },
  {
    id: "2007-fashion-1",
    image: "/images/years/2007/fashion/2007-fashion-1.jpg",
    credit: {
      label: "Lesekreis · Wikimedia Commons · CC0",
      url: "https://commons.wikimedia.org/wiki/File%3AConverse_red.JPG",
    },
    year: 2007,
    category: "fashion",
    title: "하이탑 운동화",
    subtitle: "빅뱅 따라 신기",
    memoryStrength: 4,
    prompt: "교복에 하이탑, 그게 제일 멋있는 줄 알았던 시절",
  },
  {
    id: "2007-fashion-2",
    image: "/images/years/2007/fashion/2007-fashion-2.jpg",
    credit: {
      label: "ben pollard · Flickr · CC BY-SA 2.0",
      url: "https://www.flickr.com/photos/13023474@N06/2375909368",
    },
    year: 2007,
    category: "fashion",
    title: "커플 후드티",
    subtitle: "우정템이자 커플템",
    memoryStrength: 3,
    prompt: "친한 친구랑 맞춰 입어본 적 있어요?",
  },
  {
    id: "2007-food-1",
    image: "/images/years/2007/food/2007-food-1.jpg",
    credit: {
      label: "Missvain · Wikimedia Commons · CC BY 4.0",
      url: "https://commons.wikimedia.org/wiki/File%3APizzaLeah_-_2021-10-23_-_Sarah_Stierch_07.jpg",
    },
    year: 2007,
    category: "food",
    title: "피자스쿨",
    subtitle: "5천원의 기적",
    memoryStrength: 4,
    prompt: "시험 끝나고 친구들이랑 한 판씩 먹었죠?",
  },
  {
    id: "2007-food-2",
    image: "/images/years/2007/food/2007-food-2.jpg",
    credit: {
      label: "Hyeon-Jeong Suk · Wikimedia Commons · CC BY 2.0",
      url: "https://commons.wikimedia.org/wiki/File%3ATwigim-soboro.jpg",
    },
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
    image: "/images/years/2008/music/2008-music-1.jpg",
    credit: {
      label: "MIKI Yoshihito. (#mikiyoshih · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/7940758@N07/8234203575",
    },
    year: 2008,
    category: "music",
    title: "원더걸스 - Nobody",
    subtitle: "장기자랑 단골 1위",
    memoryStrength: 5,
    prompt: "수학여행 장기자랑에서 이거 춘 반 꼭 있었죠?",
  },
  {
    id: "2008-music-2",
    image: "/images/years/2008/music/2008-music-2.jpg",
    credit: {
      label: "la_minai · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/46348337@N02/5029488788",
    },
    year: 2008,
    category: "music",
    title: "빅뱅 - 하루하루",
    subtitle: "노래방 떼창곡",
    memoryStrength: 5,
    prompt: "랩 파트 담당 친구, 누구였어요?",
  },
  {
    id: "2008-music-3",
    image: "/images/years/2005/internet/mp3-player.jpg",
    credit: {
      label: "Graham Stanley · Wikimedia Commons · CC BY 2.0",
      url: "https://commons.wikimedia.org/wiki/File:IRiver_ifp-890.jpg",
    },
    year: 2008,
    category: "music",
    title: "쥬얼리 - One More Time",
    subtitle: "롤리팝 이전의 후크송",
    memoryStrength: 4,
    prompt: "\"딱 걸렸어 you~\" 따라 불렀죠?",
  },
  {
    id: "2008-drama-1",
    image: "/images/years/2008/drama/2008-drama-1.jpg",
    credit: {
      label: "unclibraries_commons · Flickr · CC PDM 1.0",
      url: "https://www.flickr.com/photos/122654055@N06/23085371702",
    },
    year: 2008,
    category: "drama",
    title: "베토벤 바이러스",
    subtitle: "\"똥.덩.어.리.\"",
    memoryStrength: 4,
    prompt: "강마에 말투 따라해본 적 있죠?",
  },
  {
    id: "2008-drama-2",
    image: "/images/years/2008/drama/2008-drama-2.jpg",
    credit: {
      label: "Tela Chhe · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/21042103@N03/4641589345",
    },
    year: 2008,
    category: "drama",
    title: "우리 결혼했어요",
    subtitle: "가상결혼의 시대",
    memoryStrength: 4,
    prompt: "최애 커플 누구였어요?",
  },
  {
    id: "2008-game-1",
    image: "/images/years/2005/game/night-gaming.jpg",
    credit: {
      label: "Hachimaki · Wikimedia Commons · CC BY-SA 2.0",
      url: "https://commons.wikimedia.org/wiki/File:Korean.culture-PC.bang-01.jpg",
    },
    year: 2008,
    category: "game",
    title: "서든어택",
    subtitle: "여전한 PC방 1위",
    memoryStrength: 4,
    prompt: "클랜 이름, 아직 기억나요?",
  },
  {
    id: "2008-game-2",
    image: "/images/years/2008/game/2008-game-2.jpg",
    credit: {
      label: "Syced · Wikimedia Commons · CC0",
      url: "https://commons.wikimedia.org/wiki/File%3ALAN_party_in_France_in_2003.jpg",
    },
    year: 2008,
    category: "game",
    title: "아이온",
    subtitle: "날개 달고 날던 그 순간",
    memoryStrength: 4,
    prompt: "오픈 첫날 서버 대기열 뚫어본 사람?",
  },
  {
    id: "2008-internet-1",
    image: "/images/years/2008/internet/2008-internet-1.jpg",
    credit: {
      label: "DJ Philly GEE · Flickr · CC BY-SA 2.0",
      url: "https://www.flickr.com/photos/11403548@N00/3499787511",
    },
    year: 2008,
    category: "internet",
    title: "빠삐놈 리믹스",
    subtitle: "빠빠라빠라빠라 빠삐코",
    memoryStrength: 5,
    prompt: "이 노래 벨소리로 해놨던 사람 분명 있다",
  },
  {
    id: "2008-internet-2",
    image: "/images/years/2008/internet/2008-internet-2.jpg",
    credit: {
      label: "BinaryApe · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/93001633@N00/3392827295",
    },
    year: 2008,
    category: "internet",
    title: "네이트 판",
    subtitle: "야자시간의 유일한 낙",
    memoryStrength: 4,
    prompt: "판 레전드 글 친구한테 링크 보내던 사람?",
  },
  {
    id: "2008-device-1",
    image: "/images/years/2008/device/2008-device-1.jpg",
    credit: {
      label: "Ha98574 · Wikimedia Commons · CC BY-SA 3.0",
      url: "https://commons.wikimedia.org/wiki/File:Anycall_Yuna%27s_Haptic.jpg",
    },
    year: 2008,
    category: "device",
    title: "햅틱폰",
    subtitle: "풀터치의 충격",
    memoryStrength: 4,
    prompt: "\"만지지 마세요\" 광고 기억나요?",
  },
  {
    id: "2008-device-2",
    image: "/images/years/2008/device/2008-device-2.jpg",
    credit: {
      label: "jaqian from Dublin, Ireland · Wikimedia Commons · CC BY 2.0",
      url: "https://commons.wikimedia.org/wiki/File%3AA2_%26_Zen_%28307730569%29.jpg",
    },
    year: 2008,
    category: "device",
    title: "PMP + 인강",
    subtitle: "공부하는 척 영화 보기",
    memoryStrength: 4,
    prompt: "PMP에 인강 말고 뭐 넣어놨었어요?",
  },
  {
    id: "2008-photo-1",
    image: "/images/years/2005/photo/uljjang-angle.jpg",
    credit: {
      label: "jpmatth · Flickr · CC BY-NC-ND 2.0",
      url: "https://www.flickr.com/photos/21893885@N00/5395865",
    },
    year: 2008,
    category: "photo",
    title: "폰카 거울샷",
    subtitle: "화장실 거울 앞 필수 코스",
    memoryStrength: 4,
    prompt: "플래시 터뜨리고 찍어서 얼굴 다 날아갔죠?",
  },
  {
    id: "2008-photo-2",
    image: "/images/years/2008/photo/2008-photo-2.jpg",
    credit: {
      label: "kevin dooley · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/12836528@N00/4871809930",
    },
    year: 2008,
    category: "photo",
    title: "싸이월드 감성 사진",
    subtitle: "사진 위에 하얀 글씨체",
    memoryStrength: 4,
    prompt: "사진에 오글거리는 문구 박아서 올린 적… 있죠?",
  },
  {
    id: "2008-fashion-1",
    image: "/images/years/2008/fashion/2008-fashion-1.jpg",
    credit: {
      label: "petitepanoply · Flickr · CC BY-SA 2.0",
      url: "https://www.flickr.com/photos/63405864@N04/15259659244",
    },
    year: 2008,
    category: "fashion",
    title: "체크셔츠",
    subtitle: "전국민 교복 아닌 교복",
    memoryStrength: 3,
    prompt: "옷장에 체크셔츠 몇 벌이었어요?",
  },
  {
    id: "2008-fashion-2",
    image: "/images/years/2008/fashion/2008-fashion-2.jpg",
    credit: {
      label: "Piercetheorganist at English · Wikimedia Commons · Public domain",
      url: "https://commons.wikimedia.org/wiki/File%3AHorn-rimmed_Rayban_glasses.JPG",
    },
    year: 2008,
    category: "fashion",
    title: "뿔테안경",
    subtitle: "도수 없는 패션 안경",
    memoryStrength: 3,
    prompt: "시력 좋은데 뿔테 꼈던 사람?",
  },
  {
    id: "2008-food-1",
    image: "/images/years/2008/food/2008-food-1.jpg",
    credit: {
      label: "Ruth Hartnup from Vancouver, · Wikimedia Commons · CC BY 2.0",
      url: "https://commons.wikimedia.org/wiki/File%3ACucumber%2C_elderflower_and_mint_ice_pop_from_Nicepops_%2818159920902%29.jpg",
    },
    year: 2008,
    category: "food",
    title: "빠삐코",
    subtitle: "빠삐놈 덕에 품절 대란",
    memoryStrength: 4,
    prompt: "끝까지 쭉 짜서 먹는 그 마지막 한 입",
  },
  {
    id: "2008-food-2",
    image: "/images/years/2008/food/2008-food-2.jpg",
    credit: {
      label: "changupn · Wikimedia Commons · CC0",
      url: "https://commons.wikimedia.org/wiki/File%3AGimbap_%28pixabay%29.jpg",
    },
    year: 2008,
    category: "food",
    title: "김밥천국",
    subtitle: "천원의 성지",
    memoryStrength: 4,
    prompt: "학원 가기 전 참치김밥 한 줄, 국룰이었죠?",
  },
  {
    id: "2009-music-1",
    image: "/images/years/2009/music/2009-music-1.jpg",
    credit: {
      label: "shaire productions · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/9822107@N08/4069525639",
    },
    year: 2009,
    category: "music",
    title: "소녀시대 - Gee",
    subtitle: "전국민 지지지지",
    memoryStrength: 5,
    prompt: "Gee Gee Gee Gee 다음 가사, 안 보고 나오죠?",
  },
  {
    id: "2009-music-2",
    image: "/images/years/2009/music/2009-music-2.jpg",
    credit: {
      label: "elyaqim · Flickr · CC BY-SA 2.0",
      url: "https://www.flickr.com/photos/19364205@N00/16039471776",
    },
    year: 2009,
    category: "music",
    title: "슈퍼주니어 - 쏘리 쏘리",
    subtitle: "교실 뒤에서 추던 그 춤",
    memoryStrength: 5,
    prompt: "쏘리쏘리 손동작, 지금도 할 수 있어요?",
  },
  {
    id: "2009-music-3",
    image: "/images/years/2009/music/2009-music-3.jpg",
    credit: {
      label: "kevin dooley · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/12836528@N00/16137275302",
    },
    year: 2009,
    category: "music",
    title: "2NE1 - I Don't Care",
    subtitle: "걸크러시의 시작",
    memoryStrength: 4,
    prompt: "이 노래로 컬러링 해놨던 사람?",
  },
  {
    id: "2009-drama-1",
    image: "/images/years/2009/drama/2009-drama-1.jpg",
    credit: {
      label: "kimberlykv · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/87542849@N00/559281413",
    },
    year: 2009,
    category: "drama",
    title: "꽃보다 남자",
    subtitle: "구준표 앓이",
    memoryStrength: 5,
    prompt: "F4 중에 누구 파였어요?",
  },
  {
    id: "2009-drama-2",
    image: "/images/years/2009/drama/2009-drama-2.jpg",
    credit: {
      label: "Abasaa · Wikimedia Commons · Public domain",
      url: "https://commons.wikimedia.org/wiki/File%3ARoyal_Tomb_of_King_Seok_Talhae.JPG",
    },
    year: 2009,
    category: "drama",
    title: "선덕여왕",
    subtitle: "미실의 카리스마",
    memoryStrength: 4,
    prompt: "'덕만아~' 하던 그 목소리 기억나요?",
  },
  {
    id: "2009-game-1",
    image: "/images/years/2009/game/2009-game-1.jpg",
    credit: {
      label: "osman.gucel · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/126089327@N04/14714880858",
    },
    year: 2009,
    category: "game",
    title: "던전앤파이터 전성기",
    subtitle: "서버 터지던 시절",
    memoryStrength: 4,
    prompt: "키리의 약속과 믿음, 아직 기억나요?",
  },
  {
    id: "2009-game-2",
    image: "/images/years/2009/game/2009-game-2.jpg",
    credit: {
      label: "kevinpoh · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/7679455@N03/13693123383",
    },
    year: 2009,
    category: "game",
    title: "버블파이터",
    subtitle: "카트 다음은 물풍선",
    memoryStrength: 3,
    prompt: "친구랑 팀 먹고 하던 사람?",
  },
  {
    id: "2009-internet-1",
    image: "/images/years/2009/internet/2009-internet-1.jpg",
    credit: {
      label: "Yahoo Inc · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/99527366@N00/5553903564",
    },
    year: 2009,
    category: "internet",
    title: "실시간 검색어",
    subtitle: "1위 보고 등교하기",
    memoryStrength: 4,
    prompt: "아침마다 실검 확인하던 사람?",
  },
  {
    id: "2009-internet-2",
    image: "/images/years/2009/internet/2009-internet-2.jpg",
    credit: {
      label: "Ted Mielczarek · Flickr · CC CC0 1.0",
      url: "https://www.flickr.com/photos/49243838@N00/27821109783",
    },
    year: 2009,
    category: "internet",
    title: "아프리카TV",
    subtitle: "인터넷 방송의 시작",
    memoryStrength: 4,
    prompt: "별풍선이 뭔지 이때 처음 알았죠?",
  },
  {
    id: "2009-device-1",
    image: "/images/years/2009/device/2009-device-1.jpg",
    credit: {
      label: "JoBot164 · Wikimedia Commons · CC0",
      url: "https://commons.wikimedia.org/wiki/File%3AIPhone_3G_or_3GS_digital_render.png",
    },
    year: 2009,
    category: "device",
    title: "아이폰 3GS 상륙",
    subtitle: "스마트폰 시대의 시작",
    memoryStrength: 5,
    prompt: "주변에 제일 먼저 아이폰 산 사람, 누구였어요?",
  },
  {
    id: "2009-photo-1",
    image: "/images/years/2009/photo/2009-photo-1.jpg",
    credit: {
      label: "Dwayne Madden from Berri, Au · Wikimedia Commons · CC BY 2.0",
      url: "https://commons.wikimedia.org/wiki/File%3ALoxton_Pizza_Bar_%284097988659%29.jpg",
    },
    year: 2009,
    category: "photo",
    title: "폰카 화질의 진화",
    subtitle: "500만 화소의 감동",
    memoryStrength: 3,
    prompt: "폴더폰 카메라로 찍던 마지막 시절이었죠",
  },
  {
    id: "2009-photo-2",
    image: "/images/years/2009/photo/2009-photo-2.jpg",
    credit: {
      label: "Smabs Sputzer (1956-2017) · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/10413717@N08/5196415676",
    },
    year: 2009,
    category: "photo",
    title: "싸이월드 마지막 전성기",
    subtitle: "사진첩에 쌓이던 추억",
    memoryStrength: 4,
    prompt: "이때 올린 사진들, 백업 했어요?",
  },
  {
    id: "2009-fashion-1",
    image: "/images/years/2009/fashion/2009-fashion-1.jpg",
    credit: {
      label: "julianomarp · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/61024468@N00/13189890843",
    },
    year: 2009,
    category: "fashion",
    title: "컬러 스키니",
    subtitle: "빨강 파랑 보라까지",
    memoryStrength: 4,
    prompt: "형광색 스키니 입어본 적... 있죠?",
  },
  {
    id: "2009-fashion-2",
    image: "/images/years/2009/fashion/2009-fashion-2.jpg",
    credit: {
      label: "catherinetodd2 · Flickr · CC BY-NC 2.0",
      url: "https://www.flickr.com/photos/94737677@N00/2650305354",
    },
    year: 2009,
    category: "fashion",
    title: "체크남방 전성기 지속",
    subtitle: "교복 위에 묶어 입기",
    memoryStrength: 3,
    prompt: "허리에 체크남방 묶고 다녔던 사람?",
  },
  {
    id: "2009-food-1",
    image: "/images/years/2009/food/2009-food-1.jpg",
    credit: {
      label: "MatthieuRicard · Wikimedia Commons · CC0",
      url: "https://commons.wikimedia.org/wiki/File%3A2020-03-11_12.23.44_%EB%B6%84%EC%8B%9D%EC%A7%91.jpg",
    },
    year: 2009,
    category: "food",
    title: "국물떡볶이",
    subtitle: "프랜차이즈 떡볶이 시대",
    memoryStrength: 4,
    prompt: "죠스? 아딸? 어느 파였어요?",
  },
  {
    id: "2009-food-2",
    image: "/images/years/2009/food/2009-food-2.jpg",
    credit: {
      label: "Hippietrail · Wikimedia Commons · CC0",
      url: "https://commons.wikimedia.org/wiki/File%3ABubble_tea_six_languages.jpg",
    },
    year: 2009,
    category: "food",
    title: "버블티 1차 유행",
    subtitle: "타피오카 펄의 충격",
    memoryStrength: 3,
    prompt: "펄 씹는 식감, 처음엔 낯설었죠?",
  },
  {
    id: "2010-music-1",
    image: "/images/years/2010/music/2010-music-1.jpg",
    credit: {
      label: "DCHNwam · Flickr · CC PDM 1.0",
      url: "https://www.flickr.com/photos/57179180@N07/53969507902",
    },
    year: 2010,
    category: "music",
    title: "소녀시대 - Oh!",
    subtitle: "오빠를 사랑해",
    memoryStrength: 5,
    prompt: "치어리더 안무 따라해본 적 있어요?",
  },
  {
    id: "2010-music-2",
    image: "/images/years/2010/music/2010-music-2.jpg",
    credit: {
      label: "Fan.D & Dav.C Photgraphy · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/98815931@N07/51363085643",
    },
    year: 2010,
    category: "music",
    title: "2AM - 죽어도 못 보내",
    subtitle: "이별 발라드의 정점",
    memoryStrength: 4,
    prompt: "노래방에서 이거 부르다 운 사람 봤어요?",
  },
  {
    id: "2010-music-3",
    image: "/images/years/2010/music/2010-music-3.jpg",
    credit: {
      label: "simonsmith001 · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/25828730@N00/2545054689",
    },
    year: 2010,
    category: "music",
    title: "미쓰에이 - Bad Girl Good Girl",
    subtitle: "수지의 등장",
    memoryStrength: 4,
    prompt: "이 안무 커버하던 친구, 있었죠?",
  },
  {
    id: "2010-drama-1",
    image: "/images/years/2010/drama/2010-drama-1.jpg",
    credit: {
      label: "*rboed* · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/92082510@N04/15544617113",
    },
    year: 2010,
    category: "drama",
    title: "시크릿 가든",
    subtitle: "현빈 트레이닝복",
    memoryStrength: 5,
    prompt: "'이게 최선입니까? 확실해요?' 따라했죠?",
  },
  {
    id: "2010-drama-2",
    image: "/images/years/2010/drama/2010-drama-2.jpg",
    credit: {
      label: "Man vyi · Wikimedia Commons · Public domain",
      url: "https://commons.wikimedia.org/wiki/File%3ACabbage_loaves_pelle_Fa%C3%AEs%27sie_d%27Cidre_2007.jpg",
    },
    year: 2010,
    category: "drama",
    title: "제빵왕 김탁구",
    subtitle: "시청률 50%의 전설",
    memoryStrength: 5,
    prompt: "온 가족이 같이 보던 마지막 드라마 아니었을까요?",
  },
  {
    id: "2010-game-1",
    image: "/images/years/2005/game/night-gaming.jpg",
    credit: {
      label: "Hachimaki · Wikimedia Commons · CC BY-SA 2.0",
      url: "https://commons.wikimedia.org/wiki/File:Korean.culture-PC.bang-01.jpg",
    },
    year: 2010,
    category: "game",
    title: "스타크래프트 2",
    subtitle: "저그 테란 프로토스의 귀환",
    memoryStrength: 4,
    prompt: "아버지 세대와 같이 한 유일한 게임이었죠",
  },
  {
    id: "2010-game-2",
    image: "/images/years/2005/game/night-gaming.jpg",
    credit: {
      label: "Hachimaki · Wikimedia Commons · CC BY-SA 2.0",
      url: "https://commons.wikimedia.org/wiki/File:Korean.culture-PC.bang-01.jpg",
    },
    year: 2010,
    category: "game",
    title: "서든어택 전성기 지속",
    subtitle: "PC방 점유율 1위",
    memoryStrength: 3,
    prompt: "은골 계급, 어디까지 갔어요?",
  },
  {
    id: "2010-internet-1",
    image: "/images/years/2010/internet/2010-internet-1.jpg",
    credit: {
      label: "Ed Yourdon · Flickr · CC BY-NC-SA 2.0",
      url: "https://www.flickr.com/photos/72098626@N00/17569715766",
    },
    year: 2010,
    category: "internet",
    title: "카카오톡 출시",
    subtitle: "문자 요금의 종말",
    memoryStrength: 5,
    prompt: "'카톡 해' 이 말이 이때 시작됐어요",
  },
  {
    id: "2010-internet-2",
    image: "/images/years/2010/internet/2010-internet-2.jpg",
    credit: {
      label: "homegets.com · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/141436406@N04/29342747487",
    },
    year: 2010,
    category: "internet",
    title: "페이스북 확산",
    subtitle: "싸이월드에서 페북으로",
    memoryStrength: 3,
    prompt: "페북 첫 프사, 뭐였는지 기억나요?",
  },
  {
    id: "2010-device-1",
    image: "/images/years/2010/device/2010-device-1.jpg",
    credit: {
      label: "Striker9498 · Wikimedia Commons · CC0",
      url: "https://commons.wikimedia.org/wiki/File%3A20240419_%EC%82%BC%EC%84%B1_%EA%B0%A4%EB%9F%AD%EC%8B%9C_S24_%EC%9A%B8%ED%8A%B8%EB%9D%BC.jpg",
    },
    year: 2010,
    category: "device",
    title: "갤럭시S",
    subtitle: "안드로이드의 반격",
    memoryStrength: 4,
    prompt: "아이폰파? 갤럭시파? 어느 쪽이었어요?",
  },
  {
    id: "2010-photo-1",
    image: "/images/years/2010/photo/2010-photo-1.jpg",
    credit: {
      label: "Karl.Chester · Flickr · CC BY-NC-SA 2.0",
      url: "https://www.flickr.com/photos/43702833@N03/26845272652",
    },
    year: 2010,
    category: "photo",
    title: "푸딩 카메라",
    subtitle: "필터 셀카의 시작",
    memoryStrength: 4,
    prompt: "필터 몇 개씩 겹쳐서 찍던 사람?",
  },
  {
    id: "2010-photo-2",
    image: "/images/years/2010/photo/2010-photo-2.jpg",
    credit: {
      label: "digital<>analog · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/30135793@N05/5388269877",
    },
    year: 2010,
    category: "photo",
    title: "싸이월드→페북 이사",
    subtitle: "사진첩 대이동",
    memoryStrength: 3,
    prompt: "미니홈피 폴더 통째로 옮기다 포기했죠?",
  },
  {
    id: "2010-fashion-1",
    image: "/images/years/2010/fashion/2010-fashion-1.jpg",
    credit: {
      label: "avlxyz · Flickr · CC BY-NC 2.0",
      url: "https://www.flickr.com/photos/10559879@N00/48413657847",
    },
    year: 2010,
    category: "fashion",
    title: "노스페이스 패딩 시작",
    subtitle: "등골브레이커의 서막",
    memoryStrength: 4,
    prompt: "반에 몇 명이나 입고 있었어요?",
  },
  {
    id: "2010-fashion-2",
    image: "/images/years/2010/fashion/2010-fashion-2.jpg",
    credit: {
      label: "Menswear Market · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/85546319@N04/9164966607",
    },
    year: 2010,
    category: "fashion",
    title: "스키니진 국민바지",
    subtitle: "이제 일자바지가 이상한 시대",
    memoryStrength: 3,
    prompt: "스키니 아니면 안 입던 시절이었죠",
  },
  {
    id: "2010-food-1",
    image: "/images/years/2010/food/2010-food-1.jpg",
    credit: {
      label: "Manjil Aryal · Flickr · CC CC0 1.0",
      url: "https://wordpress.org/photos/photo/2636a11d70/",
    },
    year: 2010,
    category: "food",
    title: "카페베네 전성기",
    subtitle: "와플과 빙수의 성지",
    memoryStrength: 4,
    prompt: "시험 끝나고 카페베네 갔던 사람?",
  },
  {
    id: "2010-food-2",
    image: "/images/years/2010/food/2010-food-2.jpg",
    credit: {
      label: "MaltaGirl · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/21749115@N00/4892259470",
    },
    year: 2010,
    category: "food",
    title: "길거리 와플",
    subtitle: "생크림 가득 반접기",
    memoryStrength: 4,
    prompt: "교문 앞 와플 트럭, 기억나요?",
  },
  {
    id: "2011-music-1",
    image: "/images/years/2011/music/2011-music-1.jpg",
    credit: {
      label: "Chris Breikss · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/70116881@N00/6733458411",
    },
    year: 2011,
    category: "music",
    title: "아이유 - 좋은 날",
    subtitle: "3단 고음의 충격",
    memoryStrength: 5,
    prompt: "3단 고음 도전해본 적 있죠? 성공은요?",
  },
  {
    id: "2011-music-2",
    image: "/images/years/2011/music/2011-music-2.jpg",
    credit: {
      label: "marfis75 · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/45409431@N00/4949472820",
    },
    year: 2011,
    category: "music",
    title: "티아라 - Roly Poly",
    subtitle: "복고 디스코 열풍",
    memoryStrength: 4,
    prompt: "롤리폴리 안무, 장기자랑 단골이었죠",
  },
  {
    id: "2011-music-3",
    image: "/images/years/2011/music/2011-music-3.jpg",
    credit: {
      label: "Photo Cindy · Flickr · CC CC0 1.0",
      url: "https://www.flickr.com/photos/13631562@N00/4946114680",
    },
    year: 2011,
    category: "music",
    title: "빅뱅 - Tonight",
    subtitle: "돌아온 빅뱅",
    memoryStrength: 4,
    prompt: "이때 미니앨범 사서 모으던 사람?",
  },
  {
    id: "2011-drama-1",
    image: "/images/years/2011/drama/2011-drama-1.jpg",
    credit: {
      label: "dave_mcmt · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/30512529@N00/187427874",
    },
    year: 2011,
    category: "drama",
    title: "드림하이",
    subtitle: "수지·아이유·김수현",
    memoryStrength: 4,
    prompt: "밀크티 커플? 삼동이 파?",
  },
  {
    id: "2011-drama-2",
    image: "/images/years/2011/drama/2011-drama-2.jpg",
    credit: {
      label: "Original: mauveine.kimEdited · Wikimedia Commons · CC0",
      url: "https://commons.wikimedia.org/wiki/File%3ACyberpunk_Seoul_View.jpg",
    },
    year: 2011,
    category: "drama",
    title: "시티헌터",
    subtitle: "이민호 액션",
    memoryStrength: 4,
    prompt: "본방 사수하고 다음날 학교에서 얘기했죠?",
  },
  {
    id: "2011-game-1",
    image: "/images/years/2005/game/night-gaming.jpg",
    credit: {
      label: "Hachimaki · Wikimedia Commons · CC BY-SA 2.0",
      url: "https://commons.wikimedia.org/wiki/File:Korean.culture-PC.bang-01.jpg",
    },
    year: 2011,
    category: "game",
    title: "리그 오브 레전드 상륙",
    subtitle: "PC방 판도 교체의 시작",
    memoryStrength: 5,
    prompt: "첫 챔피언 뭐였어요? 설마 가렌?",
  },
  {
    id: "2011-game-2",
    image: "/images/years/2005/game/night-gaming.jpg",
    credit: {
      label: "Hachimaki · Wikimedia Commons · CC BY-SA 2.0",
      url: "https://commons.wikimedia.org/wiki/File:Korean.culture-PC.bang-01.jpg",
    },
    year: 2011,
    category: "game",
    title: "테라",
    subtitle: "그래픽 충격의 MMO",
    memoryStrength: 3,
    prompt: "사양 안 돼서 PC방 가서 하던 사람?",
  },
  {
    id: "2011-internet-1",
    image: "/images/years/2011/internet/2011-internet-1.jpg",
    credit: {
      label: "♥ KawaiiCloud ♥ · Flickr · CC BY-NC 2.0",
      url: "https://www.flickr.com/photos/43056779@N00/288540402",
    },
    year: 2011,
    category: "internet",
    title: "카톡 이모티콘",
    subtitle: "말보다 이모티콘",
    memoryStrength: 4,
    prompt: "처음 산 이모티콘, 뭐였어요?",
  },
  {
    id: "2011-internet-2",
    image: "/images/years/2011/internet/2011-internet-2.jpg",
    credit: {
      label: "Johan Larsson · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/38305415@N00/4368595436",
    },
    year: 2011,
    category: "internet",
    title: "트위터·페북 전성기",
    subtitle: "타임라인의 시대",
    memoryStrength: 3,
    prompt: "이때 트윗들, 지금 봐도 괜찮아요?",
  },
  {
    id: "2011-device-1",
    image: "/images/years/2011/device/2011-device-1.jpg",
    credit: {
      label: "Beamish4 · Wikimedia Commons · CC BY 4.0",
      url: "https://commons.wikimedia.org/wiki/File%3ASamsung_Galaxy_S_II_-_Front.jpg",
    },
    year: 2011,
    category: "device",
    title: "갤럭시S2",
    subtitle: "국민 안드로이드폰",
    memoryStrength: 4,
    prompt: "슬라이드 잠금해제 소리, 기억나요?",
  },
  {
    id: "2011-photo-1",
    image: "/images/years/2011/photo/2011-photo-1.jpg",
    credit: {
      label: "mielel · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/133884572@N08/19535458080",
    },
    year: 2011,
    category: "photo",
    title: "필터 앱 전성기",
    subtitle: "싸이메라 이전의 시대",
    memoryStrength: 3,
    prompt: "세피아 필터 안 쓰면 허전했죠?",
  },
  {
    id: "2011-photo-2",
    image: "/images/years/2011/photo/2011-photo-2.jpg",
    credit: {
      label: "Thomas Leuthard · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/41346951@N05/11650572156",
    },
    year: 2011,
    category: "photo",
    title: "팔 뻗기 셀카의 최후",
    subtitle: "셀카봉 직전의 시대",
    memoryStrength: 3,
    prompt: "단체샷은 여전히 팔 긴 애 담당이었죠",
  },
  {
    id: "2011-fashion-1",
    image: "/images/years/2011/fashion/2011-fashion-1.jpg",
    credit: {
      label: "simonov · Flickr · CC BY-SA 2.0",
      url: "https://www.flickr.com/photos/26209464@N00/3629215534",
    },
    year: 2011,
    category: "fashion",
    title: "노스페이스 패딩 절정",
    subtitle: "교실은 검정 패딩 물결",
    memoryStrength: 5,
    prompt: "패딩 계급도, 진짜 있었어요?",
  },
  {
    id: "2011-fashion-2",
    image: "/images/years/2011/fashion/2011-fashion-2.jpg",
    credit: {
      label: "Nicole Beauchamp · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/48932385@N07/17131566946",
    },
    year: 2011,
    category: "fashion",
    title: "플랫슈즈+스키니",
    subtitle: "교복 아래 국민 조합",
    memoryStrength: 3,
    prompt: "단화 뒤축 구겨신다 혼난 적 있죠?",
  },
  {
    id: "2011-food-1",
    image: "/images/years/2011/food/2011-food-1.jpg",
    credit: {
      label: "Hamburger Helper · Flickr · CC BY-NC-ND 2.0",
      url: "https://www.flickr.com/photos/52042499@N00/5100102416",
    },
    year: 2011,
    category: "food",
    title: "로티보이 번",
    subtitle: "버터 향 가득한 그 빵",
    memoryStrength: 4,
    prompt: "줄 서서 사 먹어본 적 있어요?",
  },
  {
    id: "2011-food-2",
    image: "/images/years/2011/food/2011-food-2.jpg",
    credit: {
      label: "by magicinprogress at Flickr · Wikimedia Commons · CC BY 2.0",
      url: "https://commons.wikimedia.org/wiki/File%3AKorean_shaved_ice-Patbingsu-10B.jpg",
    },
    year: 2011,
    category: "food",
    title: "카페 팥빙수",
    subtitle: "빙수의 카페 시대",
    memoryStrength: 3,
    prompt: "숟가락 여러 개 꽂고 나눠 먹었죠?",
  },
  {
    id: "2012-music-1",
    image: "/images/years/2012/music/2012-music-1.jpg",
    credit: {
      label: "No machine-readable author p · Wikimedia Commons · Public domain",
      url: "https://commons.wikimedia.org/wiki/File%3AA_street_in_Gangnam_residential_area%2C_Seoul.jpg",
    },
    year: 2012,
    category: "music",
    title: "싸이 - 강남스타일",
    subtitle: "전 세계가 말춤",
    memoryStrength: 5,
    prompt: "말춤, 안 춰본 사람 없죠?",
  },
  {
    id: "2012-music-2",
    image: "/images/years/2012/music/2012-music-2.jpg",
    credit: {
      label: "HunkinElvis · Wikimedia Commons · Public domain",
      url: "https://commons.wikimedia.org/wiki/File%3AS_cherry_blossoms.jpg",
    },
    year: 2012,
    category: "music",
    title: "버스커버스커 - 벚꽃엔딩",
    subtitle: "벚꽃 연금의 시작",
    memoryStrength: 5,
    prompt: "봄만 되면 자동재생되는 그 노래",
  },
  {
    id: "2012-music-3",
    image: "/images/years/2012/music/2012-music-3.jpg",
    credit: {
      label: "Ruth and Dave · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/95142644@N00/2711930011",
    },
    year: 2012,
    category: "music",
    title: "빅뱅 - Fantastic Baby",
    subtitle: "WOW Fantastic Baby",
    memoryStrength: 4,
    prompt: "'붐샤카라카' 따라 외쳤죠?",
  },
  {
    id: "2012-drama-1",
    image: "/images/years/2012/drama/2012-drama-1.jpg",
    credit: {
      label: "Fraser Mummery · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/73014677@N05/9559789651",
    },
    year: 2012,
    category: "drama",
    title: "해를 품은 달",
    subtitle: "훤과 연우",
    memoryStrength: 5,
    prompt: "김수현 앓이, 이때부터였죠?",
  },
  {
    id: "2012-drama-2",
    image: "/images/years/2012/drama/2012-drama-2.jpg",
    credit: {
      label: "Chris Breikss · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/70116881@N00/6733458411",
    },
    year: 2012,
    category: "drama",
    title: "응답하라 1997",
    subtitle: "추억 드라마의 시작",
    memoryStrength: 5,
    prompt: "이 드라마 보면서 내 학창시절 생각났죠?",
  },
  {
    id: "2012-game-1",
    image: "/images/years/2012/game/2012-game-1.jpg",
    credit: {
      label: "Monica's Dad · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/22077905@N00/2813812521",
    },
    year: 2012,
    category: "game",
    title: "LoL PC방 점령",
    subtitle: "롤이 국민게임이 된 해",
    memoryStrength: 5,
    prompt: "티어 어디까지 올라갔어요?",
  },
  {
    id: "2012-game-2",
    image: "/images/years/2012/game/2012-game-2.jpg",
    credit: {
      label: "Linh H. Nguyen · Flickr · CC BY-NC-ND 2.0",
      url: "https://www.flickr.com/photos/22439010@N04/7881151510",
    },
    year: 2012,
    category: "game",
    title: "애니팡",
    subtitle: "카톡 하트의 시대",
    memoryStrength: 5,
    prompt: "하트 달라고 새벽에 카톡 보낸 적 있죠?",
  },
  {
    id: "2012-internet-1",
    image: "/images/years/2012/internet/2012-internet-1.jpg",
    credit: {
      label: "Artem Beliaikin · Flickr · CC CC0 1.0",
      url: "https://www.flickr.com/photos/157635012@N07/31299887987",
    },
    year: 2012,
    category: "internet",
    title: "카카오톡 게임하기",
    subtitle: "전 국민이 게임 친구",
    memoryStrength: 4,
    prompt: "애니팡 점수로 반 등수 매겼던 시절",
  },
  {
    id: "2012-internet-2",
    image: "/images/years/2012/internet/2012-internet-2.jpg",
    credit: {
      label: "EX22218 - ON/OFF · Flickr · CC BY-NC-ND 2.0",
      url: "https://www.flickr.com/photos/91593630@N08/27898421096",
    },
    year: 2012,
    category: "internet",
    title: "페이스북 전성기",
    subtitle: "좋아요와 담벼락",
    memoryStrength: 3,
    prompt: "담벼락에 생일축하 도배되던 그 기분",
  },
  {
    id: "2012-device-1",
    image: "/images/years/2012/device/2012-device-1.jpg",
    credit: {
      label: "GadgetsGuy · Wikimedia Commons · CC BY 3.0",
      url: "https://commons.wikimedia.org/wiki/File%3ASamsung_Galaxy_S_III.png",
    },
    year: 2012,
    category: "device",
    title: "갤럭시S3",
    subtitle: "펫블루의 시대",
    memoryStrength: 4,
    prompt: "'옥타코어'가 자랑이던 시절이었죠",
  },
  {
    id: "2012-photo-1",
    image: "/images/years/2012/photo/2012-photo-1.jpg",
    credit: {
      label: "jurvetson · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/44124348109@N01/25739119490",
    },
    year: 2012,
    category: "photo",
    title: "싸이메라",
    subtitle: "보정 셀카의 국민앱",
    memoryStrength: 4,
    prompt: "잡티 제거 슬라이더, 최대로 올렸죠?",
  },
  {
    id: "2012-photo-2",
    image: "/images/years/2012/photo/2012-photo-2.jpg",
    credit: {
      label: "virgirm · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/29445906@N00/3787704589",
    },
    year: 2012,
    category: "photo",
    title: "인스타그램 초기",
    subtitle: "정사각형 사진의 시작",
    memoryStrength: 3,
    prompt: "첫 인스타 게시물, 아직 있어요?",
  },
  {
    id: "2012-fashion-1",
    image: "/images/years/2012/fashion/2012-fashion-1.jpg",
    credit: {
      label: "Menswear Market · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/85546319@N04/8442851109",
    },
    year: 2012,
    category: "fashion",
    title: "스냅백",
    subtitle: "모자 챙은 일자로",
    memoryStrength: 4,
    prompt: "챙에 스티커 안 떼고 쓰던 사람?",
  },
  {
    id: "2012-fashion-2",
    image: "/images/years/2012/fashion/2012-fashion-2.jpg",
    credit: {
      label: "apairandaspare · Flickr · CC BY 2.0",
      url: "https://www.flickr.com/photos/66755335@N05/15289354718",
    },
    year: 2012,
    category: "fashion",
    title: "야상 점퍼",
    subtitle: "카키색 국민 아우터",
    memoryStrength: 4,
    prompt: "야상에 후드 겹쳐입기, 국룰이었죠",
  },
  {
    id: "2012-food-1",
    image: "/images/years/2012/food/2012-food-1.jpg",
    credit: {
      label: "Mobius6 · Wikimedia Commons · CC BY-SA 4.0",
      url: "https://commons.wikimedia.org/wiki/File%3ABuldak_Ramen_20210114_001.jpg",
    },
    year: 2012,
    category: "food",
    title: "불닭볶음면 출시",
    subtitle: "매운맛 도전의 시작",
    memoryStrength: 4,
    prompt: "처음 먹고 우유 몇 컵 마셨어요?",
  },
  {
    id: "2012-food-2",
    image: "/images/years/2012/food/2012-food-2.jpg",
    credit: {
      label: "Sonja1982 · Wikimedia Commons · CC0",
      url: "https://commons.wikimedia.org/wiki/File%3ASchneeball-Gebaeck-Rothenburg-odT.jpg",
    },
    year: 2012,
    category: "food",
    title: "슈니발렌",
    subtitle: "망치로 부수는 과자",
    memoryStrength: 4,
    prompt: "망치질하다 튄 조각, 주워 먹었죠?",
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
