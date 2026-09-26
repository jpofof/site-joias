import { useEffect, useRef, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export type ItemIndice = { id: string; titulo: string }

type Props = {
  titulo: string
  /** Nome da página no caminho "Início / …" (não aparece no mobile, como no quadro). */
  atual: string
  /** Linha abaixo do título (ex.: "Última atualização"). */
  subtitulo?: ReactNode
  /** Seções para o "Nesta página". Sem índice, a página é só o texto. */
  indice?: ItemIndice[]
  /** Link para a outra página legal: na coluna lateral ("Nesta página") no desktop e ao fim do texto no tablet e no mobile. */
  linkExtra?: { para: string; texto: string }
  children: ReactNode
}

// Rola até a seção (respeitando "reduzir movimento") e leva o foco ao título dela.
function irParaSecao(id: string) {
  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth' })
  document.getElementById(`titulo-${id}`)?.focus({ preventScroll: true })
}

export function SecaoTexto({ id, titulo, children }: { id: string; titulo: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`titulo-${id}`} className="flex scroll-mt-6 flex-col gap-3 pt-8 md:pt-10">
      <h2 id={`titulo-${id}`} tabIndex={-1} className="font-display text-2xl leading-[1.2] font-normal md:text-[28px]">
        {titulo}
      </h2>
      {children}
    </section>
  )
}

// Layout das páginas de texto (Privacidade, Termos, Sobre): caminho, título, "Nesta página" e seções.
export default function PaginaTexto({ titulo, atual, subtitulo, indice, linkExtra, children }: Props) {
  const navigate = useNavigate()
  const hashInicial = useRef(useLocation().hash)

  // Link direto com âncora (ex.: /privacidade#direitos) já chega na seção certa. Numa carga completa da página
  // o navegador também processa o fragmento e tira o foco do alvo, então o foco só é movido depois do load.
  useEffect(() => {
    const id = hashInicial.current.slice(1)
    if (!id) return
    const ir = () => window.setTimeout(() => irParaSecao(id), 0)
    if (document.readyState === 'complete') {
      ir()
      return
    }
    window.addEventListener('load', ir, { once: true })
    return () => window.removeEventListener('load', ir)
  }, [])

  return (
    <main className="site-container">
      <section className="pt-5 md:flex md:flex-col md:gap-3 lg:block lg:pt-8">
        <nav aria-label="Caminho" className="hidden items-center gap-3 pt-3 text-sm text-ink-2 md:flex">
          <Link to="/" className="-mx-1.5 flex h-11 items-center px-1.5 underline underline-offset-[3px]">
            Início
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="flex h-11 items-center font-medium">
            {atual}
          </span>
        </nav>
        <h1 className="mt-3 mb-2 font-display text-[34px] leading-[1.1] font-normal md:m-0 md:text-[44px] lg:mt-6 lg:mb-2 lg:text-5xl">
          {titulo}
        </h1>
        {subtitulo}
      </section>

      <section
        className={
          indice ? 'lg:grid lg:grid-cols-[300px_1fr] lg:items-start lg:gap-24 lg:pt-6 lg:pb-24' : 'lg:pt-6 lg:pb-24'
        }
      >
        {indice && (
          <nav
            aria-label="Nesta página"
            className="flex flex-col pt-6 md:mt-6 md:border md:border-greige md:bg-oat-1 md:px-6 md:py-5 lg:mt-0 lg:border-0 lg:bg-transparent lg:p-0 lg:pt-10"
          >
            <div className="mb-1 text-xs font-medium tracking-[0.18em] text-ink-2 uppercase md:mb-2">Nesta página</div>
            <div className="flex flex-col border-t border-greige md:grid md:grid-cols-2 md:gap-x-8 md:border-t-0 lg:flex">
              {indice.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    navigate({ hash: `#${item.id}` }, { replace: true })
                    irParaSecao(item.id)
                  }}
                  className="flex min-h-[45px] items-center border-b border-greige text-[15px] leading-[1.3] md:min-h-11 md:border-b-0"
                >
                  {item.titulo}
                </a>
              ))}
            </div>
            {linkExtra && (
              <div className="mt-4 hidden lg:block">
                <Link to={linkExtra.para} className="flex h-11 w-fit items-center underline underline-offset-[3px]">
                  {linkExtra.texto}
                </Link>
              </div>
            )}
          </nav>
        )}
        <div className="flex flex-col pb-12 md:pb-16 lg:max-w-[720px] lg:pb-0">
          {children}
          {linkExtra && (
            <div className="mt-8 lg:hidden">
              <Link to={linkExtra.para} className="flex h-11 w-fit items-center underline underline-offset-[3px]">
                {linkExtra.texto}
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
