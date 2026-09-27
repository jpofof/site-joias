# Design handoff — Eduáh Acessórios (site-joias)

> **Atualização (27/09/2026):** os blocos 1 a 5 (§8: `feat/base-visual`, `feat/vitrine`, `feat/busca`, `feat/carrinho`, `feat/paginas-legais`) foram implementados e mesclados em `main`, seguidos de uma revisão geral (acessibilidade, SEO, desempenho) e de um deploy de teste no Netlify com bloqueio temporário de indexação. Bloco 6 (`feat/cms`) em andamento. As divergências do `CLAUDE.md` listadas no §7 abaixo foram de fato aplicadas: rotas atuais (`/`, `/catalogo`, `/busca`, `/produto/:id`, `/carrinho`, `/pedido`, `/sobre`, `/privacidade`, `/termos`, `*`), carrinho com seletor de quantidade (não mais presença/ausência), Menu mobile com botão (sem hambúrguer escondendo item), Busca como página (não overlay/`SearchPanel`), texto de Privacidade/Termos vindo do design (não redigido pelo Claude) e nenhum banner de cookies. Ver `docs/documentacao-projeto-joias.md` (seção 0) para o estado atual completo. O restante deste documento não foi reescrito.

**Regra principal: o design é a fonte de verdade.** Implementar EXATAMENTE como nos arquivos de `docs/design/` (desktop 1440, tablet 768, mobile 390). Onde este documento, o design e o `CLAUDE.md` divergirem sobre visual, páginas, navegação ou comportamento de tela, vale o design. O `CLAUDE.md` continua valendo para processo (fluxo de Git, ESLint, `type="button"`, fontes locais, Tailwind v4 com `@theme`, sem dependências novas, um único `ProductCard`).

Preview ao vivo: https://claude.ai/artifact/QjxvZBeyjHwJFLpaqtf4Jv

## 1. Como ler os arquivos `docs/design/*.dc.html`
Cada arquivo é um quadro (artboard) HTML com estilos inline e marcação `<x-dc>`, `<sc-for>`, `<sc-if>`. São referência visual e de texto: copiar medidas, cores, espaçamentos, textos e estados literalmente para JSX + classes Tailwind. `canvas.json` só organiza o quadro no canvas (ignorar). `Identidade.dc.html` é a paleta, tipografia e componentes base.

## 2. Mapa página → arquivos → rota

| Página | Rota | Mobile 390 | Tablet 768 | Desktop 1440 |
|---|---|---|---|---|
| Home | `/` | `Mobile.dc.html` | `HomeTablet.dc.html` | `Main.dc.html` |
| Catálogo (paginado, "Página 1 de 3") | `/catalogo` | `Catalogo` | `CatalogoTablet` | `CatalogoDesk` |
| Busca (resultados por categoria, contagem, chips de salto) | `/busca?q=` | `Busca` | `BuscaTablet` | `BuscaDesk` |
| Produto | `/produto/:id` | `Produto` | `ProdutoTablet` | `ProdutoDesk` |
| Carrinho (3 etapas, desfazer, prévia da mensagem) | `/carrinho` | `Carrinho` | `CarrinhoTablet` | `CarrinhoDesk` |
| Carrinho vazio | `/carrinho` (estado) | `CarrinhoVazio` | `CarrinhoVazioTablet` | `CarrinhoVazioDesk` |
| Pedido preparado | `/pedido` | `Confirmacao` | `ConfirmacaoTablet` | `ConfirmacaoDesk` |
| 404 | `*` | `Erro404` | `Erro404Tablet` | `Erro404Desk` |
| Política de privacidade | `/privacidade` | `PrivacidadeMobile` | `PrivacidadeTablet` | `Privacidade` |
| Termos de uso | `/termos` | `TermosMobile` | `TermosTablet` | `Termos` |
| Sobre a Eduáh | `/sobre` | — sem quadro: seguir o padrão das páginas de texto (Privacidade/Termos) e pedir o conteúdo ao João | | |
| Menu mobile | overlay do header mobile | `Menu.dc.html` | | |

Os textos das páginas de Privacidade e Termos já estão nos quadros; usar como estão. Colchetes como `[nome/CPF-CNPJ]`, `[e-mail]`, `[provedor]`, `[prazos]`, `[foro]`, `[data]` são dados pendentes da cliente: deixar visíveis em constante única (`src/config/legal.ts`) para preencher depois, e avisar o João antes de publicar (revisão jurídica recomendada).

## 3. Tokens → `@theme` em `src/index.css`

```css
@theme {
  --color-silk: #EFE2D2;        /* fundo (Vanilla Silk) */
  --color-oat: #D7C6B4;         /* superfícies (Alpine Oat) */
  --color-oat-1: #E3D3C2;
  --color-oat-2: #D0BFAC;
  --color-oat-3: #CDBAA6;
  --color-oat-4: #C4B09C;
  --color-greige: #B09D8F;      /* só bordas/detalhes, nunca texto */
  --color-cherry: #481E20;      /* ações (Cherry Velvet) */
  --color-noir: #32191D;        /* texto, header, footer (Bordeaux Noir) */
  --color-ink-2: #4E3B36;       /* texto secundário */
  --color-placeholder: #5C4A45;

  --font-display: "Bodoni Moda", serif;  /* títulos e preços, 400/500 */
  --font-sans: "Jost", sans-serif;       /* corpo e UI, 300/400/500 */
  --radius-btn: 2px;
}
```

