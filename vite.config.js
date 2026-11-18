import { defineConfig, loadEnv } from 'vite';
import { validateClientConfig, securityMeta } from './scripts/security-policy.mjs';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const backend = validateClientConfig(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);
  return {
    base: '/poker/',
    server: { host: '127.0.0.1', port: 5175, strictPort: true },
    plugins: [{
      name: 'browser-security-policy',
      transformIndexHtml: { order: 'post', handler: html => securityMeta(html, backend, command === 'serve' ? 5175 : null) },
    }],
  };
});
