# Documentação Técnica — Site de Joias (Vitrine + Painel Próprio)

## 1. Visão Geral do Projeto

Vitrine online de joias para cliente próxima, com objetivo de exibir produtos, permitir seleção via carrinho e redirecionar o interesse de compra para o WhatsApp. Sem checkout/pagamento no site. Cliente atualiza o catálogo sozinha via painel de edição.

**Escopo comercial fechado:** Opção 2 (vitrine + painel próprio), R$1.800–R$2.500, parcelável em até 3x pelo valor cheio ou 5% de desconto à vista.

## 2. Requisitos Funcionais (coletados com a cliente)

- 20–25 produtos, catálogo trocando aproximadamente todo mês
- Categorias: pulseiras, anéis, piercing, brincos, colares, linha masculina
- Preço de cada produto exibido diretamente no site
- Cliente final seleciona múltiplos itens em um carrinho antes de ser redirecionada ao WhatsApp
- Mensagem pré-formatada no WhatsApp listando os itens escolhidos
- Cliente (dona do negócio) edita o catálogo sozinha, sem depender do João a cada troca
- Cliente vai usar um número de WhatsApp dedicado (chip novo) só para o site
- Cliente já tem identidade visual definida e fotos dos produtos (parte pode precisar ser refeita)
- Sem pagamento online — modelo 100% de geração de interesse/contato

## 3. Arquitetura (só front-end, sem backend)

Como não há necessidade de autenticação de usuário final, pagamento, nem processamento server-side, o projeto inteiro roda como site estático + CMS baseado em git.

```
Cliente final (navegador)
   → site estático (React/TS/Tailwind, build via Vite)
   → carrinho em memória/localStorage (Context API)
   → botão "finalizar" monta link wa.me com itens selecionados
   → abre WhatsApp da loja

Dona do negócio (cliente)
   → acessa painel de admin (Decap CMS, autenticado via Netlify Identity/GitHub)
   → cadastra/edita/remove produtos
   → commit automático no repositório
   → Netlify detecta o push e republica o site sozinho
```

Nenhum servidor próprio, nenhum banco de dados tradicional — os dados dos produtos vivem como arquivos (Markdown/JSON) dentro do próprio repositório, versionados no Git.

## 3.1. Navegação e Modelo de Produto (escopo reduzido)

Foi produzida uma análise de UX completa para cabeçalho, mega menu e pesquisa (arquitetura para catálogos grandes, com painel de categorias em colunas, painel de busca com recomendações e campos de destaque). Essa arquitetura **foi guardada como referência** em `docs/reference/arquitetura-navegacao-mega-menu.md`, para ser retomada se o catálogo crescer além de 20-25 produtos. Para o escopo atual, foi adotada uma versão reduzida:

**Cabeçalho (desktop e mobile, sem hambúrguer):**
```
LOGOTIPO   CATÁLOGO   SOBRE   🔍   🛒(contador)
```
- **Catálogo:** link que rola/navega até a grade de produtos (`ProductGrid`), onde o filtro por categoria (`CategoryFilter`) aparece como chips/abas horizontais — sem mega menu ou painel separado.
- **Sobre:** âncora ou página simples.
- **Pesquisa:** ícone que expande um campo de texto no próprio cabeçalho, filtrando os produtos já carregados em memória (sem painel sobreposto, sem recomendações, sem estado dedicado de "nenhum resultado").
- **Carrinho:** ícone com contador, abre o drawer.
- **Mobile:** os mesmos 4 elementos ficam visíveis (sem hambúrguer); se o espaço apertar, "Catálogo" pode virar um ícone de grade, mas nada fica escondido atrás de um menu.

**Modelo de produto** (`src/types/produto.ts`), refeito do zero para o escopo atual:
```ts
export type Categoria =
  | 'aneis'
  | 'brincos'
  | 'colares'
  | 'pulseiras'
  | 'piercings'
  | 'linha-masculina';

export type Produto = {
  id: string;
  nome: string;
  categoria: Categoria;
  preco: number;
  imagem: string;
  descricao?: string;
};
```
Sem campos de destaque, ordenação manual ou data de criação por enquanto — eles pertencem à arquitetura maior guardada como referência, e podem ser adicionados sem quebrar o tipo atual se o catálogo crescer.

## 4. Stack Tecnológica

