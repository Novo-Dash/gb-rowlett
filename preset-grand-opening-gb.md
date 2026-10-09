# PRESET · GRAND OPENING — na identidade visual Gracie Barra (base: GB Lindale LP v2)

Documento de **base de nível de design** para a landing page de inauguração de um novo
cliente. Ele cruza duas fontes, ambas lidas do código em produção em 9 de outubro de 2026:

| De onde vem | O que entra |
|---|---|
| **Collective Jiu-Jitsu** (CJJ-001, `lp.collectivejja.com`) | A **arquitetura de Grand Opening**: tese, ordem das seções, oferta de fundação em faixas, obra como argumento, contador, pedido final, disciplina de dado |
| **GB Lindale LP v2** (`src/v2`, `lp.gblindale.com/v2`) | A **identidade visual e a engenharia**: AdihausDIN, vermelho e marinho GB, o triângulo como único sistema gráfico, o botão único, o eyebrow, o pattern, mobile first, sem GSAP, zero CLS |

Marcação ao longo do documento:
**[ESTRUTURA]** se repete em qualquer Grand Opening ·
**[IDV GB]** é a linguagem Gracie Barra que vem da Lindale v2 ·
**[CLIENTE]** troca a cada projeto.

Nada é para ser clonado da Lindale: é para ser replicado na mesma gramática, do mesmo
jeito que a v2 fez com Like Water, Dárcio Lira, Satori, Maison e OCJ.

---

## 0. Em uma frase

> Uma página de inauguração **branca, com uma tinta quase preta, o vermelho GB como única
> cor de ação e o marinho GB como única cor de fundo escuro**; tipografia condensada em
> **caixa alta itálica**; o **triângulo** da marca medindo e cortando tudo (mordidas,
> pattern, pino, selo); cantos **retos**; e a **oferta de fundação em segundo lugar**,
> logo depois do hero.

A referência de tom não é "academia de luta" e também não é "clube antigo" (esse era o
preset da Collective). É **equipe atlética**: uniforme, placa de resultado, fita de pódio.

---

## 1. Tese de persuasão [ESTRUTURA]

Quem chega numa página de inauguração já sabe o que quer (jiu-jitsu perto de casa). O que
ele não sabe é **por que decidir hoje**. Por isso:

1. **Hero promete a aula, não a vaga.** "Nunca treinei" é a dor de entrada. A oferta de
   fundação só faz sentido depois disso.
2. **A oferta é a segunda seção**, não a última. Inverte o roteiro clássico do nicho.
3. **A obra é argumento.** Fotos reais do espaço em construção provam que a pessoa está
   comprando algo que ainda não existe, e isso é o que cria pressa.
4. **Escassez numerada e honesta.** Vagas de fundação em grupos liberados em ordem, com
   desconto decrescente e vitalício. O único número que o cliente mexe é `claimed`; barra,
   texto, grupo aberto, selo, CTA final e modal saem todos dele.
5. **Nada inventado.** Dado que o cliente não mandou vira marcador `Pending` visível no modo
   prospect e oculto no modo cliente.
6. **Toque que responde** (herdado da v2): um estilo único de botão, e tudo que parece
   botão abre o formulário. Nada sem ação tem sombra, hover, seta ou cursor.

Personas, nesta ordem: a mãe (separação por idade, supervisão), o adulto iniciante (sem
experiência), a mulher que quer uma turma própria.

---

## 2. Tokens [IDV GB nos valores · ESTRUTURA no esquema]

Todos num arquivo só, escopados numa classe raiz (na v2 é `.gb2`). **Nenhum hex mora fora
desse arquivo.** Unidade fluida `--u = min(1vw, 19.2px)`: o quadro é desenhado em 1920 e,
acima disso, fica idêntico e centralizado.

