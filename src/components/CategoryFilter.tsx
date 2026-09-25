import { Link } from 'react-router-dom'
import { categorias } from '../config/categorias'
import type { Categoria } from '../types/produto'

type Props = {
  categoria: Categoria | null
  urlDe: (categoria: Categoria | null) => string
  onSelecionar: (categoria: Categoria | null) => void
}

const rotulo = 'text-xs font-medium tracking-[0.18em] text-ink-2 uppercase'
const chip = 'inline-flex h-11 items-center rounded-btn px-4 text-sm lg:px-[18px]'

// Renderiza dois itens irmãos (fragmento) para o grid da página: select no mobile, chips a partir do md.
export default function CategoryFilter({ categoria, urlDe, onSelecionar }: Props) {
  const opcoes = [{ slug: null, nome: 'Todas' }, ...categorias]

  return (
    <>
      <div className="flex flex-col gap-1.5 md:hidden">
        <label htmlFor="filtro-categoria" className={rotulo}>
          Categoria
        </label>
        <select
          id="filtro-categoria"
          value={categoria ?? ''}
          onChange={(e) => onSelecionar((e.target.value || null) as Categoria | null)}
          className="h-12 rounded-btn border border-noir bg-silk px-3 text-base text-noir"
        >
          {opcoes.map((o) => (
            <option key={o.slug ?? 'todas'} value={o.slug ?? ''}>
              {o.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden flex-col gap-2 md:col-span-2 md:row-start-1 md:flex lg:col-span-1 lg:self-end">
        <div id="rotulo-categoria" className={rotulo}>
          Categoria
        </div>
        <div role="group" aria-labelledby="rotulo-categoria" className="flex flex-wrap gap-2">
          {opcoes.map((o) => {
            const ativo = o.slug === categoria
            return (
              <Link
                key={o.slug ?? 'todas'}
                to={urlDe(o.slug)}
                aria-current={ativo ? 'true' : undefined}
                className={`${chip} ${ativo ? 'bg-cherry font-medium text-silk underline' : 'border border-noir'}`}
              >
                {ativo && <span aria-hidden="true">✓&nbsp;</span>}
                {o.nome}
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
