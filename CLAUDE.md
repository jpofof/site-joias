# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

# Projeto: Site de Joias (vitrine + painel Decap CMS)

## Contexto
Vitrine online de joias para uma cliente próxima. Sem checkout e sem pagamento: a cliente final monta um carrinho e é redirecionada ao WhatsApp da loja (link `wa.me` com a lista de itens). A dona do negócio edita o catálogo sozinha pelo painel Decap CMS. Documentação completa em `docs/documentacao-projeto-joias.md` — leia só a seção necessária para a tarefa, não o arquivo inteiro.

## Stack
- React + TypeScript + Vite
- Rotas: React Router (`react-router-dom`) — rotas: `/`, `/catalogo`, `/busca?q=`, `/produto/:id`, `/carrinho` (com estado vazio), `/pedido`, `/sobre`, `/privacidade`, `/termos`, `*` (404). Busca e Carrinho são páginas, não overlays. O único overlay é o Menu mobile.
- Netlify: `public/_redirects` com `/* /index.html 200` (obrigatório para rotas do lado do cliente funcionarem)
- Tailwind CSS v4 (`@tailwindcss/vite`; tema em `@theme` dentro de `src/index.css`; sem `tailwind.config.ts`)
- ESLint
- Carrinho: Context API + hook `useCart` + `localStorage` (sem biblioteca de estado). Guarda `{ id, quantidade }`.
- CMS: Decap CMS em `/admin` (implementado no bloco `feat/cms`). Autenticação: GitHub OAuth via Netlify Function própria do site (`netlify/functions/auth.js` e `callback.js`, sem dependência nova; não Netlify Identity, descontinuada para sites novos), com fluxo editorial (`publish_mode: editorial_workflow` — cada edição gera branch + Pull Request, nunca publica direto em `main`). Três coleções, cada uma um único arquivo JSON com `list`/`object` (não uma pasta por item, para preservar a ordem de cadastro sem campo extra): **Produtos** (`src/data/produtos.json`), **Configurações do site** (`src/data/site-config.json`) e **Dados legais** (`src/data/legal.json`, só os dados — o texto de `/privacidade` e `/termos` continua em `src/content/`, fora do CMS). `site.ts` e `legal.ts` importam esses JSONs e fazem merge com os padrões vazios (não `as T` direto), para um campo faltando no JSON cair no padrão em vez de `undefined` silencioso. Variáveis de ambiente do OAuth (`GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`) só no painel do Netlify — ver README.
- Deploy: Netlify. Versionamento: Git + GitHub

## Estrutura planejada
```
public/admin/ (config.yml, index.html)
public/_redirects
src/types/produto.ts
src/types/site-config.ts (campos de "Configurações do site": hero, footer)
src/pages/ (Home, Catalogo, Busca, Produto, Carrinho, Pedido, Sobre, Privacidade, Termos, NotFound)
src/components/ (SiteHeader, MenuMobile, Hero, CategoryTiles, DestaquesTeaser, ProductCard, ProductGrid, CategoryFilter, SiteFooter, ...)
src/config/legal.ts (dados pendentes da cliente para Privacidade/Termos)
src/config/site.ts (número de WhatsApp e demais constantes do site)
src/hooks/useCart.ts
src/context/CartContext.tsx
src/data/produtos.json, site-config.json, legal.json  (arquivos únicos editados pelo Decap; produtos/index.ts só reexporta o JSON tipado)
```
Um único `ProductCard` recebendo um `Produto` por props; nunca um componente por produto.
Fonte de verdade visual: `docs/design/*.dc.html` (ver `docs/reference/design-handoff.md`).

## Navegação, Busca e Modelo de Produto (substituído pelo design aprovado em `docs/design/`; o mega menu segue só como referência)
A arquitetura de navegação completa (mega menu, painel de busca elaborado, campos de ordenação) fica como referência em `docs/reference/arquitetura-navegacao-mega-menu.md`. NÃO implementar. O que vale é o design aprovado:
- Cabeçalho (ver `design-handoff.md` §4): desktop/tablet com logo + Catálogo, Sobre a Eduáh, campo fino de pesquisa e Carrinho com badge; mobile com logo + botões Menu, Pesquisar e Carrinho (ícone sobre rótulo). Sem mega menu. A Home desktop tem header próprio, como no quadro.
- Catálogo: página `/catalogo` com filtro por categoria, grid e paginação ("Página X de Y").
- Pesquisa: página `/busca?q=` com resultados agrupados por categoria, contagem, chips de salto e estado sem resultados. Liga ao campo do header.
- Modelo de produto:
```ts
export type Categoria = 'aneis' | 'brincos' | 'colares' | 'pulseiras' | 'piercings' | 'linha-masculina';
export type Produto = { id: string; nome: string; categoria: Categoria; preco: number; imagem: string; descricao?: string; destaque?: boolean };
```
Sem `featuredOrder` ou `createdAt` por enquanto — a ordem de destaque é a ordem de cadastro no Decap CMS.