| Token | Valor | Papel | Regra |
|---|---|---|---|
| `--paper` | `#FFFFFF` | fundo claro | **branco puro**, e não o papel quente da Collective: a GB é uniforme, não papel timbrado |
| `--paper-2` | `#F3F2EE` | superfície secundária, pills, fundo de polaroid | |
| `--line` / `--line-strong` | `#E3E1DB` / `#CBC8C0` | fios e bordas | |
| `--ink` | `#0D0E12` | headline | |
| `--ink-2` | `#34353B` | corpo | **nunca cinza claro** |
| `--muted` | `#65666D` | secundário | 5,6:1 sobre branco |
| `--red` | `#C8102E` | **vermelho GB**: botão, eyebrow, destaque de título, selo, barras de progresso | 5,9:1 sobre branco |
| `--red-deep` | `#9E0B23` | degradê do botão, borda do pino | |
| `--red-hi` | `#FF5A6B` | vermelho para **texto pequeno sobre o marinho** | |
| `--red-glow` | `#F2213B` | vermelho vivo para **display grande sobre o marinho** e para a luz dos cards | 4,3:1 sobre marinho |
| `--navy` | `#19286D` | **azul-marinho GB**: footer, cards escuros, pattern | |
| `--night` | `#0B1233` | **a única banda escura** do corpo da página (na v2: vídeos / kids) | |
| `--on-dark` / `--on-dark-2` | `#F4F5FA` / 74% | texto sobre escuro | |
| `--r` | `2px` | **cantos retos**: atlético, não "app" | um raio só na página |
| `--ease` | `cubic-bezier(0.19, 1, 0.22, 1)` | expo-out, a curva da página | |
| `--ease-spring` | `cubic-bezier(0.34, 1.4, 0.64, 1)` | só para o tranco da faixa e o pouso dos cards | |
| `--gutter` | `clamp(16px, 5vw, 64px)` | margem lateral | |
| `--nav-h` | `64px` / `80px` desktop | | |

Receita de cor: **branco + tinta + um vermelho (com os dois irmãos para fundo escuro) +
um marinho (com o irmão noite)**. Nada de terceira cor. A cor viva vem das fotos (tatame
azul, kimonos).

**O vermelho tem duas versões sobre o marinho** (`red-hi` para texto pequeno, `red-glow`
para display) porque o `#C8102E` perde contraste em fundo escuro. Quem for usar vermelho
sobre marinho escolhe pelo corpo do texto, não pelo gosto.

---

## 3. Tipografia [IDV GB]

**AdihausDIN** (corpo: Regular 400, Medium cobrindo 500 a 900) + **AdihausDIN Cn**
(display: CnBold, CnBoldItalic, CnMediumItalic). Self-hosted em `public/fonts`, em
**subconjunto** (~10 KB cada), com `font-synthesis-weight: none` e um **fallback Arial de
métricas ajustadas** (`size-adjust`, `ascent-override`) para o swap não mover o layout.
Os TTFs ficam em `brand/fonts`, fora do git.

| Utility | O que faz | Por quê |
|---|---|---|
| `.d` | Cn, peso 700, **caixa alta**, tracking **-0,006em**, entrelinha **0,9**, `text-wrap: balance` | letra de uniforme e placa de resultado; condensada pede tracking neutro ou negativo, nunca o positivo da Big Shoulders |
| `.h1` | `clamp(2.75rem, min(12.6vw, 9svh), 7.4rem)`, lh 0,88 | limitado **também pela altura**: o hero cabe na dobra |
| `.h2` | `clamp(2.4rem, 9.4vw, 5.4rem)` | |
| `.h3` | `clamp(1.5rem, 5.4vw, 2rem)` | |
| `--t-statement` | `clamp(2.3rem, min(9.8vw, 7svh), 5.6rem)` | a frase-tese do Kids / do pedido |
| `.body` | `--ink-2`, `text-wrap: pretty`, 60ch | 17px de base |
| `.lead` | `clamp(1.125rem, 1.1vw + 0.9rem, 1.375rem)`, lh 1,45 | |
| `.label` | Cn 700, 0,78rem, tracking **0,2em**, caixa alta | |
| `.accent` | `color: var(--red)` | |

Regras que vêm junto:

- **Títulos de seção em itálico** (`font-style: italic`, tracking -0,012em no hero). O
  itálico é o ângulo da marca: a barra do eyebrow, o brilho do botão e a faixa do "Como
  funciona" inclinam no mesmo sentido.
- **Destaque vermelho com duplicado em contorno.** Todo trecho vermelho de display ganha
  uma cópia em `-webkit-text-stroke` vermelho, deslocada `(0.05em, 0.06em)`, atrás dele
  (`::after` com `content: attr(data-text)`). Sobre foto ou marinho o destaque usa
  `red-glow`. Em texto gigante o traço afina (`0.008em`).
- **Título que sobe palavra a palavra** de dentro de uma máscara (`Lines`): dividido no
  render, não em runtime; o heading recebe `aria-label` e as máscaras ficam `aria-hidden`.
  No hero anima no load; nas seções, na entrada. Stagger 34ms.
