import PaginaLegal from '../components/PaginaLegal'
import { legal } from '../config/legal'
import { secoesPrivacidade } from '../content/privacidade'

export default function Privacidade() {
  return (
    <PaginaLegal
      titulo="Política de privacidade"
      atualizadoEm={legal.privacidadeAtualizadaEm}
      secoes={secoesPrivacidade}
      linkExtra={{ para: '/termos', texto: 'Ler os Termos de uso' }}
    />
  )
}
