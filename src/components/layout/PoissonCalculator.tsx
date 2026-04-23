import { useState, useDeferredValue } from 'react'
import { Sliders } from 'lucide-react'
import { computeMatchProbs, computeDeltaHome } from '../../lib/poisson'

const DEFAULTS = {
  lambdaHome: 1.5,
  lambdaAway: 1.2,
  minute: 45,
  homeGoals: 0,
  awayGoals: 0,
}

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  display: string
  onChange: (v: number) => void
}

function Slider({ label, value, min, max, step, display, onChange }: SliderProps) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <label className="text-xs font-medium text-gray-600">{label}</label>
        <span className="text-xs font-mono font-semibold text-gray-900">{display}</span>
      </div>
      <input
        type="range"
        className="calc-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
      />
    </div>
  )
}

interface ProbCardProps {
  label: string
  value: number
  accent?: string
  sub?: string
}

function ProbCard({ label, value, accent = '#6B7280', sub }: ProbCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg px-4 py-3 text-center">
      <p className="text-xs text-gray-500 mb-0.5 font-medium">{label}</p>
      <p className="text-2xl font-bold font-mono leading-none" style={{ color: accent }}>
        {(value * 100).toFixed(1)}%
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function PoissonCalculator() {
  const [params, setParams] = useState(DEFAULTS)

  const set = (key: keyof typeof DEFAULTS) => (v: number) =>
    setParams(prev => ({ ...prev, [key]: v }))

  const deferred = useDeferredValue(params)

  const probs = computeMatchProbs(
    deferred.lambdaHome,
    deferred.lambdaAway,
    deferred.minute,
    deferred.homeGoals,
    deferred.awayGoals,
  )

  const delta = computeDeltaHome(
    deferred.lambdaHome,
    deferred.lambdaAway,
    deferred.minute,
    deferred.homeGoals,
    deferred.awayGoals,
  )

  const deltaBarWidth = Math.min(100, Math.abs(delta) * 250)

  return (
    <section id="calculator" className="section-scroll-mt py-10 border-t border-gray-100">
      <div className="max-w-3xl">
        {/* Section header */}
        <div className="flex items-start gap-3 mb-6">
          <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center bg-syracuse-navy/10">
            <Sliders size={16} className="text-syracuse-navy" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 leading-tight">
              Try the Poisson Model
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Adjust match state to see how in-play win probabilities shift under a Poisson
              goal-scoring process — the theoretical foundation for this thesis's Greek analogies.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Slider
                label="λ Home (goals/90)"
                value={params.lambdaHome}
                min={0.3}
                max={3.5}
                step={0.05}
                display={params.lambdaHome.toFixed(2)}
                onChange={set('lambdaHome')}
              />
              <Slider
                label="λ Away (goals/90)"
                value={params.lambdaAway}
                min={0.3}
                max={3.5}
                step={0.05}
                display={params.lambdaAway.toFixed(2)}
                onChange={set('lambdaAway')}
              />
            </div>

            <Slider
              label="Minute"
              value={params.minute}
              min={0}
              max={90}
              step={1}
              display={`${params.minute}'`}
              onChange={set('minute')}
            />

            <div className="grid grid-cols-2 gap-4">
              <Slider
                label="Home goals"
                value={params.homeGoals}
                min={0}
                max={5}
                step={1}
                display={String(params.homeGoals)}
                onChange={set('homeGoals')}
              />
              <Slider
                label="Away goals"
                value={params.awayGoals}
                min={0}
                max={5}
                step={1}
                display={String(params.awayGoals)}
                onChange={set('awayGoals')}
              />
            </div>

            <button
              onClick={() => setParams(DEFAULTS)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline-offset-2 hover:underline"
            >
              Reset to defaults
            </button>
          </div>

          {/* Output */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2">
              <ProbCard label="Home win" value={probs.homeWin}    accent="#F76900" />
              <ProbCard label="Draw"     value={probs.draw}       accent="#000E54" />
              <ProbCard label="Away win" value={probs.awayWin}    accent="#6B7280" />
            </div>

            {/* Delta readout */}
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <div className="flex justify-between items-baseline mb-2">
                <p className="text-xs font-medium text-gray-600">
                  Theoretical Δ (home goal impact)
                </p>
                <p
                  className="text-sm font-bold font-mono"
                  style={{ color: delta >= 0 ? '#F76900' : '#000E54' }}
                >
                  {delta >= 0 ? '+' : ''}{(delta * 100).toFixed(1)} pp
                </p>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{
                    width: `${deltaBarWidth}%`,
                    background: delta >= 0 ? '#F76900' : '#000E54',
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                If home scores now, their win probability changes by this amount.
              </p>
            </div>

            {/* Score display */}
            <div className="text-center py-1">
              <span className="text-3xl font-bold font-mono text-gray-800">
                {params.homeGoals}
              </span>
              <span className="text-xl text-gray-400 mx-2">–</span>
              <span className="text-3xl font-bold font-mono text-gray-800">
                {params.awayGoals}
              </span>
              <p className="text-xs text-gray-400 mt-0.5">{params.minute}&apos;</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
