import { Globe } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'

export default function OutlookSection() {
  return (
    <section id="outlook" className="section-scroll-mt pt-4 pb-0">
      <SectionHeader
        icon={Globe}
        title="Outlook — Applications, Extensions, and Research Frontier"
        summary={
          'The framework developed in this thesis is not specific to soccer. The Greeks — Delta, Theta, ' +
          'Gamma — exist wherever a market prices a time-bounded uncertain outcome that responds to discrete ' +
          'information shocks. This section translates the empirical findings into concrete applications, ' +
          'identifies the sports where the framework should port directly, and flags the structural reasons ' +
          'it would fail elsewhere.'
        }
      />
      {/* Phase 2: Applications */}
      {/* Phase 3: Extensions */}
      {/* Phase 4: Research Frontier + Closer */}
    </section>
  )
}
