import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { Calculator } from './sections/Calculator'
import { Features } from './sections/Features'
import { Comparison } from './sections/Comparison'
import { Testimonials } from './sections/Testimonials'
import { Pricing } from './sections/Pricing'
import { Faq } from './sections/Faq'
import { FinalCta } from './sections/FinalCta'
import { Footer } from './sections/Footer'

export function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-lg bg-action-strong font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:px-4 focus:py-3"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <Calculator />
        <Features />
        <Comparison />
        <Testimonials />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
