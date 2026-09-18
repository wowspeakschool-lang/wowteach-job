import { createClient } from '@supabase/supabase-js';
import { failoverFetch } from './failoverFetch';
import { isWowteachDomain, sharedCookieStorage } from './cookieStorage';
import { SUPABASE_KEY, SUPABASE_URL } from './hosts';

// Клиент HR-панели. Вне .wowteach.ru (локальная разработка, превью) общего
// cookie быть не может — там обычное хранилище supabase-js, как в legacy.
export const sbHr = isWowteachDomain()
  ? createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { storage: sharedCookieStorage },
      global: { fetch: failoverFetch },
    })
  : createClient(SUPABASE_URL, SUPABASE_KEY, { global: { fetch: failoverFetch } });
