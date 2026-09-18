import { createClient } from '@supabase/supabase-js';
import { SUPABASE_KEY, SUPABASE_URL } from './hosts';

// Публичные анкеты. ВНИМАНИЕ: в боевых apply*.html цепочки запасных хостов
// нет — там жёстко api.wowteach.ru. То есть при аварии Timeweb панели
// продолжают работать, а приём анкет встаёт. Расхождение сохранено
// намеренно, чтобы новая версия совпадала со старой при сверке.
// Чинить — отдельной задачей, не внутри миграции.
export const sbPublic = createClient(SUPABASE_URL, SUPABASE_KEY);
