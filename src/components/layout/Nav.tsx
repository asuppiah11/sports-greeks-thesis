import { useScrollSpy } from '../../hooks/useScrollSpy'

interface NavSection {
  id: string
  label: string
}

interface NavProps {
  sections: NavSection[]
}

export default function Nav({ sections }: NavProps) {
  const activeId = useScrollSpy(sections.map((s) => s.id))

  return (
    <nav className="sticky top-0 z-40 bg-terminal-bg/95 backdrop-blur border-b border-terminal-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-0 overflow-x-auto scrollbar-none">
          {sections.map(({ id, label }) => {
            const isActive = activeId === id
            return (
              <a
                key={id}
                href={`#${id}`}
                className={[
                  'flex-shrink-0 px-4 py-2.5 font-sans text-xs font-medium border-b-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-terminal-orange text-terminal-orange'
                    : 'border-transparent text-terminal-dim hover:text-terminal-text hover:border-terminal-border',
                ].join(' ')}
              >
                {label}
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
