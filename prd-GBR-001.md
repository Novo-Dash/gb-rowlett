# PRD-GBR-001 · Gracie Barra Rowlett · Landing Page de Grand Opening
**Padrão:** BLACK-BELT-UX v5.1 · **Tipo:** Landing page (React/Vite) · **Data:** 9 out 2026
**Preset:** GRAND OPENING na identidade Gracie Barra (arquitetura da **Collective**, IDV da **GB Lindale v2**)
**Modo de execução:** com aprovação (design pass do hero com parada) · **UX mode:** prospect até as pendências fecharem → client no lançamento

---

## 0. PROTOCOLO PARA O CLAUDE CODE

**0.1** Este PRD é autocontido. Em conflito com qualquer outro documento, ele vence. Dentro dele, a **Seção 6 (jornada)** vence divergências de ordem e o **Anexo A (preset)** vence divergências visuais.
**0.1.1** Execução autônoma: `claude --dangerously-skip-permissions`.
**0.1.2** Declare cada fase: "Iniciando FASE X" / "FASE X concluída".

**0.2 Stack (sobrescreve o padrão v5.1 por decisão do preset):**
Vite · React 19 · TypeScript ~5.9 · Tailwind 4 (`@theme` só para fontes; tokens em CSS puro na classe raiz `.gbr`) · `clsx` + `tailwind-merge` (`cn()` em `src/lib/utils.ts`) · `@base-ui/react` só como primitivo sem estilo (Dialog, Accordion) · **sem GSAP, sem motion, sem Lenis.** O movimento é um barramento próprio de scroll (rAF + variáveis CSS) e um `IntersectionObserver` compartilhado, copiados da Lindale v2 (`src/v2/motion/scroll.ts`, `inview.ts`).
Kit Novo Dash de formulário/lead/tracking (`nd/*` da Collective: Booking, attribution, webhook, tracking, programs, config) **reaproveitado, não reescrito.**

**0.3 Fases:** F0 Leitura das referências → F1 Fundação (tokens, fontes, utilitários) → F2 Átomos (`Cta`, `Eyebrow`, `Lines`, `Odo`, `Stamp`, `Pic`, `Pending`) → F3 Infra (dados, booking, tracking, pré-render) → F4 Layout (Nav, Footer, StickyCTA, pattern fixo) → **Design pass do hero (PARADA)** → F5 Seções → F6 Composição → F7 Qualidade (Lighthouse, a11y, grep).

**F0 obrigatória — ler o CÓDIGO das duas referências e capturar prints novos:**
```
D:\DOCUMENTOS\NovoDash\COLLECTIVE JIU-JITSU      → arquitetura de Grand Opening (src/sections/*, src/data/site.ts, src/nd/*)
D:\DOCUMENTOS\NovoDash\GB Lindale                → IDV GB e engenharia: a v2 em src/v2 (rota /v2)
```
- O **código manda**. `COLLECTIVE JIU-JITSU/memory/design-decisions.md` está defasado (Newsreader, brasão, cinco gestos) e `GB Lindale/memory/design-decisions.md` + `memory/prints/sections` descrevem uma iteração anterior da v2. Não usar como fonte de mecanismo.
- Capturar com Playwright, no MEIO de cada mecanismo, em 1440 e 390: hero da Lindale v2 (cena 1 e cena 2), trilho de programas, "como funciona" com a faixa, FAQ aberto, footer com pino; oferta, obra, contador e pedido da Collective. Salvar em `public/memory/prints/ref-*.png`.
- Entrar → absorver → **replicar na mesma gramática, com leitura nova**. Nada é clonado.

**0.4 Proibições absolutas**
- Dado ou copy hardcoded no TSX (tudo vem de `src/data/site.ts`) · hex fora de `src/styles/tokens.css` · espaçamento fora da escala 4px · emoji (SVG próprio) · touch target < 44px · fonte via `<link>` · `<img>` cru (tudo por `Pic`) · imagem sem width/height · **schedule como imagem** · card de Programs sem foto.
- **Anti-template de criação:** nenhum componente visível com estilo de biblioteca. Botão, card, accordion, campo, controles do trilho, menu, ícones e foco são desenhados para o projeto (tabela 8.9). Zero Lucide/Heroicons visíveis. Proibido: `shadow-md` genérica, radius de biblioteca, foco azul do navegador, "Learn more"/"Submit"/"Get started", gradiente ou blob sem função, foto de banco apresentada como foto real.
- **Um mecanismo por seção** (Seção 7). Gestos genéricos só dois: título em máscara (`Lines`) e `.rise`. Proibido "o mesmo fade com delay diferente" e proibido repetir "título centralizado + subtítulo + grid de 3 cards com ícone".
- **Bugs proibidos (encontrados no código da Maison e da OCJ):**
  1. H1, CTA, preço, horários ou formulário com `opacity:0` no CSS-base ou atrás de classe de JS. **O H1 nunca anima opacidade.**
  2. Acento cortado por máscara: spans-máscara com `padding-block:.3em .08em; margin-block:-.3em -.08em`.
  3. Odômetro lido como "0 1 2…9": valor final no HTML + `sr-only`, tiras `aria-hidden`; o contador sempre termina (timeout, `visibilitychange`, reduced motion).
  4. Decorativo (faixa, triângulo, pattern) por cima de preço, CTA, horários ou formulário.
  5. Scroll fixo (sticky) ≤ 3,5 telas e ≤ 30% da página; nenhum trecho > 2,5 viewports sem CTA visível (a barra fixa conta). **Nenhum pin.**
  6. Tela vazia em qualquer ponto do scroll (testar rolando devagar em 1440 e 390).
  7. Hydration mismatch com o pré-render: reduced motion decidido por classe `html.motion` no `<head>`, nunca em `useState`.
  8. Texto real dentro de `aria-hidden`; card visível com `aria-hidden`; conteúdo recolhido sem `inert`.
  9. Fonte < 12px; `alt` que não descreve a foto.
  10. Código morto e `memory/*.md` desatualizado na entrega.

**0.5 Pendências:** dado que o cliente não mandou vira `<Pending>` (vermelho sobre `#FEF1F2`, visível em prospect, oculto com `VITE_UX_MODE=client`). Imagem faltando vira `Media` com o briefing do que precisa entrar no slot. **Nunca** placeholder plausível.
**0.6** Se vai escrever algo pela 2ª vez, pare e extraia.
**0.7 Posicionamento e marca:** unidade **afiliada Gracie Barra** (rede). Conciliação obrigatória: *o padrão é da Gracie Barra, a atenção é de quem dá a aula.* Usar logo, nome e cores GB conforme o material da unidade; não inventar selo, slogan oficial ou número da rede ("1.000+ escolas") sem fonte. Idioma da página: **inglês (en-US)**.
**0.8 / 0.9.2 Regra de imagem (dura):** hero, Programs e "Why us/Obra" sempre com imagem real da unidade. Toda seção tem imagem. Na falta de asset, Unsplash como placeholder **marcado** `[CONFIRMAR]`, nunca div cinza.
**0.9 Referências:** ver F0 e Anexo A.
**0.10 Segredos:** nenhum ID de webhook, token ou credencial no repo. `.env` fora do git; `.env.example` com chaves vazias.
**0.11 Oferta:** a página é de **pré-abertura com oferta de fundação** (preço publicado). Não existe aula experimental grátis nesta página; o CTA é **reserva de vaga de fundador**, sem cobrança no ato `[CONFIRMAR]`.

