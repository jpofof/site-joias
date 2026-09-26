import { createContext } from 'react'
import type { ItemCarrinho, ResumoCarrinho } from '../lib/carrinho'

export type ResultadoAdicionar = 'adicionado' | 'limite'

/** Última ação que pode ser desfeita (só a mais recente é guardada). */
export type AcaoDesfazer = { tipo: 'removido' | 'esvaziado'; idRemovido?: string }

export type CartValor = ResumoCarrinho & {
  itens: ItemCarrinho[]
  acaoDesfazer: AcaoDesfazer | null
  /** Soma à quantidade existente, mantendo a posição do item; acima do teto fica no teto e retorna 'limite'. */
  adicionar: (id: string, quantidade: number) => ResultadoAdicionar
  definirQuantidade: (id: string, quantidade: number) => void
  remover: (id: string) => void
  esvaziar: () => void
  desfazer: () => void
  limparDesfazer: () => void
}

export const CartContext = createContext<CartValor | null>(null)
