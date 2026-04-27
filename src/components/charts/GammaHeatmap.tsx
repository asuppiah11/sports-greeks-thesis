import { useState, useRef } from 'react'
import type { GammaHeatmapRow } from '../../types'
import { C_UNDERDOG } from '../../lib/chartTheme'

const BIN_ORDER = ['0–15', '15–30', '30–45', '45–60', '60–75', '75–90', '90+']
const SCORE_DIFFS = [-2, -1, 0, 1, 2]
const DIFF_LABELS: Record<number, string> = {
  [-2]: '−2', [-1]: '−1', [0]: '0 (TIED)', [1]: '+1', [2]: '+2',
}
const MAX_DELTA = 0.6
const SMALL_N = 10
const PEAK_BIN = '75–90'
const PEAK_DIFF = 0
// On dark bg: light text on orange cells
const CELL_TEXT = '#e5e5e5'

interface CellInfo {
  x: number; y: number
  bin: string; diff: number
  medDelta: number; n: number; isSmall: boolean
}

function getIntensity(medDelta: number) {
  return Math.min(medDelta / MAX_DELTA, 1.0)
}

function getCellBg(medDelta: number, isSmall: boolean) {
  // Base: terminal-panel (#111111), overlaid with orange at varying opacity
  const alpha = (isSmall ? getIntensity(medDelta) * 0.35 : getIntensity(medDelta)) * 0.85
  return `rgba(255,138,26,${alpha.toFixed(3)})`
}

interface Props { data: GammaHeatmapRow[] }

export default function GammaHeatmap({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<CellInfo | null>(null)
  const [pinned, setPinned] = useState<CellInfo | null>(null)

  const displayed = pinned ?? hovered

  const lookup = new Map<string, GammaHeatmapRow>()
  data.forEach(row => lookup.set(`${row.min_bin}__${row.score_diff_clamp}`, row))

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('[data-cell]')) setPinned(null)
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <p className="sm:hidden font-mono text-[9px] text-terminal-dim mb-1.5 text-center tracking-wide">← SWIPE TO EXPLORE →</p>
      <div ref={containerRef} style={{ minWidth: 580 }} onClick={handleContainerClick}>
        {/* Column headers */}
        <div className="grid text-center" style={{ gridTemplateColumns: '72px repeat(7, 1fr)' }}>
          <div className="pb-1.5 pr-2">
            <span className="font-mono text-[9px] text-terminal-dim">SCORE DIFF</span>
          </div>
          {BIN_ORDER.map(bin => (
            <div key={bin} className="pb-1.5 px-1 text-center">
              <span className="font-mono text-[9px] font-medium text-terminal-muted block">{bin}</span>
              <span className="font-mono text-[8px] text-terminal-dim block">MIN</span>
            </div>
          ))}
        </div>

        {/* Rows */}
        {SCORE_DIFFS.map(diff => (
          <div key={diff} className="grid" style={{ gridTemplateColumns: '72px repeat(7, 1fr)' }}>
            <div className="flex items-center pr-2 py-0.5">
              <span className={['font-mono text-[10px] font-medium',
                diff === 0 ? 'text-terminal-orange' : 'text-terminal-dim'].join(' ')}>
                {DIFF_LABELS[diff]}
              </span>
            </div>

            {BIN_ORDER.map(bin => {
              const cell = lookup.get(`${bin}__${diff}`)
              const isPeak = bin === PEAK_BIN && diff === PEAK_DIFF
              const isSmall = !!cell && cell.n < SMALL_N
              const isPinned = pinned?.bin === bin && pinned?.diff === diff

              if (!cell) {
                return (
                  <div key={bin} className="m-px flex items-center justify-center bg-terminal-bg"
                    style={{ height: 46 }} />
                )
              }

              return (
                <div
                  key={bin}
                  data-cell="true"
                  className="relative m-px flex items-center justify-center cursor-pointer select-none"
                  style={{
                    height: 46,
                    background: getCellBg(cell.med_delta, isSmall),
                    outline: isPinned
                      ? `1px solid ${C_UNDERDOG}`
                      : isPeak
                      ? '1px solid rgba(255,138,26,0.6)'
                      : '1px solid transparent',
                    outlineOffset: '-1px',
                  }}
                  onMouseEnter={e => setHovered({ x: e.clientX, y: e.clientY, bin, diff, medDelta: cell.med_delta, n: cell.n, isSmall })}
                  onMouseMove={e => setHovered(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : prev)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={e => {
                    e.stopPropagation()
                    const info: CellInfo = { x: e.clientX, y: e.clientY, bin, diff, medDelta: cell.med_delta, n: cell.n, isSmall }
                    setPinned(prev => (prev?.bin === bin && prev?.diff === diff) ? null : info)
                  }}
                >
                  <span className="font-mono text-[10px] font-medium" style={{ color: CELL_TEXT }}>
                    {cell.med_delta.toFixed(2)}
                    {isPeak && (
                      <span className="block text-center text-[8px] font-normal leading-tight mt-0.5"
                        style={{ color: C_UNDERDOG }}>PEAK</span>
                    )}
                  </span>
                  {isSmall && (
                    <span className="absolute top-0.5 right-1 text-[8px] leading-none text-terminal-dim">*</span>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[9px] text-terminal-dim">
          <div className="flex items-center gap-1.5">
            <div className="w-12 h-2.5" style={{ background: `linear-gradient(to right, rgba(255,138,26,0.05), rgba(255,138,26,0.85))` }} />
            <span>LOW → HIGH Δ (0 → 0.6+)</span>
          </div>
          <span className="text-terminal-border">|</span>
          <span>* N &lt; 10 — REDUCED OPACITY</span>
          <span className="text-terminal-border">|</span>
          <span>CLICK TO PIN</span>
        </div>
      </div>

      {/* Tooltip */}
      {displayed && (
        <div
          className={['fixed z-50 bg-[#161616] font-mono text-[11px] pointer-events-none px-2.5 py-2',
            pinned ? 'border border-terminal-orange' : 'border border-[#2a2a2a]'].join(' ')}
          style={{ left: displayed.x + 14, top: displayed.y - 10, minWidth: 200 }}
        >
          {pinned && (
            <p className="text-[9px] font-semibold text-terminal-orange mb-1.5 tracking-widest">◆ PINNED</p>
          )}
          <p className="text-terminal-muted mb-1">
            {displayed.bin} MIN · DIFF {DIFF_LABELS[displayed.diff]}
          </p>
          <div className="flex justify-between gap-4">
            <span style={{ color: C_UNDERDOG }}>MEDIAN Δ</span>
            <span className="text-terminal-text font-semibold">{displayed.medDelta.toFixed(3)}</span>
          </div>
          <div className="flex justify-between gap-4 mt-0.5">
            <span className="text-terminal-dim">N</span>
            <span className="text-terminal-text">{displayed.n}</span>
          </div>
          {displayed.isSmall && (
            <p className="mt-1.5 text-yellow-500 text-[10px]">SMALL SAMPLE — USE WITH CAUTION</p>
          )}
          {!pinned && (
            <p className="mt-1.5 text-terminal-dim text-[9px]">CLICK TO PIN</p>
          )}
        </div>
      )}
    </div>
  )
}