- **Front-end:** React + TypeScript + Vite
- **Estilização:** Tailwind CSS v4 (plugin `@tailwindcss/vite`; tema configurado via `@theme` no CSS, sem `tailwind.config.ts` obrigatório)
- **Qualidade de código:** ESLint
- **Gerenciamento de estado do carrinho:** Context API + hook customizado (`useCart`), persistido em `localStorage`
- **CMS:** Decap CMS (admin em `/admin`, autenticação via Netlify Identity ou GitHub)
- **Hospedagem/Deploy:** Netlify (mesmo fluxo já usado nos outros projetos)
- **Controle de versão:** Git + GitHub

## 5. Estrutura de Arquivos Planejada

```
site-joias/
  public/
    admin/
      config.yml          # configuração do Decap CMS (coleções, campos)
      index.html          # entrada do painel admin
  src/
    types/
      produto.ts           # type Produto (id, nome, categoria, preco, imagem, descricao?) — ver seção 3.1
    components/
      ProductCard.tsx       # recebe um Produto via props
      ProductGrid.tsx       # recebe Produto[] e faz o map por categoria
      CategoryFilter.tsx    # filtro por categoria (pulseiras, anéis, etc.)
      Cart.tsx               # painel/drawer do carrinho
      CartButton.tsx         # botão flutuante com contagem de itens
      WhatsAppCTA.tsx        # monta o link wa.me com os itens selecionados
    hooks/
      useCart.ts             # lógica do carrinho + persistência em localStorage
    context/
      CartContext.tsx        # provider do carrinho pra toda a árvore de componentes
    data/
      produtos/               # arquivos .md ou .json gerados/editados pelo Decap CMS
    App.tsx
    main.tsx
  netlify.toml
  package.json
  tailwind.config.ts      # opcional no Tailwind v4 (tema via @theme em src/index.css)
  tsconfig.json
```

## 6. Fluxo de Trabalho (fases)

**Fase 1 — Design visual (antes de qualquer código de produção)**
1. Gerar direção visual via imagem (prompt de design → imagem/mockup via IA), usando a identidade visual e fotos que a cliente já tem como referência.
2. Validar a direção visual com a cliente antes de partir para o código.
3. Só depois de aprovado, converter o design (imagem/mockup) em código real — separando a etapa de "como fica visualmente" da etapa de "como funciona", evitando resolver os dois problemas ao mesmo tempo.

**Fase 2 — Implementação por partes**
4. Estrutura base do projeto (Vite + React + TS + Tailwind + ESLint).
5. Componentes de vitrine (ProductCard, ProductGrid, filtro por categoria).
6. Carrinho (Context API + localStorage) e integração com WhatsApp.
7. Configuração do Decap CMS (coleções, campos do produto, autenticação).
8. Validação da cliente em cada bloco antes de avançar para o próximo.

**Fase 3 — SEO e performance** (mesmo checklist já aplicado em Perin/Pedras Paraíso)
- `robots.txt` e `sitemap.xml`
- Meta tags (title, description, og:image, twitter:image) por página
- Schema.org apropriado (Store/Product, se aplicável)
- Otimização de imagens (formato, tamanho, lazy loading)
- Auditoria de performance (Lighthouse/Core Web Vitals)

**Fase 4 — Domínio, DNS e hospedagem**
- Registro/configuração do domínio (a cargo da cliente, conforme já alinhado comercialmente)
- Configuração de DNS apontando para Netlify
- Deploy e configuração do `netlify.toml`
- Testes finais de todas as rotas antes da entrega

## 7. Skills / Ferramentas — Resultado da Validação Piloto

Todas as skills abaixo foram testadas num projeto piloto isolado (React/TS/Vite) antes de entrar no projeto real, com critérios objetivos de aprovação/reprovação por skill.

