import type { Produto } from '../../types/produto'

// DADOS DE EXEMPLO: nomes, preços e descrições são fictícios e devem ser substituídos
// pelo catálogo real (cadastrado pelo Decap CMS). A ordem do array é a ordem "mais recentes
// primeiro": as Novidades da Home são os 4 primeiros e os Destaques são os primeiros com destaque: true.
export const produtos: Produto[] = [
  { id: 'aneis-01', nome: 'Anel Exemplo 01', categoria: 'aneis', preco: 89.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.', detalhes: { material: 'Material de exemplo', medidas: 'Medidas de exemplo', cuidados: 'Cuidados de exemplo' } },
  { id: 'brincos-01', nome: 'Brinco Exemplo 01', categoria: 'brincos', preco: 129.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.', detalhes: { material: 'Material de exemplo', medidas: 'Medidas de exemplo', cuidados: 'Cuidados de exemplo' } },
  { id: 'colares-01', nome: 'Colar Exemplo 01', categoria: 'colares', preco: 159.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.' },
  { id: 'pulseiras-01', nome: 'Pulseira Exemplo 01', categoria: 'pulseiras', preco: 109.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.' },
  { id: 'piercings-01', nome: 'Piercing Exemplo 01', categoria: 'piercings', preco: 69.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.', destaque: true },
  { id: 'linha-masculina-01', nome: 'Peça masculina Exemplo 01', categoria: 'linha-masculina', preco: 139.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.', destaque: true },
  { id: 'aneis-02', nome: 'Anel Exemplo 02', categoria: 'aneis', preco: 99.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.', destaque: true },
  { id: 'brincos-02', nome: 'Brinco Exemplo 02', categoria: 'brincos', preco: 149.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.', destaque: true },
  { id: 'colares-02', nome: 'Colar Exemplo 02', categoria: 'colares', preco: 179.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.', destaque: true },
  { id: 'pulseiras-02', nome: 'Pulseira Exemplo 02', categoria: 'pulseiras', preco: 119.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.', destaque: true },
  { id: 'piercings-02', nome: 'Piercing Exemplo 02', categoria: 'piercings', preco: 79.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.' },
  { id: 'linha-masculina-02', nome: 'Peça masculina Exemplo 02', categoria: 'linha-masculina', preco: 159.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.' },
  { id: 'aneis-03', nome: 'Anel Exemplo 03', categoria: 'aneis', preco: 109.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.', destaque: true },
  { id: 'brincos-03', nome: 'Brinco Exemplo 03', categoria: 'brincos', preco: 169.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.', destaque: true },
  { id: 'colares-03', nome: 'Colar Exemplo 03', categoria: 'colares', preco: 199.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.' },
  { id: 'pulseiras-03', nome: 'Pulseira Exemplo 03', categoria: 'pulseiras', preco: 129.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.' },
  { id: 'piercings-03', nome: 'Piercing Exemplo 03', categoria: 'piercings', preco: 89.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.' },
  { id: 'linha-masculina-03', nome: 'Peça masculina Exemplo 03', categoria: 'linha-masculina', preco: 149.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.' },
  { id: 'aneis-04', nome: 'Anel Exemplo 04', categoria: 'aneis', preco: 79.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.' },
  { id: 'brincos-04', nome: 'Brinco Exemplo 04', categoria: 'brincos', preco: 119.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.' },
  { id: 'colares-04', nome: 'Colar Exemplo 04', categoria: 'colares', preco: 139.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.' },
  { id: 'pulseiras-04', nome: 'Pulseira Exemplo 04', categoria: 'pulseiras', preco: 99.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.' },
  { id: 'piercings-04', nome: 'Piercing Exemplo 04', categoria: 'piercings', preco: 59.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.' },
  { id: 'linha-masculina-04', nome: 'Peça masculina Exemplo 04', categoria: 'linha-masculina', preco: 129.9, imagem: '', descricao: 'Descrição de exemplo, a substituir pelo texto real.' },
]
