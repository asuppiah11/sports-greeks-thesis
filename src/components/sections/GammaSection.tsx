import { Zap } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import ChartPanel from '../ui/ChartPanel'
import GammaHeatmap from '../charts/GammaHeatmap'
import GammaGradientChart from '../charts/GammaGradientChart'
import gammaHeatmap from '../../data/gammaHeatmap.json'
import type { GammaHeatmapRow } from '../../types'

export default function GammaSection() {
  const data = gammaHeatmap as GammaHeatmapRow[]

  return (
    <section id="gamma" className="section-scroll-mt pt-8 pb-4">
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

      <ChartPanel
        panelId="Γ.A"
        title="Panel A — Delta by Minute Bin and Score Differential"
        annotation="Peak market explosiveness: median Δ = 0.531 at 75–90 min in tied matches."
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
        caption={
          'This panel isolates the score_diff = 0 row from the heatmap and plots it as a time series. ' +
          'The near-linear rise through 75–90 min followed by a jump in the 90+ bin captures the ' +
          '"Gamma gradient": market sensitivity to a goal in a tied match increases as time pressure mounts. ' +
          'The 90+ bin (n=46) reflects stoppage-time goals — high Delta but also high variance. ' +
          'The dashed reference line marks the analytical peak at 75–90 min.'
        }
      >
        <GammaGradientChart data={data} />
      </ChartPanel>
    </section>
  )
}
