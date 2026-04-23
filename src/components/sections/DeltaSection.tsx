import { TrendingUp } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import ChartPanel from '../ui/ChartPanel'
import DeltaByMinuteChart from '../charts/DeltaByMinuteChart'
import DeltaByOddsChart from '../charts/DeltaByOddsChart'
import deltaByMinute from '../../data/deltaByMinute.json'
import deltaByOddsBin from '../../data/deltaByOddsBin.json'
import type { DeltaMinuteRow, DeltaOddsBinRow } from '../../types'

export default function DeltaSection() {
  return (
    <section id="delta" className="section-scroll-mt pt-16 pb-8">
      <SectionHeader
        icon={TrendingUp}
        title="Delta — Price Sensitivity to Goals"
        summary={
          'Delta (Δ) measures how much a betting market price shifts after a goal. ' +
          'A goal scored by a 5.0-odds underdog conveys far more information than one by a ' +
          '1.2-odds favorite, so the market re-prices more aggressively. ' +
          'The panels below quantify this asymmetry across match time and pre-goal odds.'
        }
      />

      <ChartPanel
        title="Panel A — Median Delta by Match Minute"
        annotation="Underdog goals produce 2.01× the price response of favorite goals, and this gap is stable across match minute."
        caption={
          'Each point is the median absolute price change (Delta) for all goals scored in that 15-minute bin. ' +
          'Favorite goals (gray) rise gradually as the match progresses and late goals become more decisive. ' +
          'Underdog goals (teal) show a persistently higher Delta throughout. ' +
          'The 90+ bin reflects stoppage-time goals, which carry extreme informational weight.'
        }
      >
        <DeltaByMinuteChart data={deltaByMinute as DeltaMinuteRow[]} />
        <p className="mt-3 text-xs text-gray-400 italic">
          * Underdog series begins at 15–30 min bin (n&lt;5 for 0–15 underdog goals in sample).
        </p>
      </ChartPanel>

      <ChartPanel
        title="Panel B — Median Delta by Pre-Goal Odds"
        annotation="Delta scales monotonically with pre-goal odds, from 0.15 for near-certainties to 0.66 for heavy underdogs."
        caption={
          'Goals are grouped by the scorer\'s decimal odds at the moment before the goal. ' +
          'The shaded band shows the interquartile range (25th–75th percentile), capturing spread within each bin. ' +
          'The 10.0+ bin has n=20 and a wide IQR, reflecting limited data for extreme longshots. ' +
          'The near-linear relationship between log-odds and Delta is consistent with a Bayesian updating model ' +
          'where larger surprises produce larger revisions.'
        }
      >
        <DeltaByOddsChart data={deltaByOddsBin as DeltaOddsBinRow[]} />
      </ChartPanel>
    </section>
  )
}
