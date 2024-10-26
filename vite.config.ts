import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/',
  test: {
    globals: true,
    environment: "jsdom",
  },
  server: {
    port: 1234
  },
  plugins: [
    VitePWA({
      registerType: 'prompt',
      // add this to cache all the imports
      workbox: {
        globPatterns: ["**/*"],
      },
      // add this to cache all the
      // static assets in the public folder
      includeAssets: [
        "**/*",
      ],
      manifest: {
        name: 'my-maze-mazer',
        short_name: 'mazer',
        description: 'small webapp that lets you solve random mazes for fun',
        theme_color: '#EDF1E6',
        scope: '/my-maze-mazer/',
        start_url: '/my-maze-mazer/',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})