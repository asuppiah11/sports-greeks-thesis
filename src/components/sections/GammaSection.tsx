import { Zap } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import ChartPanel from '../ui/ChartPanel'
import WorkedExample from '../ui/WorkedExample'
import GammaHeatmap from '../charts/GammaHeatmap'
import GammaGradientChart from '../charts/GammaGradientChart'
import gammaHeatmap from '../../data/gammaHeatmap.json'
import type { GammaHeatmapRow } from '../../types'

export default function GammaSection() {
  const data = gammaHeatmap as GammaHeatmapRow[]

  return (
    <section id="gamma" className="section-scroll-mt pt-4 pb-0">
      <SectionHeader
        icon={Zap}
        title="Gamma — Convexity of Price Response"
        summary={
          'Gamma measures the rate of change of Delta — how much the price sensitivity to a goal ' +
          'itself changes based on game state. High Gamma means that the same event (a goal) produces ' +
          'very different price responses depending on when it happens and what the score is. ' +
          'Late goals in tied matches exhibit the highest Gamma in the dataset: ' +
          'a 75–90 minute equalizer triggers a 2.67× larger price move than an early goal.'
        }
      />

      <WorkedExample>
        <p>Two scenarios, same event:</p>
        <p>
          <span className="text-terminal-text font-medium">Scenario A</span> — A goal is scored at
          minute 20 of a 0–0 match. The market's median price reaction is a Delta of 0.20.
        </p>
        <p>
          <span className="text-terminal-text font-medium">Scenario B</span> — A goal is scored at
          minute 85 of a 0–0 match. The market's median price reaction is a Delta of 0.53.
        </p>
        <p>
          Same event (one goal), same score state (was tied), wildly different reaction. Gamma is
          what captures this — it's the second-order observation that Delta itself depends on context.
          The market isn't just sensitive in late tied matches; it's increasingly sensitive, which is
          what makes those minutes the riskiest for anyone holding a position.
        </p>
      </WorkedExample>

      <ChartPanel
        panelId="Γ.A"
        title="Panel A — Delta by Minute Bin and Score Differential"
        annotation="The market is most reactive when a late goal could still flip the result. Tied matches between minutes 75 and 90 show 2.67× the price response of equivalent goals earlier in the match."
        stats={[
          { label: 'EARLY n',   value: '283' },
          { label: 'LATE n',    value: '220' },
          { label: 'EARLY MED Δ', value: '0.191' },
          { label: 'LATE MED Δ',  value: '0.509',  accent: '#ff8a1a' },
          { label: 'PEAK Δ',    value: '0.531',    accent: '#ff8a1a' },
          { label: 'PEAK CELL', value: '75–90, 0', accent: '#ff8a1a' },
          { label: 'U STATISTIC', value: '22,367' },
          { label: 'P-VALUE',   value: '1.8×10⁻³⁴' },
          { label: 'RATIO',     value: '2.67×',    accent: '#ff8a1a' },
        ]}
        caption={
          'Each cell shows the median absolute price change (Delta) for goals scored in that ' +
          '(minute bin × score differential) combination. Score differential is measured from ' +
          'the scoring team\'s perspective at the moment of the goal (0 = tied, +1 = scoring team ' +
          'already leads, −1 = scoring team trails). ' +
          'Darker orange = larger price response. ' +
          'Cells marked * have n < 10 and are shown at reduced opacity — hover for exact counts. ' +
          'The peak cell (75–90, tied) is outlined.'
        }
      >
        <GammaHeatmap data={data} />
      </ChartPanel>

      <ChartPanel
        panelId="Γ.B"
        title="Panel B — Gamma Gradient: Tied-Match Delta Across Match Time"
        annotation="In tied matches, median Delta rises monotonically from 0.163 (0–15 min) to 0.531 (75–90 min) — a 3.26× increase."
        stats={[
          { label: 'N TIED GOALS', value: '952' },
          { label: '0–15 MIN Δ',   value: '0.163' },
          { label: '75–90 MIN Δ',  value: '0.531', accent: '#ff8a1a' },
          { label: '90+ MIN Δ',    value: '0.693', accent: '#ff8a1a' },
          { label: 'N (0–15)',     value: '87' },
          { label: 'N (75–90)',    value: '114' },
          { label: 'N (90+)',      value: '46' },
          { label: 'INCREASE',     value: '3.26×', accent: '#ff8a1a' },
        ]}
        caption={
          'This panel isolates the score_diff = 0 row from the heatmap and plots it as a time series. ' +
          'The near-linear rise through 75–90 min captures the "Gamma gradient": market sensitivity to a ' +
          'goal in a tied match increases as time pressure mounts. ' +
          'The reference line marks the analytical peak at 75–90 min, excluding the stoppage-time bin.'
        }
      >
        <div className="mb-3 pl-2.5 pr-2 py-1.5 font-mono text-[10px] flex items-start gap-1.5 border-l-[3px] border-l-terminal-orange/50">
          <span className="text-terminal-orange text-[9px] uppercase tracking-widest flex-shrink-0 mt-px font-semibold">NOTE</span>
          <span className="text-terminal-dim leading-snug">
            The 90+ bin (stoppage time, n=46) is shown as a dashed/faded segment and excluded from the analytical peak — high variance due to small sample size.
          </span>
        </div>
        <GammaGradientChart data={data} />
      </ChartPanel>
    </section>
  )
}
