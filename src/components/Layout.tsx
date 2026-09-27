import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import MenuMobile from './MenuMobile'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'

/** Contexto do Outlet: páginas podem abrir o Menu mobile (ex.: "Ver categorias" na Busca sem resultados). */
export type LayoutContext = {
  /** `origem` é o elemento que abriu o Menu: o foco volta a ele ao fechar. */
  abrirMenu: (origem: HTMLElement) => void
}

// Leva o foco ao <main> da página atual (tabIndex -1: focável só por código, sem contorno).
function focarConteudo() {
  const main = document.querySelector('main')
  if (!main) return
  main.tabIndex = -1
  main.focus({ preventScroll: true })
}

export default function Layout() {
  const { pathname, hash } = useLocation()
  // A Home tem footer próprio no desktop (variante `home`); o header é o mesmo em todas as páginas.
  const home = pathname === '/'

  // O <main> de cada página é o alvo do "Pular para o conteúdo": recebe id e tabIndex -1 (focável só por código).
  useEffect(() => {
    const main = document.querySelector('main')
    if (main) {
      main.id = 'conteudo'
      main.tabIndex = -1
    }
  }, [pathname])

  // Ao mudar de página (pathname): volta ao topo e move o foco para o conteúdo. Mudanças só de parâmetros
  // (filtros, paginação) e âncoras (#) não entram: essas telas já cuidam do próprio foco.
  const pathnameAnterior = useRef(pathname)
  useEffect(() => {
    if (pathnameAnterior.current === pathname) return
    pathnameAnterior.current = pathname
    if (hash) return
    window.scrollTo(0, 0)
    focarConteudo()
  }, [pathname, hash])
  const { quantidadeTotal: quantidadeCarrinho } = useCart()

  const [menuAberto, setMenuAberto] = useState(false)
  const origemRef = useRef<HTMLElement | null>(null)

  const abrirMenu = useCallback((origem: HTMLElement) => {
    origemRef.current = origem
    setMenuAberto(true)
  }, [])

  const fecharMenu = useCallback(() => {
    setMenuAberto(false)
    if (origemRef.current?.isConnected) origemRef.current.focus()
  }, [])

  function pularParaConteudo(e: MouseEvent) {
    e.preventDefault()
    document.querySelector('main')?.scrollIntoView()
    focarConteudo()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        onClick={pularParaConteudo}
        // Fora da tela até receber o foco (sem sr-only, para o padding não ser zerado).
        className="fixed top-3 left-3 z-[60] -translate-y-[300%] rounded-btn bg-cherry px-4 py-3 text-sm font-medium tracking-[0.14em] text-silk uppercase focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <SiteHeader menuAberto={menuAberto} onAbrirMenu={abrirMenu} quantidadeCarrinho={quantidadeCarrinho} />
      <div className="flex-1">
        <Outlet context={{ abrirMenu } satisfies LayoutContext} />
      </div>
      <SiteFooter home={home} />
      <MenuMobile aberto={menuAberto} onFechar={fecharMenu} quantidadeCarrinho={quantidadeCarrinho} />
    </div>
  )
}
