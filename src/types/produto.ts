export type Categoria =
  | 'aneis'
  | 'brincos'
  | 'colares'
  | 'pulseiras'
  | 'piercings'
  | 'linha-masculina'

export type DetalhesProduto = {
  material?: string
  medidas?: string
  cuidados?: string
}

export type Produto = {
  id: string
  nome: string
  categoria: Categoria
  preco: number
  /** Caminho da foto principal. Vazio = ainda sem foto (exibe placeholder). */
  imagem: string
  /** Fotos extras da galeria. A galeria só aparece com mais de uma foto (imagem + imagens). */
  imagens?: string[]
  descricao?: string
  detalhes?: DetalhesProduto
  destaque?: boolean
}
