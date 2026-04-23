interface StatCardProps {
  value: string
  label: string
  description: string
  pValue: string
  href: string
}

export default function StatCard({ value, label, description, pValue, href }: StatCardProps) {
  return (
    <a
      href={href}
      className="group block rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-teal-200 hover:shadow-sm p-6 transition-all"
    >
      <div className="text-4xl font-bold text-teal-700 mb-2 tracking-tight">{value}</div>
      <div className="text-sm font-semibold text-gray-800 mb-1">{label}</div>
      <div className="text-sm text-gray-500 leading-snug mb-3">{description}</div>
      <div className="text-xs font-mono text-gray-400">{pValue}</div>
    </a>
  )
}
