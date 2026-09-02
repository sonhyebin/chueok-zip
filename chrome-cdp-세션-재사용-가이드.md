# 크롬 로그인 세션 재사용 가이드 (CDP 방식)

> 사용자가 이미 로그인해 둔 크롬 세션을 그대로 빌려서, 로그인이 필요한 웹사이트를
> 자동화하고 **사이트 내부 API를 직접 호출**하는 방법.
> 2026-08-28 App Store Connect(개인정보 라벨 편집) 작업에서 실제로 검증됨.

---

## 1. 언제 쓰나

이 방법이 필요한 상황은 둘 중 하나다.

| 상황 | 설명 |
|---|---|
| **확장이 연결 안 될 때** | `mcp__claude-in-chrome__*` 도구가 "Browser extension is not connected"를 반환하는데, 확장을 설치·재시작해 줄 사람이 없거나 기다릴 수 없을 때 |
| **공개 API가 없는 편집** | 사이트가 공식 API로는 제공하지 않는 기능(예: App Store Connect의 앱 개인정보 라벨). 웹 UI에서만 가능한 작업은 결국 **웹 세션**이 필요하다 |

### 시작 전 30초 판정 — 이 방법이 통하는 사이트인가

**공식 API가 있으면 브라우저로 가지 마라.** 아래 순서로 판단한다.

1. 공식 API로 되는 일인가? → 된다면 API를 써라 (CLI 토큰·서비스 계정).
   구글이면 `gcloud`, AWS면 `aws`, Apple이면 App Store Connect API(JWT).
2. API에 없는 기능인가? → 그때 이 방법을 쓴다.
3. **대상이 구글인가? → 이 방법은 통하지 않는다** (5-4의 DBSC). 바로 5-6으로 간다.

검증된 사례와 실패 사례를 같이 적어 둔다:

| 대상 | 결과 |
|---|---|
| App Store Connect (개인정보 라벨 `iris` API) | ✅ 성공 |
| Google Cloud Console / Firebase Console | ❌ 실패 — DBSC로 세션 무효 |

핵심 아이디어:

```
사용자 크롬 프로필의 쿠키
   └─(최소 사본)→ 별도 user-data-dir
        └─(헤드리스 + --remote-debugging-port)→ CDP WebSocket
             └─(Runtime.evaluate)→ 페이지 컨텍스트에서 fetch 실행
                  └─ 세션 쿠키 + CSRF 헤더가 자동으로 붙은 내부 API 호출
```

마지막 줄이 이 방법의 전부다. **페이지 컨텍스트 안에서 `fetch`를 실행하면**
브라우저가 알아서 쿠키를 싣고, 사이트의 서비스워커/인터셉터가 CSRF 토큰까지
붙여 준다. curl로 쿠키를 재현하려다 CSRF에서 막히는 문제가 통째로 사라진다.

---

## 2. 로그인 세션이 있는 프로필 찾기

크롬 프로필이 수십 개인 경우가 흔하다. 대상 도메인 쿠키의 **최근 접근 시각**으로
어느 프로필에 살아 있는 세션이 있는지 찾는다.

### 2-1. 프로필 목록 확인

```bash
python3 -c "
import json, os
d = json.load(open(os.path.expanduser('~/Library/Application Support/Google/Chrome/Local State')))
info = d.get('profile', {})
print('last_used:', info.get('last_used'))
print('profiles:', {k: v.get('name') for k, v in info.get('info_cache', {}).items()})
"
```

### 2-1b. 프로필별 로그인 계정 바로 알아내기 ★

쿠키를 뒤지기 전에 이걸 먼저 해라. `Local State`의 `info_cache[프로필].user_name`에
**그 프로필에 로그인된 계정 이메일이 그대로 들어 있다.** 계정을 특정해야 하는 작업
(예: "이 GCP 프로젝트 소유자 계정이 어느 프로필이냐")에서는 쿠키 스캔보다 훨씬 빠르다.

```python
import json, os
base = os.path.expanduser('~/Library/Application Support/Google/Chrome')
info = json.load(open(base + '/Local State'))['profile']['info_cache']
rows = [(p, d.get('name'), d.get('user_name')) for p, d in info.items() if d.get('user_name')]
for prof, name, email in sorted(rows, key=lambda x: x[2]):
    print(f'{prof:12} {name:28} {email}')
```

