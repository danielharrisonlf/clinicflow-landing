import { SectionHeading } from '../components/SectionHeading'

/* Personas fictícias. A legenda da seção deixa isso explícito. */
const DEPOIMENTOS = [
  {
    citacao: 'Reduzimos as faltas de 22% para 4% no primeiro mês.',
    nome: 'Helena Duarte',
    papel: 'Gestora de clínica dermatológica',
    iniciais: 'HD',
    antes: '22%',
    depois: '4%',
    medida: 'de faltas',
  },
  {
    citacao: 'A fila no balcão acabou. Vejo quem chegou e há quanto tempo espera sem levantar da cadeira.',
    nome: 'Joana Prado',
    papel: 'Recepcionista de policlínica',
    iniciais: 'JP',
    antes: '31 min',
    depois: '9 min',
    medida: 'de espera média',
  },
  {
    citacao: 'Cancelamento virou encaixe. Minha agenda de terça fechou cheia pela primeira vez no ano.',
    nome: 'Rafael Moura',
    papel: 'Ortopedista',
    iniciais: 'RM',
    antes: '78%',
    depois: '96%',
    medida: 'da agenda ocupada',
  },
] as const

export function Testimonials() {
  return (
    <section aria-labelledby="dep-titulo" className="py-20 md:py-28">
      <div className="mx-auto max-w-[75rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading id="dep-titulo" titulo="O que muda no primeiro mês">
          <p className="text-[1rem]">Cenários ilustrativos de implantação</p>
        </SectionHeading>

        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {DEPOIMENTOS.map((d) => (
            <li key={d.nome} className="flex flex-col rounded-2xl border border-subtle bg-surface p-6 sm:p-7">
              <p className="num flex flex-wrap items-baseline gap-x-2 text-sm text-ink-muted">
                <span className="text-risk line-through decoration-risk/60">{d.antes}</span>
                <span className="font-sans">para</span>
                <span className="text-2xl font-medium tracking-[-0.02em] text-revenue">{d.depois}</span>
                <span className="font-sans">{d.medida}</span>
              </p>
              <blockquote className="mt-5 flex-1 text-lg leading-relaxed text-ink">
                <p>“{d.citacao}”</p>
              </blockquote>
              <footer className="mt-6 flex items-center gap-3 border-t border-subtle pt-5">
                <span
                  aria-hidden="true"
                  className="grid size-10 flex-none place-items-center rounded-full bg-surface-raised text-sm font-medium text-ink-muted"
                >
                  {d.iniciais}
                </span>
                <span>
                  <span className="block text-[0.9375rem] font-medium text-ink">{d.nome}</span>
                  <span className="block text-sm text-ink-muted">{d.papel}</span>
                </span>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
