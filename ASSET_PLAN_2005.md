# ASSET_PLAN_2005 — 2005년 추억 피드 이미지 에셋 기획

> 대상: `data/memories.ts`의 2005년 MemoryItem 16개 전체
> 목적: 카드별로 어떤 이미지를 어떤 방식(generated / recreated / actual / do_not_use)으로 준비할지 확정
> 이 문서는 기획 산출물이며, 실제 이미지 제작·삽입은 검토 후 다음 단계에서 진행한다.
> 공통 제작 규칙은 [`ASSET_GUIDELINES.md`](./ASSET_GUIDELINES.md) 참조.

## 분류 기준 요약

| 타입 | 의미 |
|---|---|
| `licensed-actual` | 실제 2000년대 촬영물/당시 물건·공간 자료 중 상업적 재사용 조건이 확인된 이미지 (CC0/CC BY 우선, 출처·저작자·라이선스 기록 필수) |
| `recreated` | 실제 자료를 레퍼런스로 조사하되 레이아웃·색·아이콘·문구·구도를 새로 만든 재현 이미지 |
| `generated-original` | 특정 원본을 복제하지 않고 2005년 한국 생활 장면을 새로 생성한 오리지널 이미지 |
| `reference-only` | 재사용 조건이 불분명하거나 정책상 사용 불가 — 서비스에 넣지 않고 recreated 제작 참고용으로만 기록 |

> 실제 자료와 재구성 이미지를 섞어 전부 AI처럼 보이거나 전부 자료사진처럼 보이지 않게 구성한다.
> 출처 관리: [`ASSET_SOURCES.md`](./ASSET_SOURCES.md)

공통 사항 (전 카드 적용):

- **비율 4:3.** 생성 원본은 **최소 1600×1200 이상 고화질로 별도 보관**(향후 OG·공유 이미지 재사용), 웹 적용본은 800×600 JPG(품질 ~80, 200KB 전후)로 변환해 배치
- **날짜 스탬프는 UI가 자동 오버레이**하므로 이미지 안에 날짜 텍스트를 넣지 말 것 (우하단 여백 확보)
- 텍스트(제목/자막/로고)는 이미지 안에 넣지 않는다 — 제목은 카드가 이미 표시함
- 인물: 실제 인물 사진 무단 사용·실존 인물 닮은 AI 얼굴 금지. **완전 오리지널 AI 생성 인물은 얼굴 노출 가능** — 감정 표현이 중요한 카드(얼짱 셀카·노래방·떡볶이)에 적극 활용하고, 피드 전체에서 얼굴 컷/뒷모습/손 클로즈업/공간 와이드를 섞어 구도 다양성 유지 (상세: `ASSET_GUIDELINES.md`)
- **MVP 단계에서는 16개 카드 전부 생성/재현 이미지로 제작 가능한 구조**로 간다 (actual은 이후 업그레이드 경로)

---

## 카드별 계획

### 1. 2005-music-1 / 윤도현 - 사랑했나봐

- category: music · memoryStrength: 5
- recommended_asset_type: **recreated** ✅ 적용 완료 → `/images/years/2005/music/cyworld-bgm.jpg` (자체 제작 렌더, 원본 `assets-src/2005/cyworld-bgm.png`)
- why: 앨범 커버·가수 사진은 do_not_use. 이 카드의 기억 포인트는 곡 자체보다 "싸이월드 BGM으로 걸어두던 행위"이므로 그 감성을 재현하는 것이 자극이 더 크고 리스크가 없음.
- visual_direction: 늦은 밤 방 안, CRT 모니터에 미니홈피 느낌의 화면(오리지널 디자인)이 떠 있고 작은 스피커·다이어리·이어폰이 놓인 책상. 따뜻한 스탠드 조명.
- what_should_be_visible: CRT 모니터, 음악 플레이어 느낌의 작은 UI 윈도우(실제 싸이월드 UI 복제 금지), 2000년대 책상 소품
- crop_recommendation: 모니터 화면이 좌상단~중앙에 오도록, 우하단은 여백(스탬프 영역)
- aspect_ratio_recommendation: 4:3
- copyright_note: 앨범 커버·가수 초상·실제 싸이월드 UI 픽셀 단위 복제 모두 금지. "감성 재현"만.
- fallback_plan: CD플레이어+이어폰+가사 적은 다이어리 조합의 정물 연출

