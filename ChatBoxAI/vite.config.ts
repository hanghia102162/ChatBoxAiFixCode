import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // QWEN_* has no VITE_ prefix, so it is only available to Vite's server.
  const env = loadEnv(mode, process.cwd(), '')
  const hasQwenConfig = Boolean(env.QWEN_API_URL && env.QWEN_API_KEY)

  return {
    plugins: [vue(), vueDevTools(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      // The UI can still start without an API. Add the two QWEN_* values to
      // .env.local to enable this proxy.
      proxy: hasQwenConfig
        ? {
            '/api': {
              target: env.QWEN_API_URL,
              changeOrigin: true,
              headers: {
                'X-API-Key': env.QWEN_API_KEY,
                'ngrok-skip-browser-warning': '1',
              },
              proxyTimeout: 300_000,
            },
          }
        : undefined,
    },
  }
})