| Skill | Status | Nota |
|---|---|---|
| Superpowers | ✅ Validada | Instalada via marketplace oficial, ativa |
| Claude Mem | ✅ Validada | Memória entre sessões confirmada funcionando |
| Humanizer | ✅ Validada | Removeu corretamente "tells" de IA em teste real |
| Headroom | ❌ Descartada | Ganho reportado pelo próprio Headroom de ~1,4% em 30 dias; exige proxy e variável de ambiente permanente. Comparação controlada com/sem wrapper não foi concluída. Removido |
| Find Skills | ✅ Validada | Busca real (não chutada), resultados com número de instalações |
| Karpathy CLAUDE.md | ✅ Validada (5/5) | Resistiu a scope creep em teste com prompt vago |
| img-to-html | ✅ Validada | Fluxo completo (5 etapas) funcionou **sem precisar de API paga**, usando fotos próprias como conteúdo em vez de gerar imagem nova |
| frontend-design | ✅ Validada com ressalvas | Processo da skill produziu redesign do `ProductCard` sem scope creep, com `tsc` e build limpos. Registro confirmado: o Claude Code passou a listá-la como invocável, desde que a skill esteja em `.claude/skills` e a sessão seja aberta a partir da pasta do projeto (ver seção 7) |
| Strix | ⏸️ Adiada | Requer Docker + chave de API paga; prioridade baixa pro escopo deste projeto (só front-end estático, sem backend próprio) |

> **Nota metodológica:** também foi rodada uma bateria automatizada (via `skills-test-harness`, com `claude -p` de tiro único + avaliação por um segundo Claude como "juiz") sobre 4 dessas skills. Essa rodada confirmou o resultado do Karpathy CLAUDE.md e do Find Skills, mas subestimou Superpowers e Humanizer por limitação do próprio método de teste, não por falha das skills: o `brainstorming` do Superpowers é feito pra ser um diálogo de várias rodadas, e uma chamada única interrompe o fluxo na primeira pergunta; o teste do Karpathy caiu numa tarefa sem escopo real pra resistir (o botão testado já existia de uma sessão manual anterior); e o teste do Humanizer teve problema de encoding no texto de entrada via PowerShell. A validação manual acima (interativa, testando cada skill do jeito que ela é realmente usada) é a que vale como veredito — a automatizada serviu mais pra provar que o harness funciona tecnicamente do que como avaliação final de qualidade.

