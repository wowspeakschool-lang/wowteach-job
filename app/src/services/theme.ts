/**
 * Тема: системная по умолчанию, ручной выбор перекрывает.
 *
 * Ключ и логика продублированы синхронным скриптом в <head> каждой точки
 * входа. Дублирование намеренное: модуль исполнится только после разбора
 * документа, то есть человек с тёмной темой успеет увидеть вспышку белого.
 * Менять ключ — значит менять его и там, иначе выбор перестанет применяться
 * до первой отрисовки.
 */
export const THEME_KEY = 'wowspeak:theme';

export type ThemeChoice = 'light' | 'dark' | 'system';

export function getTheme(): ThemeChoice {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    // приватное окно или заблокированные данные сайта
    return 'system';
  }
}

export function setTheme(choice: ThemeChoice): void {
  const root = document.documentElement;
  if (choice === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', choice);
  try {
    if (choice === 'system') localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, choice);
  } catch {
    // не смогли запомнить — тема всё равно применена на этой странице
  }
}

/** Что показано прямо сейчас, с учётом системной настройки. */
export function resolvedTheme(): 'light' | 'dark' {
  const choice = getTheme();
  if (choice !== 'system') return choice;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
