# Eduáh Acessórios (vitrine online)

Vitrine de joias e acessórios da Eduáh Acessórios. O cliente navega pelo catálogo, monta um carrinho e envia o pedido por WhatsApp: **não há checkout, pagamento nem backend próprio**. O carrinho fica só no `localStorage` do aparelho.

Stack: React 19, TypeScript, Vite 8, Tailwind CSS v4 e React Router. Deploy no Netlify.

## Como rodar

Precisa de Node `^20.19.0` ou `>=22.12.0`.

```bash
npm install
npm run dev       # servidor de desenvolvimento
npm run build     # tsc -b + build de produção em dist/
npm run preview   # serve o build local (útil para testar rotas diretas)
npm run lint      # ESLint
npx tsc --noEmit  # checagem de tipos
```

Não há testes automatizados: a verificação é `tsc`, lint, build e conferência no navegador.

## Rotas

`/` Home · `/catalogo` · `/busca?q=` · `/produto/:id` · `/carrinho` · `/pedido` (só depois de enviar o pedido) · `/sobre` · `/privacidade` · `/termos` · `*` (404).

`public/_redirects` (`/* /index.html 200`) é a única fonte dos redirects: sem ele as rotas do lado do cliente não abrem direto no Netlify. O `netlify.toml` define o build, o Node e os cabeçalhos de cache.

## Estrutura

```
src/
  pages/        uma página por rota
  components/   componentes reutilizáveis (ProductCard único, header, footer, menu, etc.)
  config/       site.ts (contatos, Sobre), legal.ts (dados dos textos legais), categorias.ts
  content/      texto das páginas de Privacidade e Termos
  context/      CartContext (estado do carrinho)
  data/         produtos.json, site-config.json, legal.json (editados pelo Decap CMS) + produtos/index.ts (tipagem)
  lib/          funções puras (catálogo, busca, carrinho e mensagem do WhatsApp, preço, datas)
  hooks/        useCart e hooks de breakpoint
  types/        tipos (Produto, Categoria)
public/         fontes locais (woff2), logo, favicon, robots.txt, _redirects
docs/           documentação, quadros do design (docs/design) e referências
```

O design vem dos quadros em `docs/design/` (mapa em `docs/reference/design-handoff.md`). O `CLAUDE.md` guarda as regras de trabalho do projeto.

## Onde ficam as pendências de conteúdo

Tudo é preenchido em arquivos de configuração; nenhum precisa de mudança em componentes.

- **`src/config/site.ts`**: número de WhatsApp (só dígitos, `55` + DDD + número; sem ele o envio do pedido fica desabilitado), Instagram, frase da marca (footer), texto da seção Sobre da Home e conteúdo da página `/sobre`.
- **`src/config/legal.ts`**: dados do responsável, CPF/CNPJ, e-mail, provedor de hospedagem, prazos, foro, política de trocas e datas de atualização. Enquanto vazios, aparecem entre colchetes, destacados, nas páginas `/privacidade` e `/termos`. Recomendada revisão jurídica antes de publicar.
- **`src/data/produtos.json`**: 24 produtos de **exemplo** (nomes, preços, descrições). A ordem do array é "mais recentes primeiro" — editável pelo painel `/admin` (coleção "Produtos").
- **Fotos**: os campos de imagem estão vazios e o site mostra placeholders nos tons da paleta.
- **Lançamento**: Remover o bloqueio de indexação (robots.txt e X-Robots-Tag) e conferir o robots.txt no ar.

## Painel Decap CMS (`/admin`)

Autenticação por GitHub OAuth, com uma Netlify Function própria do site (`netlify/functions/auth.js` e `callback.js`, sem dependência nova) — não usa Netlify Identity (descontinuada para sites novos). Fluxo editorial: cada edição salva no painel cria uma branch e um Pull Request no repositório, nunca publica direto em `main`. Só quem tem acesso de escrita ao repositório `jpofof/site-joias` consegue completar o login (é assim que o GitHub já garante).

Coleções: **Produtos** (`src/data/produtos.json`), **Configurações do site** (`src/data/site-config.json`) e **Dados legais** (`src/data/legal.json`, só os dados — o texto de `/privacidade` e `/termos` fica em `src/content/`, não é editável pelo painel).

**Configuração necessária no Netlify (painel, nunca no código):**
1. Criar um GitHub OAuth App (conta com acesso ao repositório): **Settings > Developer settings > OAuth Apps > New OAuth App**.
   - Homepage URL: o endereço do site publicado.
   - Authorization callback URL: `https://SEU-SITE/.netlify/functions/callback`.
2. No Netlify, em **Site configuration > Environment variables**, criar:
   - `GITHUB_OAUTH_CLIENT_ID` — Client ID do OAuth App.
   - `GITHUB_OAUTH_CLIENT_SECRET` — Client secret do OAuth App (gerado na mesma tela).
3. Em `public/admin/config.yml`, atualizar `base_url` para o mesmo endereço usado acima (hoje está com um placeholder marcado "TROCAR").
4. Fazer um novo deploy depois de criar as variáveis (elas só valem em builds/functions criados depois).

**Como testar o login antes da conta da cliente existir:** adicione sua própria conta do GitHub como colaboradora do repositório (**Settings > Collaborators**) e entre em `/admin` com ela. Quando a conta da Duda for criada, repita o convite para ela e remova a sua, se não for mais precisar.

## Ainda não implementado

- Analytics, pixel e banner de cookies: decidido não ter. Só há armazenamento essencial (o carrinho).
