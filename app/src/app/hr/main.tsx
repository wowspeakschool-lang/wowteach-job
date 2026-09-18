import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Placeholder } from '@/app/Placeholder';
import '@/styles/global.css';
import '@/styles/legacy-hr.css';

// Phase 0.5: дизайн-система подключена, экранов ещё нет.
const el = document.getElementById('root');
if (!el) throw new Error('#root не найден');

createRoot(el).render(
  <StrictMode>
    <Placeholder entry="hr" />
  </StrictMode>,
);
