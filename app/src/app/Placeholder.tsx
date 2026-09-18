import { useState } from 'react';
import { SUPABASE_HOSTS } from '@/services/supabase/hosts';
import { getTheme, resolvedTheme, setTheme, type ThemeChoice } from '@/services/theme';

const TITLES: Record<string, string> = {
  cabinet: 'Кабинет кандидата',
  hr: 'HR-панель',
  apply: 'Анкеты',
};

const CHOICES: ThemeChoice[] = ['system', 'light', 'dark'];
const CHOICE_LABEL: Record<ThemeChoice, string> = {
  system: 'Как в системе',
  light: 'Светлая',
  dark: 'Тёмная',
};

/**
 * Временная заглушка. Её задача — подтвердить, что точка входа собралась,
 * конфигурация подхватилась и обе темы применяются. Удаляется, как только
 * появится первый настоящий экран.
 */
export function Placeholder({ entry }: { entry: string }) {
  const [choice, setChoice] = useState<ThemeChoice>(getTheme);

  const pick = (c: ThemeChoice) => {
    setTheme(c);
    setChoice(c);
  };

  return (
    <main style={{ maxWidth: 620, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 6px' }}>
        {TITLES[entry] ?? entry}
      </h1>
      <p style={{ color: 'var(--text-muted)', margin: '0 0 28px' }}>
        Каркас новой платформы. Экраны ещё не перенесены.
      </p>

      <section
        style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
          padding: '22px 24px',
          marginBottom: 18,
        }}
      >
        <h2 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 14px' }}>Проверка сборки</h2>
        <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px' }}>
          <dt style={{ color: 'var(--text-muted)' }}>Точка входа</dt>
          <dd style={{ margin: 0, fontWeight: 700 }}>{entry}</dd>
          <dt style={{ color: 'var(--text-muted)' }}>Окружение</dt>
          <dd style={{ margin: 0, fontWeight: 700 }}>{import.meta.env.VITE_APP_ENV ?? 'не задано'}</dd>
          <dt style={{ color: 'var(--text-muted)' }}>Хостов в цепочке</dt>
          <dd style={{ margin: 0, fontWeight: 700 }}>{SUPABASE_HOSTS.length}</dd>
          <dt style={{ color: 'var(--text-muted)' }}>Тема сейчас</dt>
          <dd style={{ margin: 0, fontWeight: 700 }}>{resolvedTheme()}</dd>
        </dl>
      </section>

      <section
        style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
          padding: '22px 24px',
        }}
      >
        <h2 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 6px' }}>Тема</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 14px' }}>
          Переключатель здесь только для проверки, что обе темы живые.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {CHOICES.map((c) => (
            <button
              key={c}
              onClick={() => pick(c)}
              style={{
                font: 'inherit',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '9px 16px',
                borderRadius: 'var(--radius-control)',
                border: c === choice ? '1px solid transparent' : '1px solid var(--line-control)',
                background: c === choice ? 'var(--accent-action-bg)' : 'var(--surface-card)',
                color: c === choice ? 'var(--accent-action-text)' : 'var(--text-strong)',
              }}
            >
              {CHOICE_LABEL[c]}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Chip bg="--state-positive-bg" fg="--state-positive-text" text="Работает" />
          <Chip bg="--state-warning-bg" fg="--state-warning-text" text="Ждём ответа" />
          <Chip bg="--state-attention-bg" fg="--state-attention-text" text="Собеседование" />
          <Chip bg="--state-danger-bg" fg="--state-danger-text" text="Отказ" />
        </div>
      </section>

      <p style={{ color: 'var(--text-faint)', fontSize: 13, marginTop: 24 }}>
        Боевая версия продолжает работать из корня репозитория, снимок — в legacy/.
      </p>
    </main>
  );
}

function Chip({ bg, fg, text }: { bg: string; fg: string; text: string }) {
  return (
    <span
      style={{
        background: `var(${bg})`,
        color: `var(${fg})`,
        borderRadius: 'var(--radius-pill)',
        padding: '5px 13px',
        fontSize: 13,
        fontWeight: 800,
      }}
    >
      {text}
    </span>
  );
}
