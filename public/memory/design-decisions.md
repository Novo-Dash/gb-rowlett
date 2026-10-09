# design-decisions.md — GBR-001 · Gracie Barra Rowlett

Lido do **código** das duas referências em 9 out 2026 (os `memory/*.md` delas estão defasados e não foram usados como fonte de mecanismo):

- `COLLECTIVE JIU-JITSU` (CJJ-001): `src/sections/*`, `src/data/site.ts`, `src/nd/*`, `src/components/*`, `index.css`, `index.html`.
- `GB Lindale` v2: `src/v2/**` (sections, ui, motion, styles), `src/data/lp.ts`, `scripts/*`, `index.html`, `main.tsx`/`Root.tsx`/`entry-server.tsx`.

Prints novos, no meio de cada mecanismo, em `prints/ref-*.png` (1440 e 390).

## 1. O que veio da Collective (arquitetura de Grand Opening)

| Herdado | Como entra na Rowlett |
|---|---|
| Oferta em 2º lugar, logo depois do hero | igual |
| Faixas de fundação liberadas em ordem; `claimed` como único número que o cliente mexe; `openTier` em vez de `tiers[0]` | igual, com **dois** ingressos e **perk decrescente** (uniforme inteiro → 50%), não desconto decrescente |
| Ingresso aberto picotado (talão só com o botão); travado borrado com texto em `sr-only` | igual, com o **triângulo marinho** no lugar do cadeado |
| A obra como argumento: cinco fotos reais em fila, hover derruba as vizinhas a 45%, pastilha com a etapa vinda do dado | igual, cinco fotos de `Obras GB` + três placas de "why us" embaixo |
| Contador como única banda escura do corpo; registro em `dl` de 4 colunas | igual, em `--night`, com o `Odo` de rolos da Lindale no lugar do painel de partidas |
| Pedido final em fundo escuro com vagas do grupo aberto na headline, benefícios em coluna única, vídeo vertical 9/16 | igual, em `--navy` + foto a 30% |
| `Pending` visível em prospect / oculto em client; `Media` com briefing no slot vazio; `VideoSlot` forçando mudo pelo ref | igual, em linguagem GB (vermelho sobre `#FEF1F2`) |
| Letreiro em X (duas fitas a ±3°, CSS puro, 6 cópias por metade) | igual |
| Kit `nd/*` (Booking, attribution, webhook, tracking, programs, config, types) | **copiado, não reescrito**; o fluxo de passos é adaptado ao pré-cadastro (ver §6) |
| Mapa apontando para o endereço exato (embed `maps/embed?...pb=`) | igual |

**O que NÃO veio:** papel quente, textura grunge, fio duplo, numeral romano no eyebrow, Big Shoulders/Archivo, `motion`, lazy por seção com fallback de altura, cortina `wipe`.

## 2. O que veio da Lindale v2 (IDV GB + engenharia)

| Herdado | Observação |
|---|---|
| Tokens (branco, tinta, `--red` e irmãos, `--navy`, `--night`), `--r: 2px`, `--u`, `--gutter`, easings | copiados para `src/styles/tokens.css`, escopo `.gbr` |
| AdihausDIN + Cn em subconjunto, fallback Arial com `size-adjust` | woff2 copiados de `public/fonts`; TTFs em `brand/fonts` (fora do git) |
| `.d .h1 .h2 .h3 .body .lead .label .accent` | iguais, com `--t-statement` |
| `scroll.ts` (um rAF, variáveis CSS, sem setState) e `inview.ts` (IO compartilhado, `data-in`) | copiados para `src/motion` |
| `Cta` (canto cortado, degradê, quadrado branco com seta, pulso, brilho, seta dá a volta) | igual; `focus-visible` em `--ink` (tabela 8.9 do PRD) |
| `Eyebrow` (barra `skewX(-12deg)` que cresce), `Lines` (máscara palavra a palavra), `Odo` (rolos, valor final no HTML), `Pic` (manifesto `media.json`) | iguais |
| Duplicado em contorno dos trechos vermelhos (`::after` com `attr(data-text)`) | igual |
| Hero "card no filme": filme sticky, `--k 1→0` abre o card, mordidas triangulares, cena 2 entrando pelos lados | igual; o selo do Google (não existe) dá lugar ao **carimbo de vagas** |
| Nav flutuante (cartão 880px, raio 14px = única exceção ao canto reto, `backdrop-filter`, menu em três cards, some rolando para baixo) | igual; cards Classes / Schedule / Visit |
| Programas em trilho com snap, luz vermelha no card central, cunha triangular na entrada, 01/04 + régua | igual, 4 cards |
| "Como funciona" com a faixa branca no bloco vermelho, palco sticky, rolo de número, tranco a cada grau | igual, com 3 passos (3 graus) |
| FAQ em peças numeradas, aberta vira cartão com barra vermelha, `inert` fechado | igual |
| Footer marinho, mapa P&B com pino triangular e foto da fachada, letreiro em contorno | igual |
| Barra fixa de CTA no celular (some com outro CTA visível ou `html.bk-open`) | igual |
| Pattern fixo único do triângulo a 8,5%, derivando em 90s | igual |
| Pré-render da rota, JS adiado até o poster decodificar (teto 2s), `HydrationReplay` | igual, para a `/` |
| `build-images.py`, `subset-fonts.py`, `fit-lines.py`, `build-og.py`, `prerender.mjs` | copiados e adaptados (HEIC via pillow-heif, saída em `public/img`) |

