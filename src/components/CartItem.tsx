import { nomeDaCategoria } from '../config/categorias'
import { QUANTIDADE_MAXIMA, type LinhaCarrinho } from '../lib/carrinho'
import { tomPlaceholder } from '../lib/placeholder'
import { formatarPreco } from '../lib/preco'

type Props = {
  linha: LinhaCarrinho
  onQuantidade: (id: string, quantidade: number) => void
  onRemover: (id: string) => void
  onLimite: () => void
}

// Seletor de quantidade: compacto (grupo com borda, 44px) no mobile; botões soltos de 48px no tablet e no desktop.
function Quantidade({ linha, onQuantidade, onLimite, className }: Omit<Props, 'onRemover'> & { className: string }) {
  const { produto, quantidade } = linha
  const passo = 'flex items-center justify-center text-xl md:size-12 md:rounded-btn md:border md:border-noir md:text-[22px]'

  return (
    <div role="group" aria-label={`Quantidade de ${produto.nome}`} className={className}>
      <button
        type="button"
        aria-label={`Diminuir quantidade de ${produto.nome}`}
        aria-disabled={quantidade <= 1}
        onClick={() => quantidade > 1 && onQuantidade(produto.id, quantidade - 1)}
        className={`size-11 ${passo}`}
      >
        −
      </button>
      <span className="w-7 text-center text-base font-medium md:w-10 md:text-lg md:font-normal lg:w-12">{quantidade}</span>
      <button
        type="button"
        aria-label={`Aumentar quantidade de ${produto.nome}`}
        aria-disabled={quantidade >= QUANTIDADE_MAXIMA}
        onClick={() => (quantidade >= QUANTIDADE_MAXIMA ? onLimite() : onQuantidade(produto.id, quantidade + 1))}
        className={`size-11 ${passo}`}
      >
        +
      </button>
    </div>
  )
}

export default function CartItem({ linha, onQuantidade, onRemover, onLimite }: Props) {
  const { produto } = linha
  const remover = (
    <button
      type="button"
      data-remover={produto.id}
      aria-label={`Remover ${produto.nome} do carrinho`}
      onClick={() => onRemover(produto.id)}
      className="flex h-11 items-center px-1 text-sm underline md:w-fit md:px-0 md:underline-offset-[3px]"
    >
      Remover
    </button>
  )

  return (
    <article className="flex gap-4 border-b border-oat py-4 md:grid md:grid-cols-[104px_1fr_auto] md:items-center md:gap-5 md:border-greige md:py-5 lg:grid-cols-[112px_1fr_auto] lg:gap-6">
      <div
        className={`flex size-24 shrink-0 items-center justify-center text-[11px] tracking-[0.14em] uppercase md:size-[104px] lg:size-28 ${
          produto.imagem ? '' : tomPlaceholder(produto.id)
        }`}
      >
        {produto.imagem ? <img src={produto.imagem} alt={produto.nome} className="size-full object-cover" /> : 'Foto'}
      </div>

      <div className="flex grow flex-col gap-1">
        <div className="text-[11px] font-medium tracking-[0.18em] text-ink-2 uppercase">{nomeDaCategoria(produto.categoria)}</div>
        <div className="font-display text-[19px] leading-[1.2] md:text-[21px] md:leading-[normal] lg:text-[22px]">{produto.nome}</div>
        <div className="text-base font-medium text-cherry">{formatarPreco(produto.preco)}</div>
        <div className="mt-1 flex items-center justify-between md:hidden">
          <Quantidade
            linha={linha}
            onQuantidade={onQuantidade}
            onLimite={onLimite}
            className="flex items-center rounded-btn border border-noir"
          />
          {remover}
        </div>
        <div className="hidden md:block">{remover}</div>
      </div>

      <Quantidade linha={linha} onQuantidade={onQuantidade} onLimite={onLimite} className="hidden items-center gap-2 md:flex" />
    </article>
  )
}
