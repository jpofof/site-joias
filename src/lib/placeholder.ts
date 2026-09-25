import { produtos } from '../data/produtos'

// Tons da paleta usados pelos quadros nos placeholders de foto (oat, oat-3, oat-4, oat-2).
const tons = ['bg-oat', 'bg-oat-3', 'bg-oat-4', 'bg-oat-2']

/** Cor do placeholder pela posição do produto no catálogo, sempre a mesma para o mesmo produto. */
export function tomPlaceholder(id: string): string {
  const indice = produtos.findIndex((p) => p.id === id)
  return tons[Math.max(indice, 0) % tons.length]
}