### 2. 2005-music-2 / SG워너비 - 죄와 벌

- category: music · memoryStrength: 4
- recommended_asset_type: **recreated**
- why: 기억 포인트가 "노래방 애창곡". 동네 노래방이라는 공간 기억으로 치환하면 저작권 리스크 없이 공감 유발.
- visual_direction: 2005년 동네 노래방 방 안 — 두꺼운 곡번호 책, 리모컨, 탬버린, 미러볼 조명, 소파의 반짝이 시트
- what_should_be_visible: 노래방 곡번호 책 + 리모컨 클로즈업 (화면 속 가사·곡명 텍스트는 비식별 처리)
- crop_recommendation: 곡번호 책이 중앙, 배경은 어둡고 미러볼 빛망울
- aspect_ratio_recommendation: 4:3
- copyright_note: 노래방 기기 브랜드(금영/태진) 로고 및 실제 곡 리스트 텍스트 노출 금지
- fallback_plan: 마이크+탬버린 정물

### 3. 2005-music-3 / 버즈 - 겁쟁이

- category: music · memoryStrength: 5
- recommended_asset_type: **recreated**
- why: 기억 포인트는 "최고음 도전". 열창하는 장면의 에너지로 재현. 밴드 사진·뮤비 장면은 do_not_use.
- visual_direction: 노래방에서 마이크를 잡고 고개 젖혀 열창하는 오리지널 생성 인물, 미러볼 역광 — 감정 표현 카드이므로 표정 활용 가능
- what_should_be_visible: 마이크 쥔 손, 열창하는 표정 또는 실루엣, 노래방 조명
- crop_recommendation: 인물 실루엣을 좌측 2/3에, 우하단 여백
- aspect_ratio_recommendation: 4:3
- copyright_note: 버즈 멤버 초상·앨범 아트 금지. music-2와 같은 노래방 배경이지만 "책/리모컨(정물)" vs "열창(인물 실루엣)"으로 구분
- fallback_plan: 천장을 향한 마이크 클로즈업 + 조명 플레어

### 4. 2005-drama-1 / 내 이름은 김삼순

- category: drama · memoryStrength: 5
- recommended_asset_type: **recreated** (드라마 스틸컷·배우 사진은 **do_not_use**)
- why: 스틸컷·배우 초상은 방송사/기획사 권리가 강해 상업 사용 불가. 기억 포인트는 "본방 사수하던 밤"이므로 시청 장면 재현이 안전하고 감성도 맞음.
- visual_direction: 2005년 거실 — 브라운관 TV에서 로맨틱 코미디 느낌의 따뜻한 불빛(화면 내용은 흐릿한 실루엣 정도), 바닥에 앉아 보는 뒷모습, 귤 바구니·리모컨
- what_should_be_visible: 브라운관 TV(두꺼운 몸체), 시청자 뒷모습, 2000년대 거실 소품
- crop_recommendation: TV가 중앙 상단, 시청자 뒷모습이 하단
- aspect_ratio_recommendation: 4:3
- copyright_note: 실제 방송 화면·배우 얼굴·MBC 로고가 TV 화면 안에 보이면 안 됨. 화면은 추상적 빛으로 처리
- fallback_plan: TV 리모컨+귤+담요 정물 (본방 사수의 밤 감성)

### 5. 2005-drama-2 / 무한도전 (무모한 도전)