- **Títulos de cards no mesmo tamanho**, calculado para o mais longo caber numa linha
  (`font-size: calc(100cqi / var(--tw))` com container query).
- Corpo e pergunta de FAQ **não** vão na condensada.
- **Letra de mão** (`Permanent Marker`, subset) só em rabisco de polaroid, carregada sob
  demanda quando a seção se aproxima.

---

## 4. O sistema gráfico: o triângulo [IDV GB]

O triângulo da Gracie Barra (o do selo, com o corte do "G") é o **único** motivo. Foi
escolhido em vez de faixa (OCJ, Maison) e de onda (Like Water). Ele sempre **mede ou corta
alguma coisa**, nunca decora:

| Peça | Como aparece |
|---|---|
| **Mordidas** | dois cantos cortados do card do hero (topo-esquerda e base-direita), com um triângulo vermelho encaixado em cada um. Encolhem com o scroll até o card virar a tela |
| **Botão** | o canto cortado do `Cta` (`--cut: 14px`) é a mordida em miniatura; o quadrado branco da seta também tem o canto cortado |
| **Pattern** | o logo em contorno marinho a 8,5%, grade de 220px intercalada, numa **camada fixa única** atrás da página inteira (`position: fixed; z-index: -1`). As seções brancas não pintam fundo; as escuras cobrem. Deriva na diagonal em 90s, só com movimento |
| **Pino** | no mapa do footer: triângulo vermelho com borda `red-deep` e triângulo branco dentro |
| **Selo / carimbo** | círculo vermelho com texto curvo repetido, rotação **fixa** de -8° (nunca aleatória), odômetro no centro |
| **Eyebrow** | barra vermelha de 4px inclinada `skewX(-12deg)`, que cresce de baixo para cima na entrada, e o rótulo em Cn Bold Italic, tracking 0,12em |
| **Micro-itens** | ▲ vermelho pequeno como marcador de lista curta ("No payment to book ▲ Uniform provided") |
| **Letreiro do footer** | o nome da academia em contorno branco intercalado com o logo em contorno, correndo na largura toda |
| **Luz dos cards** | retângulo `red-glow` aceso no topo do card com halo descendo pela foto (`mix-blend-mode: screen`) |

Separador de texto: o ponto do meio `·`.

---

## 5. Ritmo de cor pela rolagem [ESTRUTURA + IDV GB]

```
branco+pattern → branco → branco → branco → branco → NOITE → branco → MARINHO (pedido) → branco (mapa) → MARINHO (footer)
hero (card no filme) oferta programas obra passos abertura faq pedido
```

Regra da v2: **uma banda escura no corpo** (`--night`), e ela recebe a ponta do
triângulo descendo da seção anterior. Para Grand Opening a banda é a **Abertura** (o
contador). O **Pedido** final vai em `--navy` com foto a 30%, e o footer repete o marinho.
Duas inversões e nenhuma a mais. As seções brancas **não pintam fundo**: é o pattern da
página que aparece por trás, então nunca há emenda entre duas brancas.

---

## 6. Ordem e anatomia das seções

Cada seção tem **um mecanismo próprio** (régua da v2) e um arquétipo de origem. Os gestos
genéricos são só dois: o título em máscara e o `.rise`.