---

## 1. CONTEXTO E PROBLEMA REAL

A Gracie Barra Rowlett (3503 Rowlett Rd, Bldg K, Suite 302, Rowlett, TX 75088) **ainda não abriu**. Não existe site, nem reviews, nem alunos. O que existe: a obra em andamento, o instrutor (Andre Carepa, 27 anos de jiu-jitsu), a grade de horários e uma oferta de fundação com preço publicado.

**Problema-núcleo:** quem vê o anúncio já quer jiu-jitsu perto de casa; ele não sabe **por que decidir antes da academia abrir**.

- **P1** Academia nova não tem prova social (zero reviews, zero alunos).
- **P2** A persona que mais decide (a mãe) precisa de prova de segurança física, e não há foto de aula ainda.
- **P3** O adulto travado precisa de permissão; a marca Gracie Barra pode soar "de competição".
- **P4** O lead de pré-abertura esfria até a abertura sem data concreta.

**Oportunidade:** transformar "ainda não abriu" no argumento central. Quem entra agora é **fundador**: paga menos para sempre `[CONFIRMAR permanência]`, ganha o uniforme e entra numa sala sem panelinha formada. A obra prova que é real; a contagem regressiva dá prazo.

---

## 2. PERSONAS

| | Persona | Objeção central | Gatilho que converte |
|---|---|---|---|
| **Primária** | **A mãe** de criança 4–14 | "E se meu filho se machucar ou ficar agressivo?" | separação por idade nomeada, "no striking, tap means stop", o professor conhecendo cada família desde o primeiro dia |
| Secundária | **O adulto que nunca treinou** (25–45) | "Eu ainda não estou pronto." | "Nobody gets in shape first", aula de 6 AM e de meio-dia, entrar junto com o grupo fundador |
| Secundária | **A família com agenda apertada** | "Não dá pra encaixar duas idas na semana." | terça, quinta e sábado com kids e adultos **em sequência**: uma viagem, todo mundo treina |

Persona latente: a mulher que quer treinar (sem turma feminina no lançamento; resposta honesta no FAQ).

---

## 3. /memory

O Claude Code cria e mantém em `public/memory/` (servido, com `noindex`):
- `briefing.md` — cliente, oferta, personas, tese, estado.
- `design-decisions.md` — o que foi herdado da Collective, o que foi herdado da Lindale v2, o que mudou e por quê; tabela de pendências do cliente.
- `claude-code-rules.md` (3-B) — as regras 0.x resumidas para sessões futuras.
- `prints/ref-*.png` (F0) e `prints/gbr-*.png` (entrega, 1440 e 390).
Atualizar os três `.md` no fim de cada fase. `memory/` desatualizado na entrega = bug (0.4, item 10).

---

## 4. ARQUITETURA

```
GB Rowlett/                         ← D:\DOCUMENTOS\NovoDash\GB Rowlett (criar)
├─ brand/                           fora do git: logos-fonte, fontes TTF, vídeos brutos
├─ public/
│  ├─ fonts/                        AdihausDIN + Cn em subconjunto (~10 KB cada)
│  ├─ img/                          saída de build-images.py (AVIF + WebP por tamanho)
│  ├─ video/                        hero 540/1280 mp4 + poster AVIF
│  └─ memory/                       ver §3
├─ scripts/
│  ├─ build-images.py               gera AVIF/WebP + src/data/media.json (width/height/aspect)
│  └─ subset-fonts.py
├─ api/                             proxy de lead (do kit nd)
├─ src/
│  ├─ main.tsx · App.tsx
│  ├─ styles/tokens.css             ÚNICO lugar com hex
│  ├─ styles/index.css              utilitários .d .h1 .h2 .h3 .body .lead .label .accent
│  ├─ motion/scroll.ts · inview.ts  barramento próprio (da Lindale v2)
│  ├─ components/
│  │  ├─ layout/  Nav · Footer · StickyCta · Pattern
│  │  ├─ ui/      Cta · Eyebrow · Lines · Odo · Stamp · Pic · Pending · Media · Bite · Pin · Stars
│  │  └─ sections/ Hero · Marquee · Offer · Programs · Build · Schedule · Parents · Ready · Coach · Reserve · Opening · Faq · Claim
│  ├─ nd/                           kit Novo Dash (Booking, attribution, webhook, tracking, programs, config)
│  ├─ data/site.ts · media.json
│  ├─ types/ · lib/utils.ts
│  └─ hooks/ (useOpenTier, useCountdown, useUxMode)
├─ vercel.json · .env.example · .gitignore (brand/, dist/, .env, .claude/)
```

---

## 5. UX MODE

| | `prospect` (build e revisão) | `client` (lançamento) |
|---|---|---|
| `<Pending>` | visível, vermelho sobre `#FEF1F2` | oculto; bloco sem dado some inteiro |
| Webhook | `PLACEHOLDER` → **não dispara**, avisa no console | proxy real para o GHL |
| Tracking | desligado | Pixel, GA4, Ads, Clarity reais |
| robots | `noindex` | `index, follow` |
| Contador | data `[CONFIRMAR]` → bloco mostra "Opening date coming soon" | data real; passada a data, a oferta some antes da primeira pintura (`html.offer-off`) |

---

## 6. JORNADA MENTAL (vence divergências de ordem)

| # | Seção | Pergunta que responde | Fundo |
|---|---|---|---|
| — | Nav | — | cartão branco flutuante |
| I | **Hero** | "O que é isso e é pra mim?" | card no filme |
| — | **Letreiro em X** | (ritmo) | transparente |
| II | **Oferta de fundação** | "Por que decidir hoje?" | branco + pattern |
| III | **Programas** | "Tem turma pra mim / meu filho?" | branco + pattern |
| IV | **A obra** (= Why Us) | "Isso é real? Qual a vantagem de entrar agora?" | branco + pattern |
| V | **Horários** | "Cabe na minha semana?" | branco + pattern |
| VI | **Para os pais** | "É seguro? Vai ficar agressivo?" | branco + pattern |
| VII | **Sem experiência** | "Eu não estou pronto." | branco + pattern |
| VIII | **Coach** | "Quem vai dar a aula?" | branco + pattern |
| IX | **Como reservar** | "O que acontece depois que eu clico?" | branco + pattern |
| X | **Abertura** (contador) | "Quando?" | **`--night`** (única banda escura do corpo) |
| XI | **Perguntas** | o resto das objeções | branco + pattern |
| XII | **O pedido** | "Ok, onde eu reservo?" | **`--navy`** |
| — | Mapa + Footer | "Onde fica?" | marinho |
| — | Barra fixa (celular) | — | — |

