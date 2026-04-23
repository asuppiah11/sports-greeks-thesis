import { useState } from 'react'
import type { GammaHeatmapRow } from '../../types'

const BIN_ORDER = ['0–15', '15–30', '30–45', '45–60', '60–75', '75–90', '90+']
const SCORE_DIFFS = [-2, -1, 0, 1, 2]
const DIFF_LABELS: Record<number, string> = {
  [-2]: '−2',
  [-1]: '−1',
  [0]: '0 (Tied)',
  [1]: '+1',
  [2]: '+2',
}
const MAX_DELTA = 0.6
const SMALL_N = 10
const PEAK_BIN = '75–90'
const PEAK_DIFF = 0

// Dark text always passes WCAG AA on the orange gradient
const CELL_TEXT = '#1F2937'

interface Tooltip {
  x: number
  y: number
  bin: string
  diff: number
  medDelta: number
  n: number
  isSmall: boolean
}

function getIntensity(medDelta: number): number {
  return Math.min(medDelta / MAX_DELTA, 1.0)
}

function getCellBg(medDelta: number, isSmall: boolean): string {
  const alpha = isSmall
    ? getIntensity(medDelta) * 0.35
    : getIntensity(medDelta)
  return `rgba(247,105,0,${alpha.toFixed(3)})`
}

interface Props {
  data: GammaHeatmapRow[]
}

export default function GammaHeatmap({ data }: Props) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)

  const lookup = new Map<string, GammaHeatmapRow>()
  data.forEach(row => {
    lookup.set(`${row.min_bin}__${row.score_diff_clamp}`, row)
  })

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 580 }}>
        {/* Column headers */}
        <div
          className="grid text-center"
          style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}
        >
          <div className="pb-2 pr-2">
            <span className="text-xs text-gray-400">Score diff</span>
          </div>
          {BIN_ORDER.map(bin => (
            <div key={bin} className="pb-2 px-1 text-xs font-medium text-gray-500 text-center">
              {bin}
              <span className="block text-gray-400 font-normal">min</span>
            </div>
          ))}
        </div>

        {/* Rows */}
        {SCORE_DIFFS.map(diff => (
          <div
            key={diff}
            className="grid"
            style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}
          >
            {/* Row header */}
            <div className="flex items-center pr-2 py-1">
              <span
                className={[
                  'text-xs font-medium',
                  diff === 0 ? 'text-syracuse-orange font-semibold' : 'text-gray-500',
                ].join(' ')}
              >
                {DIFF_LABELS[diff]}
              </span>
            </div>

            {/* Cells */}
            {BIN_ORDER.map(bin => {
              const cell = lookup.get(`${bin}__${diff}`)
              const isPeak = bin === PEAK_BIN && diff === PEAK_DIFF
              const isSmall = !!cell && cell.n < SMALL_N

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
                  className="relative m-0.5 rounded flex items-center justify-center cursor-default select-none"
                  style={{
                    height: 52,
                    background: getCellBg(cell.med_delta, isSmall),
                    outline: isPeak ? '2px solid #000E54' : undefined,
                    outlineOffset: isPeak ? '-2px' : undefined,
                  }}
                  onMouseEnter={e => {
                    setTooltip({
                      x: e.clientX,
                      y: e.clientY,
                      bin,
                      diff,
                      medDelta: cell.med_delta,
                      n: cell.n,
                      isSmall,
                    })
                  }}
                  onMouseMove={e => {
                    setTooltip(prev =>
                      prev ? { ...prev, x: e.clientX, y: e.clientY } : prev
                    )
                  }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <span
                    className="text-xs font-mono font-medium"
                    style={{ color: CELL_TEXT }}
                  >
                    {cell.med_delta.toFixed(2)}
                    {isPeak && (
                      <span className="block text-center text-[9px] font-normal opacity-75 leading-tight mt-0.5">
                        Peak
                      </span>
                    )}
                  </span>

                  {/* Small-sample asterisk */}
                  {isSmall && (
                    <span
                      className="absolute top-0.5 right-1 text-[9px] leading-none"
                      style={{ color: CELL_TEXT }}
                    >
                      *
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        {/* Legend row */}
        <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <div
              className="w-14 h-3 rounded-sm"
              style={{
                background: 'linear-gradient(to right, rgba(247,105,0,0.08), rgba(247,105,0,1))',
              }}
            />
            <span>Low → High Δ (0 → 0.6+)</span>
          </div>
          <span className="text-gray-300">|</span>
          <span>* n &lt; 10 — reduced opacity</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-xs pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          <p className="font-semibold text-gray-800 mb-1">
            {tooltip.bin} min · Score diff {DIFF_LABELS[tooltip.diff]}
          </p>
          <p className="text-gray-600">
            Median Δ:{' '}
            <span className="font-mono font-semibold text-syracuse-navy">
              {tooltip.medDelta.toFixed(3)}
            </span>
          </p>
          <p className="text-gray-500 mt-0.5">n = {tooltip.n} events</p>
          {tooltip.isSmall && (
            <p className="mt-1.5 text-amber-600 max-w-[200px] leading-snug">
              Small sample — interpret with caution.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
