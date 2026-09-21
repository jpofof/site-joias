# Carrinho via WhatsApp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir que a cliente selecione peças de um catálogo de exemplo, veja um carrinho persistente (localStorage) e envie os itens selecionados como mensagem pronta pelo WhatsApp — sem checkout real.

**Architecture:** `CartProvider` (Context API) + hook `useCart` centralizam o estado do carrinho e sua sincronização com `localStorage`. `ProductCard` consome o hook para adicionar/remover itens. `CartBadge` e `CartDrawer` (novos) exibem o estado do carrinho e disparam a geração do link de WhatsApp via utilitário puro `buildWhatsAppUrl`.

**Tech Stack:** React 19 + TypeScript, Vite 8. Sem bibliotecas novas.

**Spec:** `site-joias-teste/docs/superpowers/specs/2026-09-20-carrinho-whatsapp-design.md`

## Global Constraints

- Sem quantidade por item — carrinho é presença/ausência (conforme spec).
- Sem framework de testes automatizado — este projeto não tem Vitest/Jest configurado e nenhum será introduzido. Verificação é manual (`npm run dev` + interação no navegador) e `npm run lint`.
- Sem repositório git neste projeto (`site-joias-teste` não é um repo git) — os passos deste plano **não incluem `git commit`**; cada tarefa termina com uma verificação manual em vez de um commit.
- Número de WhatsApp é placeholder `5511999999999` com o comentário exato: `// TODO: substituir pelo número real da loja quando a cliente confirmar o número do chip novo.`
- Imagem de todos os produtos de exemplo é `nalaura.jpg` (copiada para `public/`).
- Carrinho não é limpo automaticamente ao enviar a mensagem.

---

### Task 1: Tipo `Product`, dados de exemplo e imagem

**Files:**
- Create: `src/types.ts`
- Create: `src/data/products.json`
- Create: `public/nalaura.jpg` (cópia de `skills-test-harness/nalaura.jpg`)

**Interfaces:**
- Produces: `interface Product { id: string; nome: string; preco: number; imagem: string }`, exportado de `src/types.ts`. Todas as tarefas seguintes importam esse tipo de `../types` (ou `./types` a partir de `src/`).

- [ ] **Step 1: Copiar a imagem placeholder**

  Copie o arquivo de `C:\Users\jpofe\Downloads\skills-test-harness\skills-test-harness\nalaura.jpg` para `C:\Users\jpofe\Downloads\skills-test-harness\site-joias-teste\public\nalaura.jpg`.

- [ ] **Step 2: Criar o tipo `Product`**

  Crie `src/types.ts`:

  ```ts
  export interface Product {
    id: string;
    nome: string;
    preco: number;
    imagem: string;
  }
  ```

- [ ] **Step 3: Criar o JSON de produtos de exemplo**

  Crie `src/data/products.json`:

  ```json
  [
    { "id": "1", "nome": "Brinco Argola Dourada", "preco": 89.9, "imagem": "/nalaura.jpg" },
    { "id": "2", "nome": "Colar Ponto de Luz", "preco": 149.9, "imagem": "/nalaura.jpg" },
    { "id": "3", "nome": "Anel Solitário", "preco": 199.9, "imagem": "/nalaura.jpg" },
    { "id": "4", "nome": "Pulseira Elos", "preco": 119.9, "imagem": "/nalaura.jpg" },
    { "id": "5", "nome": "Brinco Argola Pequena", "preco": 69.9, "imagem": "/nalaura.jpg" }
  ]
  ```

- [ ] **Step 4: Verificar**

  Confirme que `public/nalaura.jpg` existe e que `src/data/products.json` tem JSON válido (abra o arquivo e confira a sintaxe). Nenhum código ainda importa esses arquivos, então não há como rodar a app para checar — isso é validado nas próximas tarefas.

---

### Task 2: `CartProvider` + hook `useCart`

**Files:**
- Create: `src/context/CartContext.tsx`
- Modify: `src/main.tsx`

**Interfaces:**
- Consumes: `Product` de `src/types.ts` (Task 1).
- Produces:
  - `CartProvider` — componente, envolve `children`.
  - `useCart(): { items: Product[]; addToCart: (product: Product) => void; removeFromCart: (id: string) => void; isInCart: (id: string) => boolean; total: number }` — hook exportado de `src/context/CartContext.tsx`, usado por `ProductCard`, `CartBadge` e `CartDrawer` nas próximas tarefas.

