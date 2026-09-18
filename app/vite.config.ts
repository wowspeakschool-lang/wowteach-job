import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Три точки входа вместо одного SPA. Так сделано не ради красоты:
//  - у панели и кабинета РАЗНОЕ хранилище сессии (cookie на .wowteach.ru
//    против localStorage), сводить их в один бандл нельзя;
//  - анкеты открывает аноним, им незачем тащить код панели;
//  - имена файлов совпадают с боевыми адресами job.wowteach.ru, поэтому
//    переключать приложения можно по одному.
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        cabinet: resolve(__dirname, 'index.html'),
        hr: resolve(__dirname, 'hr.html'),
        apply: resolve(__dirname, 'apply.html'),
      },
    },
  },
});
