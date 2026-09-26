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

// PENDENTE (cliente + revisão jurídica): todos os campos vazios aparecem entre colchetes, com fundo suave,
// nas páginas /privacidade e /termos até serem preenchidos aqui. Este é o único lugar a editar.
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
}
