import { defineConfig } from 'vite';

export default defineConfig({
  // v6.0 戰略：僅負責主程式打包。
  // 靜態頁面已移至 /public/，由 Tailwind CLI 獨立處理，嚴禁在此處註冊。
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      }
    }
  }
});