- category: drama · memoryStrength: 4
- recommended_asset_type: **recreated** (방송 캡처는 **do_not_use**)
- why: 방송 장면·출연진 초상 사용 불가. "지하철과 달리기" 같은 무모한 도전의 코믹한 에너지를 익명 재현.
- visual_direction: 토요일 오후 거실, 브라운관 TV 앞에서 웃음이 터진 가족/학생의 뒷모습, TV 화면은 밝은 예능 느낌의 빛만
- what_should_be_visible: 웃는 분위기(몸짓), 브라운관 TV, 과자 봉지
- crop_recommendation: 드라마-1과 구분되게 낮 시간대 밝은 톤
- aspect_ratio_recommendation: 4:3
- copyright_note: 출연진 초상·프로그램 로고·자막체 모방 금지
- fallback_plan: 지하철 승강장에서 달리기 출발 자세를 잡은 익명 인물 실루엣 (원거리)

### 6. 2005-game-1 / 카트라이더

- category: game · memoryStrength: 5
- recommended_asset_type: **licensed-actual** ✅ 적용 완료 (게임 화면·다오/배찌 캐릭터는 여전히 사용 금지)
- 사용 자료: "PC bang in 2001" — Alex C, Wikimedia Commons, **CC BY 2.0**, 2001년 촬영 (CRT 시대 실제 한국 PC방)
- source_url: https://commons.wikimedia.org/wiki/File:PC_bang_in_2001.jpg
- 적용: 4:3 크롭 + 800×600 리사이즈 + 디카 톤 → `/images/years/2005/game/pcbang-racing.jpg`, 카드에 출처 표기(원본 링크)
- 시대적 특징: CRT 모니터 열, 파란 조명, 2000년대 초 PC방 의자·집기
- visual_direction: 2005년 PC방 — 줄지은 CRT 모니터, 헤드셋 낀 학생 뒷모습, 화면에는 알록달록한 레이싱 게임 느낌의 추상 색 번짐, 컵라면
- what_should_be_visible: PC방 특유의 파란 조명·CRT 열·의자, 화면은 비식별 컬러
- crop_recommendation: 모니터 줄이 사선으로 이어지는 원근감, 우하단 여백
- aspect_ratio_recommendation: 4:3
- copyright_note: 게임 UI/캐릭터/로고 재현 금지. "레이싱 게임 느낌의 빛"까지만
- fallback_plan: PC방 키보드+마우스+회원카드 클로즈업

### 7. 2005-game-2 / 던전앤파이터

- category: game · memoryStrength: 4
- recommended_asset_type: **recreated** (게임 화면·귀검사 캐릭터는 **do_not_use**)
- why: game-1과 동일한 이유. 구분 포인트는 "집 컴퓨터로 밤새 하던 벨트스크롤 감성".
- visual_direction: 어두운 방, 오래된 데스크탑 앞에서 키보드에 손을 올린 클로즈업, 화면은 도트 게임 느낌의 픽셀 광원(비식별), 야식
- what_should_be_visible: 키보드 조작하는 손, CRT 빛, 2000년대 컴퓨터 책상
- crop_recommendation: 손+키보드 중심의 로우앵글
- aspect_ratio_recommendation: 4:3
- copyright_note: 던파 캐릭터·UI·네오플 자산 금지. 픽셀 느낌은 추상적으로만
- fallback_plan: 오락실 조이스틱 느낌의 레트로 게임 소품 정물

### 8. 2005-internet-1 / 싸이월드 미니홈피