| # | Seção | Fundo | Arquétipo | Mecanismo e marca |
|---|---|---|---|---|
| — | **Nav** | cartão branco flutuante | Lindale v2 | cartão de 880px máx, 60px, raio 14px (**a única exceção ao canto reto**, por ser objeto flutuante), `backdrop-filter`. Menu à esquerda, logo no centro (abre o formulário), telefone + CTA compacto à direita. Menu abre o próprio cartão para baixo (`grid-rows 0fr→1fr`) em três cards: Turmas / Primeira aula / Visite. Some rolando para baixo depois de uma tela e volta subindo |
| I | **Hero** · o card no filme | b-roll da obra ou da equipe dentro de um card de cantos retos com as duas mordidas | Lindale v2 | **Cena 1**: título à esquerda embaixo, lead, CTA `block`, micro-itens com ▲, selo do Google à direita (só informação). **Cena 2**: rolando, o card **abre** até a tela (`--k 1→0`, sem pin, filme sticky), o marinho desce e a frase-tese entra pelos lados ("No experience" pela esquerda, "needed." pela direita), com o botão "Explore" apontando para baixo. LCP é o poster AVIF; o vídeo entra depois do load e só com conexão boa. **O H1 nunca anima opacidade.** Para Grand Opening a copy promete a aula e nomeia a cidade; o selo do Google dá lugar ao **carimbo "Founding member · 20% · Group I"** |
| — | **Letreiro em X** | transparente | Collective ← Jiu-Jitsu Prime | duas fitas a ±3°, a de cima **vermelha** andando para a esquerda, a de baixo **marinho** ao contrário, CSS puro. Itens curtos em Cn caixa alta. Entra só se a foto do hero transbordar a base |
| II | **A oferta de fundação** | branco + pattern | Collective ← Alliance | três cartões de cantos retos. O **aberto** é um **ingresso vermelho** (degradê `#E3232A→#C3141B` como o botão, picote tracejado com dois furos, talão só com o botão **branco de seta vermelha**), pastilha "Available now" com ponto pulsando, barra de vagas em branco sobre `red-deep`. O **esgotado** lê inteiro: desconto riscado, barra cheia marinho, selo "Sold out" marinho. O **travado** é borrado a 5px com um **triângulo marinho** no centro (em vez do cadeado), `sr-only` para leitor de tela. O **carimbo** vermelho com odômetro de dias até a abertura mora no canto do cartão aberto |
| III | **Programas** | branco + pattern | Lindale v2 ← Dárcio Lira | cards 3/4 com foto inteira e sombra marinho embaixo. **No celular: trilho nativo com snap**, o card central aceso (luz vermelha no topo) e os vizinhos recuam 5%; contador 01/04 e régua vermelha. **No desktop**: grade de 4, luz no hover, card cresce 4% sobre os vizinhos. Nome em Cn itálico, idade discreta na mesma linha, descrição e o **quadrado vermelho de seta branca** (a seta dá a volta no hover). Entrada por **cunha triangular**. Cada card inteiro é `<button>` e abre o formulário com a turma |
| IV | **A obra** | branco + pattern | Collective | pastilha vermelha com a etapa atual (vem do dado) e cinco fotos reais em fila de borda a borda, cantos retos. Hover: as outras caem a 45%, a apontada sobe, cresce e perde o véu marinho. Alternativa quando não há obra: a **fita de fotos** da v2 (`Reel`, arrastável), que responde "é pra mim?" mostrando o tatame cheio de gente comum |
| V | **Como reservar** | branco + pattern | Lindale v2 ← Like Water (Four steps) | cabeçalho; um **bloco vermelho liso** atravessando a tela com a **faixa branca de jiu-jitsu** deitada nele, inclinada -1,4°, ponta à esquerda na linha do texto; a cena fica no palco (sticky CSS, sem pin) e a rolagem troca os passos **no mesmo lugar**: o número gigante gira como rolo, e a cada passo a ponteira preta ganha um grau com um **tranco** (`--ease-spring`). O último passo leva o botão. Reduced motion: lista com a faixa já com todos os graus |
| VI | **Abertura** · contador | **`--night`** + fachada a 30% | Collective + Lindale v2 | a ponta do triângulo desce da seção anterior; marca pequena, "The doors open in" em `red-glow` com duplicado, **odômetro** de dias/horas/min/seg (rolos de dígito, HTML já nasce no valor final, largura reservada por gêmeo invisível), registro em `dl` de 4 colunas separado por fios a 15%, botão. É a única banda escura do corpo |
| VII | **Perguntas** | branco + pattern | Lindale v2 | uma coluna centralizada. Cada pergunta é uma **peça**: número em Cn itálico vermelho, pergunta grande em corpo, quadrado com +/−. Aberta vira cartão branco com sombra e **barra vermelha à esquerda**, o quadrado enche de vermelho. A primeira já vem aberta. Resposta abre por `grid-template-rows` e fica `inert` fechada. JSON-LD `FAQPage` sai da mesma lista |
| VIII | **O pedido** | **`--navy`** + foto a 30% | Collective | eyebrow claro, headline em `--t-statement` com as vagas do grupo aberto (duplicado em contorno no trecho vermelho), benefícios em **coluna única** separados por fio a 15% com ✓ em `red-hi`, botão + telefone como ação escrita ("Tap to call or text"), vídeo vertical 9/16 autoplay mudo travado em 22rem, carimbo mordendo o canto |
| — | **Mapa + Footer** | marinho | Lindale v2 ← Maison | grade de 4 (marca + sobre + social · a academia · onde fica com **ações escritas** · programas, cada um abre o formulário com a turma). Mapa em P&B com o **pino triangular** cravado no centro e a foto da fachada encostada nele, que cresce no hover. **Letreiro** com o nome em contorno + logo em contorno correndo. Base com ©, afiliação Gracie Barra e assinatura |
| — | **Barra fixa de CTA** (celular) | | Lindale v2 | aparece depois que o CTA do hero sai da tela, some enquanto outro CTA está visível ou o formulário está aberto (`html.bk-open`). `safe-area-inset-bottom`. Entra só por transform; o espaço dela já está reservado no wrapper |

