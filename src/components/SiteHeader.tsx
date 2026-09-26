import { Link, NavLink, useLocation } from 'react-router-dom'
import { site } from '../config/site'
import { CartIcon, MenuIcon, SearchIcon } from './icons'
import SearchField from './SearchField'

const botaoMobile =
  'flex h-14 w-17 flex-col items-center justify-center gap-[3px] text-[11px] font-medium tracking-[0.06em] text-silk uppercase'
const linkNav = 'flex h-12 items-center px-3 text-[15px] font-medium text-silk'
// Header próprio da Home no desktop (Main.dc.html): links em maiúsculas, gap 40 e badge com borda.
const linkNavHome = 'lg:px-0 lg:text-sm lg:font-normal lg:tracking-[0.16em] lg:uppercase'
const linkNavPadrao = 'lg:px-4'

type Props = {
  home?: boolean
  menuAberto: boolean
  onAbrirMenu: (origem: HTMLElement) => void
  quantidadeCarrinho: number
}

export default function SiteHeader({ home = false, menuAberto, onAbrirMenu, quantidadeCarrinho }: Props) {
  const naBusca = useLocation().pathname === '/busca'
  // Começa com o texto visível ("Carrinho 0"), para o nome acessível conter o rótulo do botão.
  const rotuloCarrinho = `Carrinho ${quantidadeCarrinho} ${quantidadeCarrinho === 1 ? 'produto' : 'produtos'}`

  const classeNavLink = ({ isActive }: { isActive: boolean }) =>
    `${linkNav} ${home ? linkNavHome : linkNavPadrao} ${isActive ? 'underline underline-offset-8' : ''}`

  return (
    <header className="bg-noir">
      <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between pr-2 pl-5 md:h-20 md:pr-9 md:pl-12 lg:h-22 lg:px-24">
        {/* Área clicável de 44px de altura (padding compensado por margem negativa, sem mover o logo). */}
        <Link
          to="/"
          aria-label={`${site.nome}, página inicial`}
          className={`block -my-[5px] py-[5px] md:-my-1 md:py-1 ${home ? 'lg:my-0 lg:py-0' : 'lg:-my-0.5 lg:py-0.5'}`}
        >
          <img src="/logo-eduah.png" alt={site.nome} width={400} height={154} className={`block h-[34px] w-auto md:h-9 ${home ? 'lg:h-12' : 'lg:h-10'}`} />
        </Link>

        <nav aria-label="Principal">
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={(e) => onAbrirMenu(e.currentTarget)}
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

            <SearchField className={`mr-3 ml-4 w-[140px] lg:w-[200px] ${home ? 'lg:mx-0' : 'lg:mr-4'}`} />

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

      {/* Só na Busca mobile: linha extra de 64px com o campo em largura total. */}
      {naBusca && (
        <div className="flex h-16 px-5 pt-1 pb-4 md:hidden">
          <SearchField className="w-full" />
        </div>
      )}
    </header>
  )
}
