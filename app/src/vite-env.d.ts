/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_HOSTS?: string;
  readonly VITE_SUPABASE_KEY?: string;
  readonly VITE_AUTH_STORAGE_PREFIX?: string;
  readonly VITE_APP_ENV?: 'development' | 'staging' | 'production';
  readonly VITE_CABINET_REDIRECT_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
