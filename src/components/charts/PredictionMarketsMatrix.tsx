interface CellDef {
  id: string
  market: string
  sub: string
  events: [string, string]
  dominant: string
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
    },
    {
      id: 'O.G',
      market: 'PHARMA / FDA',
      sub: 'PDUFA dates',
      events: ['trial readouts', 'approval decisions'],
      dominant: 'Δ + Γ',
    },
  ],
  [
    {
      id: 'O.H',
      market: 'CAT BONDS',
      sub: 'Hurricane / earthquake',
      events: ['hurricane landfall', 'earthquake trigger'],
      dominant: 'Δ + Θ',
    },
    {
      id: 'O.F',
      market: 'CLIMATE / WX',
      sub: 'Seasonal markets',
      events: ['seasonal precip', 'temp thresholds'],
      dominant: 'Θ',
    },
  ],
]

function QuadrantCell({ cell }: { cell: CellDef }) {
  return (
    <div className="bg-terminal-panel p-3 flex flex-col min-h-[180px]">
      {/* Badge + market name */}
      <div className="flex items-start gap-2 mb-2">
        <span className="font-mono text-[10px] text-terminal-orange border border-terminal-orange/40 bg-[#1a1208] px-1 py-0.5 leading-none flex-shrink-0 mt-px">
          {cell.id}
        </span>
        <div>
          <p className="font-mono text-[11px] font-semibold text-terminal-text uppercase tracking-wide leading-tight">
            {cell.market}
          </p>
          <p className="font-mono text-[10px] text-terminal-dim mt-0.5">{cell.sub}</p>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-terminal-border mb-2" />

      {/* Trigger events */}
      <div className="flex-1 space-y-1">
        {cell.events.map(ev => (
          <p key={ev} className="font-mono text-[10px] text-terminal-muted leading-snug">
            · {ev}
          </p>
        ))}
      </div>

      {/* Dominant Greek — the thesis line */}
      <div className="border-t border-terminal-border mt-2 pt-2">
        <span className="font-mono text-[10px] text-terminal-dim uppercase tracking-wide">dominant: </span>
        <span className="font-mono text-[13px] font-bold text-terminal-cyan">{cell.dominant}</span>
      </div>
    </div>
  )
}

export default function PredictionMarketsMatrix() {
  return (
    <div>
      {/* Axis title row */}
      <div className="flex items-center mb-1">
        <div className="w-28 flex-shrink-0" />
        <p className="font-mono text-[10px] text-terminal-dim uppercase tracking-widest">
          Information Shock Structure
        </p>
      </div>

      {/* Main grid */}
      <div className="flex">
        {/* Y-axis labels */}
        <div className="flex-shrink-0 w-28 flex flex-col">
          {/* Y-axis title */}
          <div className="h-8 flex items-end pb-1">
            <p className="font-mono text-[10px] text-terminal-dim uppercase tracking-widest"
               style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              Resolution Horizon
            </p>
          </div>
          {/* FAST label */}
          <div className="flex-1 flex items-center justify-end pr-3 border-t border-terminal-border">
            <div className="text-right">
              <p className="font-mono text-[10px] text-terminal-muted uppercase tracking-wide font-semibold">FAST ↑</p>
              <p className="font-mono text-[9px] text-terminal-dim">event-driven</p>
              <p className="font-mono text-[9px] text-terminal-dim">days–weeks</p>
            </div>
          </div>
          {/* SLOW label */}
          <div className="flex-1 flex items-center justify-end pr-3 border-t border-terminal-border">
            <div className="text-right">
              <p className="font-mono text-[10px] text-terminal-muted uppercase tracking-wide font-semibold">SLOW ↓</p>
              <p className="font-mono text-[9px] text-terminal-dim">accumulating</p>
              <p className="font-mono text-[9px] text-terminal-dim">months</p>
            </div>
          </div>
        </div>

        {/* Data area */}
        <div className="flex-1">
          {/* Column headers */}
          <div className="grid grid-cols-2 gap-px bg-terminal-border border border-terminal-border border-b-0">
            <div className="bg-terminal-bg px-3 py-1.5">
              <p className="font-mono text-[10px] text-terminal-dim uppercase tracking-widest">
                ← Discrete <span className="text-terminal-dim/60">(named events)</span>
              </p>
            </div>
            <div className="bg-terminal-bg px-3 py-1.5 border-l-0">
              <p className="font-mono text-[10px] text-terminal-dim uppercase tracking-widest">
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

      {/* Caption */}
      <p className="mt-3 font-sans text-[13px] text-terminal-dim leading-relaxed border-t border-terminal-border pt-2">
        Each quadrant maps to a different Greek profile. Markets in the upper-left (discrete + fast) are closest to soccer; markets in the lower-right (continuous + slow) are closest to traditional options.
      </p>
    </div>
  )
}
