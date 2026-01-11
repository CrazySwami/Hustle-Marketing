import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  define: {
    // Expose environment variables to the client
    'process.env.ANTHROPIC_API_KEY': JSON.stringify(process.env.VITE_ANTHROPIC_API_KEY),
    'process.env.OPENAI_API_KEY': JSON.stringify(process.env.VITE_OPENAI_API_KEY),
    'process.env.GOOGLE_GENERATIVE_AI_API_KEY': JSON.stringify(process.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY),
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
