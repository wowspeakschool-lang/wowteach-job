// Вся работа с московским временем — здесь. Правило простое:
//  - ПОКАЗЫВАЕМ через Intl с timeZone: 'Europe/Moscow';
//  - СОБИРАЕМ время слота литеральным офсетом '+03:00'.
// Смешивать два подхода нельзя: слоты уезжают на часы. Так сделано в legacy,
// так же оставляем.
export const MSK = { timeZone: 'Europe/Moscow' } as const;

export const mskDate = (d: string | Date): string =>
  new Date(d).toLocaleDateString('ru-RU', { ...MSK, weekday: 'short', day: 'numeric', month: 'long' });

export const mskTime = (d: string | Date): string =>
  new Date(d).toLocaleTimeString('ru-RU', { ...MSK, hour: '2-digit', minute: '2-digit' });

export const mskShort = (d: string | Date): string =>
  new Date(d).toLocaleDateString('ru-RU', { ...MSK, weekday: 'short', day: 'numeric', month: 'short' }) +
  ', ' +
  mskTime(d) +
  ' МСК';

/** Ключ дня в МСК — для группировки слотов по дням. */
export const mskDayKey = (d: string | Date): string =>
  new Date(d).toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' });

/** Подпись «у вас: HH:MM», если локальное время читателя отличается от МСК. */
export function localNote(d: string | Date): string {
  const local = new Date(d).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  return local !== mskTime(d) ? ` · у вас: ${local}` : '';
}

/** Дата и время слота в МСК в виде, пригодном для <input type=date|time>. */
export function mskParts(iso: string): { date: string; time: string } {
  const p = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso));
  const [date, time] = p.split(' ');
  return { date: date ?? '', time: (time ?? '').slice(0, 5) };
}

/** '2026-09-18' + '09:00' (МСК) → ISO. Офсет литеральный, как в legacy. */
export const mskToISO = (dateStr: string, timeStr: string): string =>
  new Date(`${dateStr}T${timeStr}:00+03:00`).toISOString();