- **Superpowers** (plugin, autor Jesse Vincent) — framework de skills que cobre o ciclo de desenvolvimento inteiro: `brainstorming` (refina requisitos em formato socrático e salva um design doc — vai ser usado na Fase 1, junto com o img-to-html), `writing-plans`, `executing-plans`, `test-driven-development`, `systematic-debugging`, `requesting-code-review`, `finishing-a-development-branch`, entre outras. Não existe uma skill "grooming" nesse catálogo — o equivalente é o `brainstorming`. **Teste real confirmado (brainstorming):** rodado um ciclo completo pro carrinho de compras — 7 perguntas específicas de múltipla escolha, refinando o entendimento a cada resposta, escolha de abordagem técnica justificada (Context API descartando Zustand/Redux citando YAGNI), design apresentado em seções com aprovação individual, e spec final escrita em arquivo (`docs/superpowers/specs/`) com auto-revisão antes de avançar pro `writing-plans`. Sem scope creep em nenhum momento (ex: recusou introduzir framework de teste não pedido, criou só o header mínimo necessário sem menu/logo não solicitados).
- **frontend-design** (`anthropics/skills`, skill `frontend-design`) — skill oficial da Anthropic para interfaces com direção estética própria, evitando o visual genérico de IA (~907 mil instalações no ecossistema de skills). É auto-invocada (sem `disable-model-invocation`). Escolhida entre 5 candidatas pesquisadas via Find Skills (as demais: `leonxlnx/taste-skill`, `pbakaus/impeccable`, `landing-page-design` e uma skill genérica de Tailwind); descartadas por serem menos consolidadas, mais complexas que o necessário ou dependerem de CLI externo com login. **Teste real (branch `teste-skill-design`):** redesenho só do `ProductCard` para uma joalheria (foto 4:5, tipografia serif Cormorant Garamond, preço discreto, sem sombras/gradientes), com Tailwind v4 instalado na hora (`tailwindcss` + `@tailwindcss/vite`). Escopo respeitado (só `ProductCard`, CSS do card, `vite.config.ts`, `index.css`, `App.css` e dependências), lógica do carrinho intocada, botões com `type="button"`, `aria-label` e foco visível, `tsc` e build limpos. **Ressalvas:** (1) no primeiro teste a skill estava só em `.agents/skills`, que o Claude Code não lê, então ele leu o `SKILL.md` à mão em vez de invocá-la: o teste validou o conteúdo, não o registro; (2) a primeira tentativa de registro falhou: mesmo com `SKILL.md` e `LICENSE.txt` em `.claude/skills/frontend-design`, o Claude Code respondeu que a skill não estava na lista da ferramenta Skill (e as respostas corretas sobre o conteúdo vinham só da leitura do arquivo); depois de reabrir a sessão a partir da pasta do projeto (`site-joias-teste`), ele passou a listá-la como invocável — a causa provável do "não" era a sessão ter sido aberta fora da pasta do projeto ou sem reiniciar o terminal; (3) o Tailwind já estava previsto na stack do projeto real; a skill foi testada com Tailwind v4, versão que passa a valer no projeto; (4) a fonte foi importada no `index.css` — no projeto real, convém hospedá-la localmente em vez de depender de serviço externo; (5) o resultado visual ainda precisa ser avaliado no navegador pelo João e, depois, pela cliente.
- **Skill "img-to-html"** (repositório `rtadewald/skills`, pasta `img-to-html`) — recria um mockup de design (imagem de referência) em HTML/CSS puro, sem framework, em 5 etapas com aprovação em cada uma: (1) wireframe ASCII + plano de implementação por região, (2) fundo, (3) estrutura/componentes/fontes, (4) assets restantes (ícones/imagens, pulado se não houver), (5) revisão final comparando com a referência. Depende de outras duas skills do mesmo repositório (`to-wireframe`, obrigatória, e `openrouter-img`, só obrigatória se for **gerar** imagem nova por IA). **Achado importante do teste:** como este projeto já tem fotos reais da cliente (não precisa gerar imagem nova), o fluxo inteiro funcionou usando as fotos como conteúdo dentro de um layout criado do zero pela própria skill — sem nunca acionar a dependência paga do `openrouter-img`. Tem `disable-model-invocation: true` no cabeçalho, ou seja, só é chamada manualmente pelo usuário digitando `/img-to-html` (não é auto-invocada). Saída em `design-systems/<slug>/index.html` + `assets/` (CSS/imagens separados, sem build, abre direto no navegador).
- **Humanizer** (repositório `blader/humanizer`) — skill que remove sinais de escrita gerada por IA de um texto, deixando-o mais natural. Instalada como plugin via marketplace (`/plugin marketplace add blader/humanizer` + `/plugin install humanizer@humanizer`); invocada com `/humanizer:humanizer` seguido do texto. Útil aqui pra revisar textos institucionais do site (descrições de produto, seção "sobre", mensagens padrão) antes de publicar.
- **Karpathy CLAUDE.md** (referência: `multica-ai/andrej-karpathy-skills`) — não é uma skill instalável, é um arquivo `CLAUDE.md` único que se copia pra raiz do repositório. Codifica 4 regras de comportamento contra falhas comuns de agentes de IA ao programar: evitar scope creep (fazer mais do que foi pedido), evitar abstração prematura, evitar comentários que não correspondem ao que o código realmente faz, e evitar mudanças silenciosas de compatibilidade retroativa. Convive bem com o `CLAUDE.md` específico deste projeto — essas 4 regras ficam no topo do arquivo, as convenções específicas do projeto (estrutura de pastas, stack, etc.) ficam abaixo.
- **Claude Mem** (`thedotmack/claude-mem`) — plugin de memória persistente entre sessões do Claude Code: registra o que foi feito, gera resumos semânticos e injeta esse contexto ao abrir uma nova sessão. Precisa do runtime **Bun** instalado (dependência descoberta durante o teste). Papel definido: manter a continuidade do projeto entre sessões (decisões tomadas, estado do código). **Teste real confirmado:** numa sessão nova, sem nenhuma pista dada, ele recuperou corretamente a última ação feita na sessão anterior (um comentário adicionado num arquivo específico) e ainda trouxe contexto correto de todo o histórico do projeto até aquele ponto.
- **Headroom** (`headroom-ai`) — **Descartada.** Era uma ferramenta de compressão de contexto/tokens (prompts, JSON, código, logs grandes) que funcionava como proxy local (`http://127.0.0.1:8787`), aberta com `headroom wrap claude`. O teste comparativo (mesma tarefa com/sem wrapper) não foi concluído: a primeira rodada com wrapper não partiu de uma sessão limpa (~6,6 mi de tokens contra ~330 mil na rodada sem wrapper, diferença grande demais para ser compressão) e a repetição foi abandonada. O único dado disponível é o do próprio Headroom (`headroom savings`): ~0,9% de economia em 7 dias e ~1,4% em 30 dias (~US$ 6,80 evitados). **Motivos da remoção:** ganho marginal frente à complexidade; `headroom mcp install` deixou a variável `ANTHROPIC_BASE_URL` definida de forma permanente no nível do usuário, fazendo todo `claude` passar pelo proxy (não era "só por sessão", como se supunha); o wrapper altera `.claude/.headroom_wrap_marker.json` e suja o `git status`; e o servidor MCP dele falhava ao conectar. **Remoção feita:** variável de ambiente removida do nível User, `claude mcp remove headroom`, `pip uninstall headroom-ai`. Onde economizar tokens de verdade: o custo vem de sessões longas com muito cache read, então vale abrir sessão nova por tarefa e usar `/clear` ou `/compact` quando o contexto crescer.
- **Find Skills** (`vercel-labs/skills`, skill `find-skills`) — única ferramenta usada para descoberta/recomendação de skills prontas pro projeto (evita rodar múltiplas ferramentas redundantes com o mesmo objetivo). Busca num diretório amplo de skills, filtra pelas mais confiáveis (stars, instalações reais) e sugere. Precisa estar copiada em `.claude/skills/` (a pasta universal `.agents/skills` sozinha não é lida pelo Claude Code).
- **Strix** (`usestrix/strix`) — agentes de IA que testam a aplicação rodando de verdade, buscando vulnerabilidades com prova de conceito. **Adiada**: requer Docker Desktop rodando (cria um container sandbox) e uma chave de API paga (Anthropic/OpenAI/OpenRouter) separada da assinatura Claude Pro. Como o projeto é só front-end estático + Decap CMS + Netlify (sem backend próprio), a superfície de ataque é pequena — não compensa o investimento agora. Revisitar se algum projeto futuro tiver backend próprio.

