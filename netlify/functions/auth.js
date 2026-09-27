// Netlify Function (runtime v2, sem dependências: usa fetch/crypto nativos do Node 22).
// Início do login do Decap CMS: redireciona para a tela de autorização do GitHub.
// Variáveis de ambiente (configuradas no painel do Netlify, nunca no código):
// GITHUB_OAUTH_CLIENT_ID e GITHUB_OAUTH_CLIENT_SECRET (o secret só é usado em callback.js).
export default async (req) => {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID
  if (!clientId) {
    return new Response('GITHUB_OAUTH_CLIENT_ID não configurado no Netlify.', { status: 500 })
  }

  const url = new URL(req.url)
  const redirectUri = `${url.origin}/.netlify/functions/callback`

  const autorizar = new URL('https://github.com/login/oauth/authorize')
  autorizar.searchParams.set('client_id', clientId)
  autorizar.searchParams.set('redirect_uri', redirectUri)
  autorizar.searchParams.set('scope', 'repo,user')
  autorizar.searchParams.set('state', crypto.randomUUID())

  return Response.redirect(autorizar.toString(), 302)
}
