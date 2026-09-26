import { categorias, nomeDaCategoria } from '../config/categorias'
import type { Categoria, Produto } from '../types/produto'

export type OrdemBusca = 'relevancia' | 'menor-preco' | 'maior-preco' | 'recentes'

export const ordensBusca: { valor: OrdemBusca; rotulo: string }[] = [
  { valor: 'relevancia', rotulo: 'Mais relevantes' },
  { valor: 'menor-preco', rotulo: 'Menor preço' },
  { valor: 'maior-preco', rotulo: 'Maior preço' },
  { valor: 'recentes', rotulo: 'Mais recentes' },
]

export type ResultadoBusca = { produto: Produto; pontos: number }

export type GrupoBusca = { categoria: Categoria; nome: string; itens: Produto[] }

export function lerOrdemBusca(valor: string | null): OrdemBusca {
  return ordensBusca.find((o) => o.valor === valor)?.valor ?? 'relevancia'
}

/** Minúsculas, sem acentos e com espaços simples: "Anéis" e "aneis" viram o mesmo texto. */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Busca em nome, nome da categoria e descrição. Todas as palavras do termo precisam aparecer (E).
 * Pontos por palavra: nome 3, categoria 2, descrição 1. Termo vazio não retorna nada.
 */
export function buscar(lista: Produto[], termo: string): ResultadoBusca[] {
  const palavras = normalizar(termo).split(' ').filter(Boolean)
  if (palavras.length === 0) return []

  const resultados: ResultadoBusca[] = []
  for (const produto of lista) {
    const nome = normalizar(produto.nome)
    const categoria = normalizar(nomeDaCategoria(produto.categoria))
    const descricao = normalizar(produto.descricao ?? '')

    let pontos = 0
    let achouTodas = true
    for (const palavra of palavras) {
      if (nome.includes(palavra)) pontos += 3
      else if (categoria.includes(palavra)) pontos += 2
      else if (descricao.includes(palavra)) pontos += 1
      else {
        achouTodas = false
        break
      }
    }
    if (achouTodas) resultados.push({ produto, pontos })
  }
  return resultados
}

/**
 * Agrupa por categoria (na ordem das categorias) e ordena os produtos dentro de cada grupo.
 * 'recentes' e os empates de 'relevancia' seguem a ordem do catálogo (mais recentes primeiro).
 */
export function agruparEOrdenar(resultados: ResultadoBusca[], ordem: OrdemBusca): GrupoBusca[] {
  return categorias
    .map((c) => {
      const doGrupo = resultados.filter((r) => r.produto.categoria === c.slug)
      if (ordem === 'relevancia') doGrupo.sort((a, b) => b.pontos - a.pontos)
      else if (ordem === 'menor-preco') doGrupo.sort((a, b) => a.produto.preco - b.produto.preco)
      else if (ordem === 'maior-preco') doGrupo.sort((a, b) => b.produto.preco - a.produto.preco)
      return { categoria: c.slug, nome: c.nome, itens: doGrupo.map((r) => r.produto) }
    })
    .filter((g) => g.itens.length > 0)
}
