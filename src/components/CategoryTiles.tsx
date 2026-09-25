import { Link } from 'react-router-dom'
import { categorias, urlCategoria } from '../config/categorias'
import { ArrowRightIcon } from './icons'

export default function CategoryTiles() {
  return (
    <section className="bg-oat">
      <div className="site-container flex min-h-[920px] flex-col items-center gap-7 py-12 md:min-h-[860px] md:gap-8 md:py-16 lg:min-h-[1040px] lg:gap-12 lg:py-20">
        <div className="flex flex-col items-center gap-2.5 text-center md:gap-3 lg:gap-3.5">
          <div className="text-xs font-medium tracking-[0.22em] uppercase md:tracking-[0.18em] lg:text-[13px] lg:tracking-[0.22em]">
            Catálogo
          </div>
          <h2 className="font-display text-[34px] leading-[1.1] font-normal md:text-[40px] lg:text-[52px]">
            Encontre seu produto
          </h2>
        </div>

        <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:gap-8">
          {categorias.map((c, i) => (
            <Link
              key={c.slug}
              to={urlCategoria(c.slug)}
              className={`flex h-[190px] flex-col justify-between p-4 md:h-[220px] md:p-5 lg:h-[280px] lg:p-7 ${
                i % 2 === 0 ? 'bg-oat-1' : 'bg-silk'
              }`}
            >
              <span className="text-[11px] tracking-[0.14em] uppercase lg:text-xs">Foto</span>
              <span className="flex items-baseline justify-between">
                <span className="font-display text-[22px] leading-[1.15] md:text-2xl lg:text-[32px] lg:leading-[1.1]">
                  {c.nome}
                </span>
                <span className="hidden items-center gap-1.5 text-[13px] font-medium tracking-[0.16em] uppercase lg:flex">
                  Ver
                  <ArrowRightIcon size={16} />
                </span>
              </span>
            </Link>
          ))}
        </div>

        <Link
          to="/catalogo"
          className="flex h-[52px] w-full items-center justify-center rounded-btn bg-cherry text-[13px] font-medium tracking-[0.16em] text-silk uppercase md:h-14 md:w-auto md:px-10 md:text-sm md:tracking-[0.14em] lg:tracking-[0.16em]"
        >
          Ver catálogo
        </Link>
      </div>
    </section>
  )
}
