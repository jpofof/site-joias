export type Legal = {
  /** Data da última revisão, no formato AAAA-MM-DD (ex.: '2026-09-26'). Vazio ou inválido = "[data]". */
  privacidadeAtualizadaEm: string
  termosAtualizadosEm: string
  /** Nome completo ou razão social do responsável pelos dados. */
  responsavel: string
  cpfCnpj: string
  /** E-mail para assuntos de privacidade, direitos e dúvidas (aparece na Política e nos Termos). */
  email: string
  provedorHospedagem: string
  /** Só o número de dias, ex.: '15'. */
  prazoRespostaDias: string
  /** Por quanto tempo as conversas de pedido são guardadas, ex.: '12 meses'. */
  prazoConversas: string
  /** Cidade/UF do foro, ex.: 'Sorocaba/SP'. */
  foro: string
  /** Texto da política de trocas, prazos e condições (a frase do Código de Defesa do Consumidor continua fixa). */
  politicaTrocas: string
}

import dados from '../data/legal.json'

// Preenchido pela cliente (+ revisão jurídica) no Decap CMS ("Dados legais", único lugar a editar).
// Campos vazios aparecem entre colchetes, com fundo suave, nas páginas /privacidade e /termos.
// Mesclado sobre estes padrões (em vez de um "as Legal" direto): se o JSON perder um campo, ele
// volta a string vazia em vez de undefined silencioso.
export const legal: Legal = {
  privacidadeAtualizadaEm: '',
  termosAtualizadosEm: '',
  responsavel: '',
  cpfCnpj: '',
  email: '',
  provedorHospedagem: '',
  prazoRespostaDias: '',
  prazoConversas: '',
  foro: '',
  politicaTrocas: '',
  // "as Partial": o JSON de hoje tem todos os campos, mas o TypeScript não pode presumir isso de um
  // arquivo editado por fora (Decap CMS). Partial mantém o spread com efeito real: campo ausente no
  // JSON cai no padrão acima, em vez do TS provar (e o build travar) que o spread sempre sobrescreve.
  ...(dados as Partial<Legal>),
}
