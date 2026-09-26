import { useEffect, useMemo, useState } from 'react'
import { Link, useOutletContext, useSearchParams } from 'react-router-dom'
import type { LayoutContext } from '../components/Layout'
import ProductGrid from '../components/ProductGrid'
import { urlCategoria } from '../config/categorias'
import { produtos } from '../data/produtos'
import { useValorPorBreakpoint } from '../hooks/useValorPorBreakpoint'
import { agruparEOrdenar, buscar, lerOrdemBusca, ordensBusca, type OrdemBusca } from '../lib/busca'

const rotulo = 'text-xs font-medium tracking-[0.18em] text-ink-2 uppercase'
const linkMigalha = '-mx-1.5 flex h-11 items-center px-1.5 underline underline-offset-[3px]'
const botaoVazio =
  'flex h-13 items-center justify-center self-start rounded-btn bg-cherry px-7 text-[13px] font-medium tracking-[0.14em] text-silk uppercase md:px-8 md:text-sm'
const botaoVerTodos =
  'flex h-12 items-center justify-center rounded-btn border border-noir text-[13px] font-medium tracking-[0.12em] uppercase lg:hidden'

export default function Busca() {
  const [params, setParams] = useSearchParams()
  const { abrirMenu } = useOutletContext<LayoutContext>()
  // Prévia por grupo: 2 produtos no mobile e 3 no tablet e no desktop (o 4º espaço do desktop é o "Ver todos").
  const limite = useValorPorBreakpoint(2, 3, 3)

  const termo = (params.get('q') ?? '').trim()
  const ordem = lerOrdemBusca(params.get('ordem'))
  const resultados = useMemo(() => buscar(produtos, termo), [termo])
  const grupos = agruparEOrdenar(resultados, ordem)
  const total = resultados.length

  const titulo =
    total === 1 ? `1 resultado para “${termo}”` : `${total} resultados para “${termo}”`
  const rotuloOrdem = ordensBusca.find((o) => o.valor === ordem)?.rotulo ?? ''

  // Anúncio único por mudança: a região começa vazia e é preenchida depois da montagem, então o
  // carregamento inicial gera uma só leitura (o h1 visível não é uma região live).
  const textoAnuncio = !termo
    ? ''
    : total === 0
      ? `Nenhum produto encontrado para “${termo}”`
      : `${titulo}${ordem === 'relevancia' ? '' : `, ordenados por ${rotuloOrdem.toLowerCase()}`}`
  const [anuncio, setAnuncio] = useState('')
  useEffect(() => {
    const id = window.setTimeout(() => setAnuncio(textoAnuncio), 0)
    return () => window.clearTimeout(id)
  }, [textoAnuncio])

  function mudarOrdem(nova: OrdemBusca) {
    const proximos = new URLSearchParams(params)
    if (nova === 'relevancia') proximos.delete('ordem')
    else proximos.set('ordem', nova)
    setParams(proximos)
  }

  // Chips de salto: rola até o grupo e leva o foco ao título dele (teclado e leitor de tela).
  function irParaGrupo(slug: string) {
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(slug)?.scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth' })
    document.getElementById(`titulo-${slug}`)?.focus({ preventScroll: true })
  }

  const migalha = (
    <nav aria-label="Caminho" className="hidden items-center gap-3 pt-3 text-sm text-ink-2 md:flex">
      <Link to="/" className={linkMigalha}>
        Início
      </Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page" className="flex h-11 items-center font-medium">
        Pesquisa
      </span>
    </nav>
  )

  const anunciador = (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {anuncio}
    </div>
  )

  // Sem termo ou sem resultados: só o convite / a mensagem, sem chips nem grupos.
  if (!termo || total === 0) {
    const semTermo = !termo
    return (
      <main className="site-container pb-14 md:pb-16 lg:pb-[72px]">
        {anunciador}
        <section className="flex flex-col gap-3 pt-7 md:gap-3.5 md:pt-5 lg:max-w-[640px] lg:gap-4 lg:pt-8 md:max-w-[560px]">
          {migalha}
          <h1 className="font-display text-[26px] leading-[1.15] font-normal md:text-[30px] lg:text-[32px]">
            {semTermo ? 'Pesquisa' : `Nenhum produto encontrado para “${termo}”`}
          </h1>
          <p className="text-base leading-normal font-light text-ink-2 md:text-[17px]">
            {semTermo
              ? 'Digite o nome de uma peça ou de uma categoria.'
              : 'Confira a grafia ou tente uma palavra mais geral, como “anel” ou “colar”. Você também pode navegar pelas categorias.'}
          </p>
          {semTermo ? (
            <Link to="/catalogo" className={botaoVazio}>
              Ver catálogo
            </Link>
          ) : (
            <>
              {/* No mobile o design abre o Menu; no tablet e no desktop leva ao Catálogo. */}
              <button type="button" onClick={(e) => abrirMenu(e.currentTarget)} className={`${botaoVazio} md:hidden`}>
                Ver categorias
              </button>
              <Link to="/catalogo" className={`${botaoVazio} hidden md:flex`}>
                Ver catálogo
              </Link>
            </>
          )}
        </section>
      </main>
    )
  }

  return (
    <main className="site-container pb-14 md:pb-16 lg:pb-[72px]">
      {anunciador}
      <section className="flex flex-col gap-4 pt-7 md:gap-5 md:pt-5 lg:gap-6 lg:pt-8">
        {migalha}
        <h1 className="font-display text-[30px] leading-[1.1] font-normal md:text-[40px] lg:text-5xl">{titulo}</h1>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6 lg:gap-8">
          <div className="flex flex-col gap-2">
            <div id="rotulo-grupos" className={rotulo}>
              Resultados por categoria
            </div>
            <nav aria-labelledby="rotulo-grupos" className="flex flex-wrap gap-2">
              {grupos.map((g) => (
                <a
                  key={g.categoria}
                  href={`#${g.categoria}`}
                  onClick={(e) => {
                    e.preventDefault()
                    irParaGrupo(g.categoria)
                  }}
                  className="inline-flex h-11 items-center rounded-btn border border-noir px-3.5 text-sm md:px-4"
                >
                  {g.nome} ({g.itens.length})
                </a>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-1.5 md:w-[220px] md:shrink-0 lg:w-[240px]">
            <label htmlFor="ordenar-busca" className={rotulo}>
              Ordenar por
            </label>
            <select
              id="ordenar-busca"
              value={ordem}
              onChange={(e) => mudarOrdem(e.target.value as OrdemBusca)}
              className="h-12 rounded-btn border border-noir bg-silk px-3 text-base text-noir"
            >
              {ordensBusca.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {grupos.map((g) => {
        const mostrados = g.itens.slice(0, limite)
        const temMais = g.itens.length > limite
        const verTodos = `Ver todos em ${g.nome} (${g.itens.length})`
        return (
          <section
            key={g.categoria}
            id={g.categoria}
            aria-labelledby={`titulo-${g.categoria}`}
            className="flex flex-col gap-4 pt-10 md:gap-5 md:pt-12 lg:gap-6 lg:pt-14"
          >
            <div className="flex items-baseline justify-between border-b border-greige pb-2 md:pb-2.5 lg:pb-3">
              <h2
                id={`titulo-${g.categoria}`}
                tabIndex={-1}
                className="font-display text-[26px] leading-[1.15] font-normal md:text-[30px] lg:text-[32px]"
              >
                {g.nome}
              </h2>
              <span className="text-sm text-ink-2 md:text-[15px]">
                {g.itens.length} {g.itens.length === 1 ? 'resultado' : 'resultados'}
              </span>
            </div>
            <ProductGrid produtos={mostrados} variante="busca">
              {temMais && (
                <Link
                  to={urlCategoria(g.categoria)}
                  className="hidden h-full min-h-[200px] flex-col items-center justify-center rounded-btn border border-noir px-6 text-center text-sm leading-[1.5] font-medium tracking-[0.14em] uppercase lg:flex"
                >
                  {verTodos}
                </Link>
              )}
            </ProductGrid>
            {temMais && (
              <Link to={urlCategoria(g.categoria)} className={botaoVerTodos}>
                {verTodos}
              </Link>
            )}
          </section>
        )
      })}
    </main>
  )
}
