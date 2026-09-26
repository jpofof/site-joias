import type { SecaoLegal } from '../lib/legal'

// Texto copiado dos quadros do design (docs/design). Os {campos} vêm de src/config/legal.ts.
// Revisão jurídica recomendada antes de publicar.
export const secoesTermos: SecaoLegal[] = [
  {
    id: 'sobre',
    titulo: '1. Sobre o site',
    blocos: [
      { tipo: 'p', texto: 'Este site apresenta o catálogo da Eduáh Acessórios. Ao usá-lo, você concorda com estes termos.' },
    ],
  },
  {
    id: 'pedidos',
    titulo: '2. Como funcionam os pedidos',
    blocos: [
      { tipo: 'p', texto: 'O carrinho é uma lista de interesse. O pedido só é concluído quando você envia a mensagem pelo WhatsApp e a Eduáh confirma disponibilidade, valor final e forma de pagamento e entrega.' },
      { tipo: 'p', texto: 'Não há pagamento no site.' },
    ],
  },
  {
    id: 'precos',
    titulo: '3. Preços e disponibilidade',
    blocos: [
      { tipo: 'p', texto: 'Os preços exibidos podem mudar sem aviso e valem até a confirmação do pedido. O catálogo é atualizado periodicamente, então algum produto pode estar indisponível.' },
      // Só vale enquanto o site tiver fotos reais e "ilustrativas" fizer sentido: revisar quando as fotos entrarem.
      { tipo: 'p', texto: 'As fotos são ilustrativas; pequenas variações de cor e tamanho podem ocorrer.' },
    ],
  },
  {
    id: 'trocas',
    titulo: '4. Trocas e devoluções',
    blocos: [
      { tipo: 'p', texto: '{politicaTrocas} Em compras a distância, o Código de Defesa do Consumidor garante o direito de arrependimento em até 7 dias após o recebimento.' },
    ],
  },
  {
    id: 'propriedade',
    titulo: '5. Propriedade intelectual',
    blocos: [
      { tipo: 'p', texto: 'Marca, logotipo, textos e fotos pertencem à Eduáh Acessórios. É proibido copiá-los ou usá-los sem autorização.' },
    ],
  },
  {
    id: 'privacidade',
    titulo: '6. Privacidade',
    blocos: [
      { tipo: 'p', texto: 'O tratamento de dados pessoais está descrito na Política de privacidade.' },
      { tipo: 'link', para: '/privacidade', texto: 'Ler a Política de privacidade' },
    ],
  },
  {
    id: 'lei',
    titulo: '7. Lei aplicável e contato',
    blocos: [
      { tipo: 'p', texto: 'Estes termos seguem a legislação brasileira. Foro: {foro}. Dúvidas: {email}.' },
    ],
  },
]
