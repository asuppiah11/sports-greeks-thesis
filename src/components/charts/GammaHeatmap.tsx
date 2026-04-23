import { useState, useRef } from 'react'
import type { GammaHeatmapRow } from '../../types'

const BIN_ORDER = ['0–15', '15–30', '30–45', '45–60', '60–75', '75–90', '90+']
const SCORE_DIFFS = [-2, -1, 0, 1, 2]
const DIFF_LABELS: Record<number, string> = {
  [-2]: '−2', [-1]: '−1', [0]: '0 (Tied)', [1]: '+1', [2]: '+2',
}
const MAX_DELTA = 0.6
const SMALL_N = 10
const PEAK_BIN = '75–90'
const PEAK_DIFF = 0
const CELL_TEXT = '#1F2937'

interface CellInfo {
  x: number; y: number
  bin: string; diff: number
  medDelta: number; n: number
  isSmall: boolean
}

function getIntensity(medDelta: number) {
  return Math.min(medDelta / MAX_DELTA, 1.0)
}

function getCellBg(medDelta: number, isSmall: boolean) {
  const alpha = isSmall ? getIntensity(medDelta) * 0.35 : getIntensity(medDelta)
  return `rgba(247,105,0,${alpha.toFixed(3)})`
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
      <div
        ref={containerRef}
        style={{ minWidth: 580 }}
        onClick={handleContainerClick}
      >
        {/* Column headers */}
        <div className="grid text-center" style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}>
          <div className="pb-2 pr-2">
            <span className="text-xs" style={{ color: 'rgba(0,14,84,0.45)' }}>Score diff</span>
          </div>
          {BIN_ORDER.map(bin => (
            <div key={bin} className="pb-2 px-1 text-xs font-medium text-center" style={{ color: 'rgba(0,14,84,0.55)' }}>
              {bin}
              <span className="block font-normal" style={{ color: 'rgba(0,14,84,0.4)' }}>min</span>
            </div>
          ))}
        </div>

        {/* Rows */}
        {SCORE_DIFFS.map(diff => (
          <div key={diff} className="grid" style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}>
            <div className="flex items-center pr-2 py-1">
              <span
                className={['text-xs font-medium', diff === 0 ? 'text-syracuse-orange font-semibold' : ''].join(' ')}
                style={diff !== 0 ? { color: 'rgba(0,14,84,0.55)' } : undefined}
              >
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
                  <div
                    key={bin}
                    className="m-0.5 rounded flex items-center justify-center"
                    style={{ height: 52, background: '#F9FAFB' }}
                  />
                )
              }

              return (
                <div
                  key={bin}
                  data-cell="true"
                  className="relative m-0.5 rounded flex items-center justify-center cursor-pointer select-none transition-transform duration-100 hover:scale-[1.04]"
                  style={{
                    height: 52,
                    background: getCellBg(cell.med_delta, isSmall),
                    outline: isPinned
                      ? '2px solid #F76900'
                      : isPeak
                      ? '2px solid #000E54'
                      : undefined,
                    outlineOffset: '-2px',
                  }}
                  onMouseEnter={e => setHovered({
                    x: e.clientX, y: e.clientY, bin, diff,
                    medDelta: cell.med_delta, n: cell.n, isSmall,
                  })}
                  onMouseMove={e => setHovered(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : prev)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={e => {
                    e.stopPropagation()
                    const info: CellInfo = { x: e.clientX, y: e.clientY, bin, diff, medDelta: cell.med_delta, n: cell.n, isSmall }
                    setPinned(prev => (prev?.bin === bin && prev?.diff === diff) ? null : info)
                  }}
                >
                  <span className="text-xs font-mono font-medium" style={{ color: CELL_TEXT }}>
                    {cell.med_delta.toFixed(2)}
                    {isPeak && (
                      <span className="block text-center text-[9px] font-normal opacity-75 leading-tight mt-0.5">Peak</span>
                    )}
                  </span>
                  {isSmall && (
                    <span className="absolute top-0.5 right-1 text-[9px] leading-none" style={{ color: CELL_TEXT }}>*</span>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        {/* Legend row */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs" style={{ color: 'rgba(0,14,84,0.45)' }}>
          <div className="flex items-center gap-1.5">
            <div
              className="w-14 h-3 rounded-sm"
              style={{ background: 'linear-gradient(to right, rgba(247,105,0,0.08), rgba(247,105,0,1))' }}
            />
            <span>Low → High Δ (0 → 0.6+)</span>
          </div>
          <span style={{ color: 'rgba(0,14,84,0.2)' }}>|</span>
          <span>* n &lt; 10 — reduced opacity</span>
          <span style={{ color: 'rgba(0,14,84,0.2)' }}>|</span>
          <span>Click a cell to pin its tooltip</span>
        </div>
      </div>

      {/* Tooltip */}
      {displayed && (
        <div
          className={[
            'fixed z-50 bg-white rounded-lg shadow-lg px-3 py-2.5 text-xs pointer-events-none',
            pinned ? 'border-2 border-syracuse-orange/60' : 'border border-[rgba(0,14,84,0.35)]',
          ].join(' ')}
          style={{ left: displayed.x + 14, top: displayed.y - 10, minWidth: 200 }}
        >
          {pinned && (
            <p className="text-[10px] font-semibold text-syracuse-orange mb-1.5 tracking-wide uppercase">
              ◆ Pinned
            </p>
          )}
          <p className="font-semibold text-gray-900 mb-1">
            {displayed.bin} min · Score diff {DIFF_LABELS[displayed.diff]}
          </p>
          <p className="text-gray-600">
            Median Δ:{' '}
            <span className="font-mono font-semibold text-syracuse-navy">
              {displayed.medDelta.toFixed(3)}
            </span>
          </p>
          <p className="text-gray-500 mt-0.5">n = {displayed.n} events</p>
          {displayed.isSmall && (
            <p className="mt-1.5 text-amber-600 leading-snug max-w-[195px]">
              Small sample — interpret with caution.
            </p>
          )}
          {!pinned && (
            <p className="mt-1.5 text-[10px]" style={{ color: 'rgba(0,14,84,0.4)' }}>
              Click to pin
            </p>
          )}
        </div>
      )}
    </div>
  )
}