- category: internet · memoryStrength: 5
- recommended_asset_type: **recreated** ✅ 적용 완료 → `/images/years/2005/internet/cyworld-room.jpg` (완전 오리지널 화면 디자인 — 실제 싸이월드 UI 미복제, 원본 `assets-src/2005/cyworld-room.png`)
- why: 실제 싸이월드 UI·도토리 아이콘은 SK컴즈(현 싸이월드제트) 권리물. 서비스 정체성의 핵심 카드이므로 "미니홈피 감성의 오리지널 화면"을 정성껏 재현할 가치가 가장 큼.
- visual_direction: CRT 모니터 안에 파스텔톤 미니 룸 느낌의 오리지널 홈피 화면(작은 픽셀 방, 방문자 숫자 느낌의 카운터 — 실제 레이아웃과 다르게 재구성), 책상 위 다이어리와 스티커
- what_should_be_visible: CRT 모니터 전체, 화면 속 "투데이 카운터" 느낌의 숫자 요소(오리지널 디자인)
- crop_recommendation: 모니터 정면 중앙 배치, 화면이 카드의 70% 차지
- aspect_ratio_recommendation: 4:3
- copyright_note: **싸이월드 로고·도토리 아이콘·실제 UI 레이아웃 복제 금지.** 색감과 분위기만 차용한 완전 오리지널 화면일 것
- fallback_plan: 미니룸 감성의 픽셀 일러스트(자체 제작 — 이미 서비스 픽셀 톤과 일치)

### 9. 2005-internet-2 / MP3 플레이어

- category: internet · memoryStrength: 4
- recommended_asset_type: **licensed-actual** ✅ 적용 완료 → `/images/years/2005/internet/mp3-player.jpg` (iriver iFP-890, Graham Stanley, CC BY 2.0 — 출처 표기)
- why(기존 기록): MVP에서는 실물 구매·촬영보다 2005년 카드 전체의 비주얼 톤을 빠르게 검증하는 것이 우선. 무브랜드 프리즘형 MP3는 생성으로 충분히 재현 가능. 실물감이 아쉬우면 이후 중고 실물 직접 촬영(라이선스 완전 클린)으로 교체.
- visual_direction: 손바닥 위 프리즘형 MP3 + 줄 감긴 번들 이어폰, 교복 소매 살짝, 자연광
- what_should_be_visible: 기기 실루엣과 작은 액정, 이어폰 줄
- crop_recommendation: 손+기기 클로즈업, 우하단 여백
- aspect_ratio_recommendation: 4:3
- copyright_note: 제조사 공식 제품 사진(웹 이미지)은 사용 금지 — **직접 촬영본만**. 로고가 크게 보이면 각도로 회피
- source_candidate: (업그레이드 시) 중고 실물 직접 촬영 / Wikimedia Commons의 CC0·CC-BY 기기 사진(라이선스 개별 확인 필수)
- license_note: CC-BY 사용 시 저작자 표기 필요 — 서비스 크레딧 페이지 필요해짐. 자체 촬영이 가장 깔끔
- fallback_plan: 번들 이어폰+감긴 줄만의 정물 (generated)

### 10. 2005-device-1 / 슬라이드폰

- category: device · memoryStrength: 4
- recommended_asset_type: **licensed-actual** ✅ 적용 완료 → `/images/years/2005/device/slide-phone.jpg` (LG 초콜릿폰 KG800, Public Domain — 2006 출시 기기로 시대 근접 사용)
- why(기존 기록): 특정 모델 재현보다 "스르륵 올리는 손맛"이 기억 포인트. 무브랜드 슬라이드폰을 쥔 손이면 충분하고 리스크 없음.
- visual_direction: 책상 아래에서 슬라이드를 반쯤 올린 폰을 쥔 손, 작은 컬러 액정의 빛, 수업 시간의 긴장감 (교과서 모서리)
- what_should_be_visible: 슬라이드가 열린 형태, 엄지 손가락, 폴더폰 시대의 두께감
- crop_recommendation: 손+폰 클로즈업, 어두운 배경
- aspect_ratio_recommendation: 4:3
- copyright_note: 삼성/스카이/LG 로고·실제 UI 화면 노출 금지. 액정은 빛 번짐으로 처리
- fallback_plan: 실물 중고폰 자체 촬영 (로고 가려서)

### 11. 2005-photo-1 / 얼짱각도 45도

