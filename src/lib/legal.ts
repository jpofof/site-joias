import type { Legal } from '../config/legal'

/** Campos de `legal.ts` que podem aparecer no meio do texto (marcados como `{campo}`). */
export type CampoNoTexto = Exclude<keyof Legal, 'privacidadeAtualizadaEm' | 'termosAtualizadosEm'>

export type Bloco = { tipo: 'p'; texto: string } | { tipo: 'link'; para: string; texto: string }

export type SecaoLegal = { id: string; titulo: string; blocos: Bloco[] }

/** Texto que aparece, entre colchetes, enquanto o campo está vazio (igual ao dos quadros do design). */
export const rotuloPendente: Record<CampoNoTexto | 'data', string> = {
  responsavel: '[nome completo ou razão social]',
  cpfCnpj: '[número]',
  email: '[e-mail]',
  provedorHospedagem: '[provedor]',
  prazoRespostaDias: '[15]',
  prazoConversas: '[prazo]',
  foro: '[cidade/UF]',
  politicaTrocas: '[Descrever política de trocas, prazos e condições.]',
  data: '[data]',
}

const meses = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

/**
 * 'AAAA-MM-DD' vira '26 de setembro de 2026', montado das partes numéricas (new Date('AAAA-MM-DD')
 * interpreta em UTC e pode mostrar o dia anterior). Formato ou data inexistente retorna null.
 */
export function formatarData(iso: string): string | null {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim())
  if (!partes) return null
  const ano = Number(partes[1])
  const mes = Number(partes[2])
  const dia = Number(partes[3])
  if (ano < 1 || mes < 1 || mes > 12 || dia < 1) return null
  const bissexto = (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0
  const diasNoMes = [31, bissexto ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mes - 1]
  if (dia > diasNoMes) return null
  return `${dia} de ${meses[mes - 1]} de ${ano}`
}
