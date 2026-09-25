import { Link } from 'react-router-dom'
import type { Produto } from '../types/produto'
import { ArrowRightIcon } from './icons'
import ProductGrid from './ProductGrid'

type Props = {
  eyebrow: string
  titulo: string
  produtos: Produto[]
  fundo: string
  /** Rótulo do link de cabeçalho no desktop e no tablet (o mobile não tem link, como no quadro). */
  linkDesktop: string
  linkTablet: string
  /** Mostra o selo NOVO em todos os cards. */
  novos?: boolean
}

// Seção de vitrine da Home: usada por "Destaques da marca" e por "Novidades".
export default function ProductShowcase({ eyebrow, titulo, produtos, fundo, linkDesktop, linkTablet, novos }: Props) {
  return (
    <section className={fundo}>
      <div className="site-container flex min-h-[900px] flex-col gap-7 py-12 md:min-h-[720px] md:gap-8 md:py-16 lg:min-h-[780px] lg:gap-12 lg:py-20">
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-2.5 md:gap-3 lg:gap-3.5">
            <div className="text-xs font-medium tracking-[0.22em] text-ink-2 uppercase md:tracking-[0.18em] lg:text-[13px] lg:tracking-[0.22em]">
              {eyebrow}
            </div>
            <h2 className="font-display text-[34px] leading-[1.1] font-normal md:text-[40px] lg:text-[52px]">{titulo}</h2>
          </div>
          <Link
            to="/catalogo"
            className="hidden h-11 items-center text-sm font-medium tracking-[0.14em] uppercase underline underline-offset-[3px] md:flex lg:hidden"
          >
            {linkTablet}
            <ArrowRightIcon size={16} />
          </Link>
          <Link
            to="/catalogo"
            className="hidden items-center gap-2 border-b border-noir pb-1.5 text-sm font-medium tracking-[0.16em] uppercase lg:flex"
          >
            {linkDesktop}
            <ArrowRightIcon size={16} />
          </Link>
        </div>
        <ProductGrid produtos={produtos} variante="destaque" novos={novos} />
      </div>
    </section>
  )
}
