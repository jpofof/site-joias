import { Link, Navigate, useLocation } from 'react-router-dom'
import OrderSteps from '../components/OrderSteps'
import { whatsappAtivo } from '../config/site'
import { useCart } from '../hooks/useCart'
import { montarMensagemPedido, rotuloProdutos, urlWhatsApp } from '../lib/carrinho'

const botao =
  'flex h-[54px] items-center justify-center rounded-btn text-sm font-medium tracking-[0.14em] uppercase md:h-14 md:px-8'

export default function Pedido() {
  const { state } = useLocation()
  const { linhas, total, quantidadeTotal } = useCart()

  // Só chega aqui quem acabou de enviar o pedido pelo Carrinho (o estado da navegação também
  // sobrevive a um recarregamento). Acesso direto, sem número de WhatsApp ou sem produtos volta ao Carrinho.
  const info = state as { enviado?: boolean; bloqueado?: boolean } | null
  if (!info?.enviado || !whatsappAtivo || linhas.length === 0) return <Navigate to="/carrinho" replace />

  const urlWhats = urlWhatsApp(whatsappAtivo, montarMensagemPedido(linhas, total, whatsappAtivo).texto)

  return (
    <main className="site-container">
      <meta name="robots" content="noindex" />
      <section className="flex flex-col gap-8 pt-8 pb-14 md:gap-6 md:pt-5 md:pb-16 lg:gap-10 lg:pt-8 lg:pb-24">
        <nav aria-label="Caminho" className="hidden items-center gap-3 pt-3 text-sm text-ink-2 md:flex">
          <Link to="/" className="-mx-1.5 flex h-11 items-center px-1.5 underline underline-offset-[3px]">
            Início
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/carrinho" className="flex h-11 items-center underline underline-offset-[3px]">
            Carrinho
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="flex h-11 items-center font-medium">
            Pedido preparado
          </span>
        </nav>

        <div className="flex flex-col gap-8 md:gap-6 lg:max-w-[640px]">
          <OrderSteps atual={3} />
          <p className="hidden text-sm text-ink-2 md:block">Passo 3 de 3: enviar pelo WhatsApp</p>

          <div className="flex flex-col items-center gap-4 pt-4 text-center md:items-start md:gap-6 md:pt-0 md:text-left">
            <div className="flex size-18 items-center justify-center rounded-full bg-cherry text-silk md:size-16">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="md:size-8"
              >
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </div>
            <h1 className="font-display text-[34px] leading-[1.1] font-normal md:text-[44px] lg:text-5xl">Pedido preparado</h1>
            <p className="max-w-[320px] text-[17px] leading-normal font-light text-ink-2 md:max-w-none md:text-lg">
              Abrimos o WhatsApp com a lista dos seus {rotuloProdutos(quantidadeTotal)}. É só enviar a mensagem para concluir o
              pedido.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:gap-6">
            {info.bloqueado && (
              <p role="status" className="text-base leading-normal text-noir">
                O navegador bloqueou a abertura do WhatsApp. Use o botão “Abrir WhatsApp” abaixo.
              </p>
            )}
            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
              <a href={urlWhats} target="_blank" rel="noopener noreferrer" className={`${botao} bg-cherry text-silk`}>
                {info.bloqueado ? 'Abrir WhatsApp' : 'Abrir WhatsApp novamente'}
              </a>
              <Link to="/catalogo" className={`${botao} border border-noir`}>
                Continuar comprando
              </Link>
            </div>
            <p className="mt-2 text-center text-sm leading-normal font-light text-ink-2 md:mt-0 md:text-left md:font-normal">
              Seus produtos continuam no carrinho até você esvaziá-lo.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
