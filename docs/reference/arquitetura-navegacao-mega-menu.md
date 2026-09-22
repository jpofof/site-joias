# Documentação UX/UI --- Arquitetura de Navegação, Mega Menu e Pesquisa

**Projeto:** Loja virtual de joias\
**Documento:** Diretrizes e decisões de wireframe --- cabeçalho,
catálogo e pesquisa\
**Status:** Em análise estrutural / wireframe de baixa fidelidade\
**Idioma da interface:** Português brasileiro

------------------------------------------------------------------------

## 1. Objetivo deste documento

Este documento registra as decisões e análises realizadas para a
arquitetura de navegação da loja de joias, com foco em:

-   Cabeçalho principal;
-   Mega menu do catálogo;
-   Pesquisa de produtos;
-   Recomendações de produtos dentro da pesquisa;
-   Comportamento responsivo em desktop, tablet e mobile;
-   Acessibilidade e previsibilidade das interações;
-   Pontos ainda abertos para validação por meio de wireframes e testes.

O objetivo não é definir ainda cores, tipografia definitiva, animações
detalhadas ou identidade visual final. A prioridade é estabelecer uma
estrutura clara, compreensível e consistente antes da implementação.

------------------------------------------------------------------------

## 2. Contexto do projeto

A loja será uma vitrine de joias com catálogo de aproximadamente 20--25
produtos. O usuário poderá explorar os produtos, visualizar preços e
adicionar itens ao carrinho. O fechamento da compra será encaminhado
pelo WhatsApp, sem checkout e pagamento diretamente no site.

As categorias inicialmente consideradas são:

-   Pulseiras;
-   Anéis;
-   Piercings;
-   Brincos;
-   Colares;
-   Linha masculina.

A cliente deverá conseguir administrar o catálogo por meio de um painel
administrativo. Por isso, algumas funcionalidades de destaque e
organização precisam ser planejadas de forma que possam ser controladas
por dados do produto.

------------------------------------------------------------------------

# 3. Princípios de UX utilizados

## 3.1. Clareza e reconhecimento

A interface deve deixar evidente:

-   Onde o usuário está;
-   Como acessar o catálogo;
-   Como encontrar um produto;
-   Como voltar à página inicial;
-   Como abrir e fechar painéis;
-   Como acessar o carrinho.

Os nomes dos elementos devem ser compreensíveis e consistentes. O ícone
da lupa, por exemplo, deve representar a pesquisa e, quando necessário,
ser acompanhado de um rótulo ou texto acessível.

## 3.2. Redução do esforço de navegação

O usuário deve conseguir seguir dois caminhos principais:

1.  Explorar a loja por categorias e recomendações;
2.  Procurar diretamente um produto por meio da pesquisa.

Nenhum desses caminhos deve depender exclusivamente do outro.

## 3.3. Previsibilidade

Os comportamentos devem ser semelhantes em todos os dispositivos, mesmo
quando a apresentação mudar.

Exemplo:

-   No desktop, o catálogo aparece em um painel amplo;
-   No tablet, aparece em um painel lateral;
-   No mobile, mantém a mesma lógica de conteúdo, mas com adaptação de
    espaço e toque.

## 3.4. Acessibilidade e controle

Os painéis precisam permitir:

-   Fechamento por botão visível;
-   Fechamento com a tecla `Esc`, quando aplicável;
-   Navegação por teclado;
-   Foco inicial no campo ou no título adequado;
-   Foco controlado enquanto o painel estiver aberto;
-   Alvos de toque suficientemente grandes;
-   Textos e estados compreensíveis para tecnologias assistivas.

O menu não deve depender apenas de hover, porque hover não funciona da
mesma forma em dispositivos touch e pode dificultar o uso por teclado.

------------------------------------------------------------------------

# 4. Arquitetura geral do cabeçalho

## 4.1. Estrutura conceitual definida

A estrutura principal considerada é:

``` text
LOGOTIPO | CATÁLOGO | PESQUISA | SOBRE | CARRINHO
```

### Logotipo

-   Funciona como link para a página inicial;
-   Substitui a necessidade de um item textual separado chamado
    "Início";
-   Deve permanecer identificável em todos os dispositivos.

### Catálogo

