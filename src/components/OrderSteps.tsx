const etapas = ['Carrinho', 'Revisão', 'WhatsApp']

// Barra de 3 etapas do pedido. `atual` 1 = Carrinho; 3 = WhatsApp (Pedido preparado, tudo preenchido).
// Não existe página própria para a etapa 2 (Revisão) nos quadros.
export default function OrderSteps({ atual }: { atual: 1 | 3 }) {
  return (
    <ol aria-label="Etapas do pedido" className="flex gap-1.5 md:gap-2 lg:max-w-[640px]">
      {etapas.map((nome, i) => {
        const numero = i + 1
        const ativa = numero === atual
        return (
          <li key={nome} aria-current={ativa ? 'step' : undefined} className="flex flex-1 flex-col gap-2">
            <div aria-hidden="true" className={`h-1.5 ${numero <= atual ? 'bg-cherry' : 'bg-oat'}`} />
            <span
              className={`text-[13px] tracking-[0.04em] md:text-sm md:tracking-normal ${
                ativa ? 'font-medium' : 'text-ink-2 md:font-light md:text-noir'
              }`}
            >
              {numero} {nome}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
