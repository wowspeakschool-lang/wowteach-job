// Три пути до базы: основной прокси, запасной у другого провайдера и прямое
// подключение. Если один недоступен, запросы сами уходят на следующий —
// править код при аварии не нужно. Порядок значим: первый хост считается
// «своим», именно его префикс подменяется в failoverFetch.
const PROD_HOSTS = [
  'https://api.wowteach.ru', // Timeweb
  'https://api2.wowteach.ru', // VDSina, запасной
  'https://vtcxghsqymwkyiogpndf.supabase.co', // напрямую
] as const;

function readHosts(): string[] {
  const raw = import.meta.env.VITE_SUPABASE_HOSTS;
  if (!raw) {
    console.warn('[supabase] VITE_SUPABASE_HOSTS не задан — беру боевую цепочку хостов');
    return [...PROD_HOSTS];
  }
  const list = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (!list.length) throw new Error('VITE_SUPABASE_HOSTS задан, но пуст');
  return list;
}

export const SUPABASE_HOSTS = readHosts();
export const SUPABASE_PROXY = SUPABASE_HOSTS[0]!;
export const SUPABASE_URL = SUPABASE_PROXY;

// Ключ публикуемый (sb_publishable_…): он по определению уезжает в браузер
// вместе с бандлом, как и сейчас в боевых html. Реальные ограничения — RLS.
export const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_KEY ?? 'sb_publishable_nZIl9kzPNhkd9Gbsm7aAgA_cAeY1s4x';

export const SB_PROXY_TIMEOUT_MS = 3000;