**Diferenças em relação à ordem da Collective, e por quê:** a copy da ETAPA 1 pede quatro seções que o preset não tem (Horários, Para os pais, Sem experiência, Coach). Entram entre a obra e "como reservar", que é o trecho de convencimento; a oferta continua em 2º e as duas inversões escuras continuam sendo só Abertura e Pedido.
**Coach não sobe para a posição 03:** a regra da casa só sobe o Coach com credencial forte confirmada. Enquanto faixa/linhagem forem `[CONFIRMAR]`, fica em VIII. Se o cliente confirmar faixa-preta com linhagem verificável, **subir para depois de Programas** e registrar em `design-decisions.md`.
**Ritmo de CTA:** hero, oferta (botão no ingresso), cada card de programa, cada horário, coach, último passo, abertura, pedido, barra fixa. Nenhum trecho > 2,5 viewports sem CTA.

---

## 7. LAYOUT

- **Mobile first a partir de 390px** (público de anúncio: ~90% celular, maioria no navegador do app FB/IG). Desktop entra em `min-width: 1024px`; grades de 4 só em 1280.
- Unidade fluida `--u = min(1vw, 19.2px)`; quadro desenhado em 1920 e centralizado acima disso.
- Gutter `clamp(16px, 5vw, 64px)`. Ritmo vertical **variado** entre seções (nem tudo igual): seções de convencimento mais curtas, oferta e obra com mais ar.
- **Arquétipo por seção** (nenhum repete):

| Seção | Arquétipo | Mecanismo próprio |
|---|---|---|
| Hero | card no filme | o card abre até a tela com o scroll (`--k`), cena 2 entra pelos lados |
| Letreiro | fitas em X | duas fitas a ±3°, CSS puro |
| Oferta | ingressos | ingresso aberto picotado, travado borrado com triângulo |
| Programas | trilho com luz | snap nativo, card central aceso, vizinhos recuam |
| Obra | fila de borda a borda | hover derruba as vizinhas a 45%; texto Why Us em 3 placas |
| Horários | **quadro de placar** | cada horário é um alvo que abre o formulário com a turma |
| Para os pais | três perguntas em aspas | aspas grandes em Cn itálico, resposta com fato físico, foto de kids |
| Sem experiência | duas colunas need / don't | coluna "don't" com ▲ riscado; frase de fechamento em `--t-statement` |
| Coach | retrato + ficha | ficha em `dl` com fios; dados pendentes visíveis |
| Como reservar | faixa no palco | bloco vermelho com faixa branca; cada passo ganha um grau com tranco |
| Abertura | odômetro | rolos de dígito, registro em `dl` de 4 colunas |
| Perguntas | peças numeradas | aberta vira cartão com barra vermelha |
| Pedido | statement + vídeo vertical | vagas do grupo aberto na headline |
| Footer | mapa com pino | pino triangular, letreiro em contorno |

---

## 8. DIREÇÃO DE ARTE

A direção completa (tokens, tipografia, triângulo, movimento) está no **Anexo A — Preset Grand Opening GB**, que é parte deste PRD. Aqui ficam a tese e as decisões específicas da Rowlett.

### 8.0 Tese visual
> **GB Rowlett deve parecer uma equipe atlética no dia da estreia, como um uniforme novo e a placa de resultado ainda zerada, não uma academia de luta escura nem um template de gym.**
- **Sensação-alvo:** padrão de rede, calor de quem está começando.
- **Metáfora âncora:** o **triângulo Gracie Barra**, que mede e corta tudo; e o **ingresso de fundador**.
- **O que NÃO somos:** dojo escuro agressivo; o "clube antigo" de papel da Collective; landing de franquia genérica.

### 8.1 Anti-clichê
Branco puro + tinta quase preta + vermelho e marinho **da marca GB** (não é o "preto + vermelhão" genérico: o fundo é branco e o vermelho tem origem na marca). Canto reto é do uniforme e da placa, mas **não é broadsheet**: não há fios de 1px densos nem colunas de jornal; há fotos grandes e um sistema gráfico.

### 8.2 Paleta (valores do Anexo A §2)
`--paper #FFFFFF` (uniforme, não papel) · `--ink #0D0E12` · `--ink-2 #34353B` · `--red #C8102E` (vermelho GB, só ação e destaque) · `--navy #19286D` (marinho GB, footer/pedido) · `--night #0B1233` (a única banda escura) + irmãos `--red-deep`, `--red-hi`, `--red-glow`. Nenhuma terceira cor. A cor viva vem das fotos (tatame, kimonos).

### 8.3 Tipografia
**AdihausDIN + AdihausDIN Cn** self-hosted em subconjunto, fallback Arial com métricas ajustadas. Display em Cn 700 **caixa alta itálica**, tracking -0,006em, lh 0,9. Corpo e FAQ em AdihausDIN regular, nunca na condensada. Destaque vermelho com **duplicado em contorno** deslocado. `Permanent Marker` só em rabisco de polaroid, se houver. Licença das fontes: as mesmas da Lindale `[CONFIRMAR que o uso está liberado para a unidade]`.

### 8.4 Profundidade
- `elev-0` página (branco + pattern fixo do logo a 8,5%)
- `elev-1` superfície `--paper-2`
- `elev-2` card: sombra marinho em duas camadas (difusa + contato) **embaixo**, nunca em volta
- `elev-3` nav flutuante (único vidro: `backdrop-filter`) e o diálogo do formulário
- Em fundo escuro: **luz vermelha** (`--red-glow`, `mix-blend-mode: screen`) em vez de sombra.

### 8.5 Tratamento de imagem
- Proporções: hero 16/9 dentro do card (4/5 no celular), programa 3/4, obra 4/5, coach 4/5, fachada 1/1.
- Fotos de celular (HEIC) e de câmera convivem: aplicar a mesma curva (contraste +6, saturação −8) e um véu marinho a 18% que **sai** no hover/foco. Nada de duotone pesado.
- Fotos da obra são prova: **sem filtro que as faça parecer render**.

### 8.6 Devices estruturais
Numeração só onde é sequência real: passos de "Como reservar" (1–3 graus) e perguntas do FAQ. Grupos da oferta em **I/II**. O eyebrow (barra vermelha inclinada) é o lugar onde a marca faz grafismo.

