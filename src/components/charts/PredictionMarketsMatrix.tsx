interface GreekWeights {
  delta: number
  theta: number
  gamma: number
}

interface CellDef {
  id: string
  market: string
  sub: string
  events: string[]
  dominant: string
  weights: GreekWeights
  examples: string[]
}

// [row][col]: [FAST,DISCRETE] [FAST,CONTINUOUS] / [SLOW,DISCRETE] [SLOW,CONTINUOUS]
const CELLS: [[CellDef, CellDef], [CellDef, CellDef]] = [
  [
    {
      id: 'O.E',
      market: 'POLITICAL EVENTS',
      sub: 'Polymarket / Kalshi',
      events: ['debate, withdrawal', 'poll shifts, endorsements'],
      dominant: 'Δ',
      weights: { delta: 80, theta: 20, gamma: 10 },
      examples: ['TRUMP-2024-NOM', 'FED-CUT-DEC', 'UK-PM-2026'],
    },
    {
      id: 'O.G',
      market: 'PHARMA / FDA',
      sub: 'PDUFA dates',
      events: ['trial readouts', 'approval decisions'],
      dominant: 'Δ + Γ',
      weights: { delta: 60, theta: 30, gamma: 50 },
      examples: ['BIIB ADUHELM', 'MRNA RSV-VAX', 'NVAX 2025-Q3'],
    },
  ],
  [
    {
      id: 'O.H',
      market: 'CAT BONDS',
      sub: 'Hurricane / earthquake',
      events: ['hurricane landfall', 'earthquake trigger'],
      dominant: 'Δ + Θ',
      weights: { delta: 70, theta: 40, gamma: 20 },
      examples: ['RESIDENTIAL-RE-2024', 'FLORIDA-WIND-CAT3+'],
    },
    {
      id: 'O.F',
      market: 'CLIMATE / WX',
      sub: 'Seasonal markets',
      events: ['seasonal precip', 'temp thresholds'],
      dominant: 'Θ',
      weights: { delta: 30, theta: 70, gamma: 20 },
      examples: ['NYC-TEMP-DEC', 'MIA-PRECIP-Q1', 'ENSO-2026'],
    },
  ],
]

function GreekBar({ label, value }: { label: string; value: number }) {
  const filled = Math.round(value / 10)
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-[9px] text-terminal-cyan w-3 leading-none shrink-0">{label}</span>
      <div className="flex gap-px flex-1">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="flex-1 h-[4px]"
            style={{ background: i < filled ? '#4ec9ff' : '#27272a' }}
          />
        ))}
      </div>
      <span className="font-mono text-[9px] text-terminal-dim w-7 text-right leading-none shrink-0">{value}%</span>
    </div>
  )
}

function QuadrantCell({ cell }: { cell: CellDef }) {
  return (
    <div className="bg-terminal-panel p-2.5 flex flex-col gap-1.5">
      {/* Badge + market name */}
      <div className="flex items-start gap-2">
        <span className="font-mono text-[10px] text-terminal-orange border border-terminal-orange/40 bg-[#1a1208] px-1 py-0.5 leading-none flex-shrink-0 mt-px">
          {cell.id}
        </span>
        <div>
          <p className="font-mono text-[11px] font-semibold text-terminal-text uppercase tracking-wide leading-tight">
            {cell.market}
          </p>
          <p className="font-mono text-[9px] text-terminal-dim mt-0.5">{cell.sub}</p>
        </div>
      </div>

      <div className="border-t border-terminal-border" />

      {/* Greek profile bars */}
      <div>
        <p className="font-mono text-[7px] uppercase tracking-widest text-terminal-dim mb-1">GREEK PROFILE</p>
        <div className="space-y-1">
          <GreekBar label="Δ" value={cell.weights.delta} />
          <GreekBar label="Θ" value={cell.weights.theta} />
          <GreekBar label="Γ" value={cell.weights.gamma} />
        </div>
      </div>

      <div className="border-t border-terminal-border" />

      {/* Event types */}
      <div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-terminal-dim mb-0.5">EVENT TYPES</p>
        {cell.events.map(ev => (
          <p key={ev} className="font-mono text-[11px] text-terminal-muted leading-snug">· {ev}</p>
        ))}
      </div>

      {/* Examples */}
      <div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-terminal-dim mb-0.5">EXAMPLES</p>
        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
          {cell.examples.map(ex => (
            <span key={ex} className="font-mono text-[10px] text-terminal-dim leading-snug">{ex}</span>
          ))}
        </div>
      </div>

      {/* Dominant Greek */}
      <div className="border-t border-terminal-border pt-1 mt-auto">
        <span className="font-mono text-[9px] text-terminal-dim uppercase tracking-wide">dominant: </span>
        <span className="font-mono text-[13px] font-bold text-terminal-cyan">{cell.dominant}</span>
      </div>
    </div>
  )
}

