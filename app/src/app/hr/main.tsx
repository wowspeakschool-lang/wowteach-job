import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Placeholder } from '@/app/Placeholder';

// Phase 0: только каркас. Экранов ещё нет — они появятся после того,
// как будет зафиксирована дизайн-система.
const el = document.getElementById('root');
if (!el) throw new Error('#root не найден');

createRoot(el).render(
  <StrictMode>
    <Placeholder entry="hr" />
  </StrictMode>,
);
