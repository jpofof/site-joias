import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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
  plugins: [react(), tailwindcss(), cssNoHtml()],
})
