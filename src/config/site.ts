export type SobreHome = {
  frase: string
  texto: string
  /** Caminho da foto. Vazio = exibe o placeholder da foto. */
  foto: string
}

export type SobrePagina = {
  /** Frase abaixo do título (opcional). */
  frase: string
  /** Parágrafos do texto. A página só mostra o conteúdo quando há pelo menos um. */
  paragrafos: string[]
  /** Caminho da foto. Vazio = sem foto. */
  foto: string
  /** Descrição da foto para leitor de tela. */
  fotoAlt: string
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
  /** Página /sobre. Vazia, mostra "Conteúdo em preparação.". */
  sobre: SobrePagina
}

import dados from '../data/site-config.json'

// Preenchido pela cliente no Decap CMS ("Configurações do site", único lugar de configuração;
// "nome" fica fixo aqui, não é um campo do CMS). Campos vazios não são exibidos (footer, botão
// "Falar no WhatsApp", seção Sobre) e o envio do pedido fica desabilitado sem número.
// Mesclado sobre estes padrões (em vez de um "as SiteConfig" direto): se o JSON perder um campo,
// ele volta a string vazia em vez de undefined silencioso.
export const site: SiteConfig = {
  nome: 'Eduáh Acessórios',
  fraseMarca: '',
  whatsapp: '',
  instagram: '',
  sobreHome: { frase: '', texto: '', foto: '' },
  sobre: { frase: '', paragrafos: [], foto: '', fotoAlt: '' },
  // "as Partial": o JSON de hoje tem todos os campos, mas o TypeScript não pode presumir isso de um
  // arquivo editado por fora (Decap CMS). Partial mantém o spread com efeito real: campo ausente no
  // JSON cai no padrão acima, em vez do TS provar (e o build travar) que o spread sempre sobrescreve.
  ...(dados as Partial<SiteConfig>),
}

/**
 * Número de WhatsApp usado pelo site: só vale com DDI 55 + DDD + número (12 ou 13 dígitos, só dígitos).
 * Vazio ou em outro formato = sem número (nenhum link wa.me é gerado e o envio do pedido fica indisponível).
 */
export const whatsappAtivo: string = /^55[0-9]{10,11}$/.test(site.whatsapp) ? site.whatsapp : ''