- [ ] **Step 1: Criar o Context e o Provider**

  Crie `src/context/CartContext.tsx`:

  ```tsx
  import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
  import type { Product } from '../types';

  const STORAGE_KEY = 'carrinho-joias';

  interface CartContextValue {
    items: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: string) => void;
    isInCart: (id: string) => boolean;
    total: number;
  }

  const CartContext = createContext<CartContextValue | undefined>(undefined);

  function loadFromStorage(): Product[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<Product[]>(loadFromStorage);

    useEffect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // localStorage indisponível (ex: modo privado) — carrinho segue em memória.
      }
    }, [items]);

    function addToCart(product: Product) {
      setItems((prev) => (prev.some((p) => p.id === product.id) ? prev : [...prev, product]));
    }

    function removeFromCart(id: string) {
      setItems((prev) => prev.filter((p) => p.id !== id));
    }

    function isInCart(id: string) {
      return items.some((p) => p.id === id);
    }

    const total = items.reduce((sum, p) => sum + p.preco, 0);

    return (
      <CartContext.Provider value={{ items, addToCart, removeFromCart, isInCart, total }}>
        {children}
      </CartContext.Provider>
    );
  }

  export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart deve ser usado dentro de um CartProvider');
    return ctx;
  }
  ```

- [ ] **Step 2: Envolver a app com `CartProvider`**

  Modifique `src/main.tsx` para importar `CartProvider` de `./context/CartContext` e envolver `<App />`:

  ```tsx
  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import './index.css'
  import App from './App.tsx'
  import { CartProvider } from './context/CartContext'

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <CartProvider>
        <App />
      </CartProvider>
    </StrictMode>,
  )
  ```

- [ ] **Step 3: Verificar**

  Rode `npm run dev` a partir de `site-joias-teste/` e confirme que a página carrega sem erros no console (o app ainda não usa `useCart` em lugar nenhum, então isso só confirma que o Provider não quebra a renderização).

---

### Task 3: Utilitário `buildWhatsAppUrl`

**Files:**
- Create: `src/utils/whatsapp.ts`

**Interfaces:**
- Consumes: `Product` de `src/types.ts` (Task 1).
- Produces: `buildWhatsAppUrl(items: Product[]): string`, usado por `CartDrawer` (Task 6).

- [ ] **Step 1: Implementar a função**

  Crie `src/utils/whatsapp.ts`:

  ```ts
  import type { Product } from '../types';

  // TODO: substituir pelo número real da loja quando a cliente confirmar o número do chip novo.
  const STORE_PHONE = '5511999999999';

  export function buildWhatsAppUrl(items: Product[]): string {
    const linhas = items.map((item) => `- ${item.nome}`).join('\n');
    const total = items.reduce((sum, item) => sum + item.preco, 0);
    const totalFormatado = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const mensagem = `Olá! Tenho interesse nos seguintes itens:\n${linhas}\nTotal: ${totalFormatado}`;
    return `https://wa.me/${STORE_PHONE}?text=${encodeURIComponent(mensagem)}`;
  }
  ```

- [ ] **Step 2: Verificar manualmente**

  Não há framework de teste no projeto. Verifique a lógica lendo o código: com `items = [{id:'1', nome:'Brinco Argola Dourada', preco: 89.9, imagem: '/nalaura.jpg'}]`, a função deve produzir uma URL começando com `https://wa.me/5511999999999?text=Ol%C3%A9...` contendo `Brinco Argola Dourada` e `R$` no total. Essa verificação será confirmada de ponta a ponta na Task 7 (verificação manual no navegador).

---

### Task 4: Botão de carrinho no `ProductCard`

**Files:**
- Modify: `src/components/ProductCard.tsx`

**Interfaces:**
- Consumes: `useCart()` de `src/context/CartContext.tsx` (Task 2); `Product` de `src/types.ts` (Task 1).
- Produces: `ProductCard` agora recebe `id: string` como prop adicional (além de `nome`, `preco`, `imagem`), usado pela Task 5 ao renderizar a lista de produtos.

- [ ] **Step 1: Atualizar `ProductCard` para aceitar `id` e usar `useCart`**

  Substitua o conteúdo de `src/components/ProductCard.tsx`:

  ```tsx
  // Este componente foi criado durante um teste piloto de skills para o projeto de joias.
  import { useState } from 'react';
  import { useCart } from '../context/CartContext';

  interface ProductCardProps {
    id: string;
    nome: string;
    preco: number;
    imagem: string;
  }

  function ProductCard({ id, nome, preco, imagem }: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const { addToCart, removeFromCart, isInCart } = useCart();
    const inCart = isInCart(id);

    return (
      <div className="product-card">
        <button
          className="favorite-button"
          onClick={() => setIsFavorite((prev) => !prev)}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
        <img src={imagem} alt={nome} />
        <h3>{nome}</h3>
        <p>{preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        <button
          className="cart-button"
          onClick={() => (inCart ? removeFromCart(id) : addToCart({ id, nome, preco, imagem }))}
        >
          {inCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'}
        </button>
      </div>
    );
  }

  export default ProductCard;
  ```