### 8.7 Signature Moment
**O card do hero que abre até virar a tela**, com as duas mordidas triangulares encolhendo, o marinho descendo e "No experience / needed." entrando pelos lados. É o que a v2 da Lindale já provou; aqui ele termina na **oferta de fundação**, que é a pergunta seguinte do visitante. Todo o resto da página é disciplinado.

### 8.8 Realidade dos assets (inventariado no Drive em 9 out 2026)
Pasta `Gracie Barra - Rowlett TX/02. Media/Fotos` (Drive da Novo Dash):
| Pasta | Conteúdo | Uso |
|---|---|---|
| `Obras GB` | fotos da obra (subpasta de download) | **Seção IV (obra)** e poster do hero se não houver vídeo |
| `10-08` | ~41 HEIC + 1 JPG de iPhone, tirados em 7 out 2026 | obra/fachada/espaço — triar no F0 |
| `Fotos` | `6T7A0276.JPG` (câmera, 4,8 MB) + zip de 138 MB | possível ensaio profissional: hero, coach, programas |
| `Fotos as Brown Belt` | zip de 399 MB | provavelmente do Andre como faixa-marrom: **história do coach** (Seção VIII) |
| `03. Recordings` | `Onboarding Call - 2026-10-05` (vídeo) | **fonte das pendências** (preço família, contrato, bio do coach) |

- **Fotografia de aula:** não existe (a academia não abriu). Programas usam foto de aula de outra unidade GB **somente com autorização** `[CONFIRMAR]`, senão Unsplash marcado. Registrar: *fotografia profissional de uma aula real move mais o ponteiro que qualquer CSS.*
- **Logo:** pedir SVG da unidade (o flyer usa o selo "Brazilian Jiu-Jitsu · Gracie Barra · Rowlett, Texas"). Sem SVG, usar o selo GB oficial em SVG da Lindale e só o texto "Rowlett, TX" ao lado.
- **Vídeo do hero:** não existe. Poster AVIF da obra/fachada até o b-roll chegar.
- **HEIC:** converter no `build-images.py` (pillow-heif).

### 8.9 Componentes próprios (estados derivados do triângulo)
| Componente | Desenho | hover | active | focus-visible | loading / erro |
|---|---|---|---|---|---|
| `Cta` (o único botão) | canto cortado `--cut:14px`, degradê vermelho vertical, rótulo Cn 700 caixa alta, quadrado branco com seta vermelha | brilho inclinado atravessa, a seta dá a volta; **não troca de cor** | escala 97% | contorno 2px `--ink` com offset 3px seguindo o recorte (`clip-path` duplicado) | rótulo vira "Sending…" com a seta girando; erro: borda `--red-deep` + texto abaixo |
| `Eyebrow` | barra 4px `skewX(-12deg)` + Cn Bold Italic | — | — | — | — |
| Card de programa | foto 3/4, sombra marinho embaixo, quadrado vermelho de seta branca | luz vermelha no topo, cresce 4% | 98% | anel `--ink` | — |
| Slot de horário | célula do placar com hora em Cn e turma em label | fundo `--paper-2`, ▲ vermelho aparece | 98% | anel `--ink` | — |
| Peça do FAQ | número Cn itálico vermelho + quadrado +/− | quadrado contorna em vermelho | — | anel `--ink` | — |
| Campo do formulário | base com fio `--line-strong` 2px, label Cn | fio `--ink` | — | fio `--red` 2px + label vermelho | erro: fio `--red-deep` + mensagem com ▲ |
| Controles do trilho | régua vermelha + contador 01/04 | — | — | anel `--ink` | — |
| Pino do mapa | triângulo vermelho, borda `--red-deep`, triângulo branco dentro | foto da fachada cresce | — | — | — |
| Ícones | ▲, ✓, seta, telefone, rota, e-mail **desenhados em SVG no traço do triângulo** | — | — | — | — |

---

## 9. TIPOGRAFIA

| Token | Valor |
|---|---|
| `.h1` | `clamp(2.75rem, min(12.6vw, 9svh), 7.4rem)`, lh 0,88, itálico, tracking -0,012em |
| `.h2` | `clamp(2.4rem, 9.4vw, 5.4rem)` |
| `.h3` | `clamp(1.5rem, 5.4vw, 2rem)` |
| `--t-statement` | `clamp(2.3rem, min(9.8vw, 7svh), 5.6rem)` (Sem experiência, Pedido) |
| `.lead` | `clamp(1.125rem, 1.1vw + 0.9rem, 1.375rem)`, lh 1,45 |
| `.body` | 17px, lh 1,6, `--ink-2`, 60ch, `text-wrap: pretty` |
| `.label` | Cn 700, 0,78rem, tracking 0,2em, caixa alta |
Títulos de cards do mesmo grupo no mesmo tamanho (`font-size: calc(100cqi / var(--tw))`). Mínimo absoluto 12px.

---

## 10. SEÇÃO POR SEÇÃO + `src/data/site.ts`

A copy é a da **ETAPA 1** (doc "Copy para grand opening GB Rowlett", revisado em 9 out 2026). Tudo abaixo vai para `site.ts`; nenhum texto no TSX. `<Pending: …>` = marcador da 0.5.

### Nav
Menu (abre cards: Classes / Schedule / Visit) · logo ao centro (abre o formulário) · `(945) 385-9359` como ação escrita · `Cta compact`: **"Claim my spot"**.

### I · Hero
- Eyebrow: **OPENING SOON · ROWLETT, TX**
- H1: **A new Gracie Barra is coming to Rowlett, built for people who've never trained.** (trecho vermelho com duplicado: "never trained")
- Lead: Kids from 4, teens and adults. No experience needed. The official Gracie Barra curriculum, led by Andre Carepa, 27 years in jiu-jitsu.
- Offer line: **Founding Members pay $87 every two weeks. No enrollment fee.**
- `Cta block`: **Claim my Founding Member spot**
- Micro-itens com ▲: `Nothing charged today` ▲ `Uniform included for the First 50` ▲ `Kids from 4` — o primeiro só depois de `[CONFIRMAR cobrança]`.
- **Carimbo** (no lugar do selo do Google, que não existe): anel "FOUNDING MEMBER · FIRST 50 ·", centro com `Odo` das **vagas restantes** do grupo aberto, rótulo "spots left".
- Cena 2: "No experience" (esq.) / "needed." (dir.) + botão "Explore" apontando para baixo.
- Mídia: poster AVIF da obra/fachada até existir b-roll `[CONFIRMAR vídeo]`.

### Letreiro em X
Fita vermelha: `FOUNDING RATE BEFORE WE OPEN · NO ENROLLMENT FEE · KIDS FROM 4 · 18 CLASSES A WEEK ·`
Fita marinho: `ROWLETT, TX · GRACIE BARRA · NO EXPERIENCE NEEDED · OPENING SOON ·`
Só entra se a foto do hero transbordar a base (regra do preset).

