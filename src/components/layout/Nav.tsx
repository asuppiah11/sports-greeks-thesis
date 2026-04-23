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
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-0 overflow-x-auto scrollbar-none">
          {sections.map(({ id, label }) => {
            const isActive = activeId === id
            return (
              <a
                key={id}
                href={`#${id}`}
                className={[
                  'flex-shrink-0 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-syracuse-orange text-syracuse-navy'
                    : 'border-transparent text-gray-500 hover:text-syracuse-navy hover:border-gray-300',
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
