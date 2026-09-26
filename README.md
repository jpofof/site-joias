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
  data/produtos catálogo de exemplo, tipado
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
- **`src/data/produtos/index.ts`**: 24 produtos de **exemplo** (nomes, preços, descrições). A ordem do array é "mais recentes primeiro". Os produtos reais virão do Decap CMS.
- **Fotos**: os campos de imagem estão vazios e o site mostra placeholders nos tons da paleta.

## Ainda não implementado

- Painel Decap CMS em `/admin` (aguarda a decisão do método de autenticação).
- Analytics, pixel e banner de cookies: decidido não ter. Só há armazenamento essencial (o carrinho).
