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
    <section id="delta" className="section-scroll-mt pt-6 pb-2">
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
        panelId="Δ.A"
        title="Panel A — Median Delta by Match Minute"
        annotation="Underdog goals produce 2.01× the price response of favorite goals, and this gap is stable across match minute."
        stats={[
          { label: 'N FAV GOALS',   value: '1,049' },
          { label: 'N UND GOALS',   value: '163' },
          { label: 'FAV MEDIAN Δ',  value: '0.262',        accent: '#4ec9ff' },
          { label: 'FAV 95% CI',    value: '0.247–0.273' },
          { label: 'UND MEDIAN Δ',  value: '0.528',        accent: '#ff8a1a' },
          { label: 'UND 95% CI',    value: '0.489–0.563' },
          { label: 'RATIO',         value: '2.01×',        accent: '#ff8a1a' },
          { label: 'U STATISTIC',   value: '53,883' },
          { label: 'P-VALUE',       value: '4.7×10⁻²¹' },
        ]}
        caption={
          'Each point is the median absolute price change (Delta) for all goals scored in that 15-minute bin. ' +
          'Favorite goals (blue) rise gradually as the match progresses and late goals become more decisive. ' +
          'Underdog goals (orange) show a persistently higher Delta throughout. ' +
          'The 90+ bin reflects stoppage-time goals, which carry extreme informational weight.'
        }
      >
        <DeltaByMinuteChart data={deltaByMinute as DeltaMinuteRow[]} />
        <p className="mt-2 font-mono text-[10px] text-terminal-dim italic">
          * Underdog series begins at 15–30 min bin (n&lt;5 for 0–15 underdog goals in sample).
        </p>
      </ChartPanel>

      <ChartPanel
        panelId="Δ.B"
        title="Panel B — Median Delta by Pre-Goal Odds"
        annotation="Delta scales monotonically with pre-goal odds, from 0.15 for near-certainties to 0.66 for heavy underdogs."
        stats={[
          { label: 'N GOALS',      value: '1,212' },
          { label: 'ODDS 1.0–1.5', value: '0.153  (n=369)' },
          { label: 'ODDS 1.5–2.0', value: '0.255  (n=294)' },
          { label: 'ODDS 2.0–3.0', value: '0.381  (n=294)' },
          { label: 'ODDS 3.0–5.0', value: '0.510  (n=160)', accent: '#ff8a1a' },
          { label: 'ODDS 5.0–10',  value: '0.659  (n=63)',  accent: '#ff8a1a' },
          { label: 'ODDS 10.0+',   value: '0.652  (n=32)',  accent: '#ff8a1a' },
          { label: 'SPREAD',       value: '4.31×',          accent: '#ff8a1a' },
        ]}
        caption={
          'Goals are grouped by the scorer\'s decimal odds at the moment before the goal. ' +
          'The shaded band shows the interquartile range (25th–75th percentile), capturing spread within each bin. ' +
          'The 10.0+ bin has n=32 and a wide IQR, reflecting limited data for extreme longshots. ' +
          'The near-linear relationship between log-odds and Delta is consistent with a Bayesian updating model ' +
          'where larger surprises produce larger revisions.'
        }
      >
        <DeltaByOddsChart data={deltaByOddsBin as DeltaOddsBinRow[]} />
      </ChartPanel>
    </section>
  )
}