- category: photo · memoryStrength: 5
- recommended_asset_type: **generated-original** ✅ 적용 완료 → `/images/years/2005/photo/uljjang-angle.jpg` (오리지널 가상 인물 일러스트, 원본 `assets-src/2005/uljjang-angle.png`) — 포토리얼 버전은 외부 생성 도구 확보 시 교체 후보
- why: 실제 얼짱 사진·일반인 셀카는 초상권 문제로 절대 불가. "45도 각도 셀카"는 감정 표현이 중요한 카드이므로 **완전 오리지널 AI 생성 인물의 얼굴을 적극 활용**한다.
- visual_direction: 오리지널 생성 인물이 팔을 위로 뻗어 디카/폰을 45도로 내려 들고 찍는 셀카 — 턱 당긴 특유의 포즈, 플래시로 살짝 하얗게 날아간 밝은 표정
- what_should_be_visible: 위로 뻗은 팔, 45도 각도의 얼굴(오리지널 인물), 과노출 플래시 빛
- crop_recommendation: 대각선 구도, 화면 일부 플래시 화이트아웃
- aspect_ratio_recommendation: 4:3
- copyright_note: 실존 인물(얼짱 세대 유명인 포함)과 닮은 얼굴 생성 금지 — 닮게 나오면 폐기 후 재생성
- fallback_plan: 거울 앞 디카 셀카 — 플래시 반사로 얼굴이 가려진 구도

### 12. 2005-photo-2 / 디카 날짜 스탬프

- category: photo · memoryStrength: 4
- recommended_asset_type: **licensed-actual** ✅ 적용 완료 → `/images/years/2005/photo/digicam-snap.jpg` (Canon IXUS 400, Public Domain)
- why: "하얗게 날아간 저화질 사진" 질감 자체가 콘텐츠. 생성으로 완벽 재현 가능.
- visual_direction: 2005년 컴팩트 디카로 찍은 듯한 일상 스냅 — 노을 진 골목, 과노출, 손떨림 블러, 채도 약간 뜬 색감
- what_should_be_visible: 저화질 노이즈, 플래시 비네팅, 일상 골목/교실 풍경
- crop_recommendation: 수평 살짝 삐뚤어진 스냅 느낌
- aspect_ratio_recommendation: 4:3
- copyright_note: **주의 — 날짜 스탬프를 이미지에 넣지 말 것.** UI가 주황 스탬프를 자동 오버레이함(중복되면 어색)
- fallback_plan: 은색 컴팩트 디카 실물을 쥔 손 (generated)

### 13. 2005-fashion-1 / 매직 스트레이트

- category: fashion · memoryStrength: 3
- recommended_asset_type: **generated-original**
- why: 생활 장면 재현이 최적. 인물 정면 없이 헤어만으로 표현 가능.
- visual_direction: 찰랑이는 일자 생머리 뒷모습(교복 어깨선), 옆에 고데기·헤어 에센스, 아침 등교 전 방
- what_should_be_visible: 반짝이는 스트레이트 헤어 뒷모습, 고데기
- crop_recommendation: 뒷모습 상반신, 머릿결에 하이라이트
- aspect_ratio_recommendation: 4:3
- copyright_note: 미용 브랜드 로고 금지, 얼굴 비노출
- fallback_plan: 고데기+헤어핀+거울 정물

### 14. 2005-fashion-2 / 샤기컷

- category: fashion · memoryStrength: 4
- recommended_asset_type: **generated-original**
- why: 특정 연예인 헤어 레퍼런스를 직접 쓰면 초상권 문제. 미용실 장면으로 재현.
- visual_direction: 동네 미용실 의자에 앉은 남학생 뒷모습~옆모습(얼굴 비식별), 층진 샤기컷, 가위 든 손, 벽의 빛바랜 헤어 포스터는 흐릿하게
- what_should_be_visible: 층 많이 낸 샤기컷 실루엣, 미용실 가위/분무기
- crop_recommendation: 뒷통수~어깨 클로즈업
- aspect_ratio_recommendation: 4:3
- copyright_note: 벽 포스터에 실존 연예인 얼굴이 생성되지 않도록 프롬프트에서 배제
- fallback_plan: 가위+빗+잘린 머리카락 바닥 정물

