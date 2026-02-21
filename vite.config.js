import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        privacy_leak: 'ai-privacy-zero-leak.html',
        chunking: 'paragraph-aware-chunking.html',
        costs: 'optimize-ai-token-costs.html',
        efficiency: 'ai-workflow-efficiency.html',
        context_logic: 'lost-in-the-middle-ai.html',
        about: 'about.html',
        privacy_policy: 'privacy.html'
      }
    }
  }
});