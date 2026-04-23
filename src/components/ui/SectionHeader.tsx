import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface SectionHeaderProps {
  icon: LucideIcon
  title: string
  summary: ReactNode
}

export default function SectionHeader({ icon: Icon, title, summary }: SectionHeaderProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-700">
          <Icon size={17} strokeWidth={2} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">{summary}</p>
    </div>
  )
}