### 15. 2005-food-1 / 컵떡볶이

- category: food · memoryStrength: 4
- recommended_asset_type: **licensed-actual** ✅ 적용 완료
- 사용 자료: "Korean.snacks-Tteokbokki-08" — jetalone (Flickr), Wikimedia Commons, **CC BY 2.0**, 2007년 촬영 (분식 떡볶이)
- source_url: https://commons.wikimedia.org/wiki/File:Korean.snacks-Tteokbokki-08.jpg
- 적용: 크롭 + 800×600 + 톤 통일 → `/images/years/2005/food/cup-tteokbokki.jpg`, 카드에 출처 표기
- 남은 이슈: 컵이 아닌 접시 떡볶이라 "컵떡볶이" 기억과 100% 일치하지 않음 — 컵떡볶이 자체 촬영본 확보 시 교체 후보
- visual_direction: 종이컵에 담긴 떡볶이 + 꽂힌 이쑤시개(나무), 학교 앞 분식집 느낌의 스테인리스 판매대, 김 서림 — 친구와 나눠 먹는 오리지널 생성 인물의 표정 컷도 좋음
- what_should_be_visible: 종이컵, 이쑤시개, 빨간 양념의 광택
- crop_recommendation: 컵 클로즈업 로우앵글, 배경 보케
- aspect_ratio_recommendation: 4:3
- copyright_note: 프랜차이즈 로고 컵 금지 — 무지 종이컵
- fallback_plan: (업그레이드) 실물 자체 촬영 — 동일 구도

### 16. 2005-food-2 / 슬러시

- category: food · memoryStrength: 3
- recommended_asset_type: **generated-original** (자체 촬영 가능하면 actual 승격)
- why: "파란 혀" 기억 포인트가 핵심. 파란 슬러시 컵은 생성으로 충분.
- visual_direction: 문방구 앞, 투명 돔 뚜껑 컵의 파란 슬러시 + 굵은 빨대, 여름 햇빛, 뒤로 흐릿한 문방구 좌판
- what_should_be_visible: 형광 파랑 슬러시 질감, 돔 뚜껑 컵
- crop_recommendation: 컵을 든 손 클로즈업, 역광
- aspect_ratio_recommendation: 4:3
- copyright_note: 음료 브랜드 로고 금지
- fallback_plan: 슬러시 기계(무로고)가 도는 문방구 앞 장면

---

## 요약 통계

| 타입 | 개수 | 카드 |
|---|---|---|
| licensed-actual | 2 (✅ 적용) | game-1(PC방 2001, CC BY 2.0), food-1(떡볶이 2007, CC BY 2.0) |
| recreated | 7 (✅ 2 적용) | music-1 ✅, music-2·3, drama-1·2, game-2, internet-1 ✅ |
| generated-original | 7 (✅ 1 적용) | internet-2, device-1, photo-1 ✅ ·2, fashion-1·2, food-2 |
| reference-only | 기록 1 | "People playing StarCraft at PC Bang in 2001" — 게임 화면 노출로 사용 불가, PC방 재현 참고용 |
| 원저작물 금지 | 전 카드 공통 | 스틸컷·앨범커버·게임화면·캐릭터·연예인 사진 일절 금지 |

> 미디어 저작물이 걸린 카드(음악·드라마·게임·싸이월드)는 전부 "그 시절 생활 장면 재현"으로 우회하는 것이 전략의 핵심.
> **MVP는 16개 카드 전부 생성/재현 이미지로 제작해 2005년 비주얼 톤을 빠르게 검증**하고, 반응이 확인되면 generated → 자체 촬영 actual로 업그레이드한다. 외부 다운로드 이미지는 원칙적으로 쓰지 않는다.

## 파일 경로 규칙 (다음 단계 적용용)

- 실제 에셋: `public/images/years/2005/<category>/<slug>.jpg`
  - 예: `/images/years/2005/internet/cyworld-room.jpg`, `/images/years/2005/food/cup-tteokbokki.jpg`
