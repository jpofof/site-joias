export type SobreHome = {
  frase: string
  texto: string
  /** Caminho da foto. Vazio = exibe o placeholder da foto. */
  foto: string
}

export type SiteConfig = {
  nome: string
  /** Frase da marca exibida no footer. Vazio = ainda não informada. */
  fraseMarca: string
  /** Somente dígitos com DDI e DDD, ex.: '5515999999999'. Vazio = ainda não informado. */
  whatsapp: string
  /** Perfil sem @, ex.: 'eduah.acessorios'. Vazio = ainda não informado. */
  instagram: string
  /** Seção "Sobre a Eduáh" da Home. Só aparece com frase e texto preenchidos. */
  sobreHome: SobreHome
}

// PENDENTE (cliente): frase da marca, número do WhatsApp (chip novo), Instagram e o texto da seção Sobre da Home.
// Único lugar de configuração. Campos vazios não são exibidos (footer, botão "Falar no WhatsApp", seção Sobre)
// e o envio do pedido fica desabilitado sem número.
export const site: SiteConfig = {
  nome: 'Eduáh Acessórios',
  fraseMarca: '',
  whatsapp: '',
  instagram: '',
  sobreHome: { frase: '', texto: '', foto: '' },
}
