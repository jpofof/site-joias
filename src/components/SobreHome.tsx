import { Link } from 'react-router-dom'
import { site } from '../config/site'
import { ArrowRightIcon } from './icons'

// Só aparece quando a cliente preencher frase e texto em src/config/site.ts.
export default function SobreHome() {
  const { frase, texto, foto } = site.sobreHome
  if (!frase || !texto) return null

  return (
    <section className="bg-cherry text-silk">
      <div className="site-container flex min-h-[760px] flex-col gap-6 py-12 md:min-h-[560px] md:flex-row md:items-center md:gap-12 md:py-16 lg:min-h-[720px] lg:gap-24 lg:py-24">
        <div className="flex h-[300px] items-center justify-center bg-greige text-center text-xs tracking-[0.14em] text-noir uppercase md:h-[400px] md:w-[290px] md:shrink-0 lg:h-[528px] lg:w-[528px] lg:text-sm">
          {foto ? <img src={foto} alt="" className="size-full object-cover" /> : 'Foto da Duda'}
        </div>
        <div className="flex flex-col gap-6 md:gap-5 lg:gap-6">
          <div className="text-xs font-medium tracking-[0.22em] text-oat uppercase md:tracking-[0.18em] lg:text-[13px] lg:tracking-[0.22em]">
            Sobre a Eduáh
          </div>
          <h2 className="font-display text-[32px] leading-[1.12] font-normal md:text-4xl lg:text-[52px] lg:leading-[1.1]">
            {frase}
          </h2>
          <p className="text-base leading-[1.6] font-light md:text-[17px] lg:max-w-[560px] lg:text-[19px]">{texto}</p>
          <Link
            to="/sobre"
            className="inline-flex min-h-11 items-center gap-2 self-start border-b border-silk pb-1.5 text-[13px] font-medium tracking-[0.16em] uppercase md:h-11 md:border-b-0 md:pb-0 md:text-sm md:tracking-[0.14em] md:underline md:underline-offset-[3px] lg:mt-2 lg:border-b lg:tracking-[0.16em] lg:no-underline"
          >
            Sobre a Eduáh
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