```
Profile 11   cosduck.com                  juno@cosduck.com
Profile 41   효민                           vofkorea3@gmail.com
Profile 65   supermembers.co.kr           company@supermembers.co.kr
```

`user_name`이 비어 있는 프로필은 브라우저 동기화 로그인을 안 한 것이다
(웹 세션은 있을 수 있으니 그때는 2-2 쿠키 스캔으로 간다).

### 2-2. 대상 도메인 쿠키 스캔

**원본 SQLite는 크롬이 잠그고 있으므로 반드시 사본을 만들어 연다.**
`last_access_utc`는 WebKit epoch(1601-01-01 기준 마이크로초)라 변환이 필요하다.

```python
import glob, sqlite3, os, shutil, tempfile, datetime

base = os.path.expanduser('~/Library/Application Support/Google/Chrome')
TARGET_HOST = '%apple.com'                       # 대상 도메인
TARGET_COOKIES = ('myacinfo', 'itctx', 'dqsid')  # 세션 쿠키 이름들

hits = []
paths = (glob.glob(base + '/Profile */Cookies')
         + glob.glob(base + '/Profile */Network/Cookies')
         + glob.glob(base + '/Default/Cookies')
         + glob.glob(base + '/Default/Network/Cookies'))

for ck in paths:
    prof = ck.replace(base + '/', '').split('/')[0]
    try:
        tmp = tempfile.mktemp()
        shutil.copy(ck, tmp)                      # ★ 잠금 회피: 사본으로 연다
        con = sqlite3.connect(tmp)
        rows = con.execute(
            "select name, host_key, last_access_utc from cookies "
            "where host_key like ? and name in (?,?,?) "
            "order by last_access_utc desc limit 3",
            (TARGET_HOST, *TARGET_COOKIES)).fetchall()
        con.close(); os.remove(tmp)
        if rows:
            newest = max(r[2] for r in rows)
            ts = datetime.datetime(1601, 1, 1) + datetime.timedelta(microseconds=newest)
            hits.append((ts, prof, [r[0] for r in rows]))
    except Exception:
        pass

for ts, prof, names in sorted(hits, reverse=True)[:8]:
    print(ts.strftime('%Y-%m-%d %H:%M'), prof, names)
```

출력 예시 — 오늘 날짜가 찍힌 프로필이 정답이다:

```
2026-08-28 01:59 Profile 65 ['dqsid', 'itctx', 'myacinfo']
2026-07-31 09:37 Profile 12 ['dqsid']
```

> **도메인별 세션 쿠키 이름 참고**
> - App Store Connect / Apple Developer: `myacinfo`, `itctx`, `dqsid`
> - Google 계열: `SID`, `SSID`, `HSID`, `__Secure-1PSID`
> - 대부분의 SaaS: `session`, `sessionid`, `_session_id`, `connect.sid`
> 모르면 `name` 조건 없이 `host_key like '%도메인%'`로 먼저 훑어보면 된다.

---

## 3. 최소 프로필 사본 만들기

프로필 폴더를 통째로 복사하면 안 된다(수 GB에 잠금 충돌까지 난다).
**로그인 상태 복원에 필요한 4개 파일만** 복사한다.

```bash
SP=/path/to/scratchpad          # 작업 디렉토리
UD="$SP/chrome-asc"             # 새 user-data-dir
PROF="Profile 65"               # 2단계에서 찾은 프로필
CH="$HOME/Library/Application Support/Google/Chrome"

rm -rf "$UD"; mkdir -p "$UD/$PROF/Network"
cp "$CH/Local State"              "$UD/"
cp "$CH/$PROF/Preferences"        "$UD/$PROF/"          2>/dev/null
cp "$CH/$PROF/Cookies"            "$UD/$PROF/"          2>/dev/null
cp "$CH/$PROF/Network/Cookies"    "$UD/$PROF/Network/"  2>/dev/null

ls -la "$UD/$PROF/" "$UD/$PROF/Network/" | grep -E "Cookies|Preferences"
```