### II · Oferta de fundação
- Eyebrow: FOUNDING MEMBERS · H2: **Join before we open. Pay less than everyone who joins after.**
- Body: Founding Members pay $87 every two weeks with no enrollment fee. Once we open, the standard rate is $107 every two weeks plus a $47 enrollment fee. Adults train unlimited. Kids train 3 classes a week.
- Permanência: `<Pending: o $87 vale enquanto o membro continuar treinando?>`
- **Dois ingressos** (o preset permite 2 ou 3):

| Grupo | Nome | Preço | Perk | Vagas | Estado |
|---|---|---|---|---|---|
| I | **The First 50** | $87 / 2 weeks · no enrollment fee | Gracie Barra uniform **included** | 50 · `claimed` `[CONFIRMAR]` | aberto |
| II | **The Founding Class** | $87 / 2 weeks · no enrollment fee | **50% off** Gracie Barra uniform | `<Pending: limite de vagas>` | abre quando o I lota |

- Aqui o desconto não decresce: **o perk decresce** (uniforme inteiro → metade). O ingresso aberto mostra o perk em destaque; o travado mostra o perk dele legível por trás do borrão a 5px com o **triângulo marinho** no centro (texto em `sr-only`).
- Comparação sempre visível embaixo dos ingressos: "After opening: ~~$87~~ **$107** every two weeks + $47 enrollment fee" (a tabela normal riscando o preço de fundador, não o contrário).
- Botão do ingresso aberto: **Claim a First 50 spot**. O carimbo vermelho com odômetro de **dias até a abertura** morde o canto do ingresso aberto (some se a data for `[CONFIRMAR]`).

### III · Programas (4 cards)
| key | Título | Tag | Linha |
|---|---|---|---|
| `lc1` | Little Champions 1 | ages 4–6 | Kids from 4 learn to move, fall and focus, in a class only for their age. |
| `lc2` | Little Champions 2 | ages 7–9 | Fundamentals for kids 7 to 9, grouped by age. |
| `juniors` | Juniors | ages 10–14 | The same curriculum, with more technique and more responsibility. |
| `adults` | Adults · All Levels | 17+ · teens 15–16 | No experience required. Teens 15–16 train in this class, same curriculum. |
H2: **Find your class.** Cada card é `<button>` e abre o formulário com o programa. Fotos: `<Pending: foto por programa>` (ver 8.8).
> As linhas de LC1/LC2/Juniors não estão na copy da ETAPA 1; são descritivas e sem promessa. Marcar `[CONFIRMAR com copy]`.

### IV · A obra (Why Us)
- Eyebrow: BEHIND THE DOORS · H2: **The academy is new. That's your advantage.**
- Body: No established cliques, no corner of the mat that's already taken. You walk in with the rest of the founding group, and you help set the tone of the room.
- Pastilha vermelha com a etapa: `buildPhase` = `<Pending: etapa atual da obra>`
- Cinco fotos reais em fila (pasta `Obras GB` / `10-08`), com `alt` descritivo.
- Três placas abaixo da fila:
  1. **Beginners are the plan, not the exception.** No experience needed, at any age. The classes start where you are.
  2. **The official curriculum, taught by someone you can meet.** Every Gracie Barra academy teaches the official curriculum, and this one is no exception. What's specific to Rowlett is who teaches it: Andre Carepa, 27 years in jiu-jitsu.
  3. **One trip for the whole family.** On Tuesdays and Thursdays the classes run back to back: 4:30 for ages 4–6, 5:30 for ages 7–14, 6:30 for teens and adults. One drive, everybody trains.

### V · Horários (texto, nunca imagem)
H2: **Classes from 6 AM to 6:30 PM. Pick the one that fits your week.**
```ts
schedule: [
  { day:'Mon', slots:[ {t:'12:00 PM',p:'adults'}, {t:'5:15 PM',p:'lc2-juniors'}, {t:'6:30 PM',p:'adults'} ] },
  { day:'Tue', slots:[ {t:'6:00 AM',p:'adults'}, {t:'4:30 PM',p:'lc1'}, {t:'5:30 PM',p:'lc2-juniors'}, {t:'6:30 PM',p:'adults'} ] },
  { day:'Wed', slots:[ {t:'12:00 PM',p:'adults'}, {t:'5:15 PM',p:'lc2-juniors'}, {t:'6:30 PM',p:'adults'} ] },
  { day:'Thu', slots:[ {t:'6:00 AM',p:'adults'}, {t:'4:30 PM',p:'lc1'}, {t:'5:30 PM',p:'lc2-juniors'}, {t:'6:30 PM',p:'adults'} ] },
  { day:'Fri', slots:[ {t:'12:00 PM',p:'adults'} ] },
  { day:'Sat', slots:[ {t:'9:00 AM',p:'lc1'}, {t:'10:00 AM',p:'lc2-juniors'}, {t:'11:00 AM',p:'adults'} ] },
]
// adults = "Adults + Teens · Fundamentals / All Levels"; lc2-juniors = "LC2 + Juniors (7–14)"
```
- **Contagens derivadas do dado, nunca digitadas:** 18 aulas/semana · 10 de adultos · 3 de LC1 · 5 de LC2+Juniors.
- Desktop: placar de 6 colunas (dias). Celular: lista por dia, com o dia de hoje aberto primeiro.
- Filtro por programa = os 4 rótulos de programa como **legenda** (não botões); cada slot é alvo que abre o formulário com o programa. Não usar `tablist`.
- Nota: "10 adult classes a week, including 6 AM on Tue/Thu for anyone who has to be at work by 8."
- ⚠️ A legenda do flyer cita **GB2 (white belt 2 stripes and up)** e nenhuma aula GB2 na grade. **Não publicar GB2** `[CONFIRMAR]`.
- Microdado: `Schedule` também alimenta o JSON-LD (`openingHoursSpecification` só depois da abertura).

### VI · Para os pais
H2: **What parents ask us first**
- "Is it safe?" → There's no striking in jiu-jitsu, and a tap always means stop. Kids train by age group: a 4-year-old never trains with a 12-year-old.
- "Will it make my child aggressive?" → Jiu-jitsu is built on leverage and control, not hitting, and kids practice staying calm when something is hard.
- "Will the coach know my child's name?" → You're joining before we open, so you're among the first families we get to know.
- `<Pending: onde os pais ficam durante a aula>` · Foto: kids GB `[CONFIRMAR autorização]`.

### VII · Sem experiência
H2: **Never trained? That's the starting line.**
- **You need:** comfortable clothes · to show up · curiosity · respect for your training partners · the courage to walk in the first time
- **You don't need:** experience · to be in shape · strength or flexibility · to know anyone · to feel ready first
- Statement (`--t-statement`): **Nobody gets in shape first. You train, and the shape follows.**

