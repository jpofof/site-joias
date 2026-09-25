import { categorias } from '../config/categorias'
import type { Categoria, Produto } from '../types/produto'

export type Ordem = 'recentes' | 'menor-preco' | 'maior-preco'

export const ordens: { valor: Ordem; rotulo: string }[] = [
  { valor: 'recentes', rotulo: 'Mais recentes' },
  { valor: 'menor-preco', rotulo: 'Menor preço' },
  { valor: 'maior-preco', rotulo: 'Maior preço' },
]

export type PaginaCatalogo = {
  itens: Produto[]
  pagina: number
  totalPaginas: number
  total: number
  /** Posição (1-based) do primeiro e do último item exibidos; 0 quando não há itens. */
  inicio: number
  fim: number
}

export function lerCategoria(valor: string | null): Categoria | null {
  return categorias.find((c) => c.slug === valor)?.slug ?? null
}

export function lerOrdem(valor: string | null): Ordem {
  return ordens.find((o) => o.valor === valor)?.valor ?? 'recentes'
}

export function lerPagina(valor: string | null): number {
  const n = Number(valor)
  return Number.isInteger(n) && n >= 1 ? n : 1
}

/** A ordem 'recentes' é a ordem do array de produtos (mais recentes primeiro). */
export function filtrarEOrdenar(lista: Produto[], categoria: Categoria | null, ordem: Ordem): Produto[] {
  const filtrada = categoria ? lista.filter((p) => p.categoria === categoria) : [...lista]
  if (ordem === 'menor-preco') return filtrada.sort((a, b) => a.preco - b.preco)
  if (ordem === 'maior-preco') return filtrada.sort((a, b) => b.preco - a.preco)
  return filtrada
}

/** Página fora do intervalo vira a página válida mais próxima (nunca fica vazia). */
export function paginar(lista: Produto[], pagina: number, tamanho: number): PaginaCatalogo {
  const total = lista.length
  const totalPaginas = Math.max(1, Math.ceil(total / tamanho))
  const atual = Math.min(Math.max(1, pagina), totalPaginas)
  const inicioIdx = (atual - 1) * tamanho
  const itens = lista.slice(inicioIdx, inicioIdx + tamanho)
  return {
    itens,
    pagina: atual,
    totalPaginas,
    total,
    inicio: total === 0 ? 0 : inicioIdx + 1,
    fim: inicioIdx + itens.length,
  }
}

export function produtosRelacionados(lista: Produto[], produto: Produto, limite: number): Produto[] {
  return lista.filter((p) => p.categoria === produto.categoria && p.id !== produto.id).slice(0, limite)
}

type EstadoCatalogo = { categoria: Categoria | null; ordem: Ordem; pagina: number }

/** Parâmetros da URL do Catálogo, omitindo os valores padrão (todas as categorias, 'recentes', página 1). */
export function paramsCatalogo({ categoria, ordem, pagina }: EstadoCatalogo) {
  const params = new URLSearchParams()
  if (categoria) params.set('categoria', categoria)
  if (ordem !== 'recentes') params.set('ordem', ordem)
  if (pagina > 1) params.set('pagina', String(pagina))
  return params
}

export function urlCatalogo(estado: EstadoCatalogo) {
  const consulta = paramsCatalogo(estado).toString()
  return consulta ? `/catalogo?${consulta}` : '/catalogo'
}
