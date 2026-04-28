import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface SectionHeaderProps {
  icon: LucideIcon
  title: string
  summary: ReactNode
}

export default function SectionHeader({ icon: Icon, title, summary }: SectionHeaderProps) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="flex items-center justify-center w-7 h-7 border border-terminal-border bg-terminal-panel text-terminal-cyan">
          <Icon size={14} strokeWidth={1.5} />
        </div>
        <h2 className="font-sans text-base font-bold text-terminal-text">{title}</h2>
      </div>
      <p className="font-sans text-[14px] text-terminal-muted max-w-2xl leading-relaxed">{summary}</p>
    </div>
  )
}
