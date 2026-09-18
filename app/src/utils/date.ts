// Внимание: в legacy fmtDate в панели и в кабинете РАЗНЫЕ. Не сводить в одну
// функцию «чтобы красивее» — это разные форматы в разных местах интерфейса.

/** Панель (legacy/hr.html): «18 сент., 12:56». */
export const fmtDateTime = (d: string | Date): string =>
  new Date(d).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

/** Панель (legacy/hr.html): «18 сент.». */
export const fmtDay = (d: string | Date): string =>
  new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

/** Кабинет (legacy/index.html): «18 сентября 2026 г.». */
export const fmtDateLong = (d: string | Date): string =>
  new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