## 8. Comandos de Instalação (testados e corrigidos no piloto)

> Esses comandos rodam no terminal integrado do Claude Code, na sua máquina — eu não tenho acesso a ela daqui do chat, então quem executa é você (ou você pede pro próprio Claude Code rodar essa lista). Versão corrigida a partir do teste piloto real.

```bash
# Superpowers — SEM marketplace add, a oficial já vem registrada
/plugin install superpowers@claude-plugins-official
# (escolher "Install for you (user scope)" na tela de confirmação)

# Claude Mem — nome do marketplace registrado é "thedotmack", não "claude-mem"
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem@thedotmack
/reload-plugins --force
# Requer o runtime Bun instalado (fora do Claude Code, no terminal do sistema):
# powershell -c "irm bun.sh/install.ps1 | iex"   (Windows)
# Depois de instalar o Bun, feche e abra o VS Code/terminal INTEIRO (não só a aba)

# Humanizer — via plugin (o git clone manual não registra a skill corretamente)
/plugin marketplace add blader/humanizer
/plugin install humanizer@humanizer
# Invocar com: /humanizer:humanizer <texto>

# Karpathy CLAUDE.md
git clone https://github.com/multica-ai/andrej-karpathy-skills.git $env:TEMP\karpathy-skills
cp $env:TEMP\karpathy-skills\CLAUDE.md .\CLAUDE.md   # revisar antes de sobrescrever se já existir um CLAUDE.md no projeto

# Find Skills — precisa ficar em .claude/skills, não só em .agents/skills
npx skills add vercel-labs/skills --skill find-skills
# (escolha "Global" no escopo; depois copiar pra pasta que o Claude Code lê:)
mkdir -Force ~\.claude\skills
cp -r ~\.agents\skills\find-skills ~\.claude\skills\find-skills

# Headroom — DESCARTADO (ver seção 7). Não instalar.
# Se já estiver instalado, remover:
#   [Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL",$null,"User")
#   claude mcp remove headroom
#   pip uninstall headroom-ai
# Depois abrir um terminal novo e conferir que `echo $env:ANTHROPIC_BASE_URL` volta vazio.

# frontend-design — via CLI de skills
npx skills add anthropics/skills --skill frontend-design
# Na lista de agentes, MARCAR "Claude Code" e escolher escopo Project (ou Global). Se ficar só em .agents/skills, copiar:
#   mkdir -Force .claude\skills
#   cp -r .agents\skills\frontend-design .claude\skills\frontend-design
# Fechar o terminal inteiro e abrir outro antes de usar. Auto-invocada.

# img-to-html — via CLI de skills (mais confiável que git clone manual)
npx skills add rtadewald/skills@img-to-html -g -y
# Invocar com: /img-to-html  (tem disable-model-invocation: true — só você pode chamar, nunca automático)

# Strix — ADIADO, requer Docker Desktop + chave de API paga (Anthropic/OpenAI/OpenRouter)
# curl -sSL https://strix.ai/install | bash
```

