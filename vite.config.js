import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: './',
  plugins: [
    preact({
      prerender: {
        enabled: true,
        renderTarget: '#app',
        prerenderScript: resolve(__dirname, 'src/prerender.jsx'),
      },
    }),
  ],
})
