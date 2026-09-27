// Netlify Function (runtime v2, sem dependências: usa fetch nativo do Node 22).
// Recebe o "code" do GitHub (redirecionado por auth.js), troca por um token de acesso e devolve
// uma página que entrega o token ao Decap CMS, pelo protocolo de handshake por postMessage que o
// Decap espera de um provedor de OAuth externo: a janela popup avisa "authorizing:github", espera
// a janela principal responder (ela sabe a origem certa a usar) e só então manda o token.
export default async (req) => {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return new Response('GITHUB_OAUTH_CLIENT_ID / GITHUB_OAUTH_CLIENT_SECRET não configurados no Netlify.', {
      status: 500,
    })
  }

  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  if (!code) {
    return new Response('Código de autorização ausente.', { status: 400 })
  }

  const respostaToken = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  })
  const dadosToken = await respostaToken.json()

  if (dadosToken.error || !dadosToken.access_token) {
    const motivo = dadosToken.error_description || dadosToken.error || 'token não recebido'
    return new Response(`Falha na autenticação: ${motivo}`, { status: 400 })
  }

  // JSON.stringify duplo: a primeira vez monta a carga {token, provider}; a segunda escapa essa
  // string para virar um literal JS seguro dentro do <script> (aspas, barras etc.).
  const carga = JSON.stringify(JSON.stringify({ token: dadosToken.access_token, provider: 'github' }))

  const html = `<!doctype html>
<html lang="pt-BR">
  <body>
    <p>Autenticando…</p>
    <script>
      (function () {
        function receberMensagem(e) {
          window.opener.postMessage('authorization:github:success:' + ${carga}, e.origin)
          window.removeEventListener('message', receberMensagem, false)
        }
        window.addEventListener('message', receberMensagem, false)
        window.opener.postMessage('authorizing:github', '*')
      })()
    </script>
  </body>
</html>`

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