---

## 7. Componentes [IDV GB]

### `Cta` — o único botão da página
Canto cortado (as mordidas do hero), degradê vermelho vertical, rótulo em Cn 700 caixa alta
tracking 0,06em, e o **quadrado branco com a seta vermelha** à direita (canto cortado
embaixo). Pulsa em vermelho (dois anéis alternados no mesmo recorte, 2,4s). **No hover não
troca de cor**: um brilho inclinado atravessa e a seta dá a volta. No clique encolhe a 97%.
Tamanhos `block` (largura toda no celular, 320px mínimo no desktop), `auto`, `compact`
(44px, para a nav). Sempre abre o formulário e registra `cta_click` com a origem.

### `Eyebrow`
Barra vermelha de 4px em `skewX(-12deg)` que cresce de baixo na entrada + rótulo Cn Bold
Italic. Variante `light` para fundo escuro (barra em `red-glow`, texto branco).

### `Lines`
Título em máscara palavra a palavra. `parts[]` com `accent` pinta o trecho de vermelho e
já carrega o `data-text` para o duplicado em contorno.

### `Odo`
Odômetro em rolos. Duas voltas de dígitos; os rolos da esquerda giram mais e demoram
mais. Zero layout shift. Usado no carimbo e no contador.

### Carimbo (`.stamp`)
`clamp(118px, 11u, 190px)`, círculo vermelho, anel de texto repetido (`textLength` para
fechar sem emenda), `rotate: -8deg` fixo, `Odo` no centro, rótulo embaixo. Fica **fora** de
qualquer máscara que recorte, porque morde a borda de propósito.

### `Pic`
Toda foto passa por aqui: `<picture>` AVIF + WebP nos tamanhos de exibição, `width`,
`height` e `aspect-ratio` vindos do manifesto `src/data/media.json` (gerado por
`scripts/build-images.py`), `art` para troca de arte por breakpoint.

### `Stars` / selo do Google
Cinco estrelas com preenchimento na proporção da nota. Só informação, nunca link para fora.

### Disciplina de dado (vem da Collective) [ESTRUTURA]
`Pending` (marcador visível em prospect, oculto com `VITE_UX_MODE=client`), `Media` com
briefing no slot vazio, `VideoSlot` que força o mudo pelo ref. Em linguagem GB o marcador
é vermelho sobre `#FEF1F2`.

---

## 8. Movimento [IDV GB]

**Tudo escopado em `html.motion`**, classe posta no `<head>` só quando o visitante não
pediu reduced motion. Sem ela a página **nasce no estado final**: nada fica escondido
esperando JS, não há sticky no hero, a faixa já tem todos os graus, o odômetro já mostra
o número.

**Sem GSAP.** Um barramento próprio de scroll (`src/v2/motion/scroll.ts`): um `rAF`,
variáveis CSS escritas no elemento, nenhum `setState` por frame; `IntersectionObserver`
compartilhado (`inview.ts`) que marca `data-in` uma vez.

**Só `transform`, `clip-path`, `opacity` e variáveis CSS.** Nunca `top`, altura ou
`background-color` animado. É isso que leva o CLS rolando a página a zero.

| Gesto | Onde |
|---|---|
| Título em máscara (`Lines`) | todo H1/H2 |
| `.rise` (22px, só transform) | lead e CTA do hero no load; blocos genéricos |
| Barra do eyebrow crescendo | todo eyebrow |
| Cunha triangular (`clip-path` de polígono) | entrada dos cards de programa |
| Odômetro | carimbo, contador, "70 reviews" |
| Abertura do card do hero (`--k`) e entrada lateral da cena 2 (`--s`) | hero |
| Rolo de número + tranco da faixa | como reservar |
| Luz vermelha + recuo dos vizinhos (`--c`) | trilho de programas |
| Pulsação do botão, brilho no hover, volta da seta | `Cta` |
| Pattern derivando em 90s | fundo |