export default function PredictionMarketsMatrix() {
  return (
    <div>
      {/* Greek profile explainer */}
      <div className="mb-3 bg-terminal-bg border border-terminal-border px-3 py-2.5 font-mono">
        <p className="text-[7px] uppercase tracking-widest text-terminal-dim mb-1.5">WHAT AM I LOOKING AT?</p>
        <p className="font-sans text-[11px] text-terminal-muted leading-relaxed mb-2">
          Each market's Greek profile shows the relative weight of Δ, Θ, and Γ in driving its price moves:
        </p>
        <div className="space-y-0.5 text-[9px] mb-2">
          <p>
            <span className="text-terminal-cyan font-semibold">Δ Delta</span>
            <span className="text-terminal-dim"> — sensitivity to the underlying state (poll numbers, storm track, trial enrollment)</span>
          </p>
          <p>
            <span className="text-terminal-cyan font-semibold">Θ Theta</span>
            <span className="text-terminal-dim"> — time decay; how much value erodes per unit time as resolution approaches</span>
          </p>
          <p>
            <span className="text-terminal-cyan font-semibold">Γ Gamma</span>
            <span className="text-terminal-dim"> — convexity; how sharply Delta itself reacts to new information shocks</span>
          </p>
        </div>
        <p className="text-[9px] text-terminal-dim leading-snug border-t border-terminal-border pt-2">
          Percentages are heuristic weights, not optimization outputs. They don't sum to 100 because a market can be simultaneously sensitive to multiple Greeks (e.g., a storm-track market is both Δ-driven and Γ-driven near landfall).
        </p>
      </div>

      {/* Axis title row */}
      <div className="flex items-center mb-1">
        <div className="w-24 flex-shrink-0" />
        <p className="font-mono text-[10px] text-terminal-dim uppercase tracking-widest">
          Information Shock Structure
        </p>
      </div>

      {/* Main grid */}
      <div className="flex">
        {/* Y-axis labels */}
        <div className="flex-shrink-0 w-24 flex flex-col">
          {/* Y-axis title */}
          <div className="h-7 flex items-end justify-end pb-1">
            <p className="font-mono text-[8px] text-terminal-dim uppercase tracking-wide text-right leading-none">
              RESOLUTION<br />HORIZON
            </p>
          </div>
          {/* FAST label */}
          <div className="flex-1 flex items-center justify-end pr-3 border-t border-terminal-border">
            <div className="text-right">
              <p className="font-mono text-[9px] text-terminal-muted uppercase tracking-wide font-semibold">FAST ↑</p>
              <p className="font-mono text-[8px] text-terminal-dim">event-driven</p>
              <p className="font-mono text-[8px] text-terminal-dim">days–weeks</p>
            </div>
          </div>
          {/* SLOW label */}
          <div className="flex-1 flex items-center justify-end pr-3 border-t border-terminal-border">
            <div className="text-right">
              <p className="font-mono text-[9px] text-terminal-muted uppercase tracking-wide font-semibold">SLOW ↓</p>
              <p className="font-mono text-[8px] text-terminal-dim">accumulating</p>
              <p className="font-mono text-[8px] text-terminal-dim">months</p>
            </div>
          </div>
        </div>

        {/* Data area */}
        <div className="flex-1">
          {/* Column headers */}
          <div className="grid grid-cols-2 gap-px bg-terminal-border border border-terminal-border border-b-0">
            <div className="bg-terminal-bg px-3 py-1">
              <p className="font-mono text-[9px] text-terminal-dim uppercase tracking-widest">
                ← Discrete <span className="text-terminal-dim/60">(named events)</span>
              </p>
            </div>
            <div className="bg-terminal-bg px-3 py-1">
              <p className="font-mono text-[9px] text-terminal-dim uppercase tracking-widest">
                Continuous → <span className="text-terminal-dim/60">(rolling data)</span>
              </p>
            </div>
          </div>

          {/* Cell rows */}
          {CELLS.map((row, ri) => (
            <div key={ri} className="grid grid-cols-2 gap-px bg-terminal-border border border-terminal-border border-t-0">
              {row.map(cell => (
                <QuadrantCell key={cell.id} cell={cell} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Caption + legend */}
      <p className="mt-3 font-sans text-[13px] text-terminal-dim leading-relaxed border-t border-terminal-border pt-2">
        Each quadrant maps to a different Greek profile. Markets in the upper-left (discrete + fast) are closest to soccer; markets in the lower-right (continuous + slow) are closest to traditional options.
      </p>
      <p className="mt-1.5 font-mono text-[9px] text-terminal-dim tracking-widest">
        <span className="text-terminal-cyan">Δ</span> DELTA &nbsp;·&nbsp;
        <span className="text-terminal-cyan">Θ</span> THETA &nbsp;·&nbsp;
        <span className="text-terminal-cyan">Γ</span> GAMMA
      </p>
    </div>
  )
}
