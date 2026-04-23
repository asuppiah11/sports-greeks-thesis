import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { ReactionSpeedRow } from '../../types'
import { GRID_STROKE, AXIS_LINE, TICK_STYLE, LABEL_FILL } from '../../lib/chartTheme'

const C_ALL = '#D1D5DB'
const C_FAV = '#000E54'
const C_UND = '#F76900'

const COMPETITION_ABBREV: Record<string, string> = {
  'English Premier League': 'EPL',
  'German Bundesliga': 'Bundesliga',
  'Italian Serie A': 'Serie A',
  'Spanish La Liga': 'La Liga',
  'UEFA Champions League': 'UCL',
}

interface ChartPoint {
  competition: string
  all: number; favorite: number; underdog: number
  allN: number; favN: number; undN: number
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
  { key: 'all',      label: 'All goals',       color: C_ALL },
  { key: 'favorite', label: 'Favorite scores', color: C_FAV },
  { key: 'underdog', label: 'Underdog scores', color: C_UND },
]

interface Props { data: ReactionSpeedRow[] }

export default function ReactionSpeedChart({ data }: Props) {
  const leagues = Object.keys(COMPETITION_ABBREV)
  const [visible, setVisible] = useState({ all: true, favorite: true, underdog: true })
  const [hovered, setHovered] = useState<string | null>(null)

  const dim = (key: string) => (hovered && hovered !== key ? 0.22 : 1)
  const toggle = (k: string) => setVisible(p => ({ ...p, [k]: !p[k as keyof typeof p] }))

  const chartData: ChartPoint[] = leagues.map(league => {
    const all = data.find(d => d.competition === league && d.event_type === 'all')
    const fav = data.find(d => d.competition === league && d.event_type === 'favorite_scores')
    const und = data.find(d => d.competition === league && d.event_type === 'underdog_scores')
    return {
      competition: COMPETITION_ABBREV[league],
      all: all?.median_tte_s ?? 0,
      favorite: fav?.median_tte_s ?? 0,
      underdog: und?.median_tte_s ?? 0,
      allN: all?.n ?? 0,
      favN: fav?.n ?? 0,
      undN: und?.n ?? 0,
    }
  })

  const tooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    const pt = chartData.find(d => d.competition === label)
    if (!pt) return null
    return (
      <div className="bg-white border border-[rgba(0,14,84,0.3)] rounded-lg shadow-md px-3 py-2.5 text-xs min-w-[195px]">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        <div className="space-y-0.5">
          <p className="flex justify-between gap-4">
            <span className="flex items-center gap-1.5 text-gray-500">
              <span className="w-2 h-2 rounded-sm" style={{ background: C_ALL }} />
              All goals (n={pt.allN})
            </span>
            <span className="font-mono">{pt.all}s</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="flex items-center gap-1.5 text-gray-600">
              <span className="w-2 h-2 rounded-sm" style={{ background: C_FAV }} />
              Favorite (n={pt.favN})
            </span>
            <span className="font-mono">{pt.favorite}s</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="flex items-center gap-1.5 font-medium" style={{ color: C_UND }}>
              <span className="w-2 h-2 rounded-sm" style={{ background: C_UND }} />
              Underdog (n={pt.undN})
            </span>
            <span className="font-mono font-semibold">{pt.underdog}s</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 480 }}>
        <SeriesToggle series={SERIES} visible={visible} hovered={hovered} onToggle={toggle} onHover={setHovered} />
        <div className="h-[240px] sm:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 28, bottom: 8, left: 16 }} barGap={2} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
              <XAxis
                dataKey="competition"
                tick={TICK_STYLE}
                tickLine={false}
                axisLine={AXIS_LINE}
              />
              <YAxis
                domain={[0, 300]}
                ticks={[0, 60, 120, 180, 240, 300]}
                tickFormatter={(v: number) => `${v}s`}
                tick={TICK_STYLE}
                tickLine={false}
                axisLine={false}
                width={40}
                label={{ value: 'Median TTE (seconds)', angle: -90, position: 'insideLeft', offset: 4, fontSize: 11, fill: LABEL_FILL }}
              />
              <Tooltip content={tooltipContent} cursor={{ fill: 'rgba(0,14,84,0.04)' }} />
              <ReferenceLine
                y={102}
                stroke={C_UND}
                strokeDasharray="4 3"
                strokeWidth={1.5}
                label={{ value: 'Overall median: 102s', position: 'right', fill: '#000E54', fontSize: 10 }}
              />
              <Bar
                dataKey="all" name="all" fill={C_ALL} radius={[3, 3, 0, 0]} maxBarSize={24}
                hide={!visible.all} opacity={dim('all')}
                onMouseEnter={() => setHovered('all')} onMouseLeave={() => setHovered(null)}
              />
              <Bar
                dataKey="favorite" name="favorite" fill={C_FAV} radius={[3, 3, 0, 0]} maxBarSize={24}
                hide={!visible.favorite} opacity={dim('favorite')}
                onMouseEnter={() => setHovered('favorite')} onMouseLeave={() => setHovered(null)}
              />
              <Bar
                dataKey="underdog" name="underdog" fill={C_UND} radius={[3, 3, 0, 0]} maxBarSize={24}
                hide={!visible.underdog} opacity={dim('underdog')}
                onMouseEnter={() => setHovered('underdog')} onMouseLeave={() => setHovered(null)}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