**Observações importantes descobertas no piloto:**
- Sempre reinicie o **terminal inteiro** (não só a sessão do Claude Code, e não só a aba) depois de mudar o PATH do Windows — mudanças de variável de ambiente não propagam pra processos já abertos.
- **Nunca use `setx` com uma string longa** (tipo `$env:PATH` completo) — ele trunca em 1024 caracteres e corrompe o PATH silenciosamente. Use `[Environment]::SetEnvironmentVariable("PATH", $valor, "User")` em vez disso, que não tem esse limite.
- Skills instaladas com `npx skills add` caem por padrão em `.agents/skills`, que o Claude Code **não** lê: marque "Claude Code" na lista de agentes ou copie para `.claude/skills`. Uma sessão já aberta não relê a pasta, então feche o terminal e abra outro. Skills de projeto só são lidas quando a sessão é aberta **a partir da pasta do projeto** (não de uma pasta acima). Para conferir se a skill está registrada, pergunte ao Claude Code se ela está na lista de skills que ele pode invocar pela ferramenta Skill.
- Ferramentas que usam proxy (caso do Headroom) podem definir `ANTHROPIC_BASE_URL` de forma **permanente** no nível User, redirecionando todo `claude` para o proxy. Se o proxy for desligado sem remover a variável, o Claude Code pode parar de conectar. Antes de qualquer teste comparativo, confira com `echo $env:ANTHROPIC_BASE_URL`.
- Para medir consumo de tokens, use `npx ccusage session` **com as sessões fechadas** (os números lidos de dentro da sessão subestimam) e só compare rodadas que partiram de sessão limpa, mesmo modelo, mesmo commit e mesmo prompt copiado, sem digitar à mão.
- Ao copiar/colar comandos do chat pro terminal, **nunca inclua o texto do prompt** (`PS C:\...>`) — só o comando em si.
- Skills com `disable-model-invocation: true` no cabeçalho (Humanizer, img-to-html) só podem ser chamadas manualmente por você digitando o comando — nem eu nem o Claude Code conseguimos disparar sozinhos.

## 9. Itens em Aberto

- Definir se o CMS será Decap CMS (com login) ou modelo mais simples (planilha), com base na familiaridade da cliente. Se for Decap, decidir o método de autenticação antes do bloco do CMS: Netlify Identity + Git Gateway (Identity foi sinalizado como descontinuado pela Netlify em fev/2025, sem previsão imediata de remoção; conferir o estado atual), backend GitHub com proxy OAuth (ex.: Cloudflare Worker, exige OAuth App e subdomínio, e a cliente precisa de conta no GitHub com acesso ao repositório) ou o modelo mais simples. Fazer um teste pequeno numa branch com o perfil real da cliente antes de fechar
- Pedir à cliente: identidade visual (logo, paleta, fontes), fotos (e quantas precisam ser refeitas), referências de sites de que ela gosta e o número de WhatsApp do chip novo
- Confirmar com a cliente se o escopo reduzido de navegação (seção 3.1) atende, ou se ela quer a arquitetura maior (mega menu, busca com recomendações) desde já
- Fechar a implementação real do cabeçalho mobile (a decisão da seção 3.1 é a proposta atual; validar no protótipo antes de considerar fechada)
- Confirmar quantidade final de fotos que precisam ser refeitas
- Confirmar valor final dentro da faixa R$1.800–R$2.500 após levantamento de fotos/ajustes
- Decidir se vale revisitar o Strix mais adiante (precisa Docker + API paga) caso o escopo do projeto mude
- Avaliar no navegador o `ProductCard` redesenhado (branch `teste-skill-design`) e decidir se a direção estética serve à cliente; se aprovado, fazer merge ou reaproveitar no projeto real
- Hospedar localmente a fonte serif escolhida (Cormorant Garamond), em vez de depender de serviço externo

## 10. Referência de Implementação (piloto)

O piloto de validação de skills gerou artefatos reais reaproveitáveis para o projeto oficial:

