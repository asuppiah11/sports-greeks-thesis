import StatCard from '../ui/StatCard'

const FINDINGS = [
  {
    value: '2.01×',
    label: 'Delta Asymmetry',
    sectionLabel: 'DELTA',
    description: 'Underdog goals shift win probability twice as far as equivalent favorite goals — a robust market asymmetry.',
    pValue: 'p ≈ 10⁻²¹',
    href: '#delta',
    badge: 'Δ',
  },
  {
    value: '4.50×',
    label: 'Theta Acceleration',
    sectionLabel: 'THETA',
    description: 'Draw probability rises 4.5× faster in the final third of scoreless matches, driven by time-pressure hazard.',
    pValue: 'p ≈ 10⁻¹⁰',
    href: '#theta',
    badge: 'Θ',
  },
  {
    value: '2.67×',
    label: 'Gamma Peak',
    sectionLabel: 'GAMMA',
    description: 'Late tied-match goals trigger 2.67× the market price response of early goals — maximum convexity.',
    pValue: 'p ≈ 10⁻³⁴',
    href: '#gamma',
    badge: 'Γ',
  },
]

export default function FindingsGlance() {
  return (
    <div className="py-4 px-4 lg:px-5">
      {/* Section label row */}
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-[9px] uppercase tracking-widest text-terminal-dim">
          Findings at a Glance
        </span>
        <div className="flex-1 border-t border-terminal-border" />
        <span className="font-mono text-[9px] text-terminal-dim">N=1465</span>
      </div>

      {/* KPI strips — vertical stack, each card horizontal */}
      <div className="border border-terminal-border divide-y divide-terminal-border">
        {FINDINGS.map(f => (
          <StatCard key={f.label} {...f} horizontal />
        ))}
      </div>
    </div>
  )
}
