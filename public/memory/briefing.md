# briefing.md — GBR-001 · Gracie Barra Rowlett

## Cliente

**Gracie Barra Rowlett** — unidade afiliada Gracie Barra, **ainda não aberta**.
3503 Rowlett Rd, Bldg K, Suite 302, Rowlett, TX 75088 · (945) 385-9359 · info@gbrowlett.com `[CONFIRMAR domínio]`.
Instrutor: **Andre Carepa**, 27 anos de jiu-jitsu. Nas fotos do Drive (pasta `10-08`, 7 out 2026) ele aparece de **faixa-preta** num tatame Gracie Barra; faixa, linhagem e datas continuam `[CONFIRMAR]` por escrito.

Sem site, sem reviews, sem alunos. O que existe: a obra (fachada com letreiro instalado, salão em drywall), o instrutor, a grade de horários e uma oferta de fundação com preço publicado.

## A oferta de fundação

| Grupo | Nome | Preço | Perk | Vagas |
|---|---|---|---|---|
| I | **The First 50** | $87 / 2 semanas · sem taxa de matrícula | uniforme GB **incluído** | 50 · `claimed` `[CONFIRMAR]` |
| II | **The Founding Class** | $87 / 2 semanas · sem taxa de matrícula | **50% off** no uniforme | `[CONFIRMAR limite]` · abre quando o I lota |

Depois da abertura: $107 / 2 semanas + $47 de matrícula. Adultos ilimitado; kids 3 aulas/semana.
O desconto **não** decresce entre os grupos: o **perk** decresce (uniforme inteiro → metade). Permanência do $87 `[CONFIRMAR]`. Cobrança no pré-cadastro `[CONFIRMAR]` (assumido: nada cobrado hoje).
O único número que o cliente mexe é `claimed` em `src/data/site.ts`; barra, carimbo, headline do pedido e modal saem dele.

## Programas e grade

4 cards: Little Champions 1 (4–6) · Little Champions 2 (7–9) · Juniors (10–14) · Adults All Levels (17+, teens 15–16 dentro).
Grade (flyer "Regular Schedule", em texto em `site.ts`): 18 aulas/semana, 10 de adultos (6 AM ter/qui, meio-dia seg/qua/sex, 6:30 PM seg–qui, 11 AM sáb), 3 de LC1, 5 de LC2+Juniors. Ter/qui/sáb com kids e adultos **em sequência**. O flyer cita GB2 e não há aula GB2 na grade: **não publicar** `[CONFIRMAR]`.

## Personas

- **A mãe** (primária, criança 4–14): segurança física, separação por idade, "tap means stop", o professor conhecendo cada família.
- **O adulto que nunca treinou** (25–45): "não estou pronto" → "Nobody gets in shape first", 6 AM e meio-dia, entrar junto com o grupo fundador.
- **A família com agenda apertada**: uma viagem, todo mundo treina.
- Latente: a mulher que quer treinar (sem turma feminina no lançamento; resposta honesta no FAQ).

## Tese

"Ainda não abriu" vira o argumento central: quem entra agora é **fundador** (paga menos, ganha o uniforme, entra numa sala sem panelinha). A obra prova que é real; a contagem regressiva dá prazo. Por isso a **oferta é a 2ª seção**, a obra é a seção "why us", e as duas únicas bandas escuras são a Abertura (contador) e o Pedido.

Tese visual: **equipe atlética no dia da estreia** — uniforme novo, placa de resultado zerada. Branco puro, tinta, vermelho e marinho GB, triângulo medindo tudo, cantos retos, display Cn em caixa alta itálica. Nem dojo escuro, nem o "clube antigo" da Collective, nem template de franquia.

## Estado (9 out 2026)

- F0 concluída: código da Collective e da Lindale v2 lido; 20 prints `prints/ref-*.png` (1440 e 390); 53 fotos do Drive baixadas e triadas (`brand/drive`, fora do git); PRD e preset na raiz.
- Modo **prospect** (`VITE_UX_MODE` ausente): pendências visíveis, webhook `PLACEHOLDER`, tracking desligado, `noindex`.
- F1–F7 concluídas e o finalizador (ETAPA 3) rodado. Hero na direção **B · o ingresso** (escolha do Adryan). Doze seções, formulário de pré-cadastro em 3 passos (webhook PLACEHOLDER em prospect), pré-render da `/`, JS adiado até o poster pintar.
- **Régua (Lighthouse mobile, build local):** prospect → Perf 97 · A11y 100 · BP 100 · SEO 69 (só o `noindex` do modo) · LCP 2,5 s · CLS 0 · TBT 40 ms. Client → **Perf 98 · A11y 100 · BP 100 · SEO 100 · LCP 2,3 s · CLS 0 · TBT 10 ms**. Grep em client: zero `[CONFIRMAR]`, zero `<Pending` renderizados. axe: zero violações reais (as restantes são peças fotografadas no meio da transição).
- Prints de entrega: `prints/gbr-*.png` (cada seção em 1440 e 390, página inteira em 375/390/768/1024/1440, reduced motion, formulário enviado).
- Repositório git local iniciado (`main`), 5 commits (base + 4 fases do finalizador). `dist/` e `brand/` fora do git; `.env.example` versionado.
- 23 pendências do cliente/Novo Dash na tabela §20 do PRD; as 🔴 travam o modo `client` (`npm run build:client`).
- Para rodar: `npm install && npm run dev` · build prospect `npm run build` · build de lançamento `npm run build:client` · imagens `npm run images` (pillow-heif) · fontes `npm run fonts`.
