import { Activity } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import ChartPanel from '../ui/ChartPanel'
import ReactionSpeedChart from '../charts/ReactionSpeedChart'
import OverreactionChart from '../charts/OverreactionChart'
import CalibrationChart from '../charts/CalibrationChart'
import reactionSpeed from '../../data/reactionSpeed.json'
import overreaction from '../../data/overreaction.json'
import favoriteLongshotBias from '../../data/favoriteLongshotBias.json'
import type { ReactionSpeedRow, OverreactionRow, CalibrationRow } from '../../types'

export default function MarketSection() {
  return (
    <section id="market" className="section-scroll-mt pt-6 pb-2">
      <SectionHeader
        icon={Activity}
        title="Market Behavior — Efficiency, Speed, and Bias"
        summary={
          'Beyond the Greeks, three additional market properties are examined: ' +
          'how quickly prices reach post-goal equilibrium (reaction speed), ' +
          'whether markets systematically overshoot (overreaction), ' +
          'and whether kickoff prices are well-calibrated to actual outcomes.'
        }
      />

      <ChartPanel
        panelId="M.A"
        title="Panel A — Time-to-Equilibrium by League and Event Type"
        annotation="Markets reach post-goal equilibrium in a median of 102 seconds. No significant league differences (Kruskal-Wallis p = 0.332)."
        stats={[
          { label: 'N GOALS',     value: '1,372' },
          { label: 'N FAVORITE',  value: '1,186' },
          { label: 'N UNDERDOG',  value: '187' },
          { label: 'MEDIAN TTE',  value: '102s' },
          { label: 'FAV MEDIAN',  value: '97s',   accent: '#4ec9ff' },
          { label: 'UND MEDIAN',  value: '161s',  accent: '#ff8a1a' },
          { label: 'UND/FAV',     value: '1.66×', accent: '#ff8a1a' },
          { label: 'KW P-VALUE',  value: '0.332' },
        ]}
        caption={
          'Time-to-equilibrium (TTE) is defined as the time from a goal until the price stabilizes ' +
          'within a 5% band of its final post-event level. ' +
          'Underdog goals (orange) take substantially longer to resolve than favorite goals (blue) ' +
          'across all leagues — consistent with greater uncertainty about the new equilibrium price. ' +
          'The dashed line marks the overall median (102s). ' +
          'The absence of inter-league differences suggests these dynamics are not league-specific but ' +
          'reflect structural features of in-play market microstructure.'
        }
      >
        <ReactionSpeedChart data={reactionSpeed as ReactionSpeedRow[]} />
      </ChartPanel>

      <ChartPanel
        panelId="M.B"
        title="Panel B — Post-Goal Overshoot by Event Type"
        annotation="97.75% of goals exhibit post-goal overshoot. Favorite goals paradoxically overshoot more than underdog goals — consistent with representativeness bias."
        stats={[
          { label: 'N ALL',         value: '1,266' },
          { label: 'N FAVORITE',    value: '1,114' },
          { label: 'N UNDERDOG',    value: '152' },
          { label: 'ALL OVERSHOOT', value: '0.279' },
          { label: 'FAV OVERSHOOT', value: '0.306',  accent: '#4ec9ff' },
          { label: 'UND OVERSHOOT', value: '0.089',  accent: '#ff8a1a' },
          { label: 'FAV/UND',       value: '3.44×',  accent: '#ff8a1a' },
          { label: '% POSITIVE',    value: '97.75%' },
        ]}
        caption={
          'Overshoot is defined as the maximum price deviation beyond the final post-event equilibrium, ' +
          'expressed as a fraction of the total price move. A value of 0.30 means the market moved ' +
          '30% further than the final settled level before correcting back. ' +
          'Error bars show 95% bootstrap confidence intervals. ' +
          'The higher overshoot for favorite goals (0.306 vs. 0.089 for underdogs) suggests ' +
          'that bettors over-extrapolate from a familiar outcome (the favorite extending its lead), ' +
          'while the genuine surprise of an underdog goal is priced more conservatively.'
        }
      >
        <OverreactionChart data={overreaction as OverreactionRow[]} />
      </ChartPanel>

      <ChartPanel
        panelId="M.C"
        title="Panel C — Calibration at Kickoff (Favorite-Longshot Bias Test)"
        annotation="χ² = 1.62, p = 0.805 — Betfair exchange prices at kickoff are well-calibrated. No favorite-longshot bias detected."
        stats={[
          { label: 'N MATCHES',   value: '791' },
          { label: 'BINS',        value: '5' },
          { label: 'DEG FREEDOM', value: '4' },
          { label: 'METHOD',      value: 'Hosmer-Lemeshow' },
          { label: 'CHI-SQUARED', value: '1.62' },
          { label: 'CRITICAL χ²', value: '9.49 (α=0.05)' },
          { label: 'P-VALUE',     value: '0.805',      accent: '#4ade80' },
          { label: 'VERDICT',     value: 'CALIBRATED', accent: '#4ade80' },
        ]}
        caption={
          'Kickoff prices are converted to implied win probabilities and compared against actual ' +
          'match outcomes across five probability bins. Error bars show ±1.96×SE. ' +
          'The dashed line represents perfect calibration (implied prob = actual rate). ' +
          'All five bins lie close to the diagonal, and the Hosmer-Lemeshow χ² test fails to reject ' +
          'calibration (p=0.805). The Betfair exchange — as a prediction market rather than a bookmaker — ' +
          'appears to aggregate information efficiently at match start, consistent with the ' +
          'semi-strong form of the Efficient Market Hypothesis for pre-match prices.'
        }
      >
        <CalibrationChart data={favoriteLongshotBias as CalibrationRow[]} />
      </ChartPanel>
    </section>
  )
}
