// Captura do build servido pelo `vite preview` com o Chromium do Playwright já
// instalado na máquina (playwright-core não baixa navegador).
//
//   node scripts/capture.mjs og               -> public/og.png (1200×630)
//   node scripts/capture.mjs shots [pasta]    -> página inteira em 390/768/1440
//
// Rode `pnpm build` antes. Para `og`, rode o build de novo depois para copiar
// o og.png para dist/.
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { preview } from 'vite'
import { chromium } from 'playwright-core'

const [modo = 'shots', destino = 'screenshots'] = process.argv.slice(2)

const server = await preview({ preview: { port: 4317, strictPort: false, open: false }, logLevel: 'silent' })
const base = server.resolvedUrls?.local[0] ?? 'http://localhost:4317/'
const browser = await chromium.launch()

async function abrir(viewport, extra = {}) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, colorScheme: 'dark', ...extra })
  const page = await context.newPage()
  const erros = []
  page.on('pageerror', (e) => erros.push(e.message))
  page.on('console', (m) => m.type() === 'error' && erros.push(m.text()))
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  // Espera a entrada do hero e o toast terminarem (os pulse dots são infinitos).
  await page.waitForFunction(
    () =>
      document
        .getAnimations()
        .filter((a) => !String(a.animationName).startsWith('pulse'))
        .every((a) => a.playState === 'finished'),
    null,
    { timeout: 15000 },
  )
  await page.waitForTimeout(300)
  return { context, page, erros }
}

try {
  if (modo === 'og') {
    // 1440×756 CSS reduzido para 1200×630 px. Só para a captura: sem header,
    // sub e CTAs, headline menor, para caber headline + cockpit no card social.
    const { context, page } = await abrir({ width: 1440, height: 756 }, { deviceScaleFactor: 1200 / 1440 })
    await page.addStyleTag({
      content: `
        header, #topo .hero-in-text > div:last-child, #topo figcaption { display: none !important; }
        #topo { padding-top: 56px !important; }
        #topo h1 { font-size: 58px !important; max-width: 15em !important; }
        #topo .hero-in-text + div { margin-top: 44px !important; }
      `,
    })
    await page.waitForTimeout(200)
    const saida = resolve('public/og.png')
    await page.screenshot({ path: saida })
    console.log(`og: ${saida}`)
    await context.close()
  } else {
    const pasta = resolve(destino)
    await mkdir(pasta, { recursive: true })
    for (const width of [390, 768, 1440]) {
      for (const reduzido of [false, true]) {
        if (reduzido && width !== 390) continue
        const { context, page, erros } = await abrir(
          { width, height: 900 },
          reduzido ? { reducedMotion: 'reduce' } : {},
        )
        const medidas = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          altura: document.documentElement.scrollHeight,
          largos: [...document.querySelectorAll('body *')]
            .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
            .filter((el) => !el.closest('[class*="hero-glow"]'))
            .slice(0, 5)
            .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`),
        }))
        const nome = `landing-${width}${reduzido ? '-reduced' : ''}.png`
        await page.screenshot({ path: resolve(pasta, nome), fullPage: true })
        await page.screenshot({ path: resolve(pasta, `hero-${width}${reduzido ? '-reduced' : ''}.png`) })
        const rolagem = medidas.scrollWidth > medidas.clientWidth ? 'ROLAGEM HORIZONTAL' : 'sem rolagem horizontal'
        console.log(`${nome}: ${rolagem} (${medidas.scrollWidth}/${medidas.clientWidth}), altura ${medidas.altura}px`)
        if (medidas.largos.length) console.log(`  excedem a viewport: ${medidas.largos.join(', ')}`)
        if (erros.length) console.log(`  erros no console: ${erros.join(' | ')}`)
        await context.close()
      }
    }
  }
} finally {
  await browser.close()
  await new Promise((ok) => server.httpServer.close(ok))
}