- **Pasta:** `C:\Users\jpofe\Downloads\skills-test-harness\site-joias-teste\` — projeto Vite/React/TS separado, usado só pra testes
- **Spec do carrinho:** `site-joias-teste/docs/superpowers/specs/2026-09-20-carrinho-whatsapp-design.md` — decisões completas sobre modelo de dados, componentes, fluxo de dados e tratamento de erros do carrinho, geradas via `brainstorming` do Superpowers com aprovação em cada seção
- **Plano de implementação:** `site-joias-teste/docs/superpowers/plans/2026-09-20-carrinho-whatsapp.md` — 7 tarefas cobrindo a spec, executadas via `subagent-driven-development`
- **Código funcional implementado e testado manualmente (ponta a ponta, navegador):** `CartProvider`/`useCart` (Context API + localStorage com fallback para JSON corrompido), `ProductCard` com botão de favoritar e de carrinho, `CartBadge` (contador no header), `CartDrawer` (lista + total + botão WhatsApp), `whatsapp.ts` (monta a URL `wa.me` com placeholder de número marcado com `// TODO`). Build e lint limpos, code review final feito (Opus): 0 Critical, 0 Important, 7 Minor. Merge feito para `main` local.
- **Findings menores do review final** (não bloquearam o merge, mas valem correção no projeto real): botão "Enviar" desabilitado não é alcançável via teclado; drawer sem fechar por Esc/sem gestão de foco; total calculado em dois lugares (podem divergir se a lógica de preço mudar); **carrinho persiste snapshot de preço/nome — pode ficar desatualizado se o catálogo mudar no CMS enquanto o item está no carrinho de alguém** (o mais relevante pro projeto real); `products.json` sem tipagem explícita no spread; botões sem `type="button"`; um `eslint-disable` sem comentário de justificativa.
- **Decisões já tomadas nesse ciclo, reaproveitáveis para o projeto real:** carrinho sem controle de quantidade (presença/ausência apenas, pois peças de joia costumam ser únicas em estoque), carrinho não é limpo automaticamente após enviar pro WhatsApp, catálogo de teste em JSON local (o projeto real usará Decap CMS)
- **Branch de teste da skill de design:** `teste-skill-design` no mesmo projeto piloto, com Tailwind v4 e o `ProductCard` redesenhado (serif Cormorant Garamond, tom bronze, foto em proporção 4:5, sem sombras); serve de referência de direção visual, não é o design final da cliente
- **Showcase do img-to-html:** `design-systems/nalaura-teste/index.html` — resultado do teste da skill de design (não é o design final da cliente, só validação do fluxo)

## 11. Auditoria de Contexto do Claude Code (setembro/2026)

Medição feita com `/context` em sessão nova, dentro de `site-joias-teste`, antes de digitar qualquer coisa. O custo fixo de cada sessão vinha principalmente das ferramentas MCP (cada ferramenta carrega a descrição em todo início de sessão), não das skills.

| Categoria | Antes | Depois |
|---|---|---|
| Ferramentas MCP | 45,7k tokens (144 ferramentas) | 15k tokens (41 ferramentas) |
| Total da sessão (sem mensagens do usuário) | 106,8k | 74,9k |
| Skills | 7,4k (61 skills) | 7,4k (61 skills), mantidas |
| Ferramentas do sistema, prompt do sistema, memória | ~50k | ~50k (não são configuráveis aqui) |

Economia: ~30,7k tokens só em MCP (~67% dessa categoria) e ~31,9k no total (~30% do custo fixo da sessão). Uma medição intermediária (150k no total) ocorreu com as ferramentas ainda carregadas depois da remoção do `tokensave`; não vale como comparação.

**Removidos:**
- **Headroom** — ver seção 7.
- **tokensave** (MCP de "code intelligence", 82 ferramentas, registrado em `~/.claude.json`) — instalação incompleta (hooks, permissões e regras no `CLAUDE.md` ausentes) e 0 chamadas / 0 tokens economizados em 30 dias segundo o `tokensave gain`. Removido com `tokensave disable-upload-counter` e `tokensave uninstall`. Não rodar `tokensave install`/`reinstall`, que adicionariam hooks e regras ao `CLAUDE.md`.

**Desativados (podem ser religados em `/mcp` ou Configurações > Conectores, no claude.ai):** Higgsfield (97 ferramentas), Google Drive (11) e Claude Docs (8) — sem uso em sessões de código.

