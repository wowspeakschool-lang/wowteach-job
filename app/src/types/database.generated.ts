// Заглушка. Реальные типы генерируются из базы и коммитятся сюда:
//   supabase gen types typescript --project-id vtcxghsqymwkyiogpndf > src/types/database.generated.ts
// До генерации клиенты типизированы как any-совместимые — это осознанно,
// чтобы каркас собирался до того, как подключим CLI.
export type Database = Record<string, unknown>;
