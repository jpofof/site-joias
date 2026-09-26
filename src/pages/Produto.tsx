import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import PaginaMeta from '../components/PaginaMeta'
import { nomeDaCategoria, urlCategoria } from '../config/categorias'
import { produtos } from '../data/produtos'
import { useCart } from '../hooks/useCart'
import { QUANTIDADE_MAXIMA, rotuloProdutos } from '../lib/carrinho'
import { produtosRelacionados } from '../lib/catalogo'
import { tomPlaceholder } from '../lib/placeholder'
import { formatarPreco } from '../lib/preco'
import type { DetalhesProduto } from '../types/produto'
import NotFound from './NotFound'

const rotulo = 'text-xs font-medium tracking-[0.18em] text-ink-2 uppercase'
const passoQuantidade = 'flex size-12 items-center justify-center text-[22px] md:rounded-btn md:border md:border-noir'

const linhasDetalhes: { chave: keyof DetalhesProduto; rotulo: string }[] = [
  { chave: 'material', rotulo: 'Material' },
  { chave: 'medidas', rotulo: 'Medidas' },
  { chave: 'cuidados', rotulo: 'Cuidados' },
]

// A chave reinicia foto, quantidade e faixa ao trocar de produto (ex.: pelos "Outros produtos").
export default function Produto() {
  const { id } = useParams()
  return <PaginaProduto key={id} id={id} />
}

