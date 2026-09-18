// Сессия персонала живёт в cookie на домене .wowteach.ru, а НЕ в localStorage:
// иначе переход между поддоменами платформы разлогинивает человека.
// Кабинет кандидата намеренно использует обычный localStorage — его вход
// не должен перетирать сессии персонала. Не объединять эти два хранилища.
const COOKIE_DOMAIN = '.wowteach.ru';

// Префикс нужен, чтобы staging не перетирал боевую сессию на том же домене.
// Пусто в проде — тогда ключи совпадают с текущими, и люди не разлогинятся.
const PREFIX = import.meta.env.VITE_AUTH_STORAGE_PREFIX ?? '';

const key = (k: string) => PREFIX + k;

export const sharedCookieStorage = {
  getItem: (k: string): string | null => {
    const escaped = key(k).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]+)'));
    return m?.[1] ? decodeURIComponent(m[1]) : null;
  },
  setItem: (k: string, value: string): void => {
    document.cookie = `${key(k)}=${encodeURIComponent(value)}; domain=${COOKIE_DOMAIN}; path=/; max-age=31536000; secure; samesite=lax`;
  },
  removeItem: (k: string): void => {
    document.cookie = `${key(k)}=; domain=${COOKIE_DOMAIN}; path=/; max-age=0; secure; samesite=lax`;
  },
};

export const isWowteachDomain = (): boolean => location.hostname.endsWith(COOKIE_DOMAIN);