Fontes: baixar Bodoni Moda 400/500 e Jost 300/400/500 em `.woff2` para `public/fonts/` e usar `@font-face` (nada de Google Fonts em produção). Botões: raio 2px, MAIÚSCULAS, tracking .14–.16em, altura 48–56px, fundo cherry, texto silk. Alvos de toque ≥ 44px, 8px de espaçamento. Contraste AA; estado nunca só por cor.

## 4. Layout por breakpoint (mobile-first)

| | Mobile (base) | Tablet `md` ≥768 | Desktop `lg` ≥1024 (ref. 1440) |
|---|---|---|---|
| Header | 72px | 80px | 88px |
| Padding lateral | 20px | 48px | 96px (conteúdo 1248px) |
| Grid de produtos | 2 col | 3 col | 4 col |
| Footer | ~560px | ~540px | ~400px |

**Header** (`SiteHeader`, `nav aria-label="Principal"`):
- Desktop: logo à esquerda; à direita, gap 24px: `Catálogo`, `Sobre a Eduáh`, campo fino de pesquisa (200px), `Carrinho` com badge de contagem.
- Tablet: logo; `Catálogo`, `Sobre a Eduáh`, campo fino (140px), `Carrinho`.
- Mobile: logo + três botões de 68px (Menu, Pesquisar, Carrinho), ícone sobre rótulo em 11px maiúsculo. Só a página Busca mobile tem uma linha extra de 64px com o campo em largura total.
- Home desktop (`Main.dc.html`) tem header próprio (nav em maiúsculas, gap 40): reproduzir como está.
- Campo fino: wrapper flex, altura 44px, borda inferior 1px #EFE2D2 (2px em `:focus-within`), lupa 44×44 (link para a busca), input transparente, texto #EFE2D2, peso 500, placeholder "Pesquisar" (#D7C6B4).

## 5. Comportamento (do design)
- **Carrinho**: itens com seletor de quantidade; total único; barra de progresso de 3 etapas; toast "DESFAZER" ao remover; prévia da mensagem do WhatsApp; botão "Enviar pedido pelo WhatsApp" abre `wa.me` com o texto; depois vai para "Pedido preparado". O carrinho NÃO é limpo automaticamente. Estado vazio com 3 passos.
- **Catálogo**: filtro por categoria (Anéis, Brincos, Colares, Pulseiras, Piercings, Linha masculina), paginação 1 2 3 com "Página X de Y".
- **Busca**: resultados agrupados por categoria com contagem e chips de salto; estado sem resultados.
- **Produto**: galeria, nome, preço (Bodoni), descrição, seletor de quantidade, "Adicionar ao carrinho".
- **Sem banner de cookies, sem analytics.** Só `localStorage` essencial do carrinho (descrito na política de privacidade).
- Terminologia exata: Catálogo · Ver catálogo · produto · carrinho · Pesquisar · Sobre a Eduáh · Adicionar ao carrinho · Enviar pedido pelo WhatsApp · "Peças em destaque" (nunca "mais vendidos").

## 6. Dados
- Guardar no carrinho `{ id, quantidade }` e resolver nome/preço pelo catálogo atual (produto que sumiu é removido). Total calculado em um só lugar.
- `Produto` conforme `CLAUDE.md` (`id, nome, categoria, preco, imagem, descricao?, destaque?`); um único `ProductCard` por props.
- Número do WhatsApp em um único arquivo de config (vem da cliente).
- Mensagem: "Olá! Gostaria de fazer um pedido:" + linhas `- Nome (qtd) — R$ preço` + `Total: R$ …`, exatamente como a prévia do quadro Carrinho.

## 7. Atualizar o `CLAUDE.md` (seções que o design substitui)
Ao começar, o Claude Code deve propor ao João a atualização destas partes do `CLAUDE.md` para não brigar com o design: rotas (`/`, `/catalogo`, `/busca`, `/produto/:id`, `/carrinho`, `/pedido`, `/sobre`, `/privacidade`, `/termos`, `*`), "Carrinho por presença/ausência" (agora há quantidade), "Sem hambúrguer" (mobile tem botão Menu), "SearchPanel overlay" (busca é página), "NÃO redigir política de privacidade" (texto já existe no design) e "banner de cookies" (decidido: não haver). Mostrar o diff e esperar aprovação.

## 8. Sequência de branches (a partir de `main`)
1. `feat/base-visual` — fontes locais, `@theme`, layout, `SiteHeader` (3 breakpoints), `SiteFooter`, `Menu` mobile.
2. `feat/vitrine` — tipos, dados de exemplo, `ProductCard`, `ProductGrid`, `CategoryFilter`, Home, Catálogo com paginação, Produto, 404, `public/_redirects`.
3. `feat/busca` — página de Busca.
4. `feat/carrinho` — `CartContext`, `useCart`, página Carrinho, vazio, Pedido preparado, WhatsApp.
5. `feat/paginas-legais` — Privacidade, Termos, Sobre.
6. `feat/cms` — Decap (só após decisão de autenticação).

Cada bloco: plano curto → implementar → `npx tsc --noEmit`, `npm run lint`, `npm run build` → comparar no navegador com o quadro correspondente nos 3 tamanhos → mostrar `git diff`. Nada de commit/push sem o João pedir.

## 9. Skills por etapa
Superpowers (brainstorming antes de cada bloco), img-to-html (comparar tela × quadro), Humanizer (textos do site e mensagem do WhatsApp), Karpathy/CLAUDE.md (sem abstração prematura).