### VIII · Coach
- H2: **Andre Carepa** · Lead: 27 years in jiu-jitsu.
- Ficha (`dl`): Belt `<Pending>` · Lineage `<Pending>` · Teaching since `<Pending>` · Teaches kids and beginner classes `<Pending>` · Why Rowlett `<Pending>`.
- Foto: pasta `Fotos as Brown Belt` pode render um "antes e agora" se houver foto atual `[CONFIRMAR]`.
- `Cta auto`: **Meet Andre as a Founding Member**.

### IX · Como reservar (3 graus na faixa)
1. **Pre-register.** Pick who's training and which class. About a minute.
2. **We confirm your spot.** By `<Pending: ligação, SMS ou e-mail, e em quanto tempo>`.
3. **Doors open.** You start with the founding group. You get the address, what to wear, what to bring and what class looks like, in writing. `<Pending: confirmar o e-mail de boas-vindas>` → `Cta`.

### X · Abertura (contador, `--night`)
- "The doors open in" (`red-glow` + duplicado) · `Odo` dias/horas/min/seg com `openingISO` `[CONFIRMAR]`.
- Registro `dl` em 4 colunas: **Address** 3503 Rowlett Rd, Bldg K, Suite 302 · **First classes** `<Pending>` · **Programs** Kids 4–14 · Teens · Adults · **Founding rate** $87 / 2 weeks.
- Sem data: o odômetro não aparece; aparece "Opening date coming soon. Founding Members hear it first." `[CONFIRMAR aviso prioritário]`.
- Fachada a 30% ao fundo (pasta `10-08`).

### XI · Perguntas (JSON-LD `FAQPage` da mesma lista; a primeira já aberta)
1. "I've never trained. Will I be the worst person in the room?" → Everyone on that mat was new once. Classes start from zero, and since the academy is new, you won't be walking into an established room.
2. "My kid has never done a sport. Is that a problem?" → No experience needed, at any age. Kids train by age (4–6, 7–9, 10–14), so your child starts with kids their own age.
3. "I work all day. When could I actually train?" → 6 AM on Tuesdays and Thursdays, noon Monday, Wednesday and Friday, 6:30 PM Monday to Thursday, and 11 AM on Saturday. *(gerada do `schedule`)*
4. "What exactly is a Founding Member?" → Someone who joins before we open: $87 every two weeks with no enrollment fee, instead of $107 plus $47 after the doors open.
5. "What's the difference between The First 50 and The Founding Class?" → Same $87, same no enrollment fee. The First 50 get a Gracie Barra uniform included. After that, The Founding Class gets 50% off the uniform.
6. "Am I locked into a contract? What if I need to pause?" → `<Pending: contrato, aviso de cancelamento, regra de pausa>`
7. "Am I charged when I pre-register? When do you open?" → `<Pending: cobrança>`. We're opening soon in Rowlett, and Founding Members hear the date first.
8. "My teen is 15. Kids' class or adults'?" → 15- and 16-year-olds train in the adult class, learning the same curriculum. `<Pending: regra de pareamento no rola>`
9. "Do you have a women's class?" → Not at launch, but it's in our plans. Women are welcome in Adults All Levels, and you can tell us you're interested on the form. `<Pending: Andre aprova>`
10. "How much does a family pay?" → `<Pending: preço da família, com número>`
> Em `client`, pergunta com resposta 100% pendente **some** da lista e do JSON-LD.

### XII · O pedido (`--navy` + foto a 30%)
- Eyebrow light: FOUNDING MEMBERS
- Headline (`--t-statement`): **Join before the doors open.** + linha gerada: "**{n} First 50 spots left.**" (trecho vermelho com duplicado em `red-glow`)
- Benefícios em coluna única, ✓ em `red-hi`: $87 every two weeks · No enrollment fee · Gracie Barra uniform included (First 50) · Adults unlimited, kids 3 classes a week · Nothing charged today `[CONFIRMAR]`
- Comparação: After opening: $107 plus a $47 enrollment fee.
- `Cta`: **Claim my Founding Member spot** + "Tap to call or text (945) 385-9359".
- Micro: No spam, and no call unless you want one.
- Vídeo vertical 9/16 `[CONFIRMAR existe]`; sem vídeo, foto vertical da obra.

### Mapa + Footer (marinho)
- Grade de 4: marca + "A new Gracie Barra academy in Rowlett, TX" + socials (`@gbrowlett` só se existir; `null` = pendência, nunca ícone vazio) · a academia · **onde fica** com ações escritas (Get directions · Call or text · Email `info@gbrowlett.com`) · programas (cada um abre o formulário).
- H2 do bloco: **Right here in Rowlett** · 3503 Rowlett Rd, Bldg K, Suite 302, Rowlett, TX 75088 · `<Pending: ponto de referência, estacionamento, cidades vizinhas (sugestão: Garland, Sachse, Rockwall)>`
- Mapa P&B com pino triangular **no endereço exato**, nunca no centro da cidade. Foto da fachada encostada no pino.
- Letreiro: "GRACIE BARRA ROWLETT" em contorno + logo em contorno.
- Base: © 2026 Gracie Barra Rowlett · Gracie Barra affiliate · Site by Novo Dash.

### Barra fixa (celular)
**Claim my Founding spot** · aparece quando o CTA do hero sai da tela, some com outro CTA visível ou com o formulário aberto (`html.bk-open`), `safe-area-inset-bottom`.

### `site.ts` — contrato (do Anexo A §10)
```
site      name, city, address, phone '(945) 385-9359', email 'info@gbrowlett.com', url 'gbrowlett.com' [CONFIRMAR domínio da LP],
          socials { instagram: null }, openingISO: null, openingLabel, firstClassesLabel, heroFilm, finalVideo, mapsEmbedSrc
pricing   founding { amount: 87, period: 'two weeks', enrollment: 0 }, standard { amount: 107, period: 'two weeks', enrollment: 47 },
          adultsAccess: 'unlimited', kidsPerWeek: 3, family: null, permanent: null
tiers[]   { id:'first-50', order:'I', label:'The First 50', seats:50, claimed:null, perks:[uniform:'included'] },
          { id:'founding-class', order:'II', label:'The Founding Class', seats:null, claimed:0, perks:[uniform:'50% off'] }
openTier  primeira faixa com vaga — tudo que fala do "grupo atual" lê daqui, nunca tiers[0]
programs[] · schedule[] · buildPhase · buildStages[5] · reserveSteps[3] · parents[3] · ready{need[],dont[]} · coach{} · faq[] · marqueeItems[]
reviews   { rating: null, count: 0, items: [] }  → selo do Google não renderiza
```

---

## 11. FORMULÁRIO

