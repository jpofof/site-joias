import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CategoryFilter from '../components/CategoryFilter'
import ProductGrid from '../components/ProductGrid'
import { produtos } from '../data/produtos'
import { useTamanhoPagina } from '../hooks/useTamanhoPagina'
import {
  filtrarEOrdenar,
  lerCategoria,
  lerOrdem,
  lerPagina,
  ordens,
  paginar,
  paramsCatalogo,
  urlCatalogo,
  type Ordem,
} from '../lib/catalogo'
import type { Categoria } from '../types/produto'

const rotulo = 'text-xs font-medium tracking-[0.18em] text-ink-2 uppercase'
const linkMigalha = 'flex h-11 items-center underline underline-offset-[3px]'

export default function Catalogo() {
  const [params, setParams] = useSearchParams()
  const tamanho = useTamanhoPagina()

  const categoria = lerCategoria(params.get('categoria'))
  const ordem = lerOrdem(params.get('ordem'))
  const pedida = lerPagina(params.get('pagina'))

  const pagina = paginar(filtrarEOrdenar(produtos, categoria, ordem), pedida, tamanho)
  const paginas = Array.from({ length: pagina.totalPaginas }, (_, i) => i + 1)

  // Ao trocar de página pelos botões: volta ao topo e leva o foco à lista de resultados (teclado e leitor de tela).
  const resultadosRef = useRef<HTMLElement>(null)
  const trocouPagina = useRef(false)
  useEffect(() => {
    if (!trocouPagina.current) return
    trocouPagina.current = false
    window.scrollTo(0, 0)
    resultadosRef.current?.focus({ preventScroll: true })
  }, [pagina.pagina])

  const mudarCategoria = (nova: Categoria | null) => setParams(paramsCatalogo({ categoria: nova, ordem, pagina: 1 }))
  const mudarOrdem = (nova: Ordem) => setParams(paramsCatalogo({ categoria, ordem: nova, pagina: 1 }))

  return (
    <main className="site-container pb-14 md:pb-16 lg:pb-[72px]">
      <section className="flex flex-col gap-4 pt-7 md:gap-5 md:pt-5 lg:gap-6 lg:pt-8">
        <nav aria-label="Caminho" className="hidden items-center gap-3 pt-3 text-sm text-ink-2 md:flex">
          <Link to="/" className={linkMigalha}>
            Início
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="flex h-11 items-center font-medium">
            Catálogo
          </span>
        </nav>

        <h1 className="font-display text-[34px] leading-[1.1] md:text-[44px] lg:text-5xl">Catálogo</h1>

        <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-[1fr_240px] md:gap-x-6 md:gap-y-5 lg:gap-x-8 lg:gap-y-6">
          <CategoryFilter
            categoria={categoria}
            urlDe={(c) => urlCatalogo({ categoria: c, ordem, pagina: 1 })}
            onSelecionar={mudarCategoria}
          />

          <div className="flex flex-col gap-1.5 md:col-start-2 md:row-start-2 lg:row-start-1 lg:self-end">
            <label htmlFor="ordenar" className={rotulo}>
              Ordenar por
            </label>
            <select
              id="ordenar"
              value={ordem}
              onChange={(e) => mudarOrdem(e.target.value as Ordem)}
              className="h-12 rounded-btn border border-noir bg-silk px-3 text-base text-noir"
            >
              {ordens.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          </div>

          <p aria-live="polite" aria-atomic="true" className="col-span-2 text-sm text-ink-2 md:col-span-1 md:col-start-1 md:row-start-2 md:self-end lg:col-span-2">
            Mostrando {pagina.inicio} a {pagina.fim} de {pagina.total} {pagina.total === 1 ? 'produto' : 'produtos'}
          </p>
        </div>
      </section>

      <section ref={resultadosRef} tabIndex={-1} aria-label="Resultados do catálogo" className="pt-5 outline-none md:pt-6">
        {pagina.total === 0 ? (
          <p className="py-10 text-ink-2">Nenhum produto nesta categoria por enquanto.</p>
        ) : (
          <ProductGrid produtos={pagina.itens} />
        )}
      </section>

      {pagina.totalPaginas > 1 && (
        <nav aria-label="Páginas do catálogo" className="flex flex-col items-center gap-3 pt-10 md:pt-12 lg:pt-14">
          <div className="flex gap-2">
            {paginas.map((n) => (
              <Link
                key={n}
                to={urlCatalogo({ categoria, ordem, pagina: n })}
                onClick={() => {
                  trocouPagina.current = n !== pagina.pagina
                }}
                aria-current={n === pagina.pagina ? 'page' : undefined}
                aria-label={`Página ${n}`}
                className={`flex size-12 items-center justify-center rounded-btn text-base ${
                  n === pagina.pagina ? 'bg-cherry font-medium text-silk underline' : 'border border-noir'
                }`}
              >
                {n}
              </Link>
            ))}
          </div>
          <div className="text-sm text-ink-2">
            Página {pagina.pagina} de {pagina.totalPaginas}
          </div>
        </nav>
      )}
    </main>
  )
}
