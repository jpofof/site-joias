import PaginaLegal from '../components/PaginaLegal'
import { legal } from '../config/legal'
import { secoesPrivacidade } from '../content/privacidade'

export default function Privacidade() {
  return (
    <PaginaLegal
      titulo="Política de privacidade"
      descricao="Como a Eduáh Acessórios trata os dados de quem visita o site e faz um pedido."
      atualizadoEm={legal.privacidadeAtualizadaEm}
      secoes={secoesPrivacidade}
      linkExtra={{ para: '/termos', texto: 'Ler os Termos de uso' }}
    />
  )
}
