import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { ThetaAccelRow } from '../../types'

const C_EARLY = '#D1D5DB'
const C_LATE = '#0F766E'

interface ChartPoint {
  label: string
  early: number
  late: number
  accel_ratio: number
  n: number
}

interface Props {
  data: ThetaAccelRow[]
}

export default function ThetaAccelChart({ data }: Props) {
  const chartData: ChartPoint[] = data.map(d => ({
    label: d.group === 'A_pure_00' ? 'Group A\n(Pure 0-0)' : 'Group B\n(Pre-1st Goal)',
    early: +(d.early_theta * 1000).toFixed(4),
    late: +(d.late_theta * 1000).toFixed(4),
    accel_ratio: d.accel_ratio,
    n: d.n,
  }))

  const tooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    const pt = chartData.find(d => d.label === label)
    if (!pt) return null
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2.5 text-xs min-w-[180px]">
        <p className="font-semibold text-gray-800 mb-1.5">
          {label.replace('\n', ' ')}
        </p>
        <p className="text-gray-500 mb-1.5">n = {pt.n} segments</p>
        <div className="space-y-0.5">
          <p className="flex justify-between gap-4">
            <span className="flex items-center gap-1.5 text-gray-500">
              <span className="w-2 h-2 rounded-sm inline-block" style={{ background: C_EARLY }} />
              Early period
            </span>
            <span className="font-mono">{pt.early.toFixed(3)} ×10⁻³</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="flex items-center gap-1.5 font-medium" style={{ color: C_LATE }}>
              <span className="w-2 h-2 rounded-sm inline-block" style={{ background: C_LATE }} />
              Final third
            </span>
            <span className="font-mono font-semibold">{pt.late.toFixed(3)} ×10⁻³</span>
          </p>
        </div>
        <p className="mt-1.5 pt-1.5 border-t border-gray-100 text-teal-700 font-semibold">
          Acceleration: {pt.accel_ratio.toFixed(2)}×
        </p>
      </div>
    )
  }

  const CustomTick = ({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) => {
    if (!x || !y || !payload) return null
    const lines = payload.value.split('\n')
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={12} textAnchor="middle" fill="#9CA3AF" fontSize={11}>
          {lines[0]}
        </text>
        {lines[1] && (
          <text x={0} y={0} dy={26} textAnchor="middle" fill="#9CA3AF" fontSize={10}>
            {lines[1]}
          </text>
        )}
      </g>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 340 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 8, right: 28, bottom: 36, left: 16 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="label"
              tick={<CustomTick />}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              interval={0}
            />
            <YAxis
              tickFormatter={(v: number) => v.toFixed(2)}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={false}
              width={44}
              label={{
                value: 'Rate (×10⁻³ / min)',
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
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={(value: string) =>
                value === 'early' ? 'Early period (first two-thirds)' : 'Final third'
              }
            />
            <Bar dataKey="early" name="early" fill={C_EARLY} radius={[3, 3, 0, 0]} maxBarSize={52} />
            <Bar dataKey="late"  name="late"  fill={C_LATE}  radius={[3, 3, 0, 0]} maxBarSize={52} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
