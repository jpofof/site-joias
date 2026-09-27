import { Link } from 'react-router-dom'
import { categorias, urlCategoria } from '../config/categorias'
import { site, whatsappAtivo } from '../config/site'

const cabecalho =
  'mb-1 text-[11px] font-medium tracking-[0.22em] text-oat uppercase md:mb-2 md:text-xs md:tracking-[0.18em]'
const linkLegal = 'flex h-11 items-center underline md:underline-offset-[3px]'

function formatarWhatsApp(numero: string) {
  const m = numero.match(/^55(\d{2})(\d{4,5})(\d{4})$/)
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : numero
}

export default function SiteFooter() {
  const { instagram, fraseMarca } = site
  const whatsapp = whatsappAtivo

  const link = 'flex h-11 items-center text-[15px] font-light'
  const coluna = 'flex flex-col'

  const whatsappLink = whatsapp && (
    <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className={`${link} gap-1`}>
      WhatsApp<span className="hidden md:inline">{formatarWhatsApp(whatsapp)}</span>
    </a>
  )
  const instagramLink = instagram && (
    <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" className={`${link} gap-1`}>
      Instagram<span className="hidden md:inline">@{instagram}</span>
    </a>
  )

  return (
    <footer className="bg-noir text-silk">
      <div className="mx-auto flex max-w-[1440px] flex-col px-5 pt-12 pb-2 md:gap-9 md:px-12 md:pb-0 lg:gap-8 lg:px-24 lg:pt-14">
        <div className="flex flex-col gap-7 md:gap-8 lg:flex-row lg:justify-between">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:gap-8 lg:w-[300px] lg:flex-col lg:items-start lg:gap-4">
            <Link to="/" aria-label={`${site.nome}, página inicial`} className="block">
              <img
                src="/logo-eduah.png"
                srcSet="/logo-eduah-300.png 300w, /logo-eduah.png 400w"
                sizes="(min-width: 1024px) 200px, (min-width: 768px) 170px, 150px"
                alt={site.nome}
                width={400}
                height={154}
                loading="lazy"
                className="block w-[150px] md:w-[170px] lg:w-[200px]"
              />
            </Link>
            {fraseMarca && <p className="text-[15px] leading-normal font-light text-oat">{fraseMarca}</p>}
          </div>

          <nav aria-label="Rodapé" className="flex gap-10 md:gap-16 lg:gap-22">
            <div className={coluna}>
              <div className={cabecalho}>Catálogo</div>
              {categorias.map((c) => (
                <Link key={c.slug} to={urlCategoria(c.slug)} className={link}>
                  {c.nome}
                </Link>
              ))}
            </div>

            <div className={coluna}>
              <div className={cabecalho}>
                <span className="md:hidden">Contato</span>
                <span className="hidden md:inline">Loja</span>
              </div>
              <Link to="/busca" className={link}>
                Pesquisa
              </Link>
              <Link to="/sobre" className={link}>
                Sobre<span className="hidden md:inline">&nbsp;a Eduáh</span>
              </Link>
              <Link to="/carrinho" className={`${link} hidden md:flex`}>
                Carrinho
              </Link>
              <div className="flex flex-col md:hidden">
                {whatsappLink}
                {instagramLink}
              </div>
            </div>

            {(whatsapp || instagram) && (
              <div className={`hidden md:flex ${coluna}`}>
                <div className={cabecalho}>Contato</div>
                {whatsappLink}
                {instagramLink}
              </div>
            )}
          </nav>
        </div>

        <div className="flex flex-col gap-1.5 border-t border-cherry pt-5 text-[12px] font-light text-oat md:h-18 md:flex-row md:items-center md:justify-between md:gap-0 md:border-greige md:pt-0 md:text-sm md:font-normal">
          <span>© {site.nome}</span>
          <span className="flex flex-col md:flex-row md:items-center md:gap-2">
            <Link to="/privacidade" className={linkLegal}>
              Política de privacidade
            </Link>
            <span className="hidden md:inline" aria-hidden="true">
              ·
            </span>
            <Link to="/termos" className={linkLegal}>
              Termos de uso
            </Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
