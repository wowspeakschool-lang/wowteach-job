import { SUPABASE_HOSTS } from '@/services/supabase/hosts';

const TITLES: Record<string, string> = {
  cabinet: 'Кабинет кандидата',
  hr: 'HR-панель',
  apply: 'Анкеты',
};

/** Временная заглушка Phase 0: подтверждает, что точка входа собралась
 *  и конфигурация подхватилась. Удаляется, как только появится первый экран. */
export function Placeholder({ entry }: { entry: string }) {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24, lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 20 }}>{TITLES[entry] ?? entry} — каркас</h1>
      <p>Точка входа <code>{entry}</code> собрана. Экраны ещё не перенесены.</p>
      <p>
        Окружение: <b>{import.meta.env.VITE_APP_ENV ?? 'не задано'}</b>
        <br />
        Хостов в цепочке: <b>{SUPABASE_HOSTS.length}</b>
      </p>
      <p style={{ color: '#666', fontSize: 14 }}>
        Боевая версия продолжает работать из корня репозитория, копия — в <code>legacy/</code>.
      </p>
    </main>
  );
}
