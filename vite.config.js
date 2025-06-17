import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['logo.svg'],
      manifest: {
        name: 'My Awesome App',
        short_name: 'MyApp',
        description: 'My Awesome App description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'logo.svg',
            sizes: '192x192',
            type: 'image/svg'
          },
          {
            src: 'logo.svg',
            sizes: '512x512',
            type: 'image/svg'
          }
        ]
      }
      // devOptions: {
      //   enabled: false
      // }
    })
  ],
})
