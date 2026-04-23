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
    <section className="py-10 border-b border-gray-100">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
        Findings at a Glance
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {FINDINGS.map((f) => (
          <StatCard key={f.label} {...f} />
        ))}
      </div>
    </section>
  )
}
