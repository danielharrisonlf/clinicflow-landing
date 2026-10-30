# ClinicFlow Landing — brief de design e construção

Página pública de conversão do **ClinicFlow: Cockpit Clínico e Resgate de Receita**.
Público: donos e gestores de clínicas médicas no Brasil. Objetivo: converter em
demonstração. Idioma: **pt-BR**. Repositório próprio, deploy estático na Vercel.

## Stack (fixa)

- Vite + React 19 + TypeScript + Tailwind CSS v4 (`@tailwindcss/vite`). pnpm.
- Fontes auto-hospedadas via `@fontsource-variable/geist` e `@fontsource-variable/geist-mono`.
  Nenhuma chamada a serviço externo em runtime (sem Google Fonts, sem analytics).
- Ícones: `lucide-react`, traço único consistente. **Nunca** emoji como ícone.
- Sem bibliotecas de animação. Motion é CSS puro.
- SPA de página única; seções em `src/sections/*.tsx`; lógica da calculadora em
  `src/lib/roi.ts` com testes Vitest.

## Identidade visual

Tema **escuro único** (página de marketing do cockpit; o produto aparece em dark).
Estética: SaaS B2B high-end estilo uitopic.com — bento grid assimétrico, micro-bordas,
respiro generoso, dados em monoespaçada. A página inteira fala a língua do assunto:
**dinheiro e horários** — por isso números grandes em mono são a voz tipográfica.

### Tokens (definir em `@theme` no CSS; nada de cor solta em componente)

| Token | Valor | Papel |
|---|---|---|
| `bg-base` | `#020617` | fundo da página |
| `surface` | `#0F172A` | cards bento |
| `surface-raised` | `#1E293B` | elementos elevados, hover |
| `border-subtle` | `rgba(255,255,255,0.08)` | micro-borda padrão de card |
| `border-strong` | `rgba(255,255,255,0.16)` | card em destaque, controles |
| `ink` | `#E2E8F0` | texto primário (nunca `#FFF` puro) |
| `ink-muted` | `#94A3B8` | texto secundário |
| `ink-faint` | `#64748B` | metadados |
| `revenue` | `#34D399` | dinheiro recuperado, sucesso, pulse verde |
| `action` | `#3B82F6` / hover `#2563EB` | CTAs e links (CTA primário: fundo `#2563EB`, texto branco) |
| `risk` | `#FB7185` | dinheiro perdido, faltas, risco |
| `warn` | `#FBBF24` | risco médio (só em dot/ícone, nunca texto pequeno) |

Contraste: corpo ≥ 4.5:1, texto grande ≥ 3:1, **medido contra a superfície real**.
Elevação no escuro = superfície mais clara + borda, não sombra. Glow: permitido **um**
radial sutil atrás do mockup do hero; em mais nenhum lugar.

### Tipografia

- **Geist Variable**: interface e títulos. Display do hero: 600–700, tracking `-0.03em`,
  tamanho responsivo com teto ~4.5rem. Corpo 16–18px, line-height 1.6, medida ≤ 70ch.
- **Geist Mono**: todo valor monetário, percentual, contagem e horário. `tabular-nums`.
- Caixa-alta com tracking só em dois lugares: o badge do hero e os rótulos das células
  da calculadora/stat cards (11–12px, semibold). Em nenhum outro título.
- Proibido: acentuar uma única palavra do headline com cor/itálico; eyebrow acima de
  título de seção; meta encadeada com ponto médio (`A · B · C`); `→` colado em link.

### Motion

- **Um** momento orquestrado: entrada do hero (headline + mockup, uma vez, ~600ms,
  ease-out exponencial). Sem fade-slide-up repetido por seção.
- Vida contínua permitida só nos **pulse dots** do mockup (verde/âmbar/rosa) e no
  count-up dos números da calculadora ao mudar input.
- `prefers-reduced-motion`: zera tudo (dots estáticos, números sem count-up).
- Hover: mudança de superfície/borda em 150ms; nada de scale/levitação em card.

## Estrutura da página (ordem fixa)

### 1. Header fino
Logomark + "ClinicFlow" à esquerda; âncoras (Funcionalidades, Calculadora, Planos,
Perguntas) e CTA "Começar demonstração" à direita. Fundo translúcido com
`backdrop-blur` ao rolar. No mobile: logomark + CTA, âncoras num menu simples.

### 2. Hero
- Badge-pílula: `O primeiro cockpit clínico com prevenção ativa de no-shows`
- H1 (exato): **Zere os buracos na agenda da sua clínica e recupere até R$ 25.000/mês
  em consultas perdidas.** (o valor "R$ 25.000/mês" em Geist Mono na cor `revenue`
  é a exceção deliberada de destaque — é o número-tese da página)
- Sub: `Automação inteligente de WhatsApp, recepção em tempo real e encaixe dinâmico
  de pacientes. A sua clínica operando com pontualidade cirúrgica.`
