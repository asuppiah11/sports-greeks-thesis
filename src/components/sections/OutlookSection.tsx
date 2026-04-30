import { Globe, Zap, Compass, FlaskConical } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import ApplicationsWorkflow from '../charts/ApplicationsWorkflow'
import PredictionMarketsMatrix from '../charts/PredictionMarketsMatrix'

const FRONTIER_ROWS = [
  {
    id: 'O.I',
    extension: 'SUB-SECOND RESOLUTION',
    constraint: 'Computational, not data',
    payoff: 'Sharper TTE/overshoot estimates; reveals within-event price-discovery microstructure',
  },
  {
    id: 'O.J',
    extension: 'MATCH-STATISTIC INTEGRATION',
    constraint: 'Data alignment / xG access',
    payoff: 'Decomposes Δ into Bayesian-update vs. soft-information components',
  },
  {
    id: 'O.K',
    extension: 'CROSS-SPORT REPLICATION',
    constraint: 'Sport-specific data deals',
    payoff: 'Tests universality of the Greek structure (hockey first, then cricket)',
  },
]

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
        summary="The framework is not specific to soccer — it applies wherever a market prices a time-bounded outcome with discrete information shocks. This tab maps the empirical findings to applications, extensions, and open questions."
      />

      {/* ── Applications ── */}
      <SectionHeader
        icon={Zap}
        title="Applications — Where the Findings Activate"
        summary="Each finding activates at a specific point in the match lifecycle — click any card to jump to its anchor panel."
      />

      <div className="border border-terminal-border bg-terminal-panel p-4 mb-2">
        <ApplicationsWorkflow />
      </div>

      {/* ── Extensions ── */}
      <SectionHeader
        icon={Compass}
        title="Extensions — Other Sports and Domains"
        summary="The framework ports to any market with discrete shocks and a hard time horizon — the tables below map six sports by structural fit and four adjacent markets by Greek profile."
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

      <div className="border border-terminal-border bg-terminal-panel p-4 mb-2">
        <PredictionMarketsMatrix />
      </div>

      {/* ── Research Frontier ── */}
      <SectionHeader
        icon={FlaskConical}
        title="Research Frontier — What's Next"
        summary="Three immediate extensions, each constrained by data or computation rather than theory."
      />

      <div className="border border-terminal-border bg-terminal-panel p-4 mb-2">
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-[11px] border-collapse">
            <thead>
              <tr className="border-b border-terminal-border">
                <th className="text-left py-2 pr-4 text-[9px] uppercase tracking-wide text-terminal-dim w-10">ID</th>
                <th className="text-left py-2 pr-4 text-[9px] uppercase tracking-wide text-terminal-dim w-52">Extension</th>
                <th className="text-left py-2 pr-4 text-[9px] uppercase tracking-wide text-terminal-dim w-44">Constraint</th>
                <th className="text-left py-2 text-[9px] uppercase tracking-wide text-terminal-dim">Expected Payoff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-terminal-border">
              {FRONTIER_ROWS.map(row => (
                <tr key={row.id} className="hover:bg-terminal-bg transition-colors">
                  <td className="py-2.5 pr-4 font-semibold text-terminal-orange">{row.id}</td>
                  <td className="py-2.5 pr-4 text-terminal-text font-semibold">{row.extension}</td>
                  <td className="py-2.5 pr-4 text-terminal-dim text-[10px]">{row.constraint}</td>
                  <td className="py-2.5 text-terminal-muted text-[10px] leading-snug">{row.payoff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
          END · OUTLOOK · GRKS&lt;GO&gt; · BUILD 2026.04.30
        </span>
      </div>
    </section>
  )
}
