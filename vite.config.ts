import { readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { SITE_URL } from './src/config/seo.js'
import type { Produto } from './src/types/produto.js'

// Rotas fixas do sitemap: sem /carrinho, /pedido nem 404 (já noindex). /catalogo e /busca entram sem
// query string (a página em si é indexável; os filtros não precisam de URL própria no sitemap).
const rotasFixas = ['/', '/catalogo', '/busca', '/sobre', '/privacidade', '/termos']

// Só no build: gera public/sitemap.xml (emitido em dist/) a partir do catálogo atual em produtos.json,
// pra sempre refletir os produtos que a cliente publicar pelo Decap CMS, sem exigir manter um arquivo
// estático em public/ sincronizado à mão.
function sitemap(): Plugin {
  return {
    name: 'sitemap',
    apply: 'build',
    generateBundle() {
      const url = new URL('./src/data/produtos.json', import.meta.url)
      const { produtos } = JSON.parse(readFileSync(url, 'utf-8')) as { produtos: Produto[] }
      const rotas = [...rotasFixas, ...produtos.map((p) => `/produto/${p.id}`)]
      const urls = rotas.map((rota) => `  <url><loc>${SITE_URL}${rota}</loc></url>`).join('\n')
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml })
    },
  }
}

// Só no build: embute o CSS no index.html e descarta o arquivo .css.
// Assim o CSS deixa de ser um pedido extra que bloqueia a renderização (o site tem um único CSS, de ~6,5 KiB comprimido).
function cssNoHtml(): Plugin {
  return {
    name: 'css-no-html',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = bundle['index.html']
      if (html?.type !== 'asset' || typeof html.source !== 'string') return
      let fonte = html.source
      for (const [nome, arquivo] of Object.entries(bundle)) {
        if (arquivo.type !== 'asset' || !nome.endsWith('.css') || typeof arquivo.source !== 'string') continue
        const link = new RegExp(`<link rel="stylesheet"[^>]*href="[^"]*${nome.split('/').pop()}"[^>]*>`)
        if (!link.test(fonte)) continue
        fonte = fonte.replace(link, () => `<style>${arquivo.source}</style>`)
        delete bundle[nome]
      }
      html.source = fonte
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), cssNoHtml(), sitemap()],
})
