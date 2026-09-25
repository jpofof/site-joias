import { Link } from 'react-router-dom'

const botao =
  'flex h-[52px] items-center justify-center rounded-btn text-[13px] font-medium tracking-[0.16em] uppercase md:h-14 md:px-9 md:text-sm md:tracking-[0.14em] lg:tracking-[0.16em]'

// Hero "híbrido" (variante padrão dos quadros). Foto e texto editáveis pelo CMS ficam para a etapa do CMS.
export default function Hero() {
  return (
    <section className="bg-silk">
      <div className="site-container flex min-h-[800px] flex-col gap-4 py-8 md:min-h-[960px] md:gap-6 md:py-14 lg:min-h-[700px] lg:flex-row lg:items-center lg:justify-between lg:gap-0 lg:py-16">
        <div className="flex flex-col gap-4 md:gap-6 lg:w-[600px] lg:gap-7">
          <div className="text-xs font-medium tracking-[0.22em] text-ink-2 uppercase md:tracking-[0.18em] lg:text-[13px] lg:tracking-[0.22em]">
            Eduáh Acessórios
          </div>
          <h1 className="font-display text-[40px] leading-[1.05] font-normal tracking-[-0.01em] md:text-[60px] md:leading-[1.03] lg:text-[76px] lg:leading-[1.02]">
            O detalhe que completa o seu brilho
          </h1>
          <p className="text-[17px] leading-normal font-light text-ink-2 md:max-w-[560px] md:text-[19px] lg:max-w-[480px] lg:text-xl">
            Anéis, brincos, colares, pulseiras e piercings. Escolha seus produtos, monte o carrinho e finalize pelo
            WhatsApp.
          </p>
          <div className="mt-3 flex flex-col gap-3 md:mt-0 md:flex-row lg:mt-2 lg:gap-4">
            <Link to="/catalogo" className={`${botao} bg-cherry text-silk`}>
              Ver catálogo
            </Link>
            <Link to="/sobre" className={`${botao} border border-noir`}>
              Sobre a Eduáh
            </Link>
          </div>
        </div>
        <div className="mt-4 flex h-[270px] items-center justify-center rounded-t-[135px] bg-oat text-center text-xs tracking-[0.14em] uppercase md:h-[420px] md:rounded-t-[336px] lg:mt-0 lg:h-[572px] lg:w-[500px] lg:rounded-t-[250px] lg:p-8 lg:text-sm">
          Foto de destaque
        </div>
      </div>
    </section>
  )
}
