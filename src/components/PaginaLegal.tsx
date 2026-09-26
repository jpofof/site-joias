import { Link } from 'react-router-dom'
import { legal } from '../config/legal'
import { formatarData, rotuloPendente, type CampoNoTexto, type SecaoLegal } from '../lib/legal'
import PaginaTexto, { SecaoTexto } from './PaginaTexto'

type Props = {
  titulo: string
  /** Data da última revisão (AAAA-MM-DD) vinda de src/config/legal.ts. */
  atualizadoEm: string
  secoes: SecaoLegal[]
  linkExtra: { para: string; texto: string }
}

// Valor ainda não informado: aparece entre colchetes, com fundo suave, e o destaque some quando o campo é preenchido.
// Sem padding e sem borda, para não mudar medidas nem quebras de linha do texto.
function Pendente({ texto }: { texto: string }) {
  return <mark className="bg-oat text-noir">{texto}</mark>
}

function comCampos(texto: string) {
  return texto.split(/(\{[a-zA-Z]+\})/).map((parte, i) => {
    const campo = /^\{([a-zA-Z]+)\}$/.exec(parte)?.[1] as CampoNoTexto | undefined
    if (!campo || !(campo in rotuloPendente)) return parte
    const valor = legal[campo].trim()
    return valor ? valor : <Pendente key={i} texto={rotuloPendente[campo]} />
  })
}

export default function PaginaLegal({ titulo, atualizadoEm, secoes, linkExtra }: Props) {
  const data = formatarData(atualizadoEm)

  return (
    <PaginaTexto
      titulo={titulo}
      atual={titulo}
      subtitulo={
        <div className="text-sm text-ink-2">
          Última atualização:{' '}
          {data ? <time dateTime={atualizadoEm.trim()}>{data}</time> : <Pendente texto={rotuloPendente.data} />}
        </div>
      }
      indice={secoes.map((s) => ({ id: s.id, titulo: s.titulo }))}
      linkExtra={linkExtra}
    >
      {secoes.map((secao) => (
        <SecaoTexto key={secao.id} id={secao.id} titulo={secao.titulo}>
          {secao.blocos.map((bloco, i) =>
            bloco.tipo === 'p' ? (
              <p key={i} className="text-base leading-[1.65] font-light text-noir md:text-[17px]">
                {comCampos(bloco.texto)}
              </p>
            ) : (
              <Link key={i} to={bloco.para} className="flex h-11 w-fit items-center underline underline-offset-[3px]">
                {bloco.texto}
              </Link>
            ),
          )}
        </SecaoTexto>
      ))}
    </PaginaTexto>
  )
}
