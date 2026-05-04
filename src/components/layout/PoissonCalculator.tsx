import { useState, useDeferredValue } from 'react'
import { Sliders } from 'lucide-react'
import { computeMatchProbs, computeDeltaHome } from '../../lib/poisson'

const LAMBDA_COPY =
  'Λ (lambda) is the expected goals rate — the average goals a team would score over 90 minutes ' +
  'given their attacking strength vs. the opponent\'s defense. A typical Premier League team sits ' +
  'around 1.4–1.6. This is the same idea as xG (expected goals), expressed as a per-match rate ' +
  'that feeds the Poisson process.'

const DEFAULTS = {
  lambdaHome: 1.5, lambdaAway: 1.2,
  minute: 45, homeGoals: 0, awayGoals: 0,
}

interface SliderProps {
  label: string; value: number; min: number; max: number
  step: number; display: string; onChange: (v: number) => void
}

function Slider({ label, value, min, max, step, display, onChange }: SliderProps) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <label className="font-mono text-[10px] text-terminal-dim uppercase tracking-wide">{label}</label>
        <span className="font-mono text-[11px] font-semibold text-terminal-orange">{display}</span>
      </div>
      <input type="range" className="calc-slider" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))} />
    </div>
  )
}

function LambdaInfo() {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-flex items-center">
      <button
        className="w-3.5 h-3.5 rounded-full border border-terminal-dim/60 font-mono text-[8px] font-bold text-terminal-dim flex items-center justify-center hover:border-terminal-cyan hover:text-terminal-cyan transition-colors leading-none"
        onClick={() => setOpen(v => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-label="What is lambda?"
      >
        ?
      </button>
      {open && (
        <div className="absolute left-0 top-5 z-50 w-72 bg-terminal-panel border border-terminal-border p-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          <p className="font-sans text-[11px] text-terminal-muted leading-relaxed">{LAMBDA_COPY}</p>
        </div>
      )}
    </span>
  )
}

interface ProbCardProps { label: string; value: number; accent?: string }

function ProbCard({ label, value, accent = '#666666' }: ProbCardProps) {
  return (
    <div className="border border-terminal-border bg-terminal-bg px-2 sm:px-3 py-2 sm:py-2.5 text-center">
      <p className="font-mono text-[8px] sm:text-[9px] text-terminal-dim mb-0.5 uppercase tracking-wide">{label}</p>
      <p className="font-mono text-base sm:text-xl font-bold tabular leading-none" style={{ color: accent }}>
        {(value * 100).toFixed(1)}%
      </p>
    </div>
  )
}

export default function PoissonCalculator() {
  const [params, setParams] = useState(DEFAULTS)
  const set = (key: keyof typeof DEFAULTS) => (v: number) =>
    setParams(prev => ({ ...prev, [key]: v }))
  const deferred = useDeferredValue(params)

  const probs = computeMatchProbs(
    deferred.lambdaHome, deferred.lambdaAway,
    deferred.minute, deferred.homeGoals, deferred.awayGoals,
  )
  const delta = computeDeltaHome(
    deferred.lambdaHome, deferred.lambdaAway,
    deferred.minute, deferred.homeGoals, deferred.awayGoals,
  )
  const deltaBarWidth = Math.min(100, Math.abs(delta) * 250)

  return (
    <div className="py-4 px-4 lg:px-6">
      {/* Header */}
      <div className="flex items-start gap-2.5 mb-4">
        <div className="flex items-center justify-center w-7 h-7 border border-terminal-border bg-terminal-panel text-terminal-cyan flex-shrink-0">
          <Sliders size={13} strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="font-sans text-base font-bold text-terminal-text">Try the Poisson Model</h2>
          <p className="font-sans text-xs text-terminal-muted mt-0.5">
            Adjust match state to see how in-play win probabilities shift under a Poisson
            goal-scoring process — the theoretical foundation for this thesis's Greek analogies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Controls */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-terminal-dim">λ PARAMETERS</span>
              <LambdaInfo />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Slider label="λ Home" value={params.lambdaHome} min={0.3} max={3.5} step={0.05}
                display={params.lambdaHome.toFixed(2)} onChange={set('lambdaHome')} />
              <Slider label="λ Away" value={params.lambdaAway} min={0.3} max={3.5} step={0.05}
                display={params.lambdaAway.toFixed(2)} onChange={set('lambdaAway')} />
            </div>
          </div>
          <Slider label="Minute" value={params.minute} min={0} max={90} step={1}
            display={`${params.minute}'`} onChange={set('minute')} />
          <div className="grid grid-cols-2 gap-3">
            <Slider label="Home goals" value={params.homeGoals} min={0} max={5} step={1}
              display={String(params.homeGoals)} onChange={set('homeGoals')} />
            <Slider label="Away goals" value={params.awayGoals} min={0} max={5} step={1}
              display={String(params.awayGoals)} onChange={set('awayGoals')} />
          </div>
          <button onClick={() => setParams(DEFAULTS)}
            className="font-mono text-[10px] text-terminal-dim hover:text-terminal-muted transition-colors uppercase tracking-wide">
            [R] RESET DEFAULTS
          </button>
        </div>

        {/* Output */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-0 border border-terminal-border">
            <div className="border-r border-terminal-border"><ProbCard label="Home Win" value={probs.homeWin} accent="#ff8a1a" /></div>
            <div className="border-r border-terminal-border"><ProbCard label="Draw" value={probs.draw} accent="#4ec9ff" /></div>
            <ProbCard label="Away Win" value={probs.awayWin} accent="#666666" />
          </div>

          {/* Delta readout */}
          <div className="border border-terminal-border bg-terminal-bg px-3 py-2.5">
            <div className="flex justify-between items-baseline mb-2">
              <p className="font-mono text-[10px] text-terminal-dim uppercase tracking-wide">
                THEORETICAL Δ (HOME GOAL IMPACT)
              </p>
              <p className="font-mono text-sm font-bold" style={{ color: delta >= 0 ? '#ff8a1a' : '#4ec9ff' }}>
                {delta >= 0 ? '+' : ''}{(delta * 100).toFixed(1)} pp
              </p>
            </div>
            <div className="h-1.5 bg-terminal-border">
              <div className="h-full transition-all duration-200"
                style={{ width: `${deltaBarWidth}%`, background: delta >= 0 ? '#ff8a1a' : '#4ec9ff' }} />
            </div>
            <p className="font-mono text-[9px] text-terminal-dim mt-1.5">
              WIN PROBABILITY CHANGE IF HOME SCORES NOW
            </p>
          </div>

          {/* Score */}
          <div className="border border-terminal-border bg-terminal-bg py-2.5 text-center">
            <span className="font-mono text-2xl font-bold text-terminal-text tabular">
              {params.homeGoals}
            </span>
            <span className="font-mono text-lg text-terminal-dim mx-2">–</span>
            <span className="font-mono text-2xl font-bold text-terminal-text tabular">
              {params.awayGoals}
            </span>
            <p className="font-mono text-[10px] text-terminal-dim mt-0.5">{params.minute}&apos;</p>
          </div>
        </div>
      </div>

      <p className="mt-3 font-mono text-[9px] text-terminal-dim border-t border-terminal-border pt-2 leading-snug">
        <span className="text-terminal-cyan font-semibold">λ NOTE —</span>{' '}{LAMBDA_COPY}
      </p>
    </div>
  )
}