- [ ] **Step 2: Verificar**

  `ProductCard` ainda não é renderizado em nenhuma tela (só será na Task 5). Confirme apenas que `npm run lint` não acusa erro de tipo/import neste arquivo antes de seguir (rode o lint completo ao final da Task 7).

---

### Task 5: `CartBadge` e catálogo em `App.tsx`

**Files:**
- Create: `src/components/CartBadge.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useCart()` (Task 2), `ProductCard` (Task 4), `products.json` (Task 1).
- Produces: `App.tsx` mantém estado local `isCartOpen: boolean` e a função `setIsCartOpen`, consumidos pelo `CartDrawer` na Task 6.
- `CartBadge` recebe props `count: number` e `onClick: () => void`.

- [ ] **Step 1: Criar `CartBadge`**

  Crie `src/components/CartBadge.tsx`:

  ```tsx
  interface CartBadgeProps {
    count: number;
    onClick: () => void;
  }

  function CartBadge({ count, onClick }: CartBadgeProps) {
    return (
      <button className="cart-badge" onClick={onClick} aria-label="Abrir carrinho">
        🛍️
        {count > 0 && <span className="cart-badge-count">{count}</span>}
      </button>
    );
  }

  export default CartBadge;
  ```

- [ ] **Step 2: Adicionar header, catálogo e estado do drawer em `App.tsx`**

  Modifique `src/App.tsx`: adicione os imports necessários, o estado `isCartOpen`, um `<header>` com `CartBadge`, e uma seção que mapeia `products.json` para `ProductCard`. Insira o `<header>` logo após a abertura do fragment (`<>`) e a nova seção de catálogo logo após `#center` (antes de `#next-steps`), sem remover o conteúdo existente do boilerplate:

  ```tsx
  import { useState } from 'react'
  import heroImg from './assets/hero.png'
  import reactLogo from './assets/react.svg'
  import viteLogo from './assets/vite.svg'
  import './App.css'
  import products from './data/products.json'
  import ProductCard from './components/ProductCard'
  import CartBadge from './components/CartBadge'
  import CartDrawer from './components/CartDrawer'
  import { useCart } from './context/CartContext'

  function App() {
    const [count, setCount] = useState(0)
    const [isCartOpen, setIsCartOpen] = useState(false)
    const { items } = useCart()

    return (
      <>
        <header id="site-header">
          <CartBadge count={items.length} onClick={() => setIsCartOpen(true)} />
        </header>

        <section id="center">
          {/* ... conteúdo existente do hero, sem alterações ... */}
        </section>

        <section id="catalog">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </section>

        {/* ... resto do conteúdo existente (#next-steps, .ticks, #spacer) sem alterações ... */}

        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </>
    )
  }

  export default App
  ```

  (O comentário `{/* ... conteúdo existente ... */}` acima é só para indicar onde inserir o novo código neste plano — no arquivo real, mantenha todo o JSX existente do `#center` e do restante do arquivo, apenas adicionando `<header>`, `<section id="catalog">` e `<CartDrawer>` nos pontos indicados.)

- [ ] **Step 3: Verificar**

  Esta tarefa referencia `CartDrawer`, que só é criado na Task 6 — o build vai falhar até lá. Isso é esperado; a verificação completa acontece ao final da Task 6.

---

### Task 6: `CartDrawer`

**Files:**
- Create: `src/components/CartDrawer.tsx`

**Interfaces:**
- Consumes: `useCart()` (Task 2), `buildWhatsAppUrl` (Task 3).
- Produces: `CartDrawer` recebe props `isOpen: boolean` e `onClose: () => void` (já usado por `App.tsx` na Task 5).

- [ ] **Step 1: Criar `CartDrawer`**

  Crie `src/components/CartDrawer.tsx`:

  ```tsx
  import { useCart } from '../context/CartContext';
  import { buildWhatsAppUrl } from '../utils/whatsapp';

  interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
  }

  function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, removeFromCart, total } = useCart();

    if (!isOpen) return null;

    return (
      <div className="cart-drawer-overlay" onClick={onClose}>
        <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          <button className="cart-drawer-close" onClick={onClose} aria-label="Fechar carrinho">
            ×
          </button>
          <h2>Seu carrinho</h2>
          {items.length === 0 ? (
            <p>Seu carrinho está vazio</p>
          ) : (
            <>
              <ul className="cart-drawer-list">
                {items.map((item) => (
                  <li key={item.id}>
                    <span>{item.nome}</span>
                    <span>{item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    <button onClick={() => removeFromCart(item.id)} aria-label={`Remover ${item.nome}`}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <p className="cart-drawer-total">
                Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </>
          )}
          <a
            className="cart-drawer-send"
            href={items.length > 0 ? buildWhatsAppUrl(items) : undefined}
            target="_blank"
            rel="noreferrer"
            aria-disabled={items.length === 0}
            onClick={(e) => {
              if (items.length === 0) e.preventDefault();
            }}
          >
            Enviar pelo WhatsApp
          </a>
        </div>
      </div>
    );
  }

  export default CartDrawer;
  ```