Hover só existe em `(hover: hover) and (pointer: fine)`. No toque o card fica quieto.

---

## 9. Mobile first [IDV GB]

A v2 foi escrita para 91% de celular, 53% dentro do navegador do app (FB/IG). O preset herda:

- CSS a partir de **390px**; desktop entra por `min-width: 1024px`; grades de 4 só em 1280.
- Barra fixa de CTA no celular (§6).
- Formulário em tela cheia no celular, inputs de 16px (sem zoom do iOS), foco que entra no
  diálogo e volta para quem abriu.
- Alvo de toque ≥ 44px em tudo. Telefone, rota e e-mail são **ações escritas**.
- Hero com `100lvh` no filme sticky e `100svh` na cena, com a diferença compensada
  (`--sv`) para a base do card acompanhar a barra de endereço.
- Nenhuma dependência de `window.webkit` ou `postMessage`; envio por `fetch` com
  `keepalive`, sem pop-up e sem `target=_blank` no envio.
- Vídeo `playsInline` + `muted` + `preload="none"`, sem player de terceiros.

---

## 10. Contrato de dados [ESTRUTURA]

```
site            nome, cidade, endereço (com pending), telefone, e-mail, socials (null = pendência),
                openingISO, openingLabel, firstClassesLabel, heroFilm (poster + mp4 540/1280), finalVideo, mapsEmbedSrc
tiers[]         id, order (I/II/III), label, discount, seats, claimed, note, perks[] (label, short, icon)
openTier        primeira faixa com vaga; tudo que fala do "grupo atual" lê daqui, nunca tiers[0]
programs[]      key, title, tag (idade), line, alt, image  — cada card abre o formulário com a key
buildPhase      etapa atual da obra
buildStages[]   cinco fotos com título que vira alt
reserveSteps[]  quatro passos (um grau da faixa por passo)
faq[]           alimenta a lista e o JSON-LD
marqueeItems[]  itens curtos em caixa alta
reviews         rating (null até confirmar), count, items[] literais do Google
media.json      manifesto gerado: width/height/aspect-ratio por imagem
```

Benefícios moram **dentro de cada faixa**. Data da oferta/abertura numa fonte única; passado
o prazo, o bloco some **antes da primeira pintura** (`<meta>` escrito no pré-render +
script de uma linha no `<head>` pondo `html.offer-off`).

---

## 11. Stack e performance [IDV GB]

Vite · React 19 · Tailwind 4 (`@theme` só para as fontes; os tokens vivem em CSS puro na
classe raiz) · `clsx` + `tailwind-merge` · **sem motion lib**. Kit Novo Dash para
formulário, lead e tracking (GHL + n8n), com `tags` e `source` por origem de anúncio.

- **Pré-render da "/"** no build: o HTML chega pronto e o React só hidrata. Outras rotas
  recebem o shell via rewrite.
- **JS adiado até o hero pintar**: o script de entrada entra depois do `decode` do poster
  (teto de 2s). Um script inline guarda o toque em qualquer botão feito antes e o reexecuta
  após a hidratação (`HydrationReplay`): nenhum clique morto.
- **Todas as seções renderizam de uma vez** (sem `lazy()` por seção) e **nenhum pin**: as
  duas causas medidas do CLS de 1,9 da v1.
- Fontes em subconjunto; imagens AVIF/WebP no tamanho de exibição; o hero com AVIF mais
  comprimido (~30 KB); logo em 3 KB.
- Geometria do hero calculada por script inline no parse do HTML pré-renderizado.
- Clarity `form_submit` **só depois do 2xx** do GHL; `cta_click` com `cta_origin`,
  `call_click`, `directions_click`, `email_click`, `video_play`.
- Schema `SportsActivityLocation` só com dado confirmado; sem `aggregateRating` até a
  nota ser literal.

Régua medida na v2 (Lighthouse mobile, build local, trackers bloqueados):
Performance 97 a 100 · LCP 1,8 a 2,5s · CLS 0 (inclusive rolando) · TBT 0ms · A11y 100.
É a fasquia do preset.

---

## 12. Anti-padrões que este preset recusa

