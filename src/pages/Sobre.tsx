import { Link } from 'react-router-dom'
import PaginaTexto from '../components/PaginaTexto'
import { site } from '../config/site'

export default function Sobre() {
  const { frase, paragrafos, foto, fotoAlt } = site.sobre
  const temConteudo = paragrafos.length > 0

  return (
    <PaginaTexto
      titulo="Sobre a Eduáh"
      atual="Sobre a Eduáh"
      subtitulo={frase && <p className="mt-0 text-lg leading-normal font-light text-ink-2">{frase}</p>}
    >
      <div className="flex flex-col gap-4 pt-8 md:pt-10">
        {temConteudo ? (
          <>
            {foto && <img src={foto} alt={fotoAlt} className="h-auto w-full object-cover" />}
            {paragrafos.map((paragrafo, i) => (
              <p key={i} className="text-base leading-[1.65] font-light text-noir md:text-[17px]">
                {paragrafo}
              </p>
            ))}
          </>
        ) : (
          <>
            <p className="text-base leading-[1.65] font-light text-noir md:text-[17px]">Conteúdo em preparação.</p>
            <Link
              to="/catalogo"
              className="flex h-14 w-fit items-center justify-center rounded-btn bg-cherry px-10 text-sm font-medium tracking-[0.14em] text-silk uppercase"
            >
              Ver catálogo
            </Link>
          </>
        )}
      </div>
    </PaginaTexto>
  )
}