- slug는 영문 케밥케이스, 카드 id와 매핑은 이 문서가 기준
- 현재 placeholder(`/images/years/2005/<id>.svg`)는 실제 에셋 적용 시 `image` 필드 한 줄 교체로 대체
- 권장 스펙: **생성 원본 4:3 · 1600×1200 이상 고화질 별도 보관(OG·공유 이미지 재사용 대비) → 웹 적용본 800×600 JPG(품질 ~80, 200KB 전후)만 public에 배치**, 우하단 10% 여백(날짜 스탬프 영역)

| id | 타깃 경로 |
|---|---|
| 2005-music-1 | `/images/years/2005/music/cyworld-bgm.jpg` |
| 2005-music-2 | `/images/years/2005/music/noraebang-book.jpg` |
| 2005-music-3 | `/images/years/2005/music/noraebang-highnote.jpg` |
| 2005-drama-1 | `/images/years/2005/drama/livingroom-drama-night.jpg` |
| 2005-drama-2 | `/images/years/2005/drama/saturday-variety.jpg` |
| 2005-game-1 | `/images/years/2005/game/pcbang-racing.jpg` |
| 2005-game-2 | `/images/years/2005/game/night-gaming.jpg` |
| 2005-internet-1 | `/images/years/2005/internet/cyworld-room.jpg` |
| 2005-internet-2 | `/images/years/2005/internet/mp3-player.jpg` |
| 2005-device-1 | `/images/years/2005/device/slide-phone.jpg` |
| 2005-photo-1 | `/images/years/2005/photo/uljjang-angle.jpg` |
| 2005-photo-2 | `/images/years/2005/photo/digicam-snap.jpg` |
| 2005-fashion-1 | `/images/years/2005/fashion/magic-straight.jpg` |
| 2005-fashion-2 | `/images/years/2005/fashion/shaggy-cut.jpg` |
| 2005-food-1 | `/images/years/2005/food/cup-tteokbokki.jpg` |
| 2005-food-2 | `/images/years/2005/food/blue-slush.jpg` |

---

## Priority 5 — 가장 먼저 만들 5장

1. **2005-internet-1 싸이월드 미니홈피** (recreated) — 서비스 정체성의 심장. memoryStrength 5 + 피드 최상단 노출군 + "미니홈피 방문자 수" 질문과 직결. 이 한 장이 서비스 전체의 비주얼 기준점이 됨.
2. **2005-photo-1 얼짱각도 45도** (generated) — 얼짱캠 연계 서비스와의 브랜드 궁합 최고. 공유 시 "아 이 각도ㅋㅋ" 즉발 반응이 나오는 밈성 비주얼.
3. **2005-game-1 카트라이더 → PC방 장면** (recreated) — 강도 5 + 남녀 공통 기억 + PC방 비주얼은 2005의 대표 공간이라 다른 게임 카드에도 톤 기준이 됨.
4. **2005-music-1 사랑했나봐 → 싸이월드 BGM 감성** (recreated) — 피드 첫 카드(강도 5 최상단)이자 BGM 플레이어 기능과 감성이 연결됨. 결과 페이지 cover 톤과도 통일 가능.
5. **2005-food-1 컵떡볶이** (generated, 이후 자체 촬영 업그레이드) — 제작 난이도가 가장 낮으면서 공감 강도가 높음. 타임캡슐 질문("학교 끝나고 가장 많이 갔던 곳")과 감정선이 직결되어 공유 동기를 보강.

> 이 5장이 **2005년 비주얼 스타일을 확정하는 첫 번째 세트**다. 5장의 톤이 확정되면 나머지 11장은 같은 스타일로 확장한다.

선정 기준: 기억 자극 강도(memoryStrength) · 서비스 대표성 · 공유 가능성 · 비주얼 임팩트 · 추억.zip(Y2K/미니홈피) 정체성과의 궁합.