**O que NÃO veio:** GSAP (a v1), Kids em baralho com polaroid, reviews, vídeos de depoimento, selo do Google, react-router, as rotas secundárias.

## 3. O que é novo na Rowlett (não existe em nenhuma das duas)

| Seção | Arquétipo | Por quê |
|---|---|---|
| **Horários** (V) | quadro de placar: 6 colunas no desktop, lista por dia no celular com o dia de hoje aberto; cada horário é um alvo que abre o formulário com a turma; contagens (18/10/3/5) derivadas do dado | a copy pede a grade em texto e a persona "família com agenda apertada" decide aqui |
| **Para os pais** (VI) | três perguntas em aspas grandes (Cn itálico), resposta com fato físico, foto de kids | objeção da persona primária; não cabe no FAQ |
| **Sem experiência** (VII) | duas colunas need / don't (▲ riscado na "don't"), statement em `--t-statement` | permissão para o adulto travado; o statement é o único momento de display grande entre a obra e o contador |
| **Coach** (VIII) | retrato 4/5 + ficha em `dl` com fios; pendências visíveis | fica em VIII até faixa/linhagem confirmadas; se o cliente confirmar faixa-preta com linhagem, sobe para depois de Programas |

## 4. Ajustes sobre o PRD, decididos no F0

1. **A pasta `10-08` não é obra.** São 41 HEIC + 1 JPG (7 out 2026) do Andre Carepa drilando técnicas com um parceiro num tatame Gracie Barra (parede "GRACIE BARRA", kimonos GB). Vira a fonte de **hero** (IMG_0196 landscape / IMG_0192 portrait), **programas adultos** (IMG_0219, IMG_0224), **sem experiência** (IMG_0213) e **coach** (IMG_0190, faixa-preta com ponteira vermelha visível). Onde foi tirado e se há autorização de uso: `[CONFIRMAR]`. O `alt` descreve o que a foto mostra, não a Rowlett.
2. **A obra está inteira em `Obras GB`**: IMG_0704 (guindaste instalando o letreiro), IMG_0712/IMG_0713 (fachada com "Gracie Barra · Jiu-Jitsu & Self-Defense"), IMG_1602–1607 (salão em drywall, dutos, portas). Cinco entram na fila da seção IV; a fachada vai para Abertura, mapa e OG.
3. **Existe b-roll da obra**: `IMG_1600.MOV` (85 MB) e `IMG_1601.MOV` (77 MB) em `Obras GB`. O conector do Drive limita o download a 10 MB, então não vieram. Enquanto não chegam em `brand/video/`, o hero usa poster (`heroFilm.mp4 = null`, `<Pending>`). O mesmo vale para `Fotos as Brown Belt` (DSC03912…DSC04030, 15–46 MB cada) e para os dois zips.
4. **`6T7A0276.JPG`** (câmera, 3648×5472): Andre com uma criança de kimono azul. É a única foto de criança disponível; entra em **Para os pais** e como foto real de **Little Champions 2**. LC1 e Juniors ficam com foto de aula da **GB Lindale** (`p-kids`, `why-4`), marcadas `[CONFIRMAR autorização GB Lindale]` e com `<Pending>` visível — foto real da rede em vez de Unsplash, porque mantém a identidade e é honesta sobre a origem.
5. **`01. Documents` está vazia** no Drive: sem logo SVG, sem flyer, sem copy. O selo redondo da Lindale **não serve** (o anel diz "Lindale, Texas"); a marca da página é o **triângulo GB puro** (`public/img/gb-mark.svg`, gerado do path de `logo-outline.svg`), em vermelho, com "Gracie Barra · Rowlett, TX" escrito ao lado na nav. Favicons e `logo-112/160` saem dele. `[CONFIRMAR logo da unidade]` continua: o letreiro da fachada usa o lockup oficial "Gracie Barra · Jiu-Jitsu & Self-Defense".
6. **Coach fica em VIII.** A foto mostra faixa-preta, mas o PRD só sobe o Coach com credencial **confirmada por escrito** (faixa + linhagem). Registrar aqui quando subir.
7. **Hero no celular em 9/16** (como a v2), não 4/5: o card ocupa a tela toda e abre até ela; 4/5 deixaria uma faixa sem filme embaixo. O PRD §8.5 fala em 4/5 para o card no celular; o preset §9 (`100lvh` no filme sticky) vence.
8. **Letreiro em X entra**: o hero fecha no card (não transborda), mas o preset diz "só entra se a foto transbordar"; o PRD §6 lista o letreiro como seção. O PRD vence: entra como ritmo entre o hero e a oferta, transparente, sem a foto por baixo.

