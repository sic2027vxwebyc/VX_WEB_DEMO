import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/VX_WEB_DEMO/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'screen.png'],
      manifest: {
        name: 'VX Web Demo',
        short_name: 'VX Web',
        description: 'VX Web Demo PWA',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'screen.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'screen.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