- CTA primário: `Começar demonstração gratuita` (micro-linha abaixo: "1 minuto, sem
  cartão"). CTA secundário (ghost): `Ver o cockpit em ação (90s)` — rola até o mockup
  ou abre nada por enquanto (sem vídeo real: âncora para a seção de funcionalidades).
- **Mockup do cockpit = o elemento memorável da página.** Não é screenshot: é uma
  réplica codificada, em miniatura, do Cockpit do Dia — card escuro com micro-borda,
  barra lateral sugerida, 3 stat cells (ex.: `Confirmadas 18/24` dot verde pulsando,
  `Em risco 3` dot rosa, `Na sala de espera 4` com timer mono correndo) e uma linha
  de fila de espera. Um toast aparece uma única vez na entrada: `Encaixe sugerido:
  Marina S. → hoje 14h30`. Legenda discreta sob o mockup: `Dados de demonstração`.

### 3. Calculadora de faturamento perdido (prova de ROI)
Card bento largo, duas colunas (empilha no mobile):
- Inputs (range nativo estilizado + valor em mono editável):
  - `Médicos na clínica` — 1 a 20, padrão 4
  - `Valor médio da consulta` — R$ 100 a R$ 1.000, passo 10, padrão R$ 280
- Saídas, recalculadas a cada mudança (em `src/lib/roi.ts`, testado):
  - consultas/mês = médicos × 12 consultas/dia × 22 dias úteis
  - perdido/mês = consultas/mês × 20% × valor (cor `risk`)
  - **recuperado com ClinicFlow = 80% do perdido** (cor `revenue`, número maior)
- Formato `R$ 12.340` (Intl.NumberFormat pt-BR, sem centavos).
- Linha de honestidade (ink-faint): `Estimativa com média nacional de 20% de faltas,
  12 consultas/dia por profissional e 22 dias úteis.`

### 4. Bento showcase (funcionalidades)
Grid assimétrico (2 cards largos + 2 estreitos no desktop; coluna única no mobile).
Cada card contém um **micro-visual codificado** do recurso, não ícone+parágrafo:
1. **Anti-no-show por WhatsApp** — bolha de conversa com botão "Confirmo ✓" e selo
   `Respondida` ; texto: confirmação em 1 clique, risco recalculado em tempo real.
2. **Sala de espera ao vivo** — mini-card de paciente com timer mono subindo e dot
   âmbar; texto: quem chegou, há quanto tempo, e quem atende.
3. **Patient 360** — linha do tempo vertical de 3 eventos (consulta, exame anexado,
   retorno agendado); texto: histórico unificado e anexos seguros.
4. **Encaixe dinâmico** — duas linhas: consulta cancelada (riscada, rosa) e a sugestão
   entrando no lugar (verde); texto: vaga cancelada vira convite automático à fila.

### 5. Comparação
Tabela de 3 colunas: **ClinicFlow** × Planilhas e agenda de papel × Sistema legado.
Linhas: Confirmação automática por WhatsApp · Encaixe de vaga cancelada · Sala de
espera em tempo real · Histórico do paciente unificado · Implantação (1 dia × — ×
semanas) · Treinamento da recepção (1 hora × — × dias). Célula ClinicFlow com check
emerald; concorrentes com traço/x em ink-faint. No mobile vira cards empilhados.

### 6. Depoimentos (3 cards)
Personas fictícias com métrica tangível, ex.: gestora — `"Reduzimos as faltas de 22%
para 4% no primeiro mês."`; recepção — fila e balcão; médico — agenda cheia.
**Obrigatório**: legenda da seção `Cenários ilustrativos de implantação` (ink-faint,
legível) — a página não inventa clientes reais. Sem fotos de pessoas: avatar de
iniciais.

### 7. Planos
Toggle `Mensal / Anual (-20%)`. Três cards:
- **Consultório Solo** — R$ 149/mês · 1 profissional, agenda + WhatsApp.
- **Clínica em Crescimento** — R$ 349/mês · até 10 profissionais, cockpit completo,
  encaixe dinâmico. Card em destaque (`border-strong`, selo "Mais escolhido").
- **Rede Multiclínica** — Sob consulta · unidades ilimitadas, API e SSO.
Preço em Geist Mono grande; no anual, mostrar o mensal equivalente. Nota ink-faint:
`Preços de lançamento`. CTA em cada card.

### 8. FAQ (accordion acessível, `<details>` ou botão + aria-expanded)
6 perguntas: implantação em quanto tempo; migração dos dados da planilha; precisa de
WhatsApp Business oficial?; LGPD e dados de pacientes; posso cancelar quando quiser?;
como funciona o suporte. Respostas de 2–3 frases, diretas.

### 9. CTA final + garantia
Faixa com H2 curto (`Sua agenda cheia é matemática, não sorte.`), CTA primário
repetido e selo de risco zero: `30 dias de garantia — não reduziu suas faltas,
devolvemos o valor.`

### 10. Footer
Logomark, © 2026 ClinicFlow, link e-mail fictício `contato@clinicflow.app` e a linha:
`Página de demonstração do produto. Depoimentos, números e preços são cenários
ilustrativos.`

## Qualidade (gates antes do commit final)

- `pnpm build` limpo; `pnpm test` (Vitest de `roi.ts`: fórmula, limites, formatação).
- Responsivo real em 390 / 768 / 1440 — sem rolagem horizontal, toque ≥ 44px.
- Teclado: foco visível custom (anel `action`), accordion e toggle operáveis, skip link.
- `lang="pt-BR"`, title `ClinicFlow — Cockpit clínico e resgate de receita`,
  meta description, OpenGraph + Twitter Card. Gere `public/og.png` 1200×630
  capturando o hero com Playwright (o monorepo em `C:\Users\daniellima\Documents\backend`
  já tem Chromium do Playwright instalado — use `pnpm dlx playwright screenshot` ou um
  script rápido); se não der, monte o og.png de outra forma local, sem serviço externo.
- Favicon SVG próprio (logomark: traço de pulso dentro de quadrado arredondado).
- Performance: sem imagem bloqueando LCP (o LCP é o H1), fontes com preload do woff2
  variable, CLS 0 (reservar alturas), JS enxuto. `vercel.json` com `cleanUrls` e
  cache imutável para assets com hash.
- Git: `git init`, commits convencionais pequenos. **Não** criar repo no GitHub nem
  fazer deploy — isso fica fora deste escopo.