-   Abre o mega menu;
-   Apresenta categorias, links de exploração e possíveis destaques;
-   Não deve ser apenas um link genérico sem contexto.

### Pesquisa

-   Abre uma interface de pesquisa;
-   Permite procurar produtos;
-   Também apresenta recomendações quando o campo está vazio.

### Sobre

-   Direciona para a seção ou página que apresenta a marca;
-   Pode funcionar como âncora na página inicial ou como página própria,
    dependendo da arquitetura final.

### Carrinho

-   Abre o carrinho;
-   Deve apresentar quantidade de itens e, quando apropriado, valor
    total;
-   O comportamento deve ser consistente em desktop, tablet e mobile.

------------------------------------------------------------------------

# 5. Decisão sobre o menu hambúrguer

Foi definido que o menu hambúrguer deve ser evitado como solução padrão,
especialmente no desktop.

A intenção é manter os principais caminhos visíveis e reconhecíveis, sem
esconder a navegação principal atrás de um ícone.

## 5.1. Diretriz

Não utilizar automaticamente:

``` text
☰ → todos os itens da navegação
```

A navegação deve ser analisada considerando:

-   Espaço horizontal disponível;
-   Tamanho dos alvos de toque;
-   Quantidade de opções;
-   Prioridade de cada ação;
-   Legibilidade;
-   Consistência entre dispositivos.

No mobile, a solução final ainda está em análise. O fato de uma tela ser
pequena não significa que o menu hambúrguer deva ser adotado sem
avaliação. Porém, a limitação de espaço precisa ser considerada de
maneira realista.

------------------------------------------------------------------------

# 6. Mega menu do catálogo

## 6.1. Objetivo

O mega menu deve permitir que o usuário explore o catálogo sem precisar
acessar primeiro uma página intermediária.

Ao clicar em "Catálogo", o usuário deve visualizar:

1.  Categorias principais;
2.  Links de exploração;
3.  Produtos ou coleções em destaque;
4.  Eventualmente, uma chamada promocional ou informativa.

O mega menu funciona como uma camada de navegação e descoberta, não como
uma página completa de catálogo.

------------------------------------------------------------------------

## 6.2. Desktop --- painel sobre a página

### Comportamento definido

No desktop, o mega menu deve:

-   Abrir quando o usuário clicar em "Catálogo";
-   Aparecer sobre o conteúdo da página;
-   Utilizar um painel horizontal amplo;
-   Organizar o conteúdo em colunas;
-   Poder apresentar imagens de produtos ou coleções;
-   Utilizar uma camada de fundo escurecida para indicar que o painel
    está ativo;
-   Possuir um botão de fechamento;
-   Fechar com `Esc`;
-   Fechar quando o usuário clicar novamente no controle do catálogo;
-   Avaliar o fechamento ao clicar fora, evitando encerramentos
    acidentais.

### Estrutura sugerida

