import { Globe, Zap, Compass, FlaskConical } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import ChartPanel from '../ui/ChartPanel'
import ApplicationsWorkflow from '../charts/ApplicationsWorkflow'

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
        title="Applications — Where the Findings Activate"
        summary="Each finding activates at a specific point in a match's lifecycle. Click any card to jump to its anchor panel."
      />

      <div className="border border-terminal-border bg-terminal-panel p-4 mb-2">
        <ApplicationsWorkflow />
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

      {/* ── Research Frontier ── */}
      <SectionHeader
        icon={FlaskConical}
        title="Research Frontier — What's Next"
        summary={
          'Three immediate research extensions follow naturally from the framework. ' +
          'Each is constrained by data or computation rather than theory.'
        }
      />

      <ChartPanel
        panelId="O.I"
        title="Panel I — Sub-Second Resolution"
        annotation="Move from minute-level to sub-second event-study estimates."
      >
        <p className="font-sans text-[14px] text-terminal-muted leading-[1.55]">
          The Betfair Stream API captures price updates at sub-second frequency, but the current
          analysis aggregates to minute resolution for tractability. Sub-second resolution would
          sharpen the time-to-equilibrium and overshoot estimates and reveal the within-event
          price-discovery microstructure in detail. The barrier is computational, not
          data-availability — the raw stream is already collected.
        </p>
      </ChartPanel>

      <ChartPanel
        panelId="O.J"
        title="Panel J — Match-Statistic Integration"
        annotation="Disentangle Bayesian updating from tactical-momentum signals."
      >
        <p className="font-sans text-[14px] text-terminal-muted leading-[1.55]">
          Adding real-time match statistics — shot counts, possession percentages, expected goals
          (xG), tactical lineup changes — as controls in the Greek regressions would identify how
          much of empirical Delta comes from pure score-based Bayesian updating versus from soft
          information about match quality and momentum. The residual Delta after these controls
          would be the "pure surprise" component.
        </p>
      </ChartPanel>

      <ChartPanel
        panelId="O.K"
        title="Panel K — Cross-Sport Replication"
        annotation="Test whether the Greek structure is universal or soccer-specific."
      >
        <p className="font-sans text-[14px] text-terminal-muted leading-[1.55]">
          The cleanest test of the framework's generality is replicating the three core hypotheses
          on another sport with similar structure. Hockey is the obvious first port (direct
          structural match); cricket would test the framework against a sport where the Theta
          analog is already in production use (DLS).
        </p>
      </ChartPanel>

      {/* ── Closer ── */}
      <p className="font-sans text-[14px] text-terminal-dim leading-[1.55] mt-6 mb-4">
        The central claim of this work is that soccer betting markets behave like options markets —
        and that the language of derivatives theory captures their structure with quantitative
        precision. The Greeks were never about soccer or stocks specifically; they were about the
        geometry of how prices respond to time, to events, and to the changing context of both.
        Wherever that geometry exists, the framework applies.
      </p>

      <div className="flex justify-end pb-6">
        <span className="font-mono text-[10px] text-terminal-dim tracking-wide">
          END · OUTLOOK · GRKS&lt;GO&gt; · BUILD 2026.04.28
        </span>
      </div>
    </section>
  )
}
