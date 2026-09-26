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

// `home`: footer próprio da Home no desktop (Main.dc.html): 400px, links de 16px sem altura fixa, gap 96.
// Nesses links a área clicável tem 44px (padding) compensada por margem negativa, sem mudar o visual do quadro.
export default function SiteFooter({ home = false }: { home?: boolean }) {
  const { instagram, fraseMarca } = site
  const whatsapp = whatsappAtivo

  const cab = `${cabecalho} ${home ? 'lg:mb-1 lg:tracking-[0.22em]' : ''}`
  const link = `flex h-11 items-center text-[15px] font-light ${home ? 'lg:-my-[10.5px] lg:text-base' : ''}`
  const coluna = `flex flex-col ${home ? 'lg:gap-3' : ''}`

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
      <div
        className={`mx-auto flex max-w-[1440px] flex-col px-5 pt-12 pb-2 md:gap-9 md:px-12 md:pb-0 lg:px-24 ${
          home ? 'lg:gap-0 lg:pt-[72px] lg:pb-[27px]' : 'lg:gap-8 lg:pt-14'
        }`}
      >
        <div className="flex flex-col gap-7 md:gap-8 lg:flex-row lg:justify-between">
          <div
            className={`flex flex-col gap-7 md:flex-row md:items-center md:gap-8 lg:flex-col lg:items-start ${
              home ? 'lg:w-[320px] lg:gap-5' : 'lg:w-[300px] lg:gap-4'
            }`}
          >
            <img src="/logo-eduah.png" alt={site.nome} className="block w-[150px] md:w-[170px] lg:w-[200px]" />
            {fraseMarca && (
              <p className={`text-[15px] leading-normal font-light text-oat ${home ? 'lg:text-base' : ''}`}>{fraseMarca}</p>
            )}
          </div>

          <nav aria-label="Rodapé" className={`flex gap-10 md:gap-16 ${home ? 'lg:gap-24' : 'lg:gap-22'}`}>
            <div className={coluna}>
              <div className={cab}>Catálogo</div>
              {categorias.map((c) => (
                <Link key={c.slug} to={urlCategoria(c.slug)} className={link}>
                  {c.nome}
                </Link>
              ))}
            </div>

            <div className={coluna}>
              <div className={cab}>
                <span className="md:hidden">Contato</span>
                <span className="hidden md:inline">Loja</span>
              </div>
              <Link to="/busca" className={link}>
                Pesquisa
              </Link>
              <Link to="/sobre" className={link}>
                Sobre<span className={`hidden md:inline ${home ? 'lg:hidden' : ''}`}>&nbsp;a Eduáh</span>
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
                <div className={cab}>Contato</div>
                {whatsappLink}
                {instagramLink}
              </div>
            )}
          </nav>
        </div>

        <div
          className={`flex flex-col gap-1.5 border-t border-cherry pt-5 text-[12px] font-light text-oat md:h-18 md:flex-row md:items-center md:justify-between md:gap-0 md:border-greige md:pt-0 md:text-sm md:font-normal ${
            home ? 'lg:h-auto lg:items-start lg:border-cherry lg:pt-6 lg:text-[13px] lg:font-light' : ''
          }`}
        >
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
