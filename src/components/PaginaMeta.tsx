import { site } from '../config/site'

/**
 * Título e descrição da página. <title> e <meta> são elementos nativos do React 19: vão para o <head>.
 * Sem `titulo`, usa só o nome do site (Home).
 */
export default function PaginaMeta({ titulo, descricao }: { titulo?: string; descricao: string }) {
  return (
    <>
      <title>{titulo ? `${titulo} | ${site.nome}` : site.nome}</title>
      <meta name="description" content={descricao} />
    </>
  )
}
