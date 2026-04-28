import { useScrollSpy } from '../../hooks/useScrollSpy'

interface NavSection {
  id: string
  label: string
  fKey?: string
}

interface NavProps {
  sections: NavSection[]
}

export default function Nav({ sections }: NavProps) {
  const activeId = useScrollSpy(sections.map((s) => s.id))

  return (
    <nav className="sticky top-7 z-40 bg-terminal-bg border-b border-terminal-border">
      <div className="w-full px-6 lg:px-8">
        <div className="flex gap-0 overflow-x-auto scrollbar-none">
          {sections.map(({ id, label, fKey }) => {
            const isActive = activeId === id
            return (
              <a
                key={id}
                href={`#${id}`}
                className={[
                  'flex-shrink-0 flex items-baseline gap-1 px-3 py-2 sm:px-4 sm:py-2.5 border-b-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-terminal-orange'
                    : 'border-transparent hover:border-terminal-border',
                ].join(' ')}
              >
                {fKey && (
                  <span className={[
                    'hidden sm:inline font-mono text-[10px] transition-colors',
                    isActive ? 'text-terminal-orange' : 'text-terminal-dim',
                  ].join(' ')}>
                    {fKey}
                  </span>
                )}
                <span className={[
                  'font-sans text-[11px] sm:text-[10px] font-medium transition-colors',
                  isActive ? 'text-terminal-orange' : 'text-terminal-dim hover:text-terminal-text',
                ].join(' ')}>
                  {label}
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
