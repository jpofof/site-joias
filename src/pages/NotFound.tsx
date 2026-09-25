import { Link } from 'react-router-dom'
import { categorias, urlCategoria } from '../config/categorias'

const botao =
  'flex h-14 items-center justify-center rounded-btn px-10 text-sm md:px-9 lg:px-10 font-medium tracking-[0.14em] uppercase'

export default function NotFound() {
  return (
    <main className="site-container">
      <section className="flex flex-col items-start gap-5 pt-12 pb-14 text-left md:items-center md:gap-6 md:pt-20 md:pb-20 md:text-center lg:py-24">
        <div aria-hidden="true" className="font-display text-[120px] leading-none text-greige md:text-[160px] lg:text-[200px]">
          404
        </div>
        <div className="text-xs font-medium tracking-[0.18em] text-ink-2 uppercase">Erro 404</div>
        <h1 className="font-display text-[34px] leading-[1.1] font-normal md:text-[44px] lg:text-5xl">Página não encontrada</h1>
        <p className="max-w-[520px] text-[17px] leading-normal font-light text-ink-2 md:text-lg">
          O endereço pode ter mudado ou o produto não está mais disponível. Nenhum dado seu foi perdido, e o carrinho
          continua como estava.
        </p>
        <div className="flex flex-col gap-3 self-stretch md:flex-row md:self-auto">
          <Link to="/catalogo" className={`${botao} bg-cherry text-silk`}>
            Ver catálogo
          </Link>
          <Link to="/" className={`${botao} border border-noir`}>
            Voltar ao início
          </Link>
        </div>
        <div className="mt-4 text-xs font-medium tracking-[0.18em] text-ink-2 uppercase">Ou comece por uma categoria</div>
        <div className="flex max-w-[640px] flex-wrap gap-2 md:justify-center">
          {categorias.map((c) => (
            <Link
              key={c.slug}
              to={urlCategoria(c.slug)}
              className="inline-flex h-11 items-center rounded-btn border border-noir px-[18px] text-sm"
            >
              {c.nome}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
