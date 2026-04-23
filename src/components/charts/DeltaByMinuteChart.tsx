import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { DeltaMinuteRow } from '../../types'
import { GRID_STROKE, AXIS_LINE, TICK_STYLE, LABEL_FILL, CURSOR_LINE } from '../../lib/chartTheme'

const BIN_ORDER = ['0–15', '15–30', '30–45', '45–60', '60–75', '75–90', '90+']
const C_FAV = '#000E54'
const C_UND = '#F76900'

interface Point {
  min_bin: string
  favorite: number | null
  favN: number | null
  underdog: number | null
  undN: number | null
}

function pivot(rows: DeltaMinuteRow[]): Point[] {
  const map = new Map<string, Point>(
    BIN_ORDER.map(b => [b, { min_bin: b, favorite: null, favN: null, underdog: null, undN: null }])
  )
  rows.forEach(r => {
    const p = map.get(r.min_bin)
    if (!p) return
    if (r.fav_label === 'Favorite') { p.favorite = r.median; p.favN = r.n }
    else { p.underdog = r.median; p.undN = r.n }
  })
  return BIN_ORDER.map(b => map.get(b)!)
}

interface SeriesMeta { key: string; label: string; color: string }

function SeriesToggle({
  series, visible, hovered, onToggle, onHover,
}: {
  series: SeriesMeta[]
  visible: Record<string, boolean>
  hovered: string | null
  onToggle: (k: string) => void
  onHover: (k: string | null) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-2">
      {series.map(s => {
        const on = visible[s.key]
        return (
          <button
            key={s.key}
            onClick={() => onToggle(s.key)}
            onMouseEnter={() => onHover(s.key)}
            onMouseLeave={() => onHover(null)}
            className={[
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs select-none',
              'border transition-all duration-150 cursor-pointer',
              on ? 'border-gray-200 bg-white text-gray-700' : 'border-gray-100 bg-gray-50 text-gray-400',
            ].join(' ')}
            style={{ opacity: hovered && hovered !== s.key ? 0.45 : 1 }}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: on ? s.color : '#D1D5DB' }} />
            {s.label}
          </button>
        )
      })}
    </div>
  )
}

const SERIES: SeriesMeta[] = [
  { key: 'favorite', label: 'Favorite',  color: C_FAV },
  { key: 'underdog', label: 'Underdog',  color: C_UND },
]

interface Props { data: DeltaMinuteRow[] }

export default function DeltaByMinuteChart({ data }: Props) {
  const chartData = pivot(data)
  const [visible, setVisible] = useState({ favorite: true, underdog: true })
  const [hovered, setHovered] = useState<string | null>(null)

  const dim = (key: string) => (hovered && hovered !== key ? 0.22 : 1)
  const toggle = (k: string) => setVisible(p => ({ ...p, [k]: !p[k as keyof typeof p] }))

  const tooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    const pt = chartData.find(d => d.min_bin === label)
    if (!pt) return null
    return (
      <div className="bg-white border border-[rgba(0,14,84,0.3)] rounded-lg shadow-md px-3 py-2.5 text-xs min-w-[160px]">
        <p className="font-semibold text-gray-800 mb-1.5">{label} min</p>
        {pt.favorite != null && (
          <div className="flex items-center gap-1.5 text-gray-600">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: C_FAV }} />
            Favorite: <span className="font-mono font-medium ml-1">{pt.favorite.toFixed(3)}</span>
            <span className="text-gray-400 ml-auto">(n={pt.favN})</span>
          </div>
        )}
        {pt.underdog != null ? (
          <div className="flex items-center gap-1.5 text-gray-600 mt-0.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: C_UND }} />
            Underdog: <span className="font-mono font-medium ml-1">{pt.underdog.toFixed(3)}</span>
            <span className="text-gray-400 ml-auto">(n={pt.undN})</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-gray-400 mt-0.5 italic">
            <span className="w-2 h-2 rounded-full flex-shrink-0 bg-gray-200" />
            Underdog: no data
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 420 }}>
        <SeriesToggle series={SERIES} visible={visible} hovered={hovered} onToggle={toggle} onHover={setHovered} />
        <div className="h-[240px] sm:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 28, bottom: 24, left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
              <XAxis
                dataKey="min_bin"
                tick={TICK_STYLE}
                tickLine={false}
                axisLine={AXIS_LINE}
                label={{ value: 'Match minute (bin)', position: 'insideBottom', offset: -14, fontSize: 11, fill: LABEL_FILL }}
              />
              <YAxis
                domain={[0, 0.85]}
                tickFormatter={(v: number) => v.toFixed(2)}
                tick={TICK_STYLE}
                tickLine={false}
                axisLine={false}
                width={40}
                label={{ value: 'Median Δ', angle: -90, position: 'insideLeft', offset: 4, fontSize: 11, fill: LABEL_FILL }}
              />
              <Tooltip content={tooltipContent} cursor={CURSOR_LINE} />
              <Line
                type="monotone"
                dataKey="favorite"
                name="Favorite"
                stroke={C_FAV}
                strokeWidth={2}
                opacity={dim('favorite')}
                hide={!visible.favorite}
                dot={{ r: 3.5, fill: C_FAV, strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                connectNulls={false}
                onMouseEnter={() => setHovered('favorite')}
                onMouseLeave={() => setHovered(null)}
              />
              <Line
                type="monotone"
                dataKey="underdog"
                name="Underdog"
                stroke={C_UND}
                strokeWidth={2.5}
                opacity={dim('underdog')}
                hide={!visible.underdog}
                dot={{ r: 3.5, fill: C_UND, strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                connectNulls={false}
                onMouseEnter={() => setHovered('underdog')}
                onMouseLeave={() => setHovered(null)}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
