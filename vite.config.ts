/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Preload dos woff2 variáveis (subset latin) que pintam o LCP (H1 em Geist) e os
 * números em Geist Mono. Os arquivos ganham hash no build, então a tag é injetada
 * a partir do bundle final em vez de escrita à mão no index.html.
 */
function preloadFonts(): Plugin {
  const wanted = [/geist-latin-wght-normal-[\w-]+\.woff2$/, /geist-mono-latin-wght-normal-[\w-]+\.woff2$/]
  return {
    name: 'clinicflow:preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        if (!ctx.bundle) return
        const files = Object.keys(ctx.bundle).filter((file) => wanted.some((re) => re.test(file)))
        return files.map((file) => ({
          tag: 'link',
          attrs: { rel: 'preload', href: `/${file}`, as: 'font', type: 'font/woff2', crossorigin: '' },
          injectTo: 'head-prepend' as const,
        }))
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadFonts()],
  build: {
    target: 'es2022',
    cssMinify: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
