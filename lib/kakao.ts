/**
 * 카카오톡 공유 (JavaScript SDK 2.8.2)
 *
 * navigator.share가 막히는 환경(카카오톡 인앱 브라우저 등)에서도 동작하므로,
 * 국내 트래픽의 공유 전환을 크게 끌어올린다.
 * JS 키는 NEXT_PUBLIC_KAKAO_JS_KEY로 주입하고, 카카오 콘솔에 도메인이 등록돼 있어야 한다.
 */

const SDK_SRC = "https://t1.kakaocdn.net/kakao_js_sdk/2.8.2/kakao.min.js";

type KakaoShareLink = { webUrl?: string; mobileWebUrl?: string };
type KakaoSDK = {
  isInitialized: () => boolean;
  init: (key: string) => void;
  Share: {
    sendDefault: (settings: {
      objectType: "feed";
      content: {
        title: string;
        description?: string;
        imageUrl: string;
        link: KakaoShareLink;
      };
      buttons?: { title: string; link: KakaoShareLink }[];
    }) => void;
  };
};

declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

const JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

/** JS 키가 설정돼 있는지 — 버튼 노출 여부 판단용 */
export function isKakaoConfigured(): boolean {
  return Boolean(JS_KEY);
}

let loadPromise: Promise<KakaoSDK | null> | null = null;

/** SDK를 1회만 주입하고 init까지 마친 Kakao 객체를 돌려준다. 실패 시 null. */
function loadKakao(): Promise<KakaoSDK | null> {
  if (typeof window === "undefined" || !JS_KEY) return Promise.resolve(null);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<KakaoSDK | null>((resolve) => {
    const ready = () => {
      const sdk = window.Kakao;
      if (!sdk) return resolve(null);
      if (!sdk.isInitialized()) sdk.init(JS_KEY);
      resolve(sdk);
    };

    if (window.Kakao) return ready();

    const script = document.createElement("script");
    script.src = SDK_SRC;
    script.async = true;
    script.onload = ready;
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });

  return loadPromise;
}

/**
 * 카카오톡 피드 공유. 성공하면 true.
 * SDK 로드 실패·미설정이면 false를 돌려주므로 호출부에서 기존 공유로 폴백한다.
 */
export async function shareKakao(opts: {
  title: string;
  description?: string;
  imageUrl: string;
  url: string;
}): Promise<boolean> {
  const sdk = await loadKakao();
  if (!sdk) return false;

  const link: KakaoShareLink = { webUrl: opts.url, mobileWebUrl: opts.url };
  try {
    sdk.Share.sendDefault({
      objectType: "feed",
      content: {
        title: opts.title,
        description: opts.description,
        imageUrl: opts.imageUrl,
        link,
      },
      buttons: [{ title: "그때로 가기", link }],
    });
    return true;
  } catch {
    return false;
  }
}
