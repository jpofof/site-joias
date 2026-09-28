import { useLocation } from 'react-router-dom'
import { SITE_URL } from '../config/seo'
import { site } from '../config/site'

type Props = {
  titulo?: string
  descricao: string
  /** Caminho da imagem a partir da raiz (ex.: produto.imagem). Sem imagem própria, usa a logo do site
   * como padrão — TROCAR pela foto de capa quando a cliente tiver uma. */
  imagem?: string
  /** "product" nas páginas de produto; as demais usam o padrão "website". */
  tipo?: 'website' | 'product'
}

/**
 * Título, descrição, Open Graph, Twitter Card e canonical da página. <title>, <meta> e <link> são
 * elementos nativos do React 19: vão para o <head> de onde forem renderizados. Sem `titulo`, usa só
 * o nome do site (Home). A URL vem da rota atual (sem query string) + SITE_URL.
 */
export default function PaginaMeta({ titulo, descricao, imagem, tipo = 'website' }: Props) {
  const { pathname } = useLocation()
  const tituloCompleto = titulo ? `${titulo} | ${site.nome}` : site.nome
  const url = `${SITE_URL}${pathname}`
  const imagemUrl = `${SITE_URL}${imagem || '/logo-eduah.png'}`

  return (
    <>
      <title>{tituloCompleto}</title>
      <meta name="description" content={descricao} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={tituloCompleto} />
      <meta property="og:description" content={descricao} />
      <meta property="og:type" content={tipo} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imagemUrl} />
      <meta property="og:site_name" content={site.nome} />
      <meta property="og:locale" content="pt_BR" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={tituloCompleto} />
      <meta name="twitter:description" content={descricao} />
      <meta name="twitter:image" content={imagemUrl} />
    </>
  )
}