## 4b. Design pass do hero (parada do PRD, 9 out 2026)

Três direções dentro da gramática GB (card no filme, mordidas triangulares, carimbo de vagas), selecionáveis por `?hero=a|b|c` enquanto a escolha não vem. Depois da escolha, as outras duas saem do código.

| | Direção | O que muda | Força | Risco |
|---|---|---|---|---|
| **a** | **O card** (v2 direta) | conteúdo embaixo à esquerda sobre o filme, branco sobre o véu marinho, carimbo à direita | é a assinatura provada da v2; a foto do Andre toma a tela; H1 enorme | depende do véu para o contraste; no celular o carimbo precisa flutuar acima da copy |
| **b** | **O ingresso** | a copy vive numa placa branca com fio vermelho e canto mordido, encostada na base do card; a foto fica limpa; o carimbo morde o canto da placa | tinta sobre branco (contraste máximo), liga o hero ao objeto da oferta (o ingresso), funciona com qualquer foto | a placa esconde parte do filme; no celular a foto fica em ~35% da tela |
| **c** | **O placar** | coluna branca à esquerda com o título em tinta e um placar de 3 colunas ($87 / $0 / $107 + $47); o card com a foto à direita; no celular o card vai para cima (46svh) e a copy embaixo | a oferta já está na primeira tela como placar; leitura mais "equipe atlética" | o card estreito corta a foto (precisa de corte próprio ou b-roll); no celular o CTA cai abaixo da dobra |

**Escolha do Adryan (9 out 2026): B · o ingresso.** A e C saíram do código. O que fica da B: a foto limpa (véu uniforme a 22%, sem degradê), a placa branca com fio vermelho e canto mordido, o título em tinta, o carimbo mordendo o canto da placa. A cena 2 (o card abrindo até a tela, "No experience / needed." entrando pelos lados) é a mesma.

## 5. Paleta, tipo, movimento

Ver `preset-grand-opening-gb.md` §2, §3, §8. Nenhum hex fora de `src/styles/tokens.css`. Nenhuma terceira cor. Um botão. Um raio (`2px`), uma exceção (nav, 14px). `html.motion` como único portão de movimento; só `transform` / `clip-path` / `opacity` / variáveis CSS.

## 6. Formulário (kit `nd`, adaptado)

O kit chega da Collective sem alterações em `attribution.ts`, `webhook.ts`, `tracking.ts`, `programs.ts`, `types.ts`, `config.ts`, `nd.css`. O que muda é o **fluxo** em `Booking.tsx`: pré-cadastro em 3 passos (quem treina → programa → contato), `leadOnly` sempre, sem calendário (a academia não abriu), payload com `who, programs[], tier, women_interest, cta_origin, page`. Webhook `PLACEHOLDER` em prospect: não dispara e avisa no console.

## 7. Pendências do cliente

A tabela viva é a §20 do `prd-GBR-001.md` (23 itens). Resumo do que trava o modo `client`: data de abertura, `claimed` do First 50, limite da Founding Class, permanência do $87, cobrança no pré-cadastro, contrato/pausa, preço de família, bio do Andre, canal de confirmação, onde os pais ficam, logo SVG, autorização das fotos, IDs do kit, texto de consentimento.
