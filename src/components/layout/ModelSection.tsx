import FindingsGlance from './FindingsGlance'
import PoissonCalculator from './PoissonCalculator'

export default function ModelSection() {
  return (
    <section id="calculator" className="section-scroll-mt border-b border-terminal-border">
      <div className="flex flex-col lg:grid lg:grid-cols-12">
        {/* Left: KPI horizontal strips */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-terminal-border">
          <FindingsGlance />
        </div>
        {/* Right: Poisson interactive */}
        <div className="lg:col-span-8">
          <PoissonCalculator />
        </div>
      </div>
    </section>
  )
}
