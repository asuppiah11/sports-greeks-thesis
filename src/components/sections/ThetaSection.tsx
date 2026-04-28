import { Clock } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import ChartPanel from '../ui/ChartPanel'
import WorkedExample from '../ui/WorkedExample'
import ThetaParamsTable from '../charts/ThetaParamsTable'
import ThetaAccelChart from '../charts/ThetaAccelChart'
import ThetaCurveChart from '../charts/ThetaCurveChart'
import thetaParams from '../../data/thetaParams.json'
import thetaAcceleration from '../../data/thetaAcceleration.json'
import type { ThetaParamsRow, ThetaAccelRow } from '../../types'

export default function ThetaSection() {
  return (
    <section id="theta" className="section-scroll-mt pt-4 pb-0">
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

      <WorkedExample>
        <p>
          Imagine a Champions League knockout match, scoreless at the 75th minute. Both sides need
          a goal to avoid extra time. Early in the match — say in the first 30 minutes — the implied
          probability of a draw rises by roughly 0.18% per minute. By the 75th minute of the same
          scoreless match, that rate has accelerated to about 0.81% per minute — over four times faster.
        </p>
        <p>
          A "draw bet" placed at minute 25 and a "draw bet" placed at minute 75 look identical on
          paper, but the second one is bleeding value four times as fast. Time isn't decaying your
          position linearly; the decay itself accelerates.
        </p>
      </WorkedExample>

      <ChartPanel
        panelId="Θ.A"
        title="Panel A — Exponential Hazard Parameters"
        stats={[
          { label: 'GRP A n',    value: '73' },
          { label: 'GRP B n',    value: '742' },
          { label: 'GRP A a',    value: '0.25311',       accent: '#ff8a1a' },
          { label: 'GRP A b',    value: '0.01053',       accent: '#ff8a1a' },
          { label: 'GRP B b',    value: '0.00153',       accent: '#4ec9ff' },
          { label: 'GRP C b',    value: '−0.02312' },
          { label: 'RATIO b',    value: '6.88×',         accent: '#ff8a1a' },
          { label: 'λ POISSON',  value: '1.160/match' },
        ]}
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
        annotation="Time decay isn't linear. Draw probability rises 4.5× faster in the final 30 minutes of a goalless match than in the opening 30 minutes — the pressure compounds."
        stats={[
          { label: 'GRP A n',      value: '73' },
          { label: 'GRP B n',      value: '386' },
          { label: 'GRP A EARLY θ', value: '1.79×10⁻³' },
          { label: 'GRP A LATE θ',  value: '8.05×10⁻³', accent: '#ff8a1a' },
          { label: 'GRP A RATIO',   value: '4.50×',      accent: '#ff8a1a' },
          { label: 'GRP B RATIO',   value: '3.34×',      accent: '#4ec9ff' },
          { label: 'W STATISTIC',   value: '1,039' },
          { label: 'P-VALUE',       value: '4.1×10⁻¹⁰' },
        ]}
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
        stats={[
          { label: 'GRP A a',    value: '0.25311',   accent: '#ff8a1a' },
          { label: 'GRP A b',    value: '0.01053',   accent: '#ff8a1a' },
          { label: 'GRP A SE(b)', value: '±0.000199' },
          { label: 'GRP A t=0',  value: '0.253/min', accent: '#ff8a1a' },
          { label: 'GRP A t=90', value: '0.653/min', accent: '#ff8a1a' },
          { label: 'GRP B b',    value: '0.00153',   accent: '#4ec9ff' },
          { label: 'GRP B SE(b)', value: '±0.00111' },
          { label: 'DIVERGE AT', value: '~45 MIN' },
        ]}
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