Reaproveitar `nd/Booking.tsx` da Collective. Diálogo em tela cheia no celular, inputs 16px, foco preso e devolvido.
- **Passo 1:** Who is training? (My child / My teen / Me / The whole family) — escolha única, cards com ▲.
- **Passo 2:** Which program? (pré-selecionado se veio de card/slot; "The whole family" permite múltiplos).
- **Passo 3:** Name · Phone · Email · campo opcional "Interested in a women's class" (checkbox) `[CONFIRMAR]`.
- Microcopy: "Nothing is charged today. We hold your spot and confirm by phone." `[CONFIRMAR]` + consentimento `<Pending: texto de consentimento>`.
- `useUTMs` + attribution do kit; honeypot; rate limit no proxy; `fetch` com `keepalive`, sem `target=_blank`.
- Payload: `who, programs[], name, phone, email, tier: openTier.id, women_interest, utm_*, cta_origin, page: 'gbr-grand-opening'`; `tags`: `founding-member`, `tier-{id}`, `program-{key}`, `source`.
- Sucesso: "You're on the Founding list. We'll confirm your spot by `<Pending: canal>`." — nunca prometer prazo sem confirmação.
- Webhook `PLACEHOLDER` → não dispara (0.10 + Seção 5).

## 12. A11y (WCAG AA)
Alvo ≥ 44px · skip link · landmarks (`header`, `main`, `footer`, `nav`) · `focus-visible` próprio (8.9) · contraste do Anexo A §2 (vermelho sobre marinho só com `red-hi`/`red-glow`) · `Lines` com `aria-label` no heading e máscaras `aria-hidden` · odômetro com valor em `sr-only` · FAQ com `inert` fechado · ingresso travado com texto em `sr-only` · reduced motion = página nasce no estado final (Seção 14). Meta: Lighthouse A11y 100.

## 13. GLASSMORPHISM
Só no cartão da nav (`backdrop-filter: blur(14px) saturate(140%)`, raio 14px — a única exceção ao canto reto). Fallback `@supports not (backdrop-filter)`: `--paper` a 96%. Proibido vidro em seção.

## 14. ANIMAÇÕES (sem GSAP — sobrescreve o padrão)
- Tudo escopado em `html.motion`, classe posta no `<head>` só se não houver `prefers-reduced-motion`. Sem ela: sem sticky no hero, faixa com todos os graus, odômetro no número final, nada escondido.
- Só `transform`, `clip-path`, `opacity` e variáveis CSS. Nunca `top`, altura ou `background-color` animados.
- Gestos: `Lines` (stagger 34ms) · `.rise` (22px) · barra do eyebrow · cunha triangular nos programas · `Odo` (carimbo, contador) · abertura do card do hero (`--k`) e cena 2 (`--s`) · rolo + tranco da faixa · luz e recuo no trilho · pulsação/brilho/seta do `Cta` · pattern derivando em 90s.
- Hover só em `(hover: hover) and (pointer: fine)`.
- Orçamento de sticky: hero (≈1,2 tela) + como reservar (≈1,5 tela) = **≤ 3 telas**, abaixo do limite de 3,5 e de 30% da página.

## 15. PERFORMANCE + imagens
- Pré-render da `/`; JS adiado até o poster do hero decodificar (teto 2s); `HydrationReplay` para toques antes da hidratação.
- Todas as seções renderizam de uma vez (sem `lazy()` por seção). Sem pin.
- Fontes em subconjunto; AVIF/WebP no tamanho de exibição; poster do hero ~30 KB; logo ~3 KB.
- Régua: Lighthouse mobile **Performance ≥ 97 · LCP ≤ 2,5s · CLS 0 rolando · TBT 0 · A11y 100**.
- **Lista de imagens** (do inventário 8.8):

| Slot | Fonte | Proporção | Status |
|---|---|---|---|
| Hero poster | `Obras GB` ou `10-08` (fachada/sala) | 16/9 · 4/5 | 🟡 triar |
| Hero b-roll | — | 16/9 | 🔴 não existe |
| Obra ×5 | `Obras GB` + `10-08` | 4/5 | 🟡 triar |
| Programas ×4 | — (sem aula ainda) | 3/4 | 🔴 autorização de outra unidade ou Unsplash marcado |
| Pais (kids) | — | 4/5 | 🔴 idem |
| Sem experiência | `Fotos` (zip) | 4/5 | 🟡 abrir zip |
| Coach | `Fotos` + `Fotos as Brown Belt` | 4/5 | 🟡 abrir zips |
| Abertura (fachada) | `10-08` | 16/9 | 🟡 |
| Pedido (vertical) | `10-08` | 9/16 | 🟡 |
| Fachada do mapa | `10-08` | 1/1 | 🟡 |
| Logo SVG | cliente | — | 🔴 |

## 16. SEGURANÇA
`vercel.json` com headers (HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) e CSP do kit (Meta, GA4, Ads, Clarity, GHL). `.env` fora do git. **Grep final obrigatório:** zero `[CONFIRMAR]` e zero `<Pending` renderizados em `client` (o componente pode existir; o texto não pode aparecer).

## 17. MICROCOPY
| Onde | Texto |
|---|---|
| CTA principal | Claim my Founding Member spot |
| CTA do ingresso | Claim a First 50 spot |
| CTA nav / sticky | Claim my spot / Claim my Founding spot |
| CTA coach | Meet Andre as a Founding Member |
| Sob o botão | Nothing is charged today. No spam, and no call unless you want one. `[CONFIRMAR cobrança]` |
| Botão do form | Hold my spot (passo final) · Next (passos 1–2) |
| Loading | Sending… |
| Sucesso | You're on the Founding list. We'll confirm your spot by `<canal>`. |
| Erro | That didn't go through. Call or text (945) 385-9359 and we'll hold your spot. |
| Grupo travado (sr-only) | The Founding Class opens when The First 50 is full. |
Proibido: Learn more · Submit · Get started · Book now genérico.

## 18. TRACKING
`PageView` · `ViewContent` (oferta em tela) · `cta_click` com `cta_origin` (hero, ticket, program-{key}, slot-{dia-hora}, coach, reserve, opening, claim, sticky, nav) · `Lead` e Clarity `form_submit` **só depois do 2xx** do GHL · `call_click` · `directions_click` · `email_click` · `video_play` · `scroll_depth` 25/50/75/100. Nada dispara em `prospect`.

## 19. SEO / SCHEMA
- Title: "Gracie Barra Rowlett · Jiu-Jitsu for Kids & Adults · Opening Soon in Rowlett, TX"
- Description: "A new Gracie Barra academy in Rowlett, TX. Kids from 4, teens and adults, no experience needed. Founding Members pay $87 every two weeks with no enrollment fee."
- OG com foto da obra/fachada 1200×630.
- `SportsActivityLocation` com nome, endereço, telefone, e-mail, `parentOrganization: Gracie Barra`. **Sem `aggregateRating`** (não há reviews). `openingHoursSpecification` e `foundingDate` só com data confirmada. `FAQPage` só com respostas confirmadas.
- `sitemap.xml` e `robots.txt` conforme o modo (Seção 5).

