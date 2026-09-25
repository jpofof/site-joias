import { useCallback, useRef, useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { site } from '../config/site'
import { CartIcon, MenuIcon, SearchIcon } from './icons'
import MenuMobile from './MenuMobile'

// Substituído pela contagem real do carrinho no bloco 4 (feat/carrinho).
const quantidadeCarrinho = 0 as number

const botaoMobile =
  'flex h-14 w-17 flex-col items-center justify-center gap-[3px] text-[11px] font-medium tracking-[0.06em] text-silk uppercase'
const linkNav = 'flex h-12 items-center px-3 text-[15px] font-medium text-silk'
// Header próprio da Home no desktop (Main.dc.html): links em maiúsculas, gap 40 e badge com borda.
const linkNavHome = 'lg:px-0 lg:text-sm lg:font-normal lg:tracking-[0.16em] lg:uppercase'
const linkNavPadrao = 'lg:px-4'

export default function SiteHeader({ home = false }: { home?: boolean }) {
  const [menuAberto, setMenuAberto] = useState(false)
  const [busca, setBusca] = useState('')
  const botaoMenuRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()

  const fecharMenu = useCallback(() => {
    setMenuAberto(false)
    botaoMenuRef.current?.focus()
  }, [])

  const termo = busca.trim()
  const urlBusca = termo ? `/busca?q=${encodeURIComponent(termo)}` : '/busca'
  const rotuloCarrinho = `Carrinho, ${quantidadeCarrinho} ${quantidadeCarrinho === 1 ? 'produto' : 'produtos'}`

  const classeNavLink = ({ isActive }: { isActive: boolean }) =>
    `${linkNav} ${home ? linkNavHome : linkNavPadrao} ${isActive ? 'underline underline-offset-8' : ''}`

  function buscar(e: FormEvent) {
    e.preventDefault()
    navigate(urlBusca)
  }

  return (
    <header className="bg-noir">
      <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between pr-2 pl-5 md:h-20 md:pr-9 md:pl-12 lg:h-22 lg:px-24">
        <Link to="/" aria-label={`${site.nome}, página inicial`}>
          <img src="/logo-eduah.png" alt={site.nome} className={`block h-[34px] w-auto md:h-9 ${home ? 'lg:h-12' : 'lg:h-10'}`} />
        </Link>

        <nav aria-label="Principal">
          <div className="flex items-center md:hidden">
            <button
              ref={botaoMenuRef}
              type="button"
              onClick={() => setMenuAberto(true)}
              aria-haspopup="dialog"
              aria-expanded={menuAberto}
              aria-label="Abrir menu"
              className={botaoMobile}
            >
              <MenuIcon />
              Menu
            </button>
            <Link to="/busca" aria-label="Pesquisar" className={botaoMobile}>
              <SearchIcon />
              Pesquisar
            </Link>
            <Link to="/carrinho" aria-label={rotuloCarrinho} className={botaoMobile}>
              <CartIcon />
              Carrinho
            </Link>
          </div>

          <div className={`hidden items-center gap-1 md:flex ${home ? 'lg:gap-10' : 'lg:gap-2'}`}>
            <NavLink to="/catalogo" className={classeNavLink}>
              Catálogo
            </NavLink>
            <NavLink to="/sobre" className={classeNavLink}>
              Sobre a Eduáh
            </NavLink>

            <form
              role="search"
              onSubmit={buscar}
              className={`mr-3 ml-4 flex h-11 w-[140px] items-center gap-1 border-b border-silk focus-within:border-b-2 lg:w-[200px] ${
                home ? 'lg:mx-0' : 'lg:mr-4'
              }`}
            >
              <Link to={urlBusca} aria-label="Pesquisar" className="-ml-2.5 flex size-11 shrink-0 items-center justify-center text-silk">
                <SearchIcon strokeWidth={1.7} />
              </Link>
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar"
                aria-label="Pesquisar no catálogo"
                className="h-11 min-w-0 flex-1 border-0 bg-transparent p-0 text-base font-medium text-silk outline-none placeholder:text-oat"
              />
            </form>

            <Link
              to="/carrinho"
              aria-label={rotuloCarrinho}
              className={`flex h-12 items-center gap-2 px-3 text-[15px] font-medium text-silk lg:px-0 ${
                home ? 'lg:gap-2.5 lg:text-sm lg:font-normal lg:tracking-[0.16em] lg:uppercase' : ''
              }`}
            >
              <span className={home ? 'lg:hidden' : ''}>
                <CartIcon />
              </span>
              Carrinho
              <span
                className={`inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-silk px-1.5 text-xs font-medium text-cherry ${
                  home
                    ? 'lg:h-6 lg:min-w-6 lg:border lg:border-greige lg:bg-transparent lg:px-0 lg:font-normal lg:tracking-normal lg:text-silk'
                    : ''
                }`}
              >
                {quantidadeCarrinho}
              </span>
            </Link>
          </div>
        </nav>
      </div>

      <MenuMobile aberto={menuAberto} onFechar={fecharMenu} quantidadeCarrinho={quantidadeCarrinho} />
    </header>
  )
}
