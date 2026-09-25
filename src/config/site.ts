export type SiteConfig = {
  nome: string
  /** Frase da marca exibida no footer. Vazio = ainda não informada. */
  fraseMarca: string
  /** Somente dígitos com DDI e DDD, ex.: '5515999999999'. Vazio = ainda não informado. */
  whatsapp: string
  /** Perfil sem @, ex.: 'eduah.acessorios'. Vazio = ainda não informado. */
  instagram: string
}

// PENDENTE (cliente): frase da marca, número do WhatsApp (chip novo) e Instagram. Único lugar de configuração.
// Campos vazios não são exibidos no footer e desabilitam o envio do pedido.
export const site: SiteConfig = {
  nome: 'Eduáh Acessórios',
  fraseMarca: '',
  whatsapp: '',
  instagram: '',
}
