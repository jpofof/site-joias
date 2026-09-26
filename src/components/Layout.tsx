import { useCallback, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import MenuMobile from './MenuMobile'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'

// Substituído pela contagem real do carrinho no bloco 4 (feat/carrinho).
const quantidadeCarrinho = 0 as number

/** Contexto do Outlet: páginas podem abrir o Menu mobile (ex.: "Ver categorias" na Busca sem resultados). */
export type LayoutContext = {
  /** `origem` é o elemento que abriu o Menu: o foco volta a ele ao fechar. */
  abrirMenu: (origem: HTMLElement) => void
}

export default function Layout() {
  // A Home tem header e footer próprios no desktop (variante `home`).
  const home = useLocation().pathname === '/'

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

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader home={home} menuAberto={menuAberto} onAbrirMenu={abrirMenu} quantidadeCarrinho={quantidadeCarrinho} />
      <div className="flex-1">
        <Outlet context={{ abrirMenu } satisfies LayoutContext} />
      </div>
      <SiteFooter home={home} />
      <MenuMobile aberto={menuAberto} onFechar={fecharMenu} quantidadeCarrinho={quantidadeCarrinho} />
    </div>
  )
}
