import { Globe, Zap, Compass } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import ChartPanel from '../ui/ChartPanel'

const SPORTS_ROWS = [
  {
    sport: 'HOCKEY (NHL)',
    fit: 'DIRECT PORT',
    fitColor: '#4ec9ff',
    argument: 'Same structure as soccer: discrete low-frequency goals, hard 60-minute clock, OT extension, similar liquidity profile on Betfair. Methodology should transfer with only a goal-rate recalibration.',
    anchor: 'λ ≈ 6 goals/game (vs 2.7 soccer)',
  },
  {
    sport: 'CRICKET (T20/ODI)',
    fit: 'STRONGER FIT',
    fitColor: '#4ade80',
    argument: 'Wickets are textbook discrete shocks. The Duckworth-Lewis-Stern adjustment is essentially a Theta computation already in production use. The over-by-over structure provides a natural discrete-time grid.',
    anchor: 'DLS = production-grade Theta',
  },
  {
    sport: 'NFL',
    fit: 'GOOD FIT',
    fitColor: '#4ec9ff',
    argument: 'Points come in discrete increments (3/6/7/8), creating a richer Delta distribution than soccer\'s binary +1. Hard 4-quarter clock + OT. Existing Win Probability models (nflfastR) lack the Greeks decomposition.',
    anchor: 'Adds Γ to existing WPA framework',
  },
  {
    sport: 'TENNIS',
    fit: 'EDGE CASE',
    fitColor: '#ff8a1a',
    argument: 'No clock, so traditional Theta is undefined. But match progression (sets, games, break points) provides a substitute decay axis. Break-point Delta would be enormous and worth measuring.',
    anchor: 'Break-point Δ as anchor event',
  },
  {
    sport: 'ESPORTS (DOTA/CS2)',
    fit: 'COMMERCIAL FIT',
    fitColor: '#4ec9ff',
    argument: 'Explicit timers, discrete game-changing events (Roshan kills, bomb plants, objective takes), liquid in-play markets, younger demographic. Structurally the closest sport to financial options markets.',
    anchor: 'Closest to options structure',
  },
  {
    sport: 'BASKETBALL',
    fit: 'POOR FIT',
    fitColor: '#f87171',
    argument: 'Possessions are too high-frequency (~100/game) and scoring is near-continuous. Per-event Delta becomes too small for the framework to have analytical bite. Documented limitation, not a flaw of the methodology.',
    anchor: 'Why a sport CAN\'T fit',
  },
]

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

      {/* ── Extensions ── */}
      <SectionHeader
        icon={Compass}
        title="Extensions — Other Sports and Domains"
        summary={
          'The Greeks framework should port directly to any market with a hard time horizon, discrete ' +
          'information shocks, and continuous price discovery. The fit varies by sport based on scoring ' +
          'frequency, time structure, and event discreteness — and one sport is a documented poor fit, ' +
          'which strengthens rather than weakens the framework.'
        }
      />

      {/* Sub-section: Sports structural fit */}
      <div className="border border-terminal-border bg-terminal-panel p-4 mb-2">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-[12px] uppercase tracking-widest text-terminal-dim">
            Sports — Structural Fit
          </span>
          <div className="flex-1 border-t border-terminal-border" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-[11px] border-collapse">
            <thead>
              <tr className="border-b border-terminal-border">
                <th className="text-left py-2 pr-4 text-[9px] uppercase tracking-wide text-terminal-dim w-36">Sport</th>
                <th className="text-left py-2 pr-4 text-[9px] uppercase tracking-wide text-terminal-dim w-32">Fit</th>
                <th className="text-left py-2 pr-4 text-[9px] uppercase tracking-wide text-terminal-dim">Structural Argument</th>
                <th className="text-left py-2 text-[9px] uppercase tracking-wide text-terminal-dim w-44">Key Anchor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-terminal-border">
              {SPORTS_ROWS.map(row => (
                <tr key={row.sport} className="hover:bg-terminal-bg transition-colors">
                  <td className="py-2.5 pr-4 text-terminal-text font-semibold whitespace-nowrap">{row.sport}</td>
                  <td className="py-2.5 pr-4 font-semibold whitespace-nowrap" style={{ color: row.fitColor }}>{row.fit}</td>
                  <td className="py-2.5 pr-4 text-terminal-muted text-[10px] leading-snug">{row.argument}</td>
                  <td className="py-2.5 text-terminal-dim text-[10px] leading-snug">{row.anchor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub-section: Adjacent prediction markets */}
      <div className="flex items-center gap-3 mb-2 mt-4">
        <span className="font-mono text-[12px] uppercase tracking-widest text-terminal-dim">
          Adjacent Prediction Markets
        </span>
        <div className="flex-1 border-t border-terminal-border" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
        <ChartPanel
          panelId="O.E"
          title="Panel E — Political Prediction Markets"
          className="mb-0"
        >
          <p className="font-sans text-[14px] text-terminal-muted leading-[1.55]">
            Polymarket and Kalshi have liquid election and political-event markets with the structural
            ingredients: discrete information shocks (debates, polls, withdrawals), hard expiry
            (election day or resolution date), and continuous pricing. Theta is the time-pressure
            analog. Soft-information embedding should be even more pronounced than in sports.
          </p>
        </ChartPanel>

        <ChartPanel
          panelId="O.F"
          title="Panel F — Climate and Weather Markets"
          className="mb-0"
        >
          <p className="font-sans text-[14px] text-terminal-muted leading-[1.55]">
            Hurricane track contracts, temperature-threshold contracts, and seasonal precipitation
            markets all have hard expiries and discrete shocks (storm formation, threshold crossings).
            Theta is the dominant Greek; Delta arrives in concentrated event clusters.
          </p>
        </ChartPanel>

        <ChartPanel
          panelId="O.G"
          title="Panel G — Pharma Equity around FDA Decisions"
          className="mb-0"
        >
          <p className="font-sans text-[14px] text-terminal-muted leading-[1.55]">
            Stock prices around PDUFA dates exhibit jump-diffusion with a hard expiry — structurally
            closer to standard options pricing than to soccer. The framework's contribution here is
            the empirical methodology for measuring Delta around discrete information events.
          </p>
        </ChartPanel>

        <ChartPanel
          panelId="O.H"
          title="Panel H — Insurance Catastrophe Bonds"
          className="mb-0"
        >
          <p className="font-sans text-[14px] text-terminal-muted leading-[1.55]">
            Cat bonds price the probability of trigger events (earthquakes above magnitude X,
            hurricanes making landfall in zone Y) within a defined coverage period. Delta on news
            of an approaching storm, Theta as the season progresses, Gamma in the peak of
            hurricane season.
          </p>
        </ChartPanel>
      </div>

      {/* Phase 4: Research Frontier + Closer */}
    </section>
  )
}
