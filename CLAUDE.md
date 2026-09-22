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
- Tailwind CSS v4 (`@tailwindcss/vite`; tema em `@theme` dentro de `src/index.css`; sem `tailwind.config.ts`)
- ESLint
- Carrinho: Context API + hook `useCart` + `localStorage` (sem biblioteca de estado)
- CMS: Decap CMS em `/admin` (método de autenticação ainda em decisão — não implementar antes de eu decidir)
- Deploy: Netlify. Versionamento: Git + GitHub

## Estrutura planejada
```
public/admin/ (config.yml, index.html)
src/types/produto.ts
src/components/ (ProductCard, ProductGrid, CategoryFilter, Cart, CartButton, WhatsAppCTA)
src/hooks/useCart.ts
src/context/CartContext.tsx
src/data/produtos/  (arquivos gerados/editados pelo Decap)
```
Um único `ProductCard` recebendo um `Produto` por props; nunca um componente por produto.

## Navegação e Modelo de Produto (escopo reduzido — ver seção 3.1 da documentação)
Existe uma arquitetura de navegação completa (mega menu, painel de busca com recomendações, campos de destaque) guardada como referência em `docs/reference/arquitetura-navegacao-mega-menu.md`, para catálogos maiores. NÃO implementar essa versão agora. O escopo atual é:
- Cabeçalho: `LOGOTIPO | CATÁLOGO | SOBRE | 🔍 | 🛒`, sem mega menu e sem hambúrguer (nem no mobile).
- Catálogo: link que rola/navega até `ProductGrid`; filtro por categoria via `CategoryFilter` (chips/abas), não um painel separado.
- Pesquisa: campo de texto simples no cabeçalho, filtra os produtos já carregados em memória; sem painel sobreposto, sem recomendações, sem estado dedicado de "nenhum resultado".
- Modelo de produto:
```ts
export type Categoria = 'aneis' | 'brincos' | 'colares' | 'pulseiras' | 'piercings' | 'linha-masculina';
export type Produto = { id: string; nome: string; categoria: Categoria; preco: number; imagem: string; descricao?: string };
```
Sem `isFeatured`, `featuredOrder` ou `createdAt` por enquanto.

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
