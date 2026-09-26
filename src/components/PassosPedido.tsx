import { whatsappAtivo } from '../config/site'

const passos = ['Escolha seus produtos', 'Monte o carrinho', 'Finalize pelo WhatsApp']

export default function PassosPedido() {
  return (
    <section className="bg-silk">
      <div className="site-container flex min-h-[600px] flex-col items-center gap-7 py-12 text-center md:min-h-[500px] md:gap-8 md:py-16 lg:min-h-[520px] lg:justify-center lg:gap-10 lg:py-20">
        <h2 className="font-display text-[34px] leading-[1.1] font-normal md:text-[40px] lg:text-[52px]">
          Encontrou o produto certo?
        </h2>
        <ol className="grid w-full gap-5 md:grid-cols-3 lg:w-[1000px] lg:gap-12">
          {passos.map((texto, i) => (
            <li
              key={texto}
              className="flex items-center gap-5 border border-greige px-5 py-4 text-left md:flex-col md:gap-2.5 md:border-0 md:p-0 md:text-center"
            >
              <span className="w-6 font-display text-[32px] leading-none text-cherry md:w-auto md:text-[40px]">{i + 1}</span>
              <span className="text-[17px] lg:text-lg">{texto}</span>
            </li>
          ))}
        </ol>
        {whatsappAtivo && (
          <a
            href={`https://wa.me/${whatsappAtivo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[52px] w-full items-center justify-center rounded-btn bg-cherry text-[13px] font-medium tracking-[0.16em] text-silk uppercase md:h-14 md:w-auto md:px-10 md:text-sm md:tracking-[0.14em] lg:tracking-[0.16em]"
          >
            Falar no WhatsApp
          </a>
        )}
      </div>
    </section>
  )
}