## 20. DADOS PENDENTES
Fonte provável de várias respostas: **Onboarding Call de 5 out 2026** (Drive, `03. Recordings`).

| # | Item | Status | Responsável | Impacto |
|---|---|---|---|---|
| 1 | Data de abertura e da primeira aula | 🔴 | cliente | contador, carimbo de dias, FAQ 7, schema |
| 2 | Vagas já tomadas no First 50 (`claimed`) | 🔴 | cliente | barra, carimbo, headline do pedido |
| 3 | Limite de vagas da Founding Class | 🔴 | cliente | ingresso II |
| 4 | $87 vale enquanto o membro treinar? | 🔴 | cliente | oferta, pedido |
| 5 | Cobrança no pré-cadastro (sim/não) | 🔴 | cliente | micro do hero, pedido, FAQ 7, form |
| 6 | Contrato, cancelamento, pausa | 🔴 | cliente | FAQ 6 |
| 7 | Preço da família, com número | 🔴 | cliente | FAQ 10, placa "one trip" |
| 8 | Bio do Andre (faixa, linhagem, datas, por que Rowlett, se dá kids/iniciante) | 🔴 | cliente | Coach, posição do Coach |
| 9 | Canal e prazo de confirmação | 🔴 | cliente/Novo Dash | passo 2, sucesso do form |
| 10 | E-mail de boas-vindas existe? | 🟡 | Novo Dash (GHL) | passo 3 |
| 11 | Onde os pais ficam na aula | 🔴 | cliente | Para os pais |
| 12 | Regra teen × adulto no rola | 🟡 | cliente | FAQ 8 |
| 13 | Turma feminina futura (Andre aprova o texto) | 🟡 | cliente | FAQ 9, campo do form |
| 14 | GB2 na legenda sem aula na grade | 🟡 | cliente | horários |
| 15 | Instagram @gbrowlett existe? | 🟡 | cliente | footer |
| 16 | Domínio da LP (gbrowlett.com ou subdomínio) | 🟡 | Novo Dash | SEO, links |
| 17 | Logo SVG da unidade | 🔴 | cliente | nav, pattern, letreiro |
| 18 | Fotos de aula / autorização de outra unidade GB | 🔴 | cliente | programas, pais |
| 19 | B-roll vertical e horizontal | 🟡 | cliente | hero, pedido |
| 20 | Licença AdihausDIN para a unidade | 🟡 | Novo Dash | tipografia |
| 21 | Ponto de referência, estacionamento, cidades vizinhas | 🟡 | cliente | mapa |
| 22 | IDs: pixel, GA4, Ads, Clarity, location, webhook, calendar | 🔴 | Novo Dash | modo client |
| 23 | Texto de consentimento do formulário | 🔴 | Novo Dash/cliente | form, footer |

## 21. CHECKLIST
**Pré:** F0 lida (código, não memory) · prints `ref-*` salvos · inventário de assets triado · `.env.example` criado.
**Durante:** design pass do hero aprovado · nenhum hex fora de `tokens.css` · nenhum texto no TSX · cada seção com o mecanismo da Seção 7 · contagens da grade derivadas do dado · `openTier` em vez de `tiers[0]`.
**Pós:** Lighthouse mobile na régua (Seção 15) · rolagem lenta em 1440 e 390 sem tela vazia · reduced motion revisado · grep `[CONFIRMAR]`/`<Pending` em `client` = zero · `tsc -b` e `npm run build` sem erro · `memory/*.md` atualizados · rodar o **finalizador (ETAPA 3)**.

## 22. TIMELINE
| Dia | Entrega |
|---|---|
| D1 | F0 (referências + prints + triagem de fotos) · F1 Fundação |
| D2 | F2 Átomos · F3 Infra (dados, kit nd, pré-render) · F4 Layout |
| D3 | **Design pass do hero (2–3 direções, parada para o Adryan escolher)** |
| D4 | F5 Seções II–VIII |
| D5 | F5 Seções IX–XII + footer · F6 Composição |
| D6 | F7 Qualidade · prints `gbr-*` · troca para `client` quando as pendências 🔴 fecharem |

---

## ANEXO A — PRESET · GRAND OPENING na identidade Gracie Barra
O arquivo `preset-grand-opening-gb.md` (base: GB Lindale LP v2 + arquitetura da Collective, lido do código em 9 out 2026) **é parte integrante deste PRD**. Copiar para `public/memory/preset-grand-opening-gb.md` no F0 e seguir: §2 tokens, §3 tipografia, §4 triângulo, §5 ritmo de cor, §6 anatomia das seções, §7 componentes, §8 movimento, §9 mobile first, §10 contrato de dados, §11 stack e performance, §12 anti-padrões, §13 checklist de adaptação.

**Ajustes da Rowlett sobre o preset** (registrar em `design-decisions.md`):
1. **Dois** ingressos, com **perk decrescente** (uniforme inteiro → 50%) no lugar de desconto decrescente.
2. Carimbo do hero conta **vagas restantes**; o do ingresso conta **dias até a abertura** (some sem data).
3. Quatro seções a mais (Horários, Para os pais, Sem experiência, Coach), com arquétipos próprios (Seção 7).
4. Sem selo do Google, sem reviews, sem `aggregateRating` (academia nova).
5. Programas em **4** cards (Teens dentro de Adults, como na grade).

### Ajustes registrados durante a execução (F0, 9 out 2026)
Ver `public/memory/design-decisions.md`, seção "Ajustes sobre o PRD". Resumo:
- A pasta `10-08` do Drive **não é obra**: é um ensaio do instrutor (Andre Carepa, de faixa-preta) drilando técnicas num tatame Gracie Barra. Vira a fonte de **hero, programas (adultos), "sem experiência" e coach**. A obra fica inteira na pasta `Obras GB` (fachada com letreiro instalado + salão em drywall).
- A pasta `Obras GB` tem **dois `.MOV` da obra** (IMG_1600, IMG_1601): b-roll do hero existe, mas passa do limite de 10 MB do conector do Drive; precisa chegar por outro caminho (`brand/video/`).
- `Fotos as Brown Belt` são JPGs de câmera de 15 a 46 MB (DSC03912…DSC04030), também acima do limite do conector; idem.
- `6T7A0276.JPG` (câmera) mostra o Andre com uma criança de kimono azul: única foto de criança disponível; candidata a "Para os pais" ou Little Champions.
- `01. Documents` está vazia: sem logo SVG, sem flyer, sem copy no Drive. Logo da unidade segue `[CONFIRMAR]`; usa-se o selo GB da Lindale + "Rowlett, TX".
