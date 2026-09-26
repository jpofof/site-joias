import CategoryTiles from '../components/CategoryTiles'
import Hero from '../components/Hero'
import PaginaMeta from '../components/PaginaMeta'
import PassosPedido from '../components/PassosPedido'
import ProductShowcase from '../components/ProductShowcase'
import SobreHome from '../components/SobreHome'
import { produtos } from '../data/produtos'

// Na Home, a ordem do array é "mais recentes primeiro": Novidades são os 4 primeiros
// e os Destaques são os 4 primeiros com destaque: true.
const destaques = produtos.filter((p) => p.destaque).slice(0, 4)
const novidades = produtos.slice(0, 4)

export default function Home() {
  return (
    <main>
      <PaginaMeta descricao="Joias e acessórios da Eduáh: anéis, brincos, colares, pulseiras, piercings e linha masculina. Monte o carrinho e envie o pedido pelo WhatsApp." />
      <Hero />
      <CategoryTiles />
      <ProductShowcase
        eyebrow="Seleção da Duda"
        titulo="Destaques da marca"
        produtos={destaques}
        fundo="bg-silk"
        linkDesktop="Ver catálogo"
        linkTablet="Ver catálogo"
      />
      <ProductShowcase
        eyebrow="Acabou de chegar"
        titulo="Novidades"
        produtos={novidades}
        fundo="bg-oat-1"
        linkDesktop="Ver novidades"
        linkTablet="Ver catálogo"
        novos
      />
      <SobreHome />
      <PassosPedido />
    </main>
  )
}