## Página Inicial — Home (proposta inicial, ver seção 3.3 da documentação)
Vários pontos abaixo são propostas em aberto, pendentes de conteúdo/decisão da cliente — implementar a estrutura, mas não travar por falta do conteúdo real.
- Ordem das seções: Hero → CategoryTiles → DestaquesTeaser → LifestyleStrip → vitrine completa (ProductGrid + CategoryFilter) → SiteFooter.
- Hero: foto + frase + link/CTA editáveis pela cliente via CMS ("Configurações do site"), não fixos no código — ela pode não ter uma "linha" temática ainda, então o link fica livre (texto), não uma lista fixa de opções.
- DestaquesTeaser: usa os mesmos produtos com `destaque: true` (não criar um segundo campo). Rótulo "Peças em destaque" — NUNCA "mais vendidos" ou qualquer alegação de venda, pois não há dado real de vendas (checkout é pelo WhatsApp). Mídia (vídeo ou foto) toca sozinha, muda, em loop, sem botão de play, ao entrar na viewport (pausar ao sair) — sem forçar interação do usuário.
- SiteFooter: campos opcionais (WhatsApp, e-mail, Instagram, TikTok) vindos de "Configurações do site" — renderizar só o que estiver preenchido, nunca um link vazio ou quebrado.
- Decidido: SEM banner de cookies e SEM analytics/pixel; só `localStorage` essencial do carrinho.
- Privacidade e Termos usam o texto que já está nos quadros do design (não redigir texto novo). Campos entre colchetes ficam em `src/config/legal.ts`, visíveis, e revisão jurídica é recomendada antes de publicar.

## Decisões já tomadas (não reabrir sem eu pedir)
- Carrinho com seletor de quantidade (Produto e Carrinho), conforme o design.
- O carrinho NÃO é limpo automaticamente depois de enviar ao WhatsApp.
- Sem checkout, sem pagamento, sem backend próprio.
- Categorias: pulseiras, anéis, piercing, brincos, colares, linha masculina. Entre 20 e 25 produtos, catálogo trocado ~1 vez por mês.
- Preço de cada produto exibido no site.

## Correções obrigatórias (achados do review do piloto)
- Guardar no carrinho só `id` e `quantidade` do produto e resolver nome e preço a partir do catálogo atual (evita preço desatualizado quando a cliente muda o catálogo). Se o produto sumiu do catálogo, remover do carrinho.
- Calcular o total em um único lugar.
- Botão "Enviar" desabilitado deve continuar acessível por teclado (usar `aria-disabled`, não só `disabled`).
- Overlay do Menu mobile: fechar com Esc e gerenciar o foco (ao abrir, ao fechar e preso dentro do overlay).
- Todo `<button>` com `type="button"`.
- Tipar explicitamente os dados de produtos.
- Todo `eslint-disable` precisa de comentário justificando.
- O número de WhatsApp não pode ficar como placeholder no código; virá da cliente (chip novo) e deve ficar em um único lugar de configuração.

## Regras de trabalho
- Faça só o que eu pedir; siga as 4 regras do topo deste arquivo.
- Não adicionar framework de teste nem dependências que eu não pedi.
- Onde a regra 4 do topo fala em escrever testes, use como critério de sucesso `tsc`, lint, build e verificação no navegador, a menos que eu peça testes automatizados.
- Fontes hospedadas localmente (nada de Google Fonts em produção).
- O design vem do que for aprovado pela cliente (`design-systems/<slug>/`). A direção do piloto (serif + bronze) foi só teste e NÃO é o design final.
- Textos institucionais (descrições, "sobre", mensagem padrão do WhatsApp): eu passo pelo `/humanizer:humanizer` antes de publicar.
- Não instalar plugin, skill ou MCP sem eu pedir (cada ferramenta MCP pesa no contexto de toda sessão).

## Fluxo de Git
- Uma branch por bloco de trabalho, criada a partir de `main` (ex.: `feat/vitrine`, `feat/carrinho`, `feat/cms`).
- Mostrar `git diff` antes de qualquer commit. Nunca commitar nem dar push sem eu pedir.
- Antes de push: `npx tsc --noEmit`, `npm run lint` e `npm run build` limpos.
- Conventional Commits, com mensagem em inglês e em português.
