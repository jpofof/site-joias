# Carrinho de compras via WhatsApp — design

Data: 2026-09-20
Projeto: site-joias-teste

## Contexto

O site é um piloto de skills para uma joalheria. Hoje não existe catálogo de
produtos nem carrinho — apenas um componente `ProductCard` isolado (não usado
em nenhuma tela) e o boilerplate padrão do Vite em `App.tsx`.

O objetivo é implementar um fluxo de carrinho onde a cliente seleciona peças
(sem quantidade — cada peça é única em estoque) e, ao finalizar, uma mensagem
pré-formatada é gerada e enviada via WhatsApp para o número fixo da loja. **Não
há checkout real** (sem pagamento, sem formulário, sem integração de pedidos).

## Objetivo e critérios de sucesso

- Cliente consegue adicionar/remover peças de um catálogo de exemplo.
- O carrinho persiste entre reloads (via `localStorage`).
- Cliente consegue revisar os itens selecionados antes de enviar.
- Ao confirmar, abre o WhatsApp com uma mensagem pronta contendo os itens e o total.
- Fluxo validado manualmente (sem framework de teste automatizado — fora de escopo).

## Fora de escopo

- Checkout real (pagamento, dados de entrega, confirmação de pedido).
- Controle de quantidade por item.
- Catálogo de produtos definitivo (fotos reais, dados da cliente) — usamos
  dados de exemplo em JSON local.
- Framework de testes automatizados.
- Número de WhatsApp real da loja (usamos placeholder).

## Arquitetura

- **`CartProvider`** (Context API) envolve a árvore de componentes e guarda o
  estado do carrinho (array de `Product`).
- Sincroniza com `localStorage` via `useEffect` a cada mudança; na
  inicialização, lê o `localStorage` para restaurar o estado (fallback para
  array vazio se não houver nada salvo ou o JSON estiver corrompido).
- **`useCart()`** — hook customizado exposto pelo Context:
  - `items: Product[]`
  - `addToCart(product: Product): void`
  - `removeFromCart(id: string): void`
  - `isInCart(id: string): boolean`
  - `total: number` (soma de `preco` dos itens)
- Sem bibliotecas externas de state management (YAGNI para o escopo do piloto).

## Modelo de dados

`src/data/products.json` — lista de produtos de exemplo (5–6 itens), todos
usando `nalaura.jpg` (copiada para o projeto) como imagem placeholder:

```json
[
  { "id": "1", "nome": "Brinco Argola", "preco": 89.9, "imagem": "/nalaura.jpg" }
]
```

Tipo `Product` (TypeScript):

```ts
interface Product {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
}
```

O carrinho reusa o mesmo tipo `Product` — cada item no carrinho é um
`Product`, sem campo de quantidade.

## Componentes

- **`ProductCard`** — ganha um botão "Adicionar ao carrinho" / "Remover do
  carrinho" (texto alterna conforme `isInCart(product.id)`), chamando
  `addToCart`/`removeFromCart`. O botão de favoritar (♥/♡) existente não muda.
- **`CartBadge`** (novo, no header) — ícone de sacola com contador
  (`items.length`) sobreposto; ao clicar, abre o drawer. Um `<header>` mínimo
  é criado em `App.tsx` só para abrigar esse ícone (sem menu de navegação ou
  logo — não solicitado).
- **`CartDrawer`** (novo) — painel lateral que lista os produtos no carrinho
  (nome, preço, botão "X" para remover), mostra o total, e um botão "Enviar
  pelo WhatsApp". Estado de aberto/fechado é local (`isOpen`), controlado pelo
  clique no `CartBadge`. Se o carrinho estiver vazio, mostra "Seu carrinho
  está vazio" no lugar da lista e o botão de enviar fica desabilitado.
- **`whatsapp.ts`** (novo, utilitário) — função pura
  `buildWhatsAppUrl(items: Product[]): string` que monta o texto:

  ```
  Olá! Tenho interesse nos seguintes itens:
  - [nome do produto 1]
  - [nome do produto 2]
  Total: R$ [valor]
  ```

  e retorna `https://wa.me/5511999999999?text=<mensagem codificada>`
  (`encodeURIComponent`). O número é um placeholder:
  `// TODO: substituir pelo número real da loja quando a cliente confirmar o número do chip novo.`

## Fluxo de dados

1. App inicia → `CartProvider` lê `localStorage` (chave `carrinho-joias`) →
   popula `items` inicial (vazio se não houver nada salvo ou parse falhar).
2. Cliente clica "Adicionar ao carrinho" → `addToCart(product)` → `items`
   atualizado no Context → `useEffect` grava no `localStorage` →
   `ProductCard` re-renderiza ("Remover do carrinho") → `CartBadge` atualiza
   o contador.
3. Cliente remove (do card ou do "X" no drawer) → mesmo caminho, via
   `removeFromCart(id)`.
4. Cliente abre o drawer → lista `items` atuais, com total calculado.
5. Cliente clica "Enviar pelo WhatsApp" → `buildWhatsAppUrl(items)` gera a
   URL → abre em nova aba (`target="_blank"`). **O carrinho não é limpo
   automaticamente** — a cliente pode continuar navegando com os itens ainda
   selecionados até remover manualmente (não há checkout real).

## Tratamento de erros

- `localStorage` indisponível/cheio → `try/catch` no `CartProvider`; se
  falhar, o carrinho segue funcionando só em memória (degrada
  graciosamente).
- JSON corrompido no `localStorage` → `try/catch` no parse; começa com
  carrinho vazio.
- Carrinho vazio → botão "Enviar pelo WhatsApp" desabilitado.

## Verificação

Sem framework de teste automatizado configurado no projeto (não será
introduzido para esta feature). Verificação manual:

- `npm run dev` — testar fluxo completo: adicionar/remover itens, reload de
  página (persistência), abrir/fechar drawer, gerar link do WhatsApp.
- `npm run lint` — garantir que nada quebrou.
