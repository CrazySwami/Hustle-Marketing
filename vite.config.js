import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  define: {
    // Expose AI Gateway API key to the client
    // Single key provides access to all AI providers via Vercel AI Gateway
    'process.env.AI_GATEWAY_API_KEY': JSON.stringify(process.env.VITE_AI_GATEWAY_API_KEY),
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