``` text
┌──────────────────────────────────────────────────────────────────────────────┐
│ LOGOTIPO      CATÁLOGO ▲      SOBRE      PESQUISA      CARRINHO              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ CATEGORIAS             EXPLORE                  DESTAQUES                    │
│                                                                              │
│ Anéis             →    Todos os produtos    →   Produto 01                  │
│ Brincos           →    Novidades            →   Produto 02                  │
│ Colares           →    Destaques da marca   →   Produto 03                  │
│ Pulseiras         →    Mais vendidos*       →   Coleção / campanha          │
│ Piercings         →                                                            │
│ Linha masculina   →                                                            │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Coluna 1 --- Categorias

Categorias principais:

-   Anéis;
-   Brincos;
-   Colares;
-   Pulseiras;
-   Piercings;
-   Linha masculina.

Cada categoria poderá direcionar para:

-   Uma página específica;
-   Uma listagem filtrada;
-   Uma rota específica do catálogo.

A decisão técnica entre página própria e filtro na mesma página ainda
deve ser tomada depois da definição da arquitetura de produtos e URLs.

### Coluna 2 --- Explore

Links de exploração:

-   Todos os produtos;
-   Novidades;
-   Destaques da marca;
-   Mais vendidos, se houver dados confiáveis.

Essa coluna deve conter caminhos que não são necessariamente categorias.

### Coluna 3 --- Destaques

Pode apresentar:

-   Um ou mais produtos selecionados;
-   Uma coleção;
-   Uma campanha;
-   Uma chamada visual da marca.

A quantidade deve ser limitada para que os destaques não prejudiquem a
função principal do menu: orientar a navegação.

------------------------------------------------------------------------

# 7. Tablet --- mega menu aprovado

## 7.1. Estrutura escolhida

Para tablet, foi aprovado um painel lateral com:

-   Fundo da página escurecido;
-   Painel branco ou visualmente destacado;
-   Título "Catálogo";
-   Botão `X`;
-   Campo de pesquisa;
-   Categorias em uma grade compacta;
-   Seção "Explore";
-   Área de destaque na parte inferior.

### Wireframe

``` text
┌────────────────────────────────────────────────────────────────┐
│ LOGOTIPO          CATÁLOGO      SOBRE      PESQUISA     CARR. │
├────────────────────────────────────────────────────────────────┤
│ Página ao fundo escurecida                                    │
│                                                                │
│                    ┌────────────────────────────────────────┐  │
│                    │ Catálogo                            X │  │
│                    │                                        │  │
│                    │ Buscar no catálogo...                  │  │
│                    │                                        │  │
│                    │ CATEGORIAS                             │  │
│                    │                                        │  │
│                    │ ┌────────┐ ┌────────┐ ┌────────┐      │  │
│                    │ │ Anéis  │ │Brincos │ │Colares │      │  │
│                    │ └────────┘ └────────┘ └────────┘      │  │
│                    │ ┌────────┐ ┌────────┐ ┌────────┐      │  │
│                    │ │Pulseiras││Piercing││Masculino│     │  │
│                    │ └────────┘ └────────┘ └────────┘      │  │
│                    │                                        │  │
│                    │ EXPLORE                                 │  │
│                    │ Todos os produtos                    → │  │
│                    │ Novidades                            → │  │
│                    │ Destaques da marca                   → │  │
│                    │ Mais vendidos*                       → │  │
│                    │                                        │  │
│                    │ ┌────────────────────────────────────┐ │  │
│                    │ │ Imagem / coleção                   │ │  │
│                    │ │ Ver coleção →                      │ │  │
│                    │ └────────────────────────────────────┘ │  │
│                    └────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

## 7.2. Motivos da escolha

Esse formato mantém os conteúdos principais do mega menu desktop, mas
reduz sua largura e organiza as categorias em uma grade.

Vantagens esperadas:

-   Categorias facilmente reconhecíveis;
-   Menor necessidade de rolagem horizontal;
-   Boa adaptação a interações por toque;
-   Hierarquia visual clara;
-   Possibilidade de incluir destaques sem ocupar toda a tela.

Pontos que ainda precisam ser avaliados:

-   Largura ideal do painel;
-   Tamanho mínimo dos alvos de toque;
-   Necessidade de rolagem vertical;
-   Quantidade de produtos no destaque;
-   Comportamento quando o tablet estiver na orientação horizontal ou
    vertical.

------------------------------------------------------------------------

# 8. Mobile --- estrutura ainda em análise

## 8.1. Diretriz atual

No mobile, será preservado o conceito visual do painel aprovado para
tablet, mas ainda não existe uma decisão final sobre a melhor forma de
navegação.

A estrutura deve ser adaptada para:

-   Toque;
-   Teclado virtual;
-   Menor largura;
-   Maior necessidade de rolagem vertical;
-   Leitura em uma coluna ou em uma grade mais compacta.

### Wireframe provisório

