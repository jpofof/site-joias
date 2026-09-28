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
  const state = crypto.randomUUID()

  const autorizar = new URL('https://github.com/login/oauth/authorize')
  autorizar.searchParams.set('client_id', clientId)
  autorizar.searchParams.set('redirect_uri', redirectUri)
  // "public_repo" (não "repo"): o repo é público, não precisa de acesso a repos privados.
  autorizar.searchParams.set('scope', 'public_repo,user')
  autorizar.searchParams.set('state', state)

  // O "state" só protege contra CSRF se for validado depois: guardado num cookie de curta duração
  // (10 min), restrito ao path do callback, pra callback.js comparar com o state devolvido pelo GitHub.
  return new Response(null, {
    status: 302,
    headers: {
      Location: autorizar.toString(),
      'Set-Cookie': `oauth_state=${state}; Path=/.netlify/functions/callback; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
    },
  })
}
