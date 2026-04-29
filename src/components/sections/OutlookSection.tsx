import { Globe, Zap } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import ChartPanel from '../ui/ChartPanel'

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

      {/* ── Applications ── */}
      <SectionHeader
        icon={Zap}
        title="Applications — What This Data Enables"
        summary={
          'Each finding maps to a concrete use case for market participants, exchange operators, or ' +
          'researchers. The applications below are anchored to specific empirical results from the ' +
          'analysis — not theoretical possibilities.'
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
        <ChartPanel
          panelId="O.A"
          title="Panel A — Asymmetric Hedging Engine"
          annotation="Hedge underdog goals roughly twice as hard as favorite goals — symmetric hedging systematically under-protects the larger-tail event."
          stats={[
            { label: 'ANCHOR',    value: 'Δ.A — Delta asymmetry' },
            { label: 'EMPIRICAL', value: '2.01×',               accent: '#ff8a1a' },
            { label: 'P-VALUE',   value: '4.7×10⁻²¹' },
            { label: 'USERS',     value: 'Sportsbooks / MM desks' },
          ]}
          className="mb-0"
        >
          <p className="font-sans text-[14px] text-terminal-muted leading-[1.55]">
            A sportsbook with exchange exposure can configure its hedging engine to overweight short
            positions on underdog scoring scenarios by the empirical 2.01× Delta ratio. Under symmetric
            hedging, the book is structurally underhedged against precisely the events that produce the
            largest price movements.
          </p>
        </ChartPanel>

        <ChartPanel
          panelId="O.B"
          title="Panel B — Automated Draw-Position Decay Rules"
          annotation="Theta isn't constant — the rate at which a draw position bleeds value accelerates 4.5× from the first third to the final third of a 0–0 match."
          stats={[
            { label: 'ANCHOR',     value: 'Θ.A — Hazard params (Grp A)' },
            { label: 'RATE EARLY', value: '1.79×10⁻³ /min' },
            { label: 'RATE LATE',  value: '8.05×10⁻³ /min', accent: '#ff8a1a' },
            { label: 'ACCEL',      value: '4.50×',           accent: '#ff8a1a' },
          ]}
          className="mb-0"
        >
          <p className="font-sans text-[14px] text-terminal-muted leading-[1.55]">
            A trader holding a draw position in a scoreless match can use the fitted exponential{' '}
            <span className="font-mono">P(t) = a·e<sup>(bt)</sup></span> to compute a real-time
            time-decay budget. Liquidation rules trigger when remaining theta exceeds expected
            goal-arrival probability — the position is no longer earning enough optionality to
            justify the decay.
          </p>
        </ChartPanel>

        <ChartPanel
          panelId="O.C"
          title="Panel C — Dynamic Quote-Widening"
          annotation="Tied matches between minutes 75–90 produce 2.67× the price response of equivalent earlier goals — the explosive zone for any market maker."
          stats={[
            { label: 'ANCHOR',        value: 'Γ.A — Gamma heatmap' },
            { label: 'PEAK CELL',     value: '75–90, tied',  accent: '#ff8a1a' },
            { label: 'PEAK Δ',        value: '0.531',        accent: '#ff8a1a' },
            { label: 'RATIO vs EARLY', value: '2.67×',       accent: '#ff8a1a' },
          ]}
          className="mb-0"
        >
          <p className="font-sans text-[14px] text-terminal-muted leading-[1.55]">
            Market makers can configure spread-widening as a function of (match minute, score
            differential), keyed to the empirical Gamma surface. When the state enters the hot
            zone, quotes widen automatically; when it exits, they narrow. The Gamma heatmap is
            itself the lookup table.
          </p>
        </ChartPanel>

        <ChartPanel
          panelId="O.D"
          title="Panel D — Post-Goal Mean-Reversion Strategy"
          annotation="97.75% of goals overshoot the eventual equilibrium price before correcting — a contrarian opportunity in the 30–120s window after a goal."
          stats={[
            { label: 'ANCHOR',    value: 'M.B — Post-goal overshoot' },
            { label: '% POSITIVE', value: '97.75%',  accent: '#ff8a1a' },
            { label: 'MEDIAN OS', value: '0.279' },
            { label: 'FAV/UND',   value: '3.44×',    accent: '#ff8a1a' },
          ]}
          className="mb-0"
        >
          <p className="font-sans text-[14px] text-terminal-muted leading-[1.55]">
            The post-goal price path systematically overshoots before settling. A contrarian
            micro-strategy enters opposite the initial price spike at ~10–30s post-goal and exits
            at ~90–120s. Median overshoot is 0.279; favorite-goal overshoots are 3.4× larger than
            underdog-goal overshoots, suggesting the strategy sizes up specifically around
            favorite goals.
          </p>
        </ChartPanel>
      </div>

      {/* Phase 3: Extensions */}
      {/* Phase 4: Research Frontier + Closer */}
    </section>
  )
}
