// Edge Function (Deno runtime): só roda em /produto/:id (ver `config.path` abaixo).
// O site é uma SPA sem SSR — PaginaMeta.tsx seta <title>/OG em runtime, então bots que não executam
// JS (WhatsApp, Facebook, Twitter/X, Telegram, LinkedIn, Slack) só veem o index.html estático e nunca
// as meta tags do produto. Esta function detecta esses bots pelo User-Agent e devolve um HTML mínimo
// com as meta tags corretas. Usuário real e Googlebot (que executa JS) passam direto pra SPA normal.
import produtosData from '../../src/data/produtos.json' with { type: 'json' }

const REGEX_BOT =
  /facebookexternalhit|Facebot|Twitterbot|WhatsApp|TelegramBot|LinkedInBot|Slackbot|Discordbot|Pinterest|redditbot|SkypeUriPreview|vkShare|Iframely/i

const NOME_SITE = 'Eduáh Acessórios'
const IMAGEM_PADRAO = '/images/produtos/nalaura.jpg'

function escaparHtml(texto) {
  return texto.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

export default async (request, context) => {
  const userAgent = request.headers.get('user-agent') ?? ''
  if (!REGEX_BOT.test(userAgent)) return context.next()

  const id = context.params.id
  const produto = produtosData.produtos.find((p) => p.id === id)
  if (!produto) return context.next()

  const url = new URL(request.url)
  const titulo = `${produto.nome} | ${NOME_SITE}`
  const descricao = produto.descricao || `${produto.nome}. Veja os detalhes e adicione ao carrinho.`
  const imagem = new URL(produto.imagem || IMAGEM_PADRAO, url.origin).toString()

  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>${escaparHtml(titulo)}</title>
    <meta name="description" content="${escaparHtml(descricao)}" />
    <meta property="og:type" content="product" />
    <meta property="og:title" content="${escaparHtml(titulo)}" />
    <meta property="og:description" content="${escaparHtml(descricao)}" />
    <meta property="og:image" content="${escaparHtml(imagem)}" />
    <meta property="og:url" content="${escaparHtml(url.toString())}" />
    <meta property="og:site_name" content="${escaparHtml(NOME_SITE)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escaparHtml(titulo)}" />
    <meta name="twitter:description" content="${escaparHtml(descricao)}" />
    <meta name="twitter:image" content="${escaparHtml(imagem)}" />
  </head>
  <body></body>
</html>
`

  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } })
}

export const config = { path: '/produto/:id' }
