// Значения, которые продублированы на сервере. Менять только парой с базой,
// иначе интерфейс покажет то, чего RPC не разрешит.

/** За сколько часов до встречи кандидат ещё может перенести её сам.
 *  Столько же ждут hr_cancel_booking и hr_free_slots. */
export const CANCEL_HOURS = 3;

/** Длительность слота по умолчанию (hr_slots.duration_min). */
export const SLOT_DEFAULT_MIN = 45;
export const SLOT_DURATIONS = [30, 45, 60, 90] as const;

/** Лимиты загрузки в анкетах (legacy/apply*.html). */
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024;
export const MAX_DOC_BYTES = 20 * 1024 * 1024;
/** Размер чанка TUS — 6 МБ стабильно проходит через Cloudflare. */
export const TUS_CHUNK_BYTES = 6 * 1024 * 1024;

/** Шаги онбординга, на которые подопечный записывается сам. */
export const BOOKABLE_STEPS = ['prep_meeting', 'final_meeting', 'mvu_meet1', 'mvu_exam'] as const;

/** Шаги, которые начинаются с чтения оффера. */
export const OFFER_STEPS = ['reread_offer', 'mvu_offer'] as const;

/** Часы в сетках расписания и календаря (МСК). */
export const GRID_HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as const;
