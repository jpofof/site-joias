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
- Rotas: React Router (`react-router-dom`) — rotas: `/`, `/produto/:id`, `/sobre`. Carrinho e busca continuam globais (overlay), não são rotas.
- Netlify: `public/_redirects` com `/* /index.html 200` (obrigatório para rotas do lado do cliente funcionarem)
- Tailwind CSS v4 (`@tailwindcss/vite`; tema em `@theme` dentro de `src/index.css`; sem `tailwind.config.ts`)
- ESLint
- Carrinho: Context API + hook `useCart` + `localStorage` (sem biblioteca de estado)
- CMS: Decap CMS em `/admin` (método de autenticação ainda em decisão — não implementar antes de eu decidir)
- Deploy: Netlify. Versionamento: Git + GitHub

## Estrutura planejada
```
public/admin/ (config.yml, index.html)
public/_redirects
src/types/produto.ts
src/types/site-config.ts (campos de "Configurações do site": hero, footer)
src/pages/ (Home, Produto, Sobre)
src/components/ (Hero, CategoryTiles, DestaquesTeaser, LifestyleStrip, ProductCard, ProductGrid, CategoryFilter, SearchPanel, Cart, CartButton, WhatsAppCTA, SiteFooter)
src/hooks/useCart.ts
src/context/CartContext.tsx
src/data/produtos/  (arquivos gerados/editados pelo Decap)
src/data/site-config.json  (arquivo único gerado pelo Decap)
```
Um único `ProductCard` recebendo um `Produto` por props; nunca um componente por produto.

## Navegação, Busca e Modelo de Produto (escopo reduzido, validado em wireframe — ver seção 3.1 da documentação)
Existe uma arquitetura de navegação completa (mega menu, painel de busca com recomendações elaboradas, campos de ordenação) guardada como referência em `docs/reference/arquitetura-navegacao-mega-menu.md`, para catálogos maiores. NÃO implementar essa versão agora. A versão aprovada (5 iterações de wireframe) é:
- Cabeçalho: logo sozinho à esquerda; `CATÁLOGO`, `SOBRE`, ícone de pesquisa e ícone de carrinho num único grupo à direita — nada centralizado isolado. Sem mega menu, sem hambúrguer (nem no mobile). Se a linha apertar no mobile, quebrar em duas linhas (logo em cima, grupo embaixo) — nunca esconder item ou trocar por ícone sem rótulo.
- Catálogo: link que rola/navega até `ProductGrid`; filtro por categoria via `CategoryFilter` (chips/abas), não um painel separado.
- Pesquisa: só um ícone no cabeçalho. Ao clicar, abre `SearchPanel`, um painel cobrindo a área do site: campo de busca + fechar no topo; categorias à esquerda (chips horizontais no mobile); área de resultados à direita.
  - Antes de digitar: mostra os produtos com `destaque: true`, rótulo "Sugestões da loja", na ordem do catálogo (sem campo de prioridade separado). Limite sugerido: 4 a 6 produtos.
  - Ao digitar: mostra os resultados reais da busca sobre os produtos já carregados em memória.
  - Fechar com Esc; foco automático no campo ao abrir; foco devolvido ao ícone ao fechar.
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
- NÃO implementar analytics, pixel de rastreamento (Meta/Google) ou banner de cookies sem eu pedir explicitamente — depende de decisão da cliente ainda pendente.
- NÃO redigir texto de política de privacidade ou aviso legal — isso é conteúdo que vem de mim/da cliente (e revisão jurídica), não algo para o Claude Code gerar.

## Decisões já tomadas (não reabrir sem eu pedir)
- Carrinho por presença/ausência: cada peça é única, sem controle de quantidade.
- O carrinho NÃO é limpo automaticamente depois de enviar ao WhatsApp.
- Sem checkout, sem pagamento, sem backend próprio.
- Categorias: pulseiras, anéis, piercing, brincos, colares, linha masculina. Entre 20 e 25 produtos, catálogo trocado ~1 vez por mês.
- Preço de cada produto exibido no site.

## Correções obrigatórias (achados do review do piloto)
- Guardar no carrinho só o `id` do produto e resolver nome e preço a partir do catálogo atual (evita preço desatualizado quando a cliente muda o catálogo). Se o produto sumiu do catálogo, remover do carrinho.
- Calcular o total em um único lugar.
- Botão "Enviar" desabilitado deve continuar acessível por teclado (usar `aria-disabled`, não só `disabled`).
- Drawer do carrinho: fechar com Esc e gerenciar o foco (ao abrir, ao fechar e preso dentro do drawer).
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
