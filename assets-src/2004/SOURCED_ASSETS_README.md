# 2004 추가 실사 소싱 묶음

2004년 피드 확장·교체 검토용으로 확보한 실사 에셋입니다. 기존에 적용된 Priority 5 에셋(버디버디·도토리·파리의 연인·가로본능·스티커사진)은 덮어쓰지 않습니다.

## 폴더 구조

- `licensed-actual/originals/`: 상업적 재사용 조건을 확인한 원본 5개
- `licensed-actual/web/`: 검토용 800×600 JPG 5개
- `reference-only/originals/`: 서비스에 직접 쓰지 않는 참고 원본 2개
- `reference-only/web/`: 참고용 800×600 JPG 2개
- `asset-manifest.sourced.json`: 출처·라이선스·상태·사용 조건
- `sourced-assets-contact-sheet.jpg`: 일괄 미리보기

## 적용 판단

| 파일 | 상태 | 판단 |
|---|---|---|
| Motorola RAZR V3 | 후보 보관 | 2004년 카메라폰 분위기는 맞지만 기존 `가로본능 폰` 카드와 기종이 달라 직접 교체하지 않음 |
| Canon PowerShot A400 | 후보 보관 | 2004년 디카 실물. 추후 디카·사진 문화 카드 신설 또는 정물형 대체에 사용 가능 |
| iRiver H340 | 후보 보관 | 2004년 MP3 실물. 사용 시 CC BY 2.5 크레딧 필수 |
| Logitech QuickCam Pro 4000 | 보류 | 2000년대 웹캠 분위기는 맞지만 동일 자료가 2006 하두리캠 카드에 이미 사용 중이라 중복 회피 |
| Belinea CRT monitor | 수정 후 후보 | 화면 속 데스크톱 UI를 흐림/중립 화면으로 교체한 뒤 사용 권장 |
| Personal computer (2003) | 참고 전용 | 이미지 내부 영문 라벨 때문에 최종 UI에 부적합 |
| PC bang in 2001 | 참고 전용 | 식별 가능한 인물이 있고 2005 PC방 카드와 중복됨 |

## 공통 규칙

- `web/` 파일은 모두 800×600 JPG, 100KB 미만입니다.
- 공개 저장소 노출 전 원본 7개의 EXIF/XMP(위치·기기·일련번호 포함 가능)를 모두 제거했습니다.
- `licensed-actual`은 출처 라이선스가 확인됐다는 뜻이며, 현재 2004 카드에 곧바로 연결됐다는 뜻은 아닙니다.
- 실제 적용 시 `public/images/years/2004/<category>/<slug>.jpg`로 복사하고 `data/memories.ts`의 `image` 및 필요한 `credit`을 함께 반영합니다.
- CC BY 자료를 적용할 때는 카드 하단 크레딧과 원본 링크를 반드시 노출합니다.
