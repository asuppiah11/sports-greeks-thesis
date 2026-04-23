import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { ReactionSpeedRow } from '../../types'

const C_ALL = '#D1D5DB'
const C_FAV = '#6B7280'
const C_UND = '#0F766E'

const COMPETITION_ABBREV: Record<string, string> = {
  'English Premier League': 'EPL',
  'German Bundesliga': 'Bundesliga',
  'Italian Serie A': 'Serie A',
  'Spanish La Liga': 'La Liga',
  'UEFA Champions League': 'UCL',
}

interface ChartPoint {
  competition: string
  all: number
  favorite: number
  underdog: number
  allN: number
  favN: number
  undN: number
}

interface Props {
  data: ReactionSpeedRow[]
}

export default function ReactionSpeedChart({ data }: Props) {
  const leagues = Object.keys(COMPETITION_ABBREV)

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
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2.5 text-xs min-w-[195px]">
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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 8, right: 28, bottom: 8, left: 16 }} barGap={2} barCategoryGap="28%">
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="competition"
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              domain={[0, 300]}
              ticks={[0, 60, 120, 180, 240, 300]}
              tickFormatter={(v: number) => `${v}s`}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={false}
              width={40}
              label={{
                value: 'Median TTE (seconds)',
                angle: -90,
                position: 'insideLeft',
                offset: 4,
                fontSize: 11,
                fill: '#9CA3AF',
              }}
            />
            <Tooltip content={tooltipContent} cursor={{ fill: '#F9FAFB' }} />
            <Legend
              iconType="square"
              iconSize={10}
              wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
              formatter={(value: string) => {
                if (value === 'all') return 'All goals'
                if (value === 'favorite') return 'Favorite scores'
                return 'Underdog scores'
              }}
            />
            <ReferenceLine
              y={102}
              stroke="#0F766E"
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{
                value: 'Overall median: 102s',
                position: 'right',
                fill: '#0F766E',
                fontSize: 10,
              }}
            />
            <Bar dataKey="all"      name="all"      fill={C_ALL} radius={[3, 3, 0, 0]} maxBarSize={24} />
            <Bar dataKey="favorite" name="favorite" fill={C_FAV} radius={[3, 3, 0, 0]} maxBarSize={24} />
            <Bar dataKey="underdog" name="underdog" fill={C_UND} radius={[3, 3, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
