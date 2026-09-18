import { SB_PROXY_TIMEOUT_MS, SUPABASE_HOSTS, SUPABASE_PROXY } from './hosts';

// Перенос из legacy/hr.html и legacy/index.html БЕЗ изменения поведения.
// Ключевое правило, которое нельзя потерять: повторяем только безопасное —
// чтение и авторизацию. Запись не переотправляем, иначе при таймауте уже
// после реального сохранения получили бы дубль записи.
let hostIdx = 0;

function swapHost(url: string): string {
  return url.startsWith(SUPABASE_PROXY) ? SUPABASE_HOSTS[hostIdx] + url.slice(SUPABASE_PROXY.length) : url;
}

function nextHost(reason: string): boolean {
  if (hostIdx >= SUPABASE_HOSTS.length - 1) return false;
  hostIdx++;
  console.warn('[supabase] переключаюсь на ' + SUPABASE_HOSTS[hostIdx] + ':', reason);
  return true;
}

/** Текущий хост — для диагностики и тестов. */
export function currentHost(): string {
  return SUPABASE_HOSTS[hostIdx]!;
}

/** Сброс цепочки — только для тестов. */
export function resetHostChain(): void {
  hostIdx = 0;
}

export async function failoverFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const urlStr =
    typeof input === 'string' ? input : input instanceof Request ? input.url : String(input);
  const method = (init.method || 'GET').toUpperCase();
  const canRetry = method === 'GET' || method === 'HEAD' || urlStr.includes('/auth/v1/');

  for (;;) {
    const target = swapHost(urlStr);
    const isLast = hostIdx >= SUPABASE_HOSTS.length - 1;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), SB_PROXY_TIMEOUT_MS);
    const onAbort = () => ctrl.abort();
    if (init.signal) init.signal.addEventListener('abort', onAbort, { once: true });
    try {
      const res = await fetch(target, { ...init, signal: ctrl.signal });
      clearTimeout(timer);
      if (!isLast && res.status >= 502 && res.status <= 504) {
        if (nextHost('HTTP ' + res.status) && canRetry) continue;
      }
      return res;
    } catch (e) {
      clearTimeout(timer);
      if (init.signal?.aborted) throw e;
      if (isLast) throw e;
      const err = e as Error;
      const moved = nextHost(err.name === 'AbortError' ? 'таймаут' : err.message || String(e));
      if (moved && canRetry) continue;
      throw e;
    } finally {
      if (init.signal) init.signal.removeEventListener('abort', onAbort);
    }
  }
}