``` text
┌────────────────────────────────────┐
│ Página ao fundo escurecida         │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ Catálogo                    X │ │
│ │                                │ │
│ │ Buscar no catálogo...          │ │
│ │                                │ │
│ │ CATEGORIAS                     │ │
│ │                                │ │
│ │ ┌──────────┐ ┌──────────┐      │ │
│ │ │  Anéis   │ │ Brincos  │      │ │
│ │ └──────────┘ └──────────┘      │ │
│ │ ┌──────────┐ ┌──────────┐      │ │
│ │ │ Colares  │ │Pulseiras │      │ │
│ │ └──────────┘ └──────────┘      │ │
│ │ ┌──────────┐ ┌──────────┐      │ │
│ │ │Piercings │ │Masculino │      │ │
│ │ └──────────┘ └──────────┘      │ │
│ │                                │ │
│ │ EXPLORE                        │ │
│ │ Todos os produtos           → │ │
│ │ Novidades                   → │ │
│ │ Destaques da marca          → │ │
│ │ Mais vendidos*              → │ │
│ │                                │ │
│ │ ┌────────────────────────────┐ │ │
│ │ │ Destaque / coleção         │ │ │
│ │ │ Ver coleção →              │ │ │
│ │ └────────────────────────────┘ │ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

## 8.2. Questões em aberto

Ainda será necessário decidir:

-   Painel lateral estreito ou painel quase em tela cheia;
-   Grade com duas colunas ou lista vertical;
-   Exibição ou remoção da área de destaque;
-   Forma de retorno de uma categoria para o menu principal;
-   Como preservar acesso à pesquisa e ao carrinho;
-   Se o cabeçalho mobile terá todos os itens visíveis ou alguma forma
    de compactação.

A solução mobile não deve ser considerada final apenas por ser uma
adaptação do tablet. Ela precisa ser analisada separadamente com base na
ergonomia e no espaço disponível.

------------------------------------------------------------------------

# 9. Pesquisa de produtos

## 9.1. Objetivo

A pesquisa terá duas funções:

1.  Busca direta de produtos;
2.  Descoberta de produtos por meio de recomendações.

A lupa não deve abrir somente um campo vazio. Quando o usuário ainda não
digitou nada, a interface poderá apresentar produtos, categorias ou
coleções sugeridas.

------------------------------------------------------------------------

## 9.2. Desktop --- painel sobreposto

### Estado inicial

``` text
┌──────────────────────────────────────────────────────────────────────────────┐
│ LOGOTIPO      CATÁLOGO      SOBRE      PESQUISA      CARRINHO                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ 🔍 Buscar produtos, categorias...                              Fechar X      │
│                                                                              │
│ EXPLORE                              PRODUTOS SUGERIDOS                      │
│                                                                              │
│ Novidades                            ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│ Destaques                            │Produto 1│ │Produto 2│ │Produto 3│   │
│ Todos os produtos                    └─────────┘ └─────────┘ └─────────┘   │
│                                                                              │
│ Categorias sugeridas                  Nome + preço dos produtos             │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Regras

-   O painel aparece sobre a página;
-   O fundo recebe uma camada visual que indica a atividade do painel;
-   O campo recebe foco ao abrir;
-   O botão de fechamento deve ser visível;
-   `Esc` deve fechar o painel;
-   O usuário deve poder navegar por teclado;
-   A rolagem deve ser controlada quando o conteúdo for maior que a área
    disponível.

------------------------------------------------------------------------

## 9.3. Tablet e mobile --- painel lateral

### Estado inicial

``` text
┌────────────────────────────────────────────────────────────────┐
│ Página ao fundo escurecida                                    │
│                                                                │
│              ┌──────────────────────────────────────────────┐  │
│              │ Pesquisar                                  X│  │
│              │                                              │  │
│              │ Buscar produtos, categorias...               │  │
│              │                                              │  │
│              │ EXPLORE                                      │  │
│              │ Novidades                                    │  │
│              │ Destaques                                    │  │
│              │ Todos os produtos                            │  │
│              │                                              │  │
│              │ PRODUTOS SUGERIDOS                            │  │
│              │                                              │  │
│              │ Produto 1 | Produto 2 | Produto 3             │  │
│              │ Imagem    | Imagem    | Imagem                │  │
│              │ Preço     | Preço     | Preço                 │  │
│              └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

O painel deve permitir rolagem interna quando necessário e manter o
botão de fechamento acessível.

------------------------------------------------------------------------

# 10. Estados da pesquisa

## 10.1. Pesquisa fechada

Somente o ícone ou controle de pesquisa fica disponível no cabeçalho.

## 10.2. Pesquisa aberta com campo vazio

Exibe:

-   Campo de pesquisa;
-   Novidades;
-   Destaques;
-   Todos os produtos;
-   Categorias sugeridas;
-   Produtos recomendados.

## 10.3. Usuário digitando

Exemplo: `anel`.

``` text
┌──────────────────────────────────────────────────────────────┐
│ 🔍 anel                                             Fechar X │
├──────────────────────────────────────────────────────────────┤
│ RESULTADOS PARA “ANEL”                                      │
│                                                              │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐                 │
│ │   Imagem   │ │   Imagem   │ │   Imagem   │                 │
│ └────────────┘ └────────────┘ └────────────┘                 │
│ Anel delicado  Anel dourado   Anel com pedra                 │
│ R$ 59,90       R$ 79,90       R$ 89,90                       │
│                                                              │
│ Ver todos os resultados →                                    │
└──────────────────────────────────────────────────────────────┘
```

## 10.4. Nenhum resultado

A interface deve apresentar:

-   Mensagem clara;
-   Sugestão para verificar a escrita;
-   Link para todos os produtos;
-   Possíveis categorias relacionadas;
-   Produtos em destaque, quando fizer sentido.

Exemplo:

``` text
Nenhum produto encontrado para “anel azul”.