- [ ] **Step 2: Verificar que o build compila**

  Rode `npm run dev` a partir de `site-joias-teste/`. A página deve carregar sem erros no console do navegador nem no terminal do Vite.

---

### Task 7: Estilos e verificação manual completa

**Files:**
- Modify: `src/App.css`

**Interfaces:**
- Nenhuma nova — apenas estiliza as classes já usadas nas tarefas anteriores (`cart-button`, `cart-badge`, `cart-badge-count`, `cart-drawer-overlay`, `cart-drawer`, `cart-drawer-close`, `cart-drawer-list`, `cart-drawer-total`, `cart-drawer-send`, `#site-header`, `#catalog`).

- [ ] **Step 1: Adicionar estilos ao final de `src/App.css`**

  ```css
  #site-header {
    display: flex;
    justify-content: flex-end;
    padding: 16px 24px;
  }

  #catalog {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    padding: 24px;
  }

  .cart-button {
    margin-top: 12px;
    width: 100%;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--accent-bg);
    color: var(--accent);
    cursor: pointer;
    transition: border-color 0.3s;

    &:hover {
      border-color: var(--accent-border);
    }
  }

  .cart-badge {
    position: relative;
    border: none;
    background: none;
    font-size: 24px;
    cursor: pointer;

    .cart-badge-count {
      position: absolute;
      top: -6px;
      right: -10px;
      background: var(--accent);
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 11px;
      line-height: 18px;
      text-align: center;
    }
  }

  .cart-drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: flex-end;
    z-index: 10;
  }

  .cart-drawer {
    position: relative;
    width: 320px;
    max-width: 90vw;
    height: 100%;
    background: var(--bg, #fff);
    padding: 24px;
    overflow-y: auto;
  }

  .cart-drawer-close {
    position: absolute;
    top: 16px;
    right: 16px;
    border: none;
    background: none;
    font-size: 20px;
    cursor: pointer;
  }

  .cart-drawer-list {
    list-style: none;
    padding: 0;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
    }
  }

  .cart-drawer-total {
    font-weight: bold;
    margin: 16px 0;
  }

  .cart-drawer-send {
    display: block;
    text-align: center;
    padding: 10px;
    border-radius: 6px;
    background: var(--accent);
    color: white;
    text-decoration: none;

    &[aria-disabled='true'] {
      opacity: 0.5;
      pointer-events: none;
    }
  }
  ```

- [ ] **Step 2: Verificação manual completa (fluxo ponta a ponta)**

  Com `npm run dev` rodando, no navegador:

  1. Confirme que o catálogo de 5 produtos aparece, cada um com botão "Adicionar ao carrinho".
  2. Clique em "Adicionar ao carrinho" em 2 produtos diferentes — o badge no header deve mostrar "2" e os botões devem mudar para "Remover do carrinho".
  3. Recarregue a página (F5) — os 2 itens devem continuar no carrinho (persistência via `localStorage`; confirme também abrindo DevTools → Application → Local Storage → chave `carrinho-joias`).
  4. Clique no badge do carrinho — o drawer deve abrir mostrando os 2 itens, seus preços e o total correto.
  5. Remova um item pelo "×" do drawer — a lista e o total devem atualizar, e o badge no header deve mostrar "1".
  6. Clique em "Enviar pelo WhatsApp" — deve abrir uma nova aba para `https://wa.me/5511999999999?text=...` com a mensagem contendo o nome do item restante e o total.
  7. Esvazie o carrinho e confirme que o drawer mostra "Seu carrinho está vazio" e o botão de enviar fica desabilitado (sem abrir nova aba ao clicar).

- [ ] **Step 3: Rodar o lint**

  Rode `npm run lint` a partir de `site-joias-teste/` e confirme que não há erros novos introduzidos por esta feature.

---

## Self-Review

**Cobertura da spec:** Modelo de dados (Task 1), Context/persistência (Task 2), geração de mensagem (Task 3), botão no card (Task 4), badge + catálogo (Task 5), drawer (Task 6), estilos + verificação ponta a ponta (Task 7) — todas as seções da spec (Arquitetura, Modelo de dados, Componentes, Fluxo de dados, Tratamento de erros, Verificação) têm tarefa correspondente.

**Placeholders:** Nenhum "TBD"/"implementar depois" — o único placeholder intencional (número de WhatsApp) está com o comentário exato definido na spec.

**Consistência de tipos:** `Product` (Task 1) é usado sem alteração em `CartContext` (Task 2), `whatsapp.ts` (Task 3), `ProductCard` (Task 4) e `CartDrawer` (Task 6). Assinatura de `useCart()` é idêntica em todas as tarefas que a consomem.
