import { Link } from 'react-router-dom'
import { nomeDaCategoria } from '../config/categorias'
import { formatarPreco } from '../lib/preco'
import { tomPlaceholder } from '../lib/placeholder'
import type { Produto } from '../types/produto'

export type VarianteCard = 'catalogo' | 'destaque' | 'relacionado' | 'busca'

type Props = {
  produto: Produto
  variante?: VarianteCard
  /** Mostra o selo NOVO sobre a foto. */
  novo?: boolean
  className?: string
}

// Medidas de cada contexto, como nos quadros (mobile / md tablet / lg desktop).
const estilos: Record<VarianteCard, { card: string; foto: string; categoria: string; nome: string; preco: string; botao: string }> = {
  catalogo: {
    card: 'gap-1',
    foto: 'h-[200px] md:h-[250px] lg:h-[280px]',
    categoria: 'text-[11px]',
    nome: 'text-[19px] md:text-[22px]',
    preco: 'text-base md:text-[17px]',
    botao: 'h-11 text-xs tracking-[0.14em] md:h-12 md:text-[13px]',
  },
  destaque: {
    card: 'gap-1 lg:gap-1.5',
    foto: 'h-[200px] md:h-[260px] lg:h-[300px] lg:text-xs',
    categoria: 'text-[11px] lg:text-xs',
    nome: 'text-[19px] md:text-[21px] lg:text-2xl',
    preco: 'text-base md:text-[17px] lg:text-lg',
    botao: 'h-11 text-xs tracking-[0.14em] md:h-12 md:text-[13px] lg:mt-2.5 lg:tracking-[0.16em]',
  },
  relacionado: {
    card: 'gap-1',
    foto: 'h-[220px] lg:h-[240px]',
    categoria: '',
    nome: 'text-xl lg:text-[22px]',
    preco: 'text-[17px]',
    botao: 'h-12 text-[13px] tracking-[0.14em]',
  },
  busca: {
    card: 'gap-1',
    foto: 'h-[180px] md:h-[220px] lg:h-[280px]',
    categoria: '',
    nome: 'text-[19px] md:text-xl lg:text-[22px]',
    preco: 'text-base md:text-[17px]',
    botao: 'h-11 text-xs tracking-[0.14em] md:h-12 md:text-[13px]',
  },
}

export default function ProductCard({ produto, variante = 'catalogo', novo = false, className = '' }: Props) {
  const e = estilos[variante]

  return (
    <article className={`flex flex-col ${e.card} ${className}`}>
      <div
        className={`relative mb-2 flex items-center justify-center text-[11px] tracking-[0.14em] uppercase ${e.foto} ${
          produto.imagem ? '' : tomPlaceholder(produto.id)
        } ${variante === 'destaque' ? 'lg:mb-2.5' : ''}`}
      >
        {produto.imagem ? (
          <img src={produto.imagem} alt={produto.nome} loading="lazy" className="size-full object-cover" />
        ) : (
          'Foto'
        )}
        {novo && (
          <span className="absolute top-2.5 left-2.5 bg-cherry px-2 py-1 text-[10px] font-medium tracking-[0.16em] text-silk md:text-[11px] lg:top-3.5 lg:left-3.5 lg:px-2.5 lg:py-[5px]">
            NOVO
          </span>
        )}
      </div>
      {e.categoria && (
        <div className={`font-medium tracking-[0.18em] text-ink-2 uppercase ${e.categoria}`}>
          {nomeDaCategoria(produto.categoria)}
        </div>
      )}
      <div className={`font-display leading-[1.2] ${e.nome}`}>{produto.nome}</div>
      <div className={`font-medium text-cherry ${e.preco}`}>{formatarPreco(produto.preco)}</div>
      <Link
        to={`/produto/${produto.id}`}
        aria-label={`Ver produto: ${produto.nome}`}
        className={`mt-2 flex items-center justify-center rounded-btn border border-noir font-medium uppercase ${e.botao}`}
      >
        Ver produto
      </Link>
    </article>
  )
}
