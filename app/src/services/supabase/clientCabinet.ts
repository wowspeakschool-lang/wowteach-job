import { createClient } from '@supabase/supabase-js';
import { failoverFetch } from './failoverFetch';
import { SUPABASE_KEY, SUPABASE_URL } from './hosts';

// Кабинет кандидата — localStorage по умолчанию, НЕ общий cookie.
// Так вход кандидата не перетирает сессии персонала на других поддоменах.
export const sbCabinet = createClient(SUPABASE_URL, SUPABASE_KEY, {
  global: { fetch: failoverFetch },
});
