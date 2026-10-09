# claude-code-rules.md — regras 0.x do PRD-GBR-001, resumidas para sessões futuras

1. **O PRD vence** (`prd-GBR-001.md`); dentro dele a §6 (jornada) vence a ordem e o Anexo A (`preset-grand-opening-gb.md`) vence o visual.
2. **Stack:** Vite · React 19 · TS ~5.9 · Tailwind 4 (`@theme` só para fontes; tokens em CSS puro na classe `.gbr`) · `clsx` + `tailwind-merge` · **sem GSAP, sem motion, sem Lenis**. Movimento = `src/motion/scroll.ts` + `inview.ts` (da Lindale v2).
3. **Nada hardcoded no TSX:** toda copy e todo número em `src/data/site.ts`. Nenhum hex fora de `src/styles/tokens.css`. Escala de 4px. Sem emoji (SVG próprio). Toque ≥ 44px. Fonte self-hosted (nunca `<link>`). Toda foto por `Pic` com width/height do `media.json`. A grade de horários é texto, nunca imagem. Card de programa sempre com foto.
4. **Anti-template:** nenhum componente com cara de biblioteca. Um botão só (`Cta`). Zero Lucide/Heroicons. Proibido "Learn more" / "Submit" / "Get started". Canto reto (`--r: 2px`); a nav é a única exceção (14px).
5. **Um mecanismo por seção** (tabela §7 do PRD). Gestos genéricos: só `Lines` e `.rise`.
6. **Bugs proibidos:** H1/CTA/preço/horários/form com `opacity:0`; acento cortado por máscara; odômetro lido como "0123…9"; decorativo por cima de CTA/preço; sticky > 3,5 telas ou > 30% da página; **nenhum pin**; tela vazia no scroll; hydration mismatch (reduced motion por `html.motion` no `<head>`); texto real em `aria-hidden`; recolhido sem `inert`; fonte < 12px; `alt` que não descreve a foto; código morto; `memory/*.md` desatualizado.
7. **Pendências:** dado que não veio vira `<Pending>` (vermelho sobre `#FEF1F2`), visível em prospect e oculto com `VITE_UX_MODE=client`. Imagem faltando vira `Media` com briefing. **Nunca** placeholder plausível, nunca inventar data, preço de família, vagas tomadas, bio do coach ou review.
8. **Modo prospect/client** (§5): webhook `PLACEHOLDER` não dispara; tracking desligado; `noindex`. Em client: grep de `[CONFIRMAR]` e `<Pending` renderizados = zero.
9. **Segredos:** nenhum ID de webhook, token ou credencial no repo. `.env` fora do git; `.env.example` com chaves vazias.
10. **Marca:** unidade afiliada Gracie Barra. Logo/nome/cores conforme o material da unidade; não inventar selo, slogan ou número da rede. Página em en-US.
11. **Imagem (regra dura):** hero, Programs e Obra sempre com imagem real da unidade; toda seção tem imagem; na falta, placeholder **marcado** `[CONFIRMAR]`.
12. **Oferta:** pré-abertura com preço publicado; não existe aula grátis; o CTA é reserva de vaga de fundador, sem cobrança no ato `[CONFIRMAR]`. Tudo que fala do "grupo atual" lê `openTier`, nunca `tiers[0]`. Contagens da grade derivadas do dado.
13. **Fases:** F0 → F1 → F2 → F3 → F4 → **design pass do hero (parar para o Adryan escolher)** → F5 → F6 → F7 → finalizador (ETAPA 3). Declarar "Iniciando FASE X" / "FASE X concluída". Atualizar `briefing.md`, `design-decisions.md` e este arquivo no fim de cada fase.
14. **Se for escrever algo pela 2ª vez, pare e extraia.**
15. **Assets brutos** (fotos do Drive, TTFs, logos-fonte, vídeos) ficam em `brand/`, fora do git. Derivados publicados em `public/`.