- `Cookies`는 크롬 버전에 따라 `Profile N/Cookies` 또는 `Profile N/Network/Cookies`에
  있다. 둘 다 복사하고 없으면 조용히 넘어가게 `2>/dev/null`을 붙인다.
- macOS에서 쿠키값은 Keychain 키로 암호화되어 있는데, **같은 사용자로 실행하면
  크롬이 알아서 복호화**한다. 별도 처리 불필요.

---

## 4. 헤드리스 크롬 실행

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --user-data-dir="$UD" \
  --profile-directory="$PROF" \
  --headless=new \
  --remote-debugging-port=9223 \
  --no-first-run \
  --no-default-browser-check \
  --window-size=1440,900 \
  > "$SP/chrome-cdp.log" 2>&1 &
echo $! > "$SP/chrome-cdp.pid"

sleep 5
curl -s http://127.0.0.1:9223/json/version | head -3
```

정상이면 이렇게 나온다:

```json
{
   "Browser": "Chrome/151.0.7922.175",
   "Protocol-Version": "1.3",
```

- 포트는 **9222 대신 9223**을 쓰는 걸 권한다. 사용자가 평소 쓰는 크롬이
  9222를 잡고 있을 수 있다.
- 사용자의 실제 크롬은 건드리지 않는다. 별도 `user-data-dir`이라 완전히 격리된다.

---

## 5. 함정과 해결책 ★

이번 작업에서 실제로 막혔던 지점들. 모르면 각각 10~20분씩 태운다.

### 5-1. WebSocket 핸드셰이크 403 Forbidden

```
websocket._exceptions.WebSocketBadStatusException: Handshake status 403 Forbidden
b'Rejected an incoming WebSocket connection from the http://127.0.0.1:9223 origin.'
```

최신 크롬은 Origin 헤더가 붙은 CDP 연결을 거부한다. `websocket-client`가
Origin을 자동으로 붙이는 게 원인이다. **둘 중 하나로 해결:**

```python
# 방법 A (권장) — 클라이언트에서 Origin 제거
ws = websocket.create_connection(url, timeout=60, suppress_origin=True)
```

```bash
# 방법 B — 크롬 실행 시 허용
--remote-allow-origins=*
```

### 5-2. `/json/new?url=...`이 about:blank로 뜬다

`PUT /json/new?url=<인코딩된 URL>`로 탭을 만들어도 `location.href`가
`about:blank`인 경우가 있다. **빈 탭을 만든 뒤 `Page.navigate`로 이동**시키고
몇 초 기다리는 쪽이 안정적이다.

```python
t = Tab()                                    # about:blank로 생성
t.navigate('https://example.com/', settle=8) # 이동 후 8초 대기
print(t.js('location.href', await_promise=False))
```

### 5-3. `Runtime.evaluate` 옵션

`fetch(...)`처럼 Promise를 반환하는 코드는 옵션 두 개가 반드시 필요하다.

```python
cmd('Runtime.evaluate',
    expression=expr,
    awaitPromise=True,     # Promise 해소를 기다린다 (없으면 Promise 객체만 돌아옴)
    returnByValue=True)    # 결과를 JSON 값으로 직렬화 (없으면 objectId만 옴)
```

`location.href`처럼 동기 값을 읽을 때는 `awaitPromise=False`로 둔다
(Promise가 아닌 값에 `awaitPromise=True`를 주면 에러가 나는 크롬 버전이 있다).

### 5-4. **구글 세션은 복사해도 안 살아난다** ★★ (가장 중요)

이 방법이 통하지 않는 대표 사례. 구글은 세션 쿠키를 기기에 묶는
**DBSC(Device Bound Session Credentials)**를 쓴다. 쿠키 DB를 그대로 복사해도
사본 프로필에서는 세션이 무효다.

증상이 특징적이다 — 로그인 페이지로 튕기면서 **계정 목록은 뜨는데 전부 "Signed out"**:

```
Choose an account
  어드민       company@supermembers.co.kr   Signed out
  Luffy Oh    wnsgg0844@gmail.com          Signed out
```

계정이 하나도 안 뜨면 쿠키 복호화 실패(다른 문제)지만, **목록은 뜨는데 전부 Signed out이면
DBSC다. 재시도·프로필 교체·쿠키 재복사 전부 소용없다.** 방금 로그인한 세션이어도 마찬가지다.

| 사이트 | 쿠키 복사로 세션 재사용 |
|---|---|
| App Store Connect (`myacinfo`) | ✅ 된다 |
| 구글 (Cloud Console·Firebase·Gmail) | ❌ 안 된다 (DBSC) |

**구글이 대상이면 브라우저를 포기하고 공식 API로 가라** (아래 5-6).

### 5-5. 쿠키가 아직 디스크에 없을 수 있다

크롬은 쿠키를 메모리에 두고 주기적으로 flush한다. **사용자가 방금 로그인한 직후라면
사본에 그 쿠키가 없을 수 있다.** 최신 여부는 `last_access_utc`(접근)가 아니라
`creation_utc`(생성)로 확인하는 게 정확하다.

```sql
select max(creation_utc) from cookies
 where host_key like '%google.com' and name in ('SID','SAPISID','__Secure-1PSID')
```

현재 시각과 비교해서 로그인 시점 이후 값이 잡히면 flush된 것이다. 안 잡히면 1~2분 뒤 재시도.

### 5-6. 브라우저가 막히면 — 공식 API + `gcloud` 우회 ★

구글 작업은 CDP 대신 이 경로가 정답이다. 다만 `gcloud`로 받은 토큰에는 함정이 있다.

```bash
TOKEN=$(gcloud auth print-access-token --account=someone@example.com)
curl -H "Authorization: Bearer $TOKEN" \
     -H "x-goog-user-project: <프로젝트ID>" \   # ★ 이 헤더가 없으면 403
     "https://firebase.googleapis.com/v1beta1/projects/<프로젝트ID>"
```

**403이라고 다 권한 문제가 아니다. 메시지를 반드시 읽어라** — 이걸 구분 못 하면
"권한 없음"으로 오판하고 엉뚱한 계정을 찾아 헤매게 된다.

| 응답 메시지 | 원인 | 대처 |
|---|---|---|
| `requires a quota project` / `SERVICE_DISABLED` | ADC에 쿼터 프로젝트 미지정 | `x-goog-user-project` 헤더 추가 → **해결됨** |
| `Caller does not have required permission to use project` / `USER_PROJECT_DENIED` | 그 프로젝트에 진짜 권한 없음 | 다른 계정 필요 |
| `The caller does not have permission` (Resource Manager) | 진짜 권한 없음 | 다른 계정 필요 |

계정을 좁힐 때는 무거운 API 대신 **프로젝트 목록**이 빠르다. 목록이 비어 있으면
그 계정은 후보에서 제외된다:

```bash
for acct in $(gcloud auth list --format="value(account)"); do
  echo "== $acct"; gcloud projects list --account=$acct --format="value(projectId)" | head
done
```

토큰이 만료된 계정은 `print-access-token`이 **조용히 빈 문자열**을 뱉는다.
"토큰 없음"을 "권한 없음"으로 착각하지 마라 — 재로그인 후 다시 판정해야 한다.

인터랙티브 로그인이 필요하면 사용자에게 직접 실행을 요청한다
(Claude Code에서는 `! gcloud auth login <email>`).

### 5-7. 그 외

- **SPA 로딩 대기**: `Page.navigate` 직후 DOM이 비어 있을 수 있다.
  `settle` 파라미터로 5~8초 주거나, 특정 셀렉터가 나타날 때까지 폴링한다.
  Firebase/Cloud Console 같은 무거운 SPA는 12~16초까지 준다.
- **응답 크기**: `returnByValue=True`는 큰 응답을 통째로 직렬화한다.
  리스트 API는 `limit`을 걸거나 JS 쪽에서 필요한 필드만 추려서 반환한다.
- **`/json/new`는 PUT이다**: GET으로 부르면 `405 Method Not Allowed`.
  `urllib.request.Request(url, method='PUT')`로 호출한다.
- **로그인 여부 판정**: 목표 URL로 이동한 뒤 `location.href`가
  `accounts.google.com/...signin` / `idmsa.apple.com` 등으로 바뀌었는지 보면 된다.
  DOM 파싱보다 정확하고 빠르다.
- **프로필 여러 개를 순차 테스트**할 때는 포트를 분리하고 사이사이 반드시 죽인다.
  안 그러면 이전 프로필 인스턴스에 붙어서 엉뚱한 세션을 본다.
  ```bash
  pkill -f "remote-debugging-port=9224"; sleep 1
  ```

---

## 6. 재사용 드라이버 — `cdp.py`

그대로 복사해서 쓰면 되는 미니 드라이버.

```python
"""CDP 미니 드라이버 — 헤드리스 크롬(9223)의 페이지 컨텍스트에서 JS 실행."""
import json, time, urllib.parse, urllib.request
import websocket


def _http(path, method='GET'):
    """CDP HTTP 엔드포인트 호출 (/json, /json/new, /json/close/<id> 등)."""
    r = urllib.request.Request('http://127.0.0.1:9223' + path, method=method)
    with urllib.request.urlopen(r) as resp:
        return json.load(resp)


class Tab:
    def __init__(self, url='about:blank'):
        # 새 탭 생성은 PUT. url은 반드시 인코딩해서 넘긴다.
        t = _http('/json/new?url=' + urllib.parse.quote(url, safe=''), method='PUT')
        self.id = t['id']
        # suppress_origin=True — 없으면 크롬이 403으로 핸드셰이크를 거부한다 (5-1)
        self.ws = websocket.create_connection(
            t['webSocketDebuggerUrl'], timeout=60, suppress_origin=True)
        self._mid = 0
        self.cmd('Page.enable')
        self.cmd('Runtime.enable')

    def cmd(self, method, **params):
        """CDP 명령 1회 — 같은 id의 응답이 올 때까지 읽는다(이벤트는 버림)."""
        self._mid += 1
        mid = self._mid
        self.ws.send(json.dumps({'id': mid, 'method': method, 'params': params}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get('id') == mid:
                if 'error' in msg:
                    raise RuntimeError(msg['error'])
                return msg.get('result', {})

    def navigate(self, url, settle=6):
        """페이지 이동 + SPA 렌더 대기. 느린 사이트는 settle을 늘린다."""
        self.cmd('Page.navigate', url=url)
        time.sleep(settle)

    def js(self, expr, await_promise=True, timeout=30):
        """페이지 컨텍스트에서 JS 실행. fetch는 await_promise=True 필수 (5-3)."""
        r = self.cmd('Runtime.evaluate', expression=expr,
                     awaitPromise=await_promise, returnByValue=True)
        if 'exceptionDetails' in r:
            raise RuntimeError(str(r['exceptionDetails'])[:500])
        return r['result'].get('value')

    def screenshot(self, path):
        """현재 뷰포트 PNG 저장 — 로그인 상태/화면 확인용."""
        import base64
        r = self.cmd('Page.captureScreenshot', format='png')
        open(path, 'wb').write(base64.b64decode(r['data']))

    def close(self):
        try:
            _http(f'/json/close/{self.id}')
        except Exception:
            pass
```

### 사용 예시 — 로그인 상태 확인

```python
import sys; sys.path.insert(0, '/path/to/scratchpad')
from cdp import Tab

t = Tab()
t.navigate('https://appstoreconnect.apple.com/apps', settle=8)
print('url:', t.js('location.href', await_promise=False))
print('title:', t.js('document.title', await_promise=False))
t.screenshot('/path/to/scratchpad/check.png')   # 눈으로 확인
```

`title`이 로그인 페이지가 아니라 실제 서비스 제목이면 세션 재사용 성공이다.

---

## 7. 사이트 내부 API 호출 — `iris.py`

**이 방법의 진짜 값어치.** 페이지 컨텍스트에서 `fetch`를 실행하므로

- 세션 쿠키가 자동으로 실린다 (직접 헤더 조립 불필요)
- 사이트가 심어 둔 CSRF 토큰/인터셉터가 그대로 적용된다
- 즉, **브라우저에서 버튼을 누른 것과 동일한 요청**이 나간다

아래는 App Store Connect의 내부 API(`/iris/v1/...`)용 헬퍼다.
다른 사이트도 `Iris` → 사이트명, 경로만 바꾸면 그대로 재사용된다.

```python
"""ASC 웹 세션(iris API) 호출 헬퍼 — 헤드리스 CDP 탭의 페이지 컨텍스트에서 fetch 실행.
공개 API(App Store Connect API)로 불가능한 편집(개인정보 라벨 등)에 사용."""
import json, urllib.request
import websocket


def _http(path):
    with urllib.request.urlopen('http://127.0.0.1:9223' + path) as r:
        return json.load(r)


class Iris:
    def __init__(self):
        # 이미 로그인 페이지가 열려 있는 탭에 붙는다 (새 탭을 만들지 않는다)
        tabs = [t for t in _http('/json') if 'appstoreconnect' in t.get('url', '')]
        if not tabs:
            raise RuntimeError('appstoreconnect 탭 없음 — cdp.py 로 먼저 로그인 페이지를 열어라')
        self.ws = websocket.create_connection(
            tabs[0]['webSocketDebuggerUrl'], timeout=90, suppress_origin=True)
        self._mid = 0
        self._cmd('Runtime.enable')

    def _cmd(self, method, **params):
        self._mid += 1
        mid = self._mid
        self.ws.send(json.dumps({'id': mid, 'method': method, 'params': params}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get('id') == mid:
                if 'error' in msg:
                    raise RuntimeError(msg['error'])
                return msg.get('result', {})

    def js(self, expr):
        r = self._cmd('Runtime.evaluate', expression=expr,
                      awaitPromise=True, returnByValue=True)
        if 'exceptionDetails' in r:
            raise RuntimeError(str(r['exceptionDetails'])[:600])
        return r['result'].get('value')

    def req(self, method, path, body=None):
        """iris API 호출 — 페이지 컨텍스트라 세션 쿠키·CSRF 헤더가 자동 적용된다."""
        opts = {'method': method, 'headers': {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
        }}
        if body is not None:
            opts['body'] = json.dumps(body)
        expr = (
            "fetch(%s, %s).then(async r=>({status:r.status, "
            "body: await r.text()}))" % (json.dumps(path), json.dumps(opts))
        )
        r = self.js(expr)
        out = {'status': r['status']}
        try:
            out['json'] = json.loads(r['body']) if r['body'] else None
        except Exception:
            out['text'] = r['body'][:800]
        return out
```

### 실제 사용 예 — 앱 개인정보 라벨 조회

공식 App Store Connect API에는 `dataUsages` 관계가 **없다**(404). 웹 전용이다.
내부 API로는 이렇게 읽힌다:

```python
import sys; sys.path.insert(0, '/path/to/scratchpad')
from iris import Iris

i = Iris()
r = i.req('GET', '/iris/v1/apps/6504695246/dataUsages'
                 '?include=category,grouping,purpose,dataProtection&limit=500')

for d in r['json']['data']:
    rel = d['relationships']
    g = lambda k: (rel.get(k, {}).get('data') or {}).get('id')
    print(g('category'), g('purpose'), g('dataProtection'), d['id'])
```

출력:

```
PHOTOS_OR_VIDEOS  PRODUCT_PERSONALIZATION  DATA_LINKED_TO_YOU  c8efd8b0-...
EMAIL_ADDRESS     APP_FUNCTIONALITY        DATA_LINKED_TO_YOU  a2886321-...
HEALTH            APP_FUNCTIONALITY        DATA_LINKED_TO_YOU  36f39a4b-...
```

각 항목은 `category` / `grouping` / `purpose` / `dataProtection` 4개 관계를 가진
JSON:API 리소스다. 같은 경로에 `POST`(추가) · `DELETE`(제거)를 보내면 편집된다.

### 내부 API 경로를 모를 때

1. 사용자의 일반 크롬에서 해당 화면을 열고 DevTools → Network → Fetch/XHR
2. UI에서 그 동작을 한 번 수행 → 요청 URL·메서드·바디를 그대로 베낀다
3. 그 요청을 `req()`로 재현한다

**중요**: 쓰기(POST/PATCH/DELETE)는 요청/응답 한 쌍을 실제로 관찰한 뒤에만
재현하라. 스키마를 추측해서 쏘면 데이터가 망가진다.

---

## 8. 정리 (cleanup) — 반드시 할 것

사본에는 **실제 로그인 쿠키**가 들어 있다. 작업이 끝나면 지운다.

```bash
# 헤드리스 크롬 종료
kill "$(cat "$SP/chrome-cdp.pid")" 2>/dev/null
# 혹시 남은 인스턴스까지
pkill -f "remote-debugging-port=9223" 2>/dev/null

# 쿠키 사본 삭제 (★ 생략 금지)
rm -rf "$UD"
rm -f "$SP/chrome-cdp.pid" "$SP/chrome-cdp.log"
```

---

## 9. 주의사항

- **사용자가 요청한 작업만.** 사용자 소유 세션을 빌리는 것이므로, 지시받은 범위
  밖의 페이지를 돌아다니거나 다른 데이터를 읽지 않는다.
- **쿠키·토큰을 절대 외부로 내보내지 않는다.** 로그·커밋·스크린샷·응답 요약
  어디에도 쿠키 원문이나 세션 토큰이 남지 않게 한다. 스크린샷을 찍기 전에
  화면에 토큰이 노출돼 있지 않은지 확인한다.
- **금지 동작**: 결제 수단·비밀번호·주민번호/여권 등 신원 정보 입력, 계정 생성,
  데이터 영구 삭제, 보안 설정 변경. 이런 건 사용자에게 직접 하시라고 안내한다.
- **되돌리기 어려운 액션은 확인받고.** 게시(publish)·제출(submit)·전송(send)처럼
  외부에 나가는 버튼은 실행 전에 사용자 승인을 받는다.
- **쓰기 전 읽기.** 편집하기 전에 현재 상태를 먼저 조회해서 무엇이 바뀌는지
  파악하고, 가능하면 원래 값을 기록해 둔다.

---

## 10. 한 장 요약

```bash
# 0) 판정                         → 공식 API로 되나? 구글인가?(→ 5-6 API 경로) 아니면 아래로
# 1) 세션 있는 프로필 찾기        → 계정 특정은 2-1b(Local State user_name), 세션은 2-2 쿠키 스캔
# 2) 최소 사본                    → Local State + Profile N/{Preferences,Cookies,Network/Cookies}
# 3) 헤드리스 실행                → --user-data-dir=사본 --profile-directory="Profile N"
#                                   --headless=new --remote-debugging-port=9223
# 4) 연결                         → websocket.create_connection(..., suppress_origin=True)
# 5) 로그인 확인                  → location.href 가 signin 으로 튕기는지 (전부 "Signed out"이면 DBSC)
# 6) 페이지 컨텍스트에서 fetch    → Runtime.evaluate(awaitPromise=True, returnByValue=True)
# 7) 정리                         → kill + rm -rf 사본
```

의존성: `pip install websocket-client` (그 외 표준 라이브러리만 사용)

---

## 11. 부록 — 겪은 함정 빠른 조회표

| 증상 | 원인 | 해결 |
|---|---|---|
| WebSocket `403 Forbidden` | CDP Origin 검사 | `suppress_origin=True` |
| `/json/new` → `405` | GET으로 호출 | `method='PUT'` |
| 탭이 `about:blank`에서 안 움직임 | `/json/new?url=`이 무시됨 | 빈 탭 → `Page.navigate` + settle |
| 결과가 `{}` 또는 objectId | Promise 미해소 | `awaitPromise=True, returnByValue=True` |
| 계정 목록 뜨는데 전부 "Signed out" | **구글 DBSC** | 브라우저 포기 → 공식 API |
| 계정이 아예 안 뜸 | 쿠키 복호화 실패 | 사본 파일 4종 다 복사했는지 확인 |
| 방금 로그인했는데 사본에 세션 없음 | 크롬이 아직 flush 안 함 | `creation_utc` 확인 후 1~2분 뒤 재시도 |
| 구글 API `403 quota project` | ADC 쿼터 프로젝트 미지정 | `x-goog-user-project` 헤더 |
| `print-access-token`이 빈 값 | 리프레시 토큰 만료 | 재로그인 (권한 문제로 오판 금지) |
| 이전 프로필 세션이 보임 | 죽이지 않은 인스턴스에 붙음 | 포트 분리 + `pkill` 후 재실행 |
