import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  CHAVE_STORAGE,
  QUANTIDADE_MAXIMA,
  lerCarrinho,
  resumir,
  salvarCarrinho,
  type ItemCarrinho,
} from '../lib/carrinho'
import { CartContext, type AcaoDesfazer, type CartValor, type ResultadoAdicionar } from './cart-context'

type Desfazer = AcaoDesfazer & { itens: ItemCarrinho[] }

export function CartProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>(lerCarrinho)
  const [desfazerAtual, setDesfazerAtual] = useState<Desfazer | null>(null)

  useEffect(() => {
    salvarCarrinho(itens)
  }, [itens])

  // Mantém várias abas em sincronia.
  useEffect(() => {
    const aoMudar = (e: StorageEvent) => {
      if (e.key === CHAVE_STORAGE || e.key === null) setItens(lerCarrinho())
    }
    window.addEventListener('storage', aoMudar)
    return () => window.removeEventListener('storage', aoMudar)
  }, [])

  const adicionar = useCallback(
    (id: string, quantidade: number): ResultadoAdicionar => {
      const soma = (itens.find((i) => i.id === id)?.quantidade ?? 0) + quantidade
      setItens((atual) =>
        atual.some((i) => i.id === id)
          ? atual.map((i) => (i.id === id ? { ...i, quantidade: Math.min(QUANTIDADE_MAXIMA, i.quantidade + quantidade) } : i))
          : [...atual, { id, quantidade: Math.min(QUANTIDADE_MAXIMA, quantidade) }],
      )
      setDesfazerAtual(null)
      return soma > QUANTIDADE_MAXIMA ? 'limite' : 'adicionado'
    },
    [itens],
  )

  const definirQuantidade = useCallback((id: string, quantidade: number) => {
    const valida = Math.min(QUANTIDADE_MAXIMA, Math.max(1, quantidade))
    setItens((atual) => atual.map((i) => (i.id === id ? { ...i, quantidade: valida } : i)))
    setDesfazerAtual(null)
  }, [])

  const remover = useCallback(
    (id: string) => {
      setDesfazerAtual({ tipo: 'removido', idRemovido: id, itens })
      setItens((atual) => atual.filter((i) => i.id !== id))
    },
    [itens],
  )

  const esvaziar = useCallback(() => {
    setDesfazerAtual({ tipo: 'esvaziado', itens })
    setItens([])
  }, [itens])

  const desfazer = useCallback(() => {
    if (!desfazerAtual) return
    setItens(desfazerAtual.itens)
    setDesfazerAtual(null)
  }, [desfazerAtual])

  const limparDesfazer = useCallback(() => setDesfazerAtual(null), [])

  const valor = useMemo<CartValor>(
    () => ({
      ...resumir(itens),
      itens,
      acaoDesfazer: desfazerAtual && { tipo: desfazerAtual.tipo, idRemovido: desfazerAtual.idRemovido },
      adicionar,
      definirQuantidade,
      remover,
      esvaziar,
      desfazer,
      limparDesfazer,
    }),
    [itens, desfazerAtual, adicionar, definirQuantidade, remover, esvaziar, desfazer, limparDesfazer],
  )

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>
}