**Mantidos:** `claude-in-chrome` (22 ferramentas, útil para conferir o site no navegador), `claude-mem` (15), Superpowers, Find Skills, Humanizer, frontend-design e as skills embutidas do Claude Code. Gmail e Google Calendar continuam sem autenticação e não pesam.

**Achados ao migrar para o projeto real (limpeza do Headroom e configuração do repositório novo):**
- `ANTHROPIC_BASE_URL` (proxy do Headroom) também estava em `~/.claude/settings.local.json`, no bloco `env`, além da variável de ambiente do usuário; junto vinha um hook `SessionStart` chamando `headroom.cli`. Remover só a variável de ambiente não basta: procurar `headroom` em `~/.claude/settings.json`, `settings.local.json` e `~/.claude.json`.
- O plugin `headroom@synced` vem da conta do claude.ai ("Synced from claude.ai") e não pode ser desinstalado pelo CLI; o hook `headroom init hook ensure` dele continuava rodando e gerando erro `command not found` na abertura de toda sessão. Solução: `claude plugin disable headroom@synced` e remover também no claude.ai. O `/hooks` mostra a origem de cada hook (`[Plugin]` ou arquivo).
- Na pasta do projeto novo, os conectores Higgsfield, Google Drive e Claude Docs voltaram a aparecer ligados (159 ferramentas, 88,4k tokens de MCP, sessão iniciando em ~150k); foi preciso desativá-los de novo em `/mcp`. Tratar a desativação de MCP como algo a repetir em cada projeto novo e conferir com `/context` na primeira sessão.
- `npx skills add` instala em `.agents/skills`, que o Claude Code não lê, mesmo escolhendo escopo Project, quando o Claude Code não está entre os agentes marcados; copiar a pasta para `.claude/skills`.
- A lista de plugins tinha o `superpowers` duplicado (`@claude-plugins-official` e `@superpowers-marketplace`, ambos 6.3.0); manter só o oficial evita duplicar descrições e hooks.

**Regra prática:** antes de instalar qualquer MCP ou plugin, rodar `/context` para ver o peso e conferir se ele será realmente usado; ferramentas MCP com dezenas de tools pesam em toda sessão, mesmo sem uso. Skills, ao contrário, custam pouco (~0,7% do contexto para 61).

## 12. Repositórios e Estado do Projeto Real

- **Piloto (referência, não usar em produção):** GitHub `jpofof/site-joias-piloto` (privado), branches `main` (carrinho) e `teste-skill-design` (redesenho do `ProductCard` com Tailwind v4 + skill `frontend-design`), tags `piloto-carrinho` e `piloto-design-card`. Pasta local: `C:\Users\jpofe\Downloads\skills-test-harness\site-joias-teste\`.
- **Projeto real:** GitHub `jpofof/site-joias` (privado), pasta local `C:\Users\jpofe\projetos\site-joias\`.
- **Estado (21/09/2026):** scaffold Vite + React + TypeScript + Tailwind v4 (`@tailwindcss/vite`) + ESLint commitado e enviado para `main`; `npm run build` e `npm run lint` passam sem erro. `App.tsx` está vazio de propósito (exemplo do template removido). Documentos do piloto (spec e plano do carrinho) copiados para `docs/reference/piloto/`.
- **Ambiente do Claude Code configurado no projeto novo:** `docs/` com esta documentação e o spec/plano do carrinho do piloto (`docs/reference/piloto/`), `CLAUDE.md` (regras do Karpathy no topo + convenções do projeto, incluindo as correções obrigatórias do review do piloto), skill `frontend-design` em `.claude/skills` (confirmada como invocável pela ferramenta Skill), `/img-to-html` disponível, MCP reduzido a `claude-in-chrome` e `claude-mem`, Headroom desativado.
- **Próximos passos:** (1) receber os materiais da cliente (ver seção 9); (2) Fase 1 (design) → Fase 2 (implementação por blocos, uma branch por bloco, validação da cliente entre eles); (3) decidir a autenticação do Decap antes do bloco do CMS.
- **Fluxo de trabalho:** uma branch por bloco a partir de `main` (ex.: `feat/vitrine`, `feat/carrinho`, `feat/cms`); diff revisado antes de cada commit; nada de commit ou push autônomo; `tsc`, `lint` e `build` limpos antes do push; Conventional Commits com mensagem em inglês e português.

Este documento (`documentacao-projeto-joias.md`) é um arquivo estático — se a conversa mudar, ele precisa ser enviado novamente para dar contexto técnico completo.
