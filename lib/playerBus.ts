/**
 * 페이지 내 오디오/영상 플레이어 단일 재생 코디네이터.
 * 어떤 플레이어가 재생을 시작하면 announcePlay(id)를 호출하고,
 * 다른 플레이어들은 onPlay 구독으로 이를 감지해 스스로 정지한다.
 */
type Listener = (id: string) => void;

const listeners = new Set<Listener>();

export function announcePlay(id: string) {
  listeners.forEach((l) => l(id));
}

export function onPlay(l: Listener): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