Tente buscar por outro termo ou explore todas as categorias.

[Ver todos os produtos]
```

------------------------------------------------------------------------

# 11. Recomendações na pesquisa

## 11.1. Recomendações permitidas na primeira versão

Para evitar afirmações sem fundamento, as recomendações iniciais podem
ser baseadas em:

-   Seleção manual da cliente;
-   Produtos marcados como destaque;
-   Produtos adicionados recentemente;
-   Categorias relevantes;
-   Produtos relacionados ao termo pesquisado.

## 11.2. "Mais vendidos"

O rótulo "Mais vendidos" só deve ser usado quando houver dados
confiáveis.

Como as vendas são encaminhadas pelo WhatsApp e não necessariamente
registradas automaticamente pelo site, o sistema pode não possuir dados
suficientes para afirmar quais produtos vendem mais.

Enquanto isso, alternativas mais seguras são:

-   Destaques da marca;
-   Seleção da cliente;
-   Produtos recomendados;
-   Novidades;
-   Explore nossos produtos.

## 11.3. Campos possíveis no modelo de produto

Para suportar a organização futura, podem ser considerados campos como:

``` ts
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  createdAt?: string;
  isFeatured?: boolean;
  featuredOrder?: number;
};
```

Esses campos são uma proposta conceitual e ainda precisam ser alinhados
ao modelo real do projeto.

------------------------------------------------------------------------

# 12. Comportamento responsivo resumido

  -----------------------------------------------------------------------
  Recurso           Desktop           Tablet            Mobile
  ----------------- ----------------- ----------------- -----------------
  Cabeçalho         Navegação direta  Versão compacta   Ainda em análise

  Mega menu         Painel amplo      Painel lateral    Adaptação do
                    sobre a página    aprovado          painel aprovado

  Pesquisa          Painel sobreposto Painel lateral    Painel lateral ou
                                                        solução a validar

  Categorias        Coluna de links   Grade compacta    Grade ou lista a
                                                        validar

  Destaques         Imagens e         Destaque compacto Destaque reduzido
                    produtos em                         ou opcional
                    colunas                             

  Fechamento        X, Esc e foco     X, Esc e toque    X e toque, com
                                                        análise de gesto

  Rolagem           Página/painel     Rolagem interna   Rolagem interna
                    conforme conteúdo quando necessário obrigatória
                                                        quando necessário
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 13. Acessibilidade e interação

## 13.1. Abertura

Ao abrir o mega menu ou a pesquisa:

-   O foco deve ser encaminhado para o primeiro elemento útil;
-   O estado aberto deve ser comunicado semanticamente;
-   O botão de abertura deve indicar que o painel está expandido;
-   O conteúdo atrás do painel não deve receber interação indevida.

## 13.2. Fechamento

O painel deve poder ser fechado por:

-   Botão `X`;
-   Tecla `Esc`, em dispositivos com teclado;
-   Controle de abertura, quando apropriado;
-   Clique fora, desde que o comportamento seja previsível e não cause
    fechamento acidental.

## 13.3. Teclado

A navegação por teclado deve permitir:

-   Entrar no painel;
-   Percorrer os links;
-   Acionar categorias;
-   Fechar o painel;
-   Retornar o foco ao controle que abriu o painel.

## 13.4. Toque

Os controles devem:

-   Possuir área de toque adequada;
-   Não depender de hover;
-   Ter espaçamento suficiente para evitar toques acidentais;
-   Permitir rolagem sem bloquear o botão de fechamento.

------------------------------------------------------------------------

# 14. Decisões tomadas

Até o momento, foram definidas ou encaminhadas as seguintes decisões:

1.  O logotipo funcionará como link para a página inicial.
2.  Não haverá item textual separado chamado "Início".
3.  O cabeçalho terá Catálogo, Pesquisa, Sobre e Carrinho.
4.  O menu hambúrguer não será utilizado automaticamente como solução
    padrão.
5.  O Catálogo abrirá um mega menu.
6.  No desktop, o mega menu será um painel amplo sobre a página.
7.  No tablet, será utilizado o painel lateral aprovado.
8.  No mobile, será preservado o conceito do painel aprovado, mas a
    estrutura ainda será refinada.
9.  O mega menu terá categorias, links de exploração e destaques.
10. A pesquisa terá busca direta e recomendações.
11. No desktop, a pesquisa abrirá sobre a página.
12. Em dispositivos menores, a pesquisa será lateral.
13. A pesquisa poderá recomendar produtos antes de o usuário digitar.
14. "Mais vendidos" só será utilizado com dados confiáveis.
15. A pesquisa e o mega menu devem ser acessíveis por teclado e toque.

------------------------------------------------------------------------

# 15. Decisões ainda em aberto

## Cabeçalho

-   Posicionamento exato dos itens;
-   Uso de rótulo junto à lupa;
-   Organização dos elementos no mobile;
-   Forma de manter Catálogo, Pesquisa, Sobre e Carrinho acessíveis em
    telas estreitas.

## Mega menu

-   Largura definitiva do painel desktop;
-   Quantidade de produtos exibidos nos destaques;
-   Uso de imagem de coleção;
-   Comportamento de subcategorias;
-   Página específica ou filtro para cada categoria;
-   Forma final do painel mobile.

## Pesquisa

-   Pesquisa instantânea ou busca após confirmação;
-   Quantidade de resultados exibidos;
-   Ordenação dos resultados;
-   Critério dos produtos recomendados;
-   Mensagens para ausência de resultados;
-   Pesquisa por categoria, nome, material e outras propriedades.

## Catálogo

-   Implementação como filtro ou páginas individuais;
-   Estrutura de URL;
-   Filtros adicionais;
-   Ordenação;
-   Paginação ou carregamento de produtos.

------------------------------------------------------------------------

# 16. Próxima etapa recomendada

A próxima etapa deve ser uma análise específica do **cabeçalho mobile**,
pois esse é o ponto que ainda apresenta maior incerteza.

A análise deve comparar opções sem assumir automaticamente o menu
hambúrguer:

1.  Cabeçalho com todos os itens essenciais;
2.  Cabeçalho com rótulos reduzidos;
3.  Cabeçalho com navegação horizontal controlada;
4.  Cabeçalho com ações prioritárias e acesso secundário bem
    identificado;
5.  Outras soluções que mantenham a navegação compreensível e acessível.

Depois disso, será possível consolidar o wireframe completo e começar a
definir:

-   Componentes React;
-   Estados dos painéis;
-   Estrutura de dados;
-   Rotas;
-   Regras de busca;
-   Regras de responsividade;
-   Critérios de acessibilidade;
-   Critérios de teste de usabilidade.

------------------------------------------------------------------------

## 17. Conclusão

A arquitetura atual combina:

-   Navegação direta pelo cabeçalho;
-   Mega menu de catálogo;
-   Pesquisa com recomendações;
-   Adaptação específica para desktop, tablet e mobile;
-   Destaques controlados pela cliente;
-   Busca orientada à descoberta e à localização direta de produtos.

O desktop já possui uma direção mais definida, com mega menu amplo sobre
a página. O tablet possui um painel lateral visualmente aprovado. O
mobile deve preservar os conceitos principais, mas ainda precisa de uma
decisão mais cuidadosa sobre a navegação do cabeçalho e a distribuição
do conteúdo.

A prioridade continua sendo construir uma experiência clara, previsível
e fácil de usar antes de iniciar a implementação visual definitiva.
