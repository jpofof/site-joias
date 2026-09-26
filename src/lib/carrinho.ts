import { produtos } from '../data/produtos'
import type { Produto } from '../types/produto'
import { formatarPreco } from './preco'

export type ItemCarrinho = { id: string; quantidade: number }

export type LinhaCarrinho = { produto: Produto; quantidade: number; subtotal: number }

export type ResumoCarrinho = { linhas: LinhaCarrinho[]; total: number; quantidadeTotal: number }

export const QUANTIDADE_MAXIMA = 99
export const CHAVE_STORAGE = 'eduah:carrinho'

/**
 * Aceita só o que tem formato de item ({ id, quantidade }) com id existente no catálogo.
 * Duplicados são descartados e a quantidade fica entre 1 e QUANTIDADE_MAXIMA.
 */
export function normalizarItens(bruto: unknown, catalogo: Produto[] = produtos): ItemCarrinho[] {
  if (!Array.isArray(bruto)) return []
  const vistos = new Set<string>()
  const itens: ItemCarrinho[] = []
  for (const candidato of bruto) {
    if (typeof candidato !== 'object' || candidato === null) continue
    const { id, quantidade } = candidato as Record<string, unknown>
    if (typeof id !== 'string' || vistos.has(id) || !catalogo.some((p) => p.id === id)) continue
    if (typeof quantidade !== 'number' || !Number.isFinite(quantidade)) continue
    vistos.add(id)
    itens.push({ id, quantidade: Math.min(QUANTIDADE_MAXIMA, Math.max(1, Math.floor(quantidade))) })
  }
  return itens
}

/** Lê o carrinho salvo. Storage indisponível ou conteúdo inválido resultam em carrinho vazio, sem lançar erro. */
export function lerCarrinho(): ItemCarrinho[] {
  try {
    const bruto = window.localStorage.getItem(CHAVE_STORAGE)
    return bruto ? normalizarItens(JSON.parse(bruto)) : []
  } catch {
    return []
  }
}

/** Salva só { id, quantidade }. Falhas (storage indisponível ou cheio) são ignoradas: o carrinho segue na memória. */
export function salvarCarrinho(itens: ItemCarrinho[]): void {
  try {
    window.localStorage.setItem(CHAVE_STORAGE, JSON.stringify(itens))
  } catch {
    // Sem localStorage (modo privado, bloqueio): o carrinho vale só durante esta visita.
  }
}

/** Único lugar que resolve nome e preço pelo catálogo atual e calcula subtotais e total (em centavos, sem erro de ponto flutuante). */
export function resumir(itens: ItemCarrinho[], catalogo: Produto[] = produtos): ResumoCarrinho {
  const linhas: LinhaCarrinho[] = []
  let centavos = 0
  let quantidadeTotal = 0
  for (const item of itens) {
    const produto = catalogo.find((p) => p.id === item.id)
    if (!produto) continue
    const subtotalCentavos = Math.round(produto.preco * 100) * item.quantidade
    linhas.push({ produto, quantidade: item.quantidade, subtotal: subtotalCentavos / 100 })
    centavos += subtotalCentavos
    quantidadeTotal += item.quantidade
  }
  return { linhas, total: centavos / 100, quantidadeTotal }
}

/** Link do WhatsApp com a mensagem codificada (as quebras de linha viram %0A). */
export function urlWhatsApp(numero: string, mensagem: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
}

export const rotuloProdutos = (quantidade: number) => `${quantidade} ${quantidade === 1 ? 'produto' : 'produtos'}`

const SAUDACAO = 'Olá! Gostaria de pedir:'

/** Tamanho máximo da URL final do WhatsApp (conservador, para funcionar em qualquer navegador). */
export const LIMITE_URL = 2000

// Sem número configurado a prévia ainda precisa medir a URL: usa um número do mesmo tamanho.
const NUMERO_DE_REFERENCIA = '5500000000000'

/**
 * completo: `2x Nome — R$ 00,00` por produto; compacto: `2x Nome` (sem preço por linha, mantém todos os itens);
 * resumido: só os primeiros itens que cabem e uma linha "e mais N produtos". O total sempre aparece.
 */
export type FormatoMensagem = 'completo' | 'compacto' | 'resumido'

export type MensagemPedido = { texto: string; formato: FormatoMensagem; omitidos: number }

/**
 * Mensagem do pedido, pura e única: é o texto da prévia e também o que vai na URL.
 * Tenta o formato completo, depois o compacto e, se ainda passar de LIMITE_URL, corta a lista
 * dos itens do fim e avisa quantos produtos ficaram de fora.
 */
export function montarMensagemPedido(linhas: LinhaCarrinho[], total: number, numero = ''): MensagemPedido {
  const preco = (valor: number) => formatarPreco(valor).replace(/\s/g, ' ')
  const montar = (itens: string[]) => [SAUDACAO, ...itens, `Total: ${preco(total)}`].join('\n')
  const cabe = (texto: string) => urlWhatsApp(numero || NUMERO_DE_REFERENCIA, texto).length <= LIMITE_URL

  const completo = montar(linhas.map((l) => `${l.quantidade}x ${l.produto.nome} — ${preco(l.subtotal)}`))
  if (cabe(completo)) return { texto: completo, formato: 'completo', omitidos: 0 }

  const compactas = linhas.map((l) => `${l.quantidade}x ${l.produto.nome}`)
  const compacto = montar(compactas)
  if (cabe(compacto)) return { texto: compacto, formato: 'compacto', omitidos: 0 }

  for (let mantidos = linhas.length - 1; mantidos >= 0; mantidos--) {
    const omitidos = linhas.slice(mantidos).reduce((soma, l) => soma + l.quantidade, 0)
    const texto = montar([...compactas.slice(0, mantidos), `e mais ${rotuloProdutos(omitidos)}`])
    if (cabe(texto)) return { texto, formato: 'resumido', omitidos }
  }
  const todos = linhas.reduce((soma, l) => soma + l.quantidade, 0)
  return { texto: montar([`e mais ${rotuloProdutos(todos)}`]), formato: 'resumido', omitidos: todos }
}
