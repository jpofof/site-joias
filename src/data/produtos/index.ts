import type { Produto } from '../../types/produto'
import dados from '../produtos.json'

// Catálogo cadastrado no Decap CMS ("Produtos"), em src/data/produtos.json. A ordem do array é a
// ordem "mais recentes primeiro": as Novidades da Home são os 4 primeiros e os Destaques são os
// primeiros com destaque: true — a mesma ordem em que a lista aparece no painel do CMS.
// Ainda são os 24 produtos de exemplo até a cliente cadastrar o catálogo real.
export const produtos: Produto[] = dados.produtos as Produto[]
