import type { SecaoLegal } from '../lib/legal'

// Texto copiado dos quadros do design (docs/design). Os {campos} vêm de src/config/legal.ts.
// Revisão jurídica recomendada antes de publicar.
export const secoesPrivacidade: SecaoLegal[] = [
  {
    id: 'controlador',
    titulo: '1. Quem somos',
    blocos: [
      { tipo: 'p', texto: 'A Eduáh Acessórios é a responsável (controladora) pelos dados tratados neste site, nos termos da Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018).' },
      { tipo: 'p', texto: 'Responsável: {responsavel} · CPF/CNPJ: {cpfCnpj} · Contato para assuntos de privacidade: {email}.' },
    ],
  },
  {
    id: 'dados',
    titulo: '2. Quais dados tratamos',
    blocos: [
      { tipo: 'p', texto: 'O site é um catálogo. Não há cadastro, login nem pagamento online, então coletamos o mínimo possível.' },
      { tipo: 'p', texto: 'Dados técnicos de acesso: endereço IP, tipo de aparelho e navegador, registrados pelo provedor de hospedagem para manter o site seguro e funcionando.' },
      { tipo: 'p', texto: 'Dados do pedido: a lista de produtos do carrinho, que fica apenas no seu aparelho até você esvaziar o carrinho. Ao enviar pelo WhatsApp, o número e o nome do seu perfil ficam com a Eduáh e com o WhatsApp.' },
    ],
  },
  {
    id: 'finalidade',
    titulo: '3. Para que usamos e em que base legal',
    blocos: [
      { tipo: 'p', texto: 'Atender seu pedido e responder suas mensagens (execução de contrato e procedimentos preliminares, art. 7º, V).' },
      { tipo: 'p', texto: 'Manter o site seguro e funcionando (legítimo interesse, art. 7º, IX).' },
    ],
  },
  {
    id: 'compartilhamento',
    titulo: '4. Com quem compartilhamos',
    blocos: [
      { tipo: 'p', texto: 'Não vendemos dados. Compartilhamos apenas com prestadores necessários ao serviço: hospedagem do site {provedorHospedagem} e WhatsApp (Meta), quando você envia o pedido.' },
      { tipo: 'p', texto: 'Alguns desses prestadores podem processar dados fora do Brasil, com as garantias previstas na LGPD.' },
    ],
  },
  {
    id: 'cookies',
    titulo: '5. Cookies e armazenamento',
    blocos: [
      { tipo: 'p', texto: 'Este site usa apenas armazenamento essencial no seu aparelho, para guardar o carrinho enquanto você navega. Ele não é usado para rastrear você nem para publicidade, por isso não pedimos consentimento.' },
      { tipo: 'p', texto: 'Se um dia passarmos a usar ferramentas de estatística ou anúncios, avisaremos nesta página e pediremos a sua permissão antes.' },
    ],
  },
  {
    id: 'direitos',
    titulo: '6. Seus direitos',
    blocos: [
      { tipo: 'p', texto: 'Você pode pedir, a qualquer momento e sem custo: confirmação de que tratamos seus dados; acesso; correção; anonimização, bloqueio ou eliminação de dados desnecessários; portabilidade; informação sobre compartilhamentos; e revogação do consentimento (art. 18 da LGPD).' },
      { tipo: 'p', texto: 'Para exercer seus direitos, escreva para {email}. Respondemos em até {prazoRespostaDias} dias.' },
    ],
  },
  {
    id: 'retencao',
    titulo: '7. Por quanto tempo guardamos',
    blocos: [
      { tipo: 'p', texto: 'Guardamos os dados apenas pelo tempo necessário para a finalidade que os motivou ou para cumprir obrigações legais. Conversas de pedido: {prazoConversas}.' },
    ],
  },
  {
    id: 'seguranca',
    titulo: '8. Segurança',
    blocos: [
      { tipo: 'p', texto: 'Usamos conexão segura (HTTPS) e limitamos o acesso aos dados a quem precisa deles. Nenhum sistema é totalmente livre de risco; em caso de incidente relevante, avisaremos você e a Autoridade Nacional de Proteção de Dados (ANPD) conforme a lei.' },
    ],
  },
  {
    id: 'atualizacoes',
    titulo: '9. Atualizações e contato',
    blocos: [
      { tipo: 'p', texto: 'Podemos atualizar esta política. A data da última revisão aparece no topo da página. Dúvidas ou reclamações: {email}. Você também pode contatar a ANPD.' },
    ],
  },
]
