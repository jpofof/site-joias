import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CartItem from '../components/CartItem'
import PaginaMeta from '../components/PaginaMeta'
import OrderSteps from '../components/OrderSteps'
import { categorias, urlCategoria } from '../config/categorias'
import { whatsappAtivo } from '../config/site'
import { useCart } from '../hooks/useCart'
import { QUANTIDADE_MAXIMA, montarMensagemPedido, rotuloProdutos, urlWhatsApp } from '../lib/carrinho'
import { formatarPreco } from '../lib/preco'

const rotulo = 'text-xs font-medium tracking-[0.18em] text-ink-2 uppercase'
const botao = 'flex items-center justify-center rounded-btn text-sm font-medium tracking-[0.14em] uppercase'
const passosVazio = ['Escolha seus produtos', 'Adicione ao carrinho', 'Envie o pedido pelo WhatsApp']

export default function Carrinho() {
  const navigate = useNavigate()
  const { linhas, total, quantidadeTotal, acaoDesfazer, definirQuantidade, remover, esvaziar, desfazer, limparDesfazer } =
    useCart()

  const [anuncio, setAnuncio] = useState('')
  const [avisoLimite, setAvisoLimite] = useState(false)
  const botaoDesfazerRef = useRef<HTMLButtonElement>(null)
  const focarDesfazer = useRef(false)
  // '' = primeiro item; id = item restaurado; null = nada a fazer.
  const focarRemoverDe = useRef<string | null>(null)

  // A faixa de desfazer vale só nesta página: ao sair, some.
  useEffect(() => limparDesfazer, [limparDesfazer])

  // Depois de remover, o foco vai para o DESFAZER (teclado); depois de desfazer, para o "Remover" do item restaurado.
  useEffect(() => {
    if (acaoDesfazer && focarDesfazer.current) {
      focarDesfazer.current = false
      botaoDesfazerRef.current?.focus()
    }
  }, [acaoDesfazer])
  useEffect(() => {
    if (focarRemoverDe.current === null || linhas.length === 0) return
    const alvos = [...document.querySelectorAll<HTMLElement>('[data-remover]')].filter((e) => e.getClientRects().length > 0)
    const alvo = alvos.find((e) => e.dataset.remover === focarRemoverDe.current) ?? alvos[0]
    focarRemoverDe.current = null
    alvo?.focus()
  }, [linhas])

  const pedido = montarMensagemPedido(linhas, total, whatsappAtivo)
  const mensagem = pedido.texto
  const podeEnviar = whatsappAtivo !== ''

  function aoRemover(id: string) {
    focarDesfazer.current = true
    setAvisoLimite(false)
    setAnuncio('Produto removido. Use o botão Desfazer para restaurar.')
    remover(id)
  }
  function aoEsvaziar() {
    focarDesfazer.current = true
    setAvisoLimite(false)
    setAnuncio('Carrinho esvaziado. Use o botão Desfazer para restaurar.')
    esvaziar()
  }
  function aoDesfazer() {
    focarRemoverDe.current = acaoDesfazer?.idRemovido ?? ''
    setAnuncio(acaoDesfazer?.tipo === 'esvaziado' ? 'Carrinho restaurado.' : 'Produto restaurado.')
    desfazer()
  }
  function aoMudarQuantidade(id: string, quantidade: number) {
    setAvisoLimite(false)
    definirQuantidade(id, quantidade)
  }
  function aoBater99() {
    setAvisoLimite(true)
    setAnuncio(`Limite de ${QUANTIDADE_MAXIMA} unidades por produto.`)
  }

  // O WhatsApp abre no próprio clique (não é bloqueado como pop-up). O carrinho não é limpo.
  // Sem noopener na chamada porque ele faz window.open retornar sempre null; o vínculo é cortado logo depois.
  function enviar() {
    if (!podeEnviar) return
    const janela = window.open(urlWhatsApp(whatsappAtivo, mensagem), '_blank')
    if (janela) janela.opener = null
    navigate('/pedido', { state: { enviado: true, bloqueado: janela === null } })
  }

  const anunciador = (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {anuncio}
    </div>
  )

  const barraDesfazer = acaoDesfazer && (
    <div className="flex h-14 items-center justify-between rounded-btn bg-noir px-4 text-[15px] text-silk md:h-13">
      <span>{acaoDesfazer.tipo === 'esvaziado' ? 'Carrinho esvaziado.' : 'Produto removido.'}</span>
      <button
        ref={botaoDesfazerRef}
        type="button"
        onClick={aoDesfazer}
        className="h-11 px-2 text-[13px] font-medium tracking-[0.16em] uppercase md:text-[15px] md:tracking-[0.14em] md:underline"
      >
        Desfazer
      </button>
    </div>
  )

  const migalha = (
    <nav aria-label="Caminho" className="hidden items-center gap-3 pt-3 text-sm text-ink-2 md:flex">
      <Link to="/" className="-mx-1.5 flex h-11 items-center px-1.5 underline underline-offset-[3px]">
        Início
      </Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page" className="flex h-11 items-center font-medium">
        Carrinho
      </span>
    </nav>
  )

  if (linhas.length === 0) {
    return (
      <main className="site-container pb-14 md:pb-16 lg:pb-[72px]">
        <PaginaMeta titulo="Carrinho" descricao="Confira os produtos escolhidos e envie o pedido pelo WhatsApp." />
        <meta name="robots" content="noindex" />
        {anunciador}
        <section className="flex flex-col gap-5 pt-8 md:gap-6 lg:gap-8">
          {migalha}
          {barraDesfazer}
          <div className="flex flex-col gap-8 md:gap-10 lg:grid lg:grid-cols-2 lg:items-start lg:gap-24">
            <div className="flex flex-col gap-5 md:gap-6">
              <h1 className="font-display text-[34px] leading-[1.1] font-normal md:text-[44px] lg:text-5xl">
                Seu carrinho está vazio
              </h1>
              <p className="text-[17px] leading-normal font-light text-ink-2 md:text-lg">
                Adicione produtos do catálogo para montar seu pedido. É simples:
              </p>
              <ol className="flex flex-col gap-3">
                {passosVazio.map((texto, i) => (
                  <li key={texto} className="flex items-center gap-5 border border-greige px-5 py-3.5 md:px-6 md:py-4">
                    <span className="w-6 font-display text-[30px] leading-none text-cherry md:w-7 md:text-[32px]">{i + 1}</span>
                    <span className="text-[17px] md:text-lg">{texto}</span>
                  </li>
                ))}
              </ol>
              <Link to="/catalogo" className={`${botao} h-[54px] bg-cherry text-silk md:h-14 md:self-start md:px-10`}>
                Ver catálogo
              </Link>
            </div>
            <div className="flex flex-col gap-3 md:gap-6 lg:gap-4 lg:pt-3">
              <div className={rotulo}>Ou comece por uma categoria</div>
              <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
                {categorias.map((c) => (
                  <Link
                    key={c.slug}
                    to={urlCategoria(c.slug)}
                    className="flex h-12 items-center rounded-btn border border-noir px-3.5 text-[15px] md:px-5"
                  >
                    {c.nome}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="site-container">
      <PaginaMeta titulo="Carrinho" descricao="Confira os produtos escolhidos e envie o pedido pelo WhatsApp." />
      <meta name="robots" content="noindex" />
      {anunciador}
      <section className="flex flex-col gap-4 pt-7 md:gap-5 md:pt-5 lg:gap-6 lg:pt-8">
        {migalha}
        <h1 className="font-display text-[34px] leading-[1.1] font-normal md:text-[44px] lg:text-5xl">
          <span className="md:hidden">Seu carrinho</span>
          <span className="hidden md:inline">Carrinho</span>
        </h1>
        <div>
          <OrderSteps atual={1} />
          <p className="mt-2 hidden text-sm text-ink-2 md:block">Passo 1 de 3: confira seus produtos</p>
        </div>
        <p className="text-[15px] leading-normal font-light text-ink-2 md:hidden">
          Passo 1 de 3. Confira seus produtos. Depois abriremos o WhatsApp com o pedido já escrito.
        </p>
      </section>

      <div className="flex flex-col gap-4 pt-4 pb-14 md:pt-6 md:pb-16 lg:grid lg:grid-cols-[1fr_440px] lg:items-start lg:gap-[72px] lg:pt-8 lg:pb-[72px]">
        <div className="flex flex-col gap-4">
          <div className="md:border-t md:border-greige">
            {linhas.map((linha) => (
              <CartItem
                key={linha.produto.id}
                linha={linha}
                onQuantidade={aoMudarQuantidade}
                onRemover={aoRemover}
                onLimite={aoBater99}
              />
            ))}
          </div>
          {avisoLimite && (
            <p className="text-sm text-ink-2">Limite de {QUANTIDADE_MAXIMA} unidades por produto no carrinho.</p>
          )}
          {barraDesfazer}
          <button
            type="button"
            onClick={aoEsvaziar}
            className="hidden h-11 w-fit items-center text-sm text-ink-2 underline underline-offset-[3px] md:flex"
          >
            Esvaziar carrinho
          </button>
        </div>

        <aside className="mt-2 flex flex-col gap-4 md:mt-4 md:gap-5 md:border md:border-greige md:bg-oat-1 md:p-8 lg:mt-0">
          <div className={`hidden md:block ${rotulo}`}>Resumo do pedido</div>
          <div className="flex items-baseline justify-between">
            <span className="text-base">Total ({rotuloProdutos(quantidadeTotal)})</span>
            <span className="font-display text-[28px] text-cherry md:text-[32px]">{formatarPreco(total)}</span>
          </div>
          <div className="flex flex-col gap-2 border border-greige p-4 md:bg-silk">
            <div className={rotulo}>Prévia da mensagem no WhatsApp</div>
            <div className="text-[15px] leading-normal font-light whitespace-pre-line md:text-sm md:leading-[1.6]">
              {mensagem}
            </div>
            {pedido.formato === 'resumido' && (
              <p className="text-sm leading-normal text-ink-2">
                Pedido grande: a mensagem mostra os primeiros itens e o total ({rotuloProdutos(pedido.omitidos)} ficam de fora).
                Combine o restante pelo WhatsApp.
              </p>
            )}
          </div>
          <button
            type="button"
            aria-disabled={!podeEnviar}
            aria-describedby={podeEnviar ? undefined : 'nota-envio'}
            onClick={enviar}
            className={`${botao} h-[54px] md:h-14 ${podeEnviar ? 'bg-cherry text-silk' : 'cursor-not-allowed bg-oat-2 text-ink-2'}`}
          >
            Enviar pedido pelo WhatsApp
          </button>
          {!podeEnviar && (
            <p id="nota-envio" className="text-sm text-ink-2">
              O envio pelo WhatsApp ainda não está disponível.
            </p>
          )}
          <Link to="/catalogo" className={`${botao} h-[54px] border border-noir md:h-13`}>
            Continuar comprando
          </Link>
          <p className="hidden text-sm leading-normal text-ink-2 md:block">
            O pedido é finalizado pelo WhatsApp. Não há pagamento no site.
          </p>
          <button
            type="button"
            onClick={aoEsvaziar}
            className="h-11 self-center px-2 text-sm underline md:hidden"
          >
            Esvaziar carrinho
          </button>
        </aside>
      </div>
    </main>
  )
}
