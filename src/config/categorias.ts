import type { Categoria } from '../types/produto'

export type CategoriaInfo = { slug: Categoria; nome: string }

// Ordem de exibição no menu e no footer.
export const categorias: CategoriaInfo[] = [
  { slug: 'aneis', nome: 'Anéis' },
  { slug: 'brincos', nome: 'Brincos' },
  { slug: 'colares', nome: 'Colares' },
  { slug: 'pulseiras', nome: 'Pulseiras' },
  { slug: 'piercings', nome: 'Piercings' },
  { slug: 'linha-masculina', nome: 'Linha masculina' },
]

// O filtro por categoria é lido pelo Catálogo no bloco 2 (feat/vitrine).
export const urlCategoria = (slug: Categoria) => `/catalogo?categoria=${slug}`

export const nomeDaCategoria = (slug: Categoria) => categorias.find((c) => c.slug === slug)?.nome ?? slug
