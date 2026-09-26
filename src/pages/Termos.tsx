import PaginaLegal from '../components/PaginaLegal'
import { legal } from '../config/legal'
import { secoesTermos } from '../content/termos'

export default function Termos() {
  return (
    <PaginaLegal
      titulo="Termos de uso"
      descricao="Condições de uso do site e dos pedidos feitos à Eduáh Acessórios."
      atualizadoEm={legal.termosAtualizadosEm}
      secoes={secoesTermos}
      linkExtra={{ para: '/privacidade', texto: 'Ler a Política de privacidade' }}
    />
  )
}
