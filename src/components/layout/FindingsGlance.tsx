import StatCard from '../ui/StatCard'

const FINDINGS = [
  {
    value: '2.01×',
    label: 'Delta asymmetry',
    description: 'Underdog goals move markets twice as much as favorite goals',
    pValue: 'p ≈ 10⁻²¹',
    href: '#delta',
  },
  {
    value: '4.50×',
    label: 'Theta acceleration',
    description: 'Draw probability rises 4.5× faster in the final third of scoreless matches',
    pValue: 'p ≈ 10⁻¹⁰',
    href: '#theta',
  },
  {
    value: '2.67×',
    label: 'Gamma peak',
    description: 'Late tied-match goals trigger 2.67× the price response of early goals',
    pValue: 'p ≈ 10⁻³⁴',
    href: '#gamma',
  },
]

export default function FindingsGlance() {
  return (
    <section className="py-6 border-b border-terminal-border">
      <p className="font-mono text-[10px] font-semibold text-terminal-dim uppercase tracking-widest mb-4">
        Findings at a Glance
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-terminal-border">
        {FINDINGS.map((f, i) => (
          <div key={f.label} className={i < FINDINGS.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-terminal-border' : ''}>
            <StatCard {...f} />
          </div>
        ))}
      </div>
    </section>
  )
}