**Da identidade GB (v2)**
- Cantos arredondados em cards e botões (só a nav flutuante tem raio).
- Botão que troca de cor no hover; mais de um estilo de botão.
- Vermelho `#C8102E` em texto sobre marinho (usar `red-hi` ou `red-glow`).
- Condensada com tracking positivo; headline em caixa baixa; corpo em condensada.
- Triângulo como enfeite que não mede nem corta nada.
- Overlay de granulado `position: fixed` repintando a tela toda (foi removido na v2).
- Vidro desfocado em seção (só no cartão da nav).
- GSAP na home; pin; `lazy()` por seção com `fallback={null}`; animar `top`, altura ou cor.
- Anything que pareça botão sem abrir o formulário.

**Da arquitetura Grand Opening (Collective)**
- Hero de foto cheia com texto por cima.
- Reveal que esconde conteúdo se falhar (o `wipe` foi removido lá por isso).
- Placeholder plausível no lugar de pendência marcada.
- Mapa apontando para o centro da cidade; ícone social que leva a lugar nenhum.
- Lista única de benefícios em faixas que entregam coisas diferentes.
- Dois fundos escuros com dois reveals grandes competindo.

---

## 13. Checklist de adaptação para o novo cliente [CLIENTE]

**Troca obrigatória**
- [ ] Nome, cidade, endereço, telefone, e-mail, socials, embed do mapa.
- [ ] Logo da unidade nos tamanhos 112/160 (webp + avif) e o logo em contorno SVG para o
      pattern e o letreiro. Se o cliente **não for Gracie Barra**, o triângulo sai e entra o
      objeto da marca dele: o sistema (mordida, pattern, pino, selo, eyebrow) continua, o
      glifo muda. Vermelho e marinho também passam a ser os dele, mantendo a receita de §2.
- [ ] Filme do hero (poster AVIF + mp4 em 540 e 1280) ou foto da equipe/obra.
- [ ] Todo `site.ts`: faixas, descontos, vagas, programas, perguntas, letreiro, datas,
      etapas da obra, fotos com `alt` que descreve a imagem.
- [ ] Copy do hero medida em `em` contra a coluna (cada linha), CTA e notas.
- [ ] Reviews literais e nota do Google (ou `null` até confirmar).
- [ ] IDs do kit: pixel, GA4, Ads, Clarity, location, webhook, `source`, mapeamento de `tags`
      no workflow do GHL.
- [ ] Rodar `scripts/build-images.py` e `scripts/subset-fonts.py`.

**Pode variar sem quebrar o preset**
- Número de faixas (duas ou três) e de passos (três ou quatro graus na faixa).
- Seção IV: obra (fila de cinco) ou fita de fotos (`Reel`), conforme o que o cliente tem.
- Letreiro em X só se a foto do hero transbordar; senão o hero fecha no card.
- Reviews: só entra se já houver avaliações reais; academia nova não tem.

**Não mexer sem motivo**
- Ordem das seções e a oferta em segundo.
- Branco puro, uma tinta, um vermelho, um marinho; canto reto; uma curva de easing.
- Um botão. Tudo que parece botão abre o formulário.
- O triângulo (ou o glifo da marca) medindo alguma coisa em cada aparição.
- Uma banda escura no corpo + o pedido em marinho.
- `html.motion` como único portão de movimento; só transform/clip-path/opacity.
- Pendência visível em prospect.

---

## 14. Observações de estado (9 out 2026)

- Os prints em `GB Lindale/memory/prints/sections` são de uma iteração **anterior** da v2
  (hero com janela triangular e eyebrow de triângulo que enche). O código atual tem o hero
  em card com mordidas, títulos em itálico, duplicado em contorno, pattern fixo, eyebrow
  de barra inclinada e a nav flutuante. **Este documento descreve o código**, não os prints.
- `GB Lindale/memory/design-decisions.md` também descreve a iteração anterior em alguns
  pontos (eyebrow que enche, progresso na nav). Vale como registro da tese do triângulo;
  para mecanismos, o código manda.
- Na Lindale a v2 está publicada em `/v2` para revisão do cliente; a `/` ainda é a v1.
- `Collective JIU-JITSU/memory/design-decisions.md` está defasado (Newsreader, brasão,
  cinco gestos). A arquitetura de Grand Opening descrita aqui foi lida do código da
  Collective em produção, não desse arquivo.
