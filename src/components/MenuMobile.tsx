import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { categorias, urlCategoria } from '../config/categorias'
import { ArrowRightIcon, CloseIcon } from './icons'

type Props = {
  aberto: boolean
  onFechar: () => void
  quantidadeCarrinho: number
}

const rodapeLink = 'flex h-12 items-center text-sm font-medium tracking-[0.16em] uppercase'

export default function MenuMobile({ aberto, onFechar, quantidadeCarrinho }: Props) {
  const painelRef = useRef<HTMLElement>(null)
  const fecharRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!aberto) return

    fecharRef.current?.focus()
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onFechar()
        return
      }
      if (e.key !== 'Tab') return
      const focaveis = painelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      if (!focaveis?.length) return
      const primeiro = focaveis[0]
      const ultimo = focaveis[focaveis.length - 1]
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primeiro.focus()
      }
    }

    document.addEventListener('keydown', aoTeclar)
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = overflowAnterior
    }
  }, [aberto, onFechar])

  if (!aberto) return null

  return (
    <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-noir/60" onClick={onFechar} aria-hidden="true" />
      <nav
        ref={painelRef}
        aria-label="Menu principal"
        className="absolute top-0 right-0 flex h-full w-[320px] max-w-full flex-col overflow-y-auto bg-silk px-6 pt-3 pb-8"
      >
        <div className="mb-5 flex h-12 justify-end">
          <button
            ref={fecharRef}
            type="button"
            onClick={onFechar}
            aria-label="Fechar menu"
            className="flex h-12 items-center gap-2 pr-1 pl-3 text-xs font-medium tracking-[0.16em] uppercase"
          >
            Fechar
            <CloseIcon size={24} />
          </button>
        </div>

        <div className="mb-2 text-[12px] font-medium tracking-[0.22em] text-ink-2 uppercase">Catálogo</div>
        <ul>
          {categorias.map((c) => (
            <li key={c.slug}>
              <Link
                to={urlCategoria(c.slug)}
                onClick={onFechar}
                className="flex h-13 items-center justify-between border-b border-oat font-display text-2xl"
              >
                {c.nome}
                <ArrowRightIcon size={18} />
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/catalogo"
          onClick={onFechar}
          className="mt-5 flex h-13 items-center justify-center rounded-btn bg-cherry text-[13px] font-medium tracking-[0.16em] text-silk uppercase"
        >
          Ver catálogo
        </Link>

        <div className="mt-auto flex flex-col gap-1 border-t border-greige pt-6">
          <Link to="/sobre" onClick={onFechar} className={rodapeLink}>
            Sobre
          </Link>
          <Link to="/carrinho" onClick={onFechar} className={`${rodapeLink} justify-between`}>
            Carrinho
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-noir text-xs tracking-normal">
              {quantidadeCarrinho}
            </span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