function PaginaProduto({ id }: { id?: string }) {
  const produto = produtos.find((p) => p.id === id)
  const { adicionar, quantidadeTotal } = useCart()
  const [fotoAtiva, setFotoAtiva] = useState(0)
  const [quantidade, setQuantidade] = useState(1)
  // Faixa "Adicionado ao carrinho" e o texto lido pelo leitor de tela (região role="status" sempre presente).
  const [faixa, setFaixa] = useState<'adicionado' | 'limite' | null>(null)
  const [anuncio, setAnuncio] = useState('')

  if (!produto) return <NotFound />

  const categoria = nomeDaCategoria(produto.categoria)
  const fotos = [produto.imagem, ...(produto.imagens ?? [])]
  const fotoPrincipal = fotos[fotoAtiva] ?? ''
  const linhas = linhasDetalhes.filter((l) => produto.detalhes?.[l.chave])
  const relacionados = produtosRelacionados(produtos, produto, 4)

  function adicionarAoCarrinho() {
    if (!produto) return
    const resultado = adicionar(produto.id, quantidade)
    setFaixa(resultado)
    setAnuncio(
      resultado === 'limite'
        ? `Limite de ${QUANTIDADE_MAXIMA} unidades por produto no carrinho.`
        : `Adicionado ao carrinho. O carrinho tem ${rotuloProdutos(quantidadeTotal + quantidade)}.`,
    )
  }

  const detalhes = linhas.length > 0 && (
    <>
      <h2 className="mb-3 font-display text-2xl font-normal md:hidden">Detalhes do produto</h2>
      <div className={`${rotulo} mb-1 hidden md:block`}>Detalhes</div>
      {linhas.map((l) => (
        <div
          key={l.chave}
          className="flex h-[53px] items-center justify-between border-b border-oat text-base md:h-auto md:justify-start md:gap-6 md:border-greige md:py-3.5"
        >
          <span className="font-medium md:w-[120px]">{l.rotulo}</span>
          <span className="text-ink-2 md:font-light md:text-noir">{produto.detalhes?.[l.chave]}</span>
        </div>
      ))}
    </>
  )

  return (
    <main className="site-container">
      <PaginaMeta
        titulo={produto.nome}
        descricao={produto.descricao || `${produto.nome}, da categoria ${categoria}. Veja os detalhes e adicione ao carrinho.`}
      />
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {anuncio}
      </div>
      <nav
        aria-label="Caminho"
        className="-mx-5 flex h-13 items-center gap-0.5 px-5 text-sm text-ink-2 md:mx-0 md:h-auto md:gap-3 md:px-0 md:pt-8"
      >
        <Link to="/" className="flex h-11 items-center px-1.5 underline underline-offset-[3px] md:-mx-1.5">
          Início
        </Link>
        <span aria-hidden="true">/</span>
        <Link to="/catalogo" className="hidden h-11 items-center underline underline-offset-[3px] md:flex">
          Catálogo
        </Link>
        <span aria-hidden="true" className="hidden md:inline">
          /
        </span>
        <Link
          to={urlCategoria(produto.categoria)}
          className="flex h-11 items-center px-1.5 underline underline-offset-[3px] md:-mx-1.5"
        >
          {categoria}
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="text-noir md:font-medium">
          {produto.nome}
        </span>
      </nav>

      <section className="md:pt-5 lg:grid lg:grid-cols-[600px_1fr] lg:items-start lg:gap-[72px] lg:pt-6">
        <div className="flex flex-col md:gap-4">
          <div
            className={`-mx-5 flex h-[390px] items-center justify-center text-xs tracking-[0.14em] uppercase md:mx-0 md:h-[520px] lg:h-[600px] ${
              fotoPrincipal ? '' : tomPlaceholder(produto.id)
            }`}
          >
            {fotoPrincipal ? (
              <img src={fotoPrincipal} alt={produto.nome} className="size-full object-cover" />
            ) : (
              'Foto principal'
            )}
          </div>
          {fotos.length > 1 && (
            <div className="flex gap-3 py-3 md:grid md:grid-cols-4 md:gap-4 md:py-0">
              {fotos.map((f, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFotoAtiva(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  aria-pressed={i === fotoAtiva}
                  className={`size-16 shrink-0 overflow-hidden text-[11px] tracking-[0.14em] uppercase md:h-[150px] md:w-auto lg:h-[132px] ${
                    f ? '' : 'bg-oat'
                  } ${i === fotoAtiva ? 'border-2 border-noir' : ''}`}
                >
                  {f ? (
                    <img src={f} alt="" className="size-full object-cover" />
                  ) : (
                    <span className="hidden md:inline">Foto {i + 1}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-5 pb-6 md:gap-5 md:pt-10 md:pb-0 lg:pt-0">
          <div className={rotulo}>{categoria}</div>
          <h1 className="font-display text-[34px] leading-[1.1] font-normal md:text-[44px] lg:text-5xl">{produto.nome}</h1>
          <div className="mt-1 text-[26px] font-medium text-cherry md:mt-0 md:font-display md:text-[30px] md:font-normal lg:text-[32px]">
            {formatarPreco(produto.preco)}
          </div>
          {produto.descricao && (
            <p className="mt-2 text-base leading-normal font-light text-ink-2 md:mt-0 md:text-[17px] md:leading-[1.6]">
              {produto.descricao}
            </p>
          )}

          <div className="mt-4 flex flex-col gap-2 md:mt-0">
            <div id="rotulo-quantidade" className={rotulo}>
              Quantidade
            </div>
            <div
              role="group"
              aria-labelledby="rotulo-quantidade"
              className="flex items-center self-start rounded-btn border border-noir md:gap-2 md:border-0"
            >
              <button
                type="button"
                aria-label="Diminuir quantidade"
                aria-disabled={quantidade === 1}
                onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                className={passoQuantidade}
              >
                −
              </button>
              <span className="w-12 text-center text-lg font-medium md:w-16 md:font-normal" aria-live="polite">
                {quantidade}
              </span>
              <button
                type="button"
                aria-label="Aumentar quantidade"
                onClick={() => setQuantidade((q) => Math.min(99, q + 1))}
                className={passoQuantidade}
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={adicionarAoCarrinho}
            className="mt-4 flex h-[54px] items-center justify-center rounded-btn bg-cherry text-sm font-medium tracking-[0.16em] text-silk uppercase md:mt-0 md:h-14 md:tracking-[0.14em]"
          >
            Adicionar ao carrinho
          </button>
          {faixa && (
            <div className="flex h-13 items-center justify-between gap-3 rounded-btn bg-noir px-4 text-[15px] text-silk">
              <span>
                {faixa === 'limite'
                  ? `Limite de ${QUANTIDADE_MAXIMA} unidades por produto no carrinho.`
                  : 'Adicionado ao carrinho.'}
              </span>
              <Link to="/carrinho" className="flex h-11 shrink-0 items-center font-medium underline">
                Ver carrinho ({quantidadeTotal})
              </Link>
            </div>
          )}
          <p className="mt-1 text-sm leading-normal font-light text-ink-2 md:mt-0 md:font-normal">
            O pedido é finalizado pelo WhatsApp. Não há pagamento no site.
          </p>

          {detalhes && <div className="mt-2 hidden flex-col md:flex lg:mt-3">{detalhes}</div>}
        </div>
      </section>

      {detalhes && <section className="flex flex-col border-t border-oat pt-6 pb-6 md:hidden">{detalhes}</section>}

      {relacionados.length > 0 && (
        <section className="hidden flex-col gap-6 py-16 md:flex lg:py-[72px]">
          <h2 className="font-display text-[30px] font-normal lg:text-[32px]">Outros produtos em {categoria}</h2>
          <ProductGrid produtos={relacionados} variante="relacionado" />
        </section>
      )}
    </main>
  )
}
