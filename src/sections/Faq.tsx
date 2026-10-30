import { ChevronDown } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import { EMAIL_CONTATO } from '../lib/links'

const PERGUNTAS = [
  {
    pergunta: 'Em quanto tempo a clínica começa a usar?',
    resposta:
      'Em um dia útil. Importamos a agenda, conectamos o WhatsApp e treinamos a recepção numa chamada de uma hora. No dia seguinte, as confirmações já saem sozinhas.',
  },
  {
    pergunta: 'Consigo migrar os dados da minha planilha?',
    resposta:
      'Sim. Você envia a planilha ou a exportação do sistema atual e nossa equipe importa pacientes e agendamentos. Você confere tudo antes de as mensagens serem ativadas.',
  },
  {
    pergunta: 'Preciso ter o WhatsApp Business oficial?',
    resposta:
      'Não precisa contratar nada antes. Usamos a API oficial do WhatsApp Business e a configuração fica por nossa conta; se quiser, migramos o número que seus pacientes já conhecem.',
  },
  {
    pergunta: 'Como ficam a LGPD e os dados dos pacientes?',
    resposta:
      'Os dados ficam criptografados, com acesso por perfil e registro de quem abriu cada ficha. Assinamos com a clínica o contrato de operador de dados que a LGPD exige.',
  },
  {
    pergunta: 'Posso cancelar quando quiser?',
    resposta:
      'Pode. No plano mensal não há fidelidade nem multa. Seus dados ficam disponíveis para exportação por 90 dias depois do cancelamento.',
  },
  {
    pergunta: 'Como funciona o suporte?',
    resposta: `Atendimento por pessoas, pelo WhatsApp e pelo e-mail ${EMAIL_CONTATO}, em dias úteis das 7h às 20h. Nos primeiros 30 dias, um especialista acompanha os números da sua clínica com você.`,
  },
]

export function Faq() {
  return (
    <section id="perguntas" aria-labelledby="faq-titulo" className="py-20 md:py-28">
      <div className="mx-auto grid max-w-[75rem] gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-8">
        <div>
          <SectionHeading id="faq-titulo" titulo="Perguntas frequentes">
            <p>
              Ficou alguma dúvida? Escreva para{' '}
              <a href={`mailto:${EMAIL_CONTATO}`} className="text-action underline hover:text-ink">
                {EMAIL_CONTATO}
              </a>
              .
            </p>
          </SectionHeading>
        </div>

        <div className="border-t border-subtle">
          {PERGUNTAS.map((item) => (
            <details key={item.pergunta} className="faq group border-b border-subtle">
              <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 rounded-lg py-4 text-left text-[1.0625rem] font-medium text-ink transition-colors duration-150 hover:text-action">
                {item.pergunta}
                <ChevronDown aria-hidden="true" className="faq-chevron size-5 flex-none text-ink-muted" strokeWidth={1.75} />
              </summary>
              <p className="max-w-[62ch] pb-6 pr-10 text-[1rem] leading-relaxed text-ink-muted">{item.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
