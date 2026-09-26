import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { CartProvider } from './context/CartContext'
import Busca from './pages/Busca'
import Carrinho from './pages/Carrinho'
import Catalogo from './pages/Catalogo'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Pedido from './pages/Pedido'
import Privacidade from './pages/Privacidade'
import Produto from './pages/Produto'
import Sobre from './pages/Sobre'
import Termos from './pages/Termos'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="catalogo" element={<Catalogo />} />
            <Route path="busca" element={<Busca />} />
            <Route path="produto/:id" element={<Produto />} />
            <Route path="carrinho" element={<Carrinho />} />
            <Route path="pedido" element={<Pedido />} />
            <Route path="sobre" element={<Sobre />} />
            <Route path="privacidade" element={<Privacidade />} />
            <Route path="termos" element={<Termos />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
