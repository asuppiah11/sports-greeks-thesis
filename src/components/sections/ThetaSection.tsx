import { Clock } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import ChartPanel from '../ui/ChartPanel'
import ThetaParamsTable from '../charts/ThetaParamsTable'
import ThetaAccelChart from '../charts/ThetaAccelChart'
import ThetaCurveChart from '../charts/ThetaCurveChart'
import thetaParams from '../../data/thetaParams.json'
import thetaAcceleration from '../../data/thetaAcceleration.json'
import type { ThetaParamsRow, ThetaAccelRow } from '../../types'

export default function ThetaSection() {
  return (
    <section id="theta" className="section-scroll-mt pt-8 pb-4">
      <SectionHeader
        icon={Clock}
        title="Theta — Time Decay in Scoreless Intervals"
        summary={
          'Theta measures how quickly the implied probability of a goal changes as time elapses in ' +
          'a scoreless interval. In options theory, Theta is the time-decay of an option\'s value. ' +
          'In soccer betting, it captures a non-linear acceleration: as a 0-0 period extends into ' +
          'its final third, the market revises draw probability upward at an accelerating rate.'
        }
      />

      <ChartPanel
        panelId="Θ.A"
        title="Panel A — Exponential Hazard Parameters"
        caption={
          'Fitted parameters from P(Δ in [t, t+dt]) = a·e^(bt)·dt estimated via non-linear least squares ' +
          'on per-match scoreless-interval data. Group A (pure 0-0 matches) shows a steeper ' +
          'positive b coefficient than Group B (pre-first-goal segments), reflecting faster acceleration. ' +
          'Group C (level-score, ≥1 goal each) has b < 0 — draw probability declines as more time passes ' +
          'at level score, consistent with increasing game pace.'
        }
      >
        <ThetaParamsTable data={thetaParams as ThetaParamsRow[]} />
      </ChartPanel>

      <ChartPanel
        panelId="Θ.B"
        title="Panel B — Early vs. Final-Third Theta (Wilcoxon Signed-Rank)"
        annotation="Draw probability rises 4.50× faster in the final third of pure 0-0 matches, and 3.34× faster in pre-first-goal segments (both p ≈ 0)."
        caption={
          'For each match segment, Theta was estimated for the first two-thirds of the scoreless interval ' +
          '(Early) and the final third (Late). Rates are multiplied by 10³ for readability. ' +
          'The acceleration ratio (Late/Early) confirms a significant, non-linear increase in goal-scoring ' +
          'urgency near the end of each period — consistent with the theoretical prediction of an ' +
          'accelerating draw-probability curve.'
        }
      >
        <ThetaAccelChart data={thetaAcceleration as ThetaAccelRow[]} />
      </ChartPanel>

      <ChartPanel
        panelId="Θ.C"
        title="Panel C — Fitted Exponential Curves P(t) = a · e^(bt)"
        annotation="Group A's curve rises steeply from ≈0.25 to ≈0.65 over 90 minutes; Group B rises gently from ≈0.30 to ≈0.34."
        caption={
          'Curves computed from the fitted parameters in Panel A. ' +
          'Group A (orange, solid) represents matches that remained goalless throughout — ' +
          'as the full 90 minutes elapses without a goal, the instantaneous goal probability rises sharply. ' +
          'Group B (blue, dashed) covers pre-first-goal segments across all match types — the curve is ' +
          'shallower because many of these segments end early. ' +
          'The divergence between the two curves illustrates context-dependence: a truly goalless match ' +
          'produces far stronger time-pressure than a segment that might end at any minute.'
        }
      >
        <ThetaCurveChart params={thetaParams as ThetaParamsRow[]} />
      </ChartPanel>
    </section>
  )
}
