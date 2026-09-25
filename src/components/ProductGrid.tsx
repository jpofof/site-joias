import type { Produto } from '../types/produto'
import ProductCard, { type VarianteCard } from './ProductCard'

type Props = {
  produtos: Produto[]
  variante?: VarianteCard
  /** Marca todos os cards com o selo NOVO (seção Novidades). */
  novos?: boolean
}

const grades: Record<VarianteCard, string> = {
  catalogo: 'grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 md:gap-x-5 md:gap-y-10 lg:grid-cols-4 lg:gap-x-6',
  destaque: 'grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6',
  relacionado: 'grid-cols-3 gap-5 lg:grid-cols-4 lg:gap-6',
}

export default function ProductGrid({ produtos, variante = 'catalogo', novos = false }: Props) {
  return (
    <div className={`grid ${grades[variante]}`}>
      {produtos.map((p, i) => (
        <ProductCard
          key={p.id}
          produto={p}
          variante={variante}
          novo={novos}
          // No tablet a Home mostra 3 destaques por linha: o 4º card só aparece no mobile e no desktop.
          className={variante === 'destaque' && i === 3 ? 'md:max-lg:hidden' : ''}
        />
      ))}
    </div>
  )
}